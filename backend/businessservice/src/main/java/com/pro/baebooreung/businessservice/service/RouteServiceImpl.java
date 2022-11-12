package com.pro.baebooreung.businessservice.service;

import com.pro.baebooreung.businessservice.client.GpsServiceClient;
import com.pro.baebooreung.businessservice.client.UserServiceClient;
import com.pro.baebooreung.businessservice.domain.Delivery;
import com.pro.baebooreung.businessservice.domain.Route;
import com.pro.baebooreung.businessservice.domain.repository.DeliveryRepository;
import com.pro.baebooreung.businessservice.domain.repository.RouteRepository;
import com.pro.baebooreung.businessservice.dto.RouteDto;
import com.pro.baebooreung.businessservice.vo.*;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.support.NullValue;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@Transactional
public class RouteServiceImpl implements RouteService {
    RouteRepository routeRepository;
    DeliveryRepository deliveryRepository;
    UserServiceClient userServiceClient;
    GpsServiceClient gpsServiceClient;
    @PersistenceContext
    private final EntityManager em;

    @Autowired
    public RouteServiceImpl(RouteRepository routeRepository, EntityManager em,DeliveryRepository deliveryRepository, UserServiceClient userServiceClient, GpsServiceClient gpsServiceClient){
        this.routeRepository = routeRepository;
        this.deliveryRepository = deliveryRepository;
        this.em = em;
        this.userServiceClient = userServiceClient;
        this.gpsServiceClient = gpsServiceClient;
    }

    @Override
    public List<ResponseRoute> getRouteByUser(int userId){//}, Data date){
        Iterable<Route> routeEntityList = routeRepository.findByUserId(userId);// userId로 route 리스트 찾기
        List<ResponseRoute> responseRoutes = new ArrayList<>();

        routeEntityList.forEach(route -> {
//            route.builder().deliveryList(deliveryRepository.findByRouteId(route.getId())).build();
//            ResponseRoute r = new ResponseRoute();

            ModelMapper mapper = new ModelMapper();
            mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
            ResponseRoute r = mapper.map(route,ResponseRoute.class);

//            List<ResponseDelivery> responseDeliveryList = new ArrayList<>();
//            route.getDeliveryList().forEach(v ->{
//                responseDeliveryList.add(new ModelMapper().map(v,ResponseDelivery.class));
//            });
//
//            responseRoutes.add(r.builder()
//                                    .id(route.getId())
//                                    .routeName(route.getRouteName())
//                                    .deliveryList(responseDeliveryList)
//                                    .build()); // deliverylist(delivery) -> list(responsedelivery)

        });
        return responseRoutes;
    }

    @Override
    public ResponseRoute getRoute(int routeId) {
        Optional<Route> routeEntity = routeRepository.findById(routeId);
        ResponseRoute responseRoute = new ResponseRoute();

//        List<Route> nameList = Optional.ofNullable(getNames()).orElseGet(() -> new ArrayList<>());
        if(routeEntity.isPresent()){
            ModelMapper mapper = new ModelMapper();
            mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
            responseRoute = mapper.map(routeEntity,ResponseRoute.class);
        }

        return responseRoute;
    }

    @Override
    public List<ResponseRoute> getRouteByUserNDate(int userId){//}, Data date){
        //드라이버의 해당하는 날짜(?or 오늘???)의 done이 아닌 루트들
        LocalDate today =LocalDate.now();
        Iterable<Route> routeEntityList = routeRepository.findByUserIdAndDeliveryDateTime(userId,today);

        List<ResponseRoute> responseRoutes = new ArrayList<>();
        routeEntityList.forEach(route -> {

            if(!route.isDone()){ //완료하지 않았다면
                //deliverylist 받아와서 넣어주기
                route.builder().deliveryList(deliveryRepository.findByRouteId(route.getId())).build();

                ResponseRoute r = new ResponseRoute();

                List<ResponseDelivery> responseDeliveryList = new ArrayList<>();
                route.getDeliveryList().forEach(v ->{
                    responseDeliveryList.add(new ModelMapper().map(v,ResponseDelivery.class));
                });

                responseRoutes.add(r.builder()
                        .id(route.getId())
                        .routeName(route.getRouteName())
                        .deliveryList(responseDeliveryList)
                        .build());
            }

        });

        return responseRoutes;
    }

    @Transactional
    public RouteDto startWork(int userId, int routeId){
        Optional<Delivery> findDelivery = deliveryRepository.findByRouteIdAndSequence(userId,1);
        Optional<Route> findRoute = routeRepository.findById(routeId);
        /* feign client */
        RequestStart requestStart = new RequestStart();
        if(findDelivery.isPresent()){
            requestStart = new RequestStart(userId,routeId,findDelivery.get().getId());
            ResponseUser responseUser = userServiceClient.startWork(requestStart);
        }

        LocalTime now = LocalTime.now();
        findRoute.get().setActualStartTime(now);
        routeRepository.save(findRoute.get());

        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        RouteDto response = mapper.map(findRoute.get(), RouteDto.class);
        //반환

        return response;
    }

    public void checkIn(int userId,int routeId,int sequence){ //,int deliveryId
        // userId를 받아서 그 사람의 userId가 gps에서 어떤 위치에 있는지 반환받아서   - 2순위
        // routeId 로 찾은 route의 delivery들 중에 (아마도 순서대로) 거리 내에 있고  - 1순위
        // 머무는 시간이 좀 걸린다면 체크인+도착시간
        // + user의 route_id,delivery_id값 다음 목적지로 바꾸기(마지막일때 0이나 null로)


        //체크인 여부를 판단하는 기준
        //- 음식점 주위에 이 사람이 지나치는지?
        //- 약간 여기 좀 더 머무르는지?
        //- 사진?
        //- 체크인 모호한 경우 - 사진 찍도록 유도

        ResponseGps findUserGps = gpsServiceClient.getGps(userId);

        double user_lat = Double.valueOf(findUserGps.getLatitude());
        double user_long = Double.valueOf(findUserGps.getLongitude());

        Optional<Delivery> findDelivery = deliveryRepository.findByRouteIdAndSequence(routeId,sequence);
        double del_lat = findDelivery.get().getLatitude();
        double del_long = findDelivery.get().getLongitude();

        double diff_lat = del_lat - user_lat;
        double diff_long = del_long - user_long;

        double distance = Math.sqrt(diff_lat*diff_lat + diff_long*diff_long);
        ////////////

        findDelivery.get().updateDelActualTime(LocalTime.now());
        deliveryRepository.save(findDelivery.get());

        // user에서 넣어주기 feign client 코드 작성
        userServiceClient.checkIn(new RequestCheckIn(userId,findDelivery.get().getId()));

//        //if 끝이라면 work_status와 route_id,delivery_id 비어주기 (그럼 user에서 delivery_id만 넣어줘도 될듯..)
//        Optional<Route> findRoute = routeRepository.findById(routeId);
//        int listSize = findRoute.get().getDeliveryList().size();
//        if(listSize == sequence){
//            userServiceClient.checkIn(new RequestCheckIn(userId, 0,0));
//            findRoute.get().updateDone(true);
//            routeRepository.save(findRoute.get());
//        }
    }

    public void endWork(int userId,int routeId){ //,int deliveryId
        //if 끝이라면 work_status와 route_id,delivery_id 비어주기 (그럼 user에서 delivery_id만 넣어줘도 될듯..)
        Optional<Route> findRoute = routeRepository.findById(routeId);
        if(findRoute.isPresent()){
            findRoute.get().updateDone(true);
            routeRepository.save(findRoute.get());
            userServiceClient.endWork(userId);
        }else{

        }


    }



}

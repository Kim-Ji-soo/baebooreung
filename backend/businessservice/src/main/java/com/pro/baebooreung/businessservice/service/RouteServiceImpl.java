package com.pro.baebooreung.businessservice.service;

import com.pro.baebooreung.businessservice.client.UserServiceClient;
import com.pro.baebooreung.businessservice.domain.Delivery;
import com.pro.baebooreung.businessservice.domain.Route;
import com.pro.baebooreung.businessservice.domain.repository.DeliveryRepository;
import com.pro.baebooreung.businessservice.domain.repository.RouteRepository;
import com.pro.baebooreung.businessservice.dto.RouteDto;
import com.pro.baebooreung.businessservice.vo.RequestStart;
import com.pro.baebooreung.businessservice.vo.ResponseDelivery;
import com.pro.baebooreung.businessservice.vo.ResponseRoute;
import com.pro.baebooreung.businessservice.vo.ResponseUser;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class RouteServiceImpl implements RouteService {
    RouteRepository routeRepository;
    DeliveryRepository deliveryRepository;
    UserServiceClient userServiceClient;
    @PersistenceContext
    private final EntityManager em;

    @Autowired
    public RouteServiceImpl(RouteRepository routeRepository, EntityManager em,DeliveryRepository deliveryRepository, UserServiceClient userServiceClient){
        this.routeRepository = routeRepository;
        this.deliveryRepository = deliveryRepository;
        this.em = em;
        this.userServiceClient = userServiceClient;
    }

    @Override
    public List<ResponseRoute> getRouteByUser(int userId){//}, Data date){
        Iterable<Route> routeEntityList = routeRepository.findByUserId(userId);// userId로 route 리스트 찾기
        List<ResponseRoute> responseRoutes = new ArrayList<>();

        routeEntityList.forEach(route -> {
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
                                    .build()); // deliverylist(delivery) -> list(responsedelivery)

        });
        return responseRoutes;
    }

    @Override
    public ResponseRoute getRoute(int routeId) {
        Optional<Route> routeEntity = routeRepository.findById(routeId);
        ResponseRoute responseRoute = new ResponseRoute();

//        List<Route> nameList = Optional.ofNullable(getNames()).orElseGet(() -> new ArrayList<>());
        log.info(">>routeEntity 존재안함");
        System.out.println("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
        if(routeEntity.isPresent()){
            System.out.println("OoooooooooooooooooooOOOOOOOOOOOOOOOOOOOO");
            log.info(">>routeEntity 존재: " + routeEntity.toString());
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

    public RouteDto startWork(int userId, int routId){
        Optional<Delivery> findDelivery = deliveryRepository.findByRouteIdAndSequence(userId,1);
        Optional<Route> findRoute = routeRepository.findById(routId);
        /* feign client */
        RequestStart requestStart = new RequestStart();
        if(findDelivery.isPresent()){
            requestStart = new RequestStart(userId,routId,findDelivery.get().getId());
            ResponseUser responseUser = userServiceClient.startWork(requestStart);
        }
        LocalTime now = LocalTime.now();
        findRoute.get().builder().actualStartTime(now).build();
        routeRepository.save(findRoute.get());

        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        RouteDto response = mapper.map(findRoute.get(), RouteDto.class);
        //반환


        return response;
    }

}

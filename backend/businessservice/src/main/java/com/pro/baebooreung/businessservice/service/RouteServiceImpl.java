package com.pro.baebooreung.businessservice.service;

import com.pro.baebooreung.businessservice.domain.Delivery;
import com.pro.baebooreung.businessservice.domain.Route;
import com.pro.baebooreung.businessservice.domain.repository.DeliveryRepository;
import com.pro.baebooreung.businessservice.domain.repository.RouteRepository;
import com.pro.baebooreung.businessservice.vo.ResponseDelivery;
import com.pro.baebooreung.businessservice.vo.ResponseRoute;
import lombok.Data;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class RouteServiceImpl implements RouteService {
    RouteRepository routeRepository;
    DeliveryRepository deliveryRepository;
    @PersistenceContext
    private final EntityManager em;

    @Autowired
    public RouteServiceImpl(RouteRepository routeRepository, EntityManager em,DeliveryRepository deliveryRepository){
        this.routeRepository = routeRepository;
        this.deliveryRepository = deliveryRepository;
        this.em = em;
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
//            responseRoutes.add(new ModelMapper().map(route,ResponseRoute.class));

        });
        return responseRoutes;
    }

    @Override
    public List<ResponseRoute> getRouteByUserNDate(int userId){//}, Data date){
        //드라이버의 해당하는 날짜(?or 오늘???)의 done이 아닌 루트들
        LocalDate today =LocalDate.now();
        Iterable<Route> routeEntityList = routeRepository.findByUserIdAndDeliveryDateTime(userId,today);

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
                    .build());
        });


        return responseRoutes;

    }


}

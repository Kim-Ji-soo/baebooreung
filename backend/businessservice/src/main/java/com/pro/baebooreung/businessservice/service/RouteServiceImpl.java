package com.pro.baebooreung.businessservice.service;

import com.pro.baebooreung.businessservice.domain.repository.RouteRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Service
public class RouteServiceImpl implements RouteService {
    RouteRepository routeRepository;

    @PersistenceContext
    private final EntityManager em;

    @Autowired
    public RouteServiceImpl(RouteRepository routeRepository, EntityManager em){
        this.routeRepository = routeRepository;
        this.em = em;
    }

    @Override
    public void getRouteByUserNDate(int userId, Data date){
//        routeRepository.findByUserId


    }
}

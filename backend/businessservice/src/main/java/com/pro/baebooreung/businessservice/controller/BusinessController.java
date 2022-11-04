package com.pro.baebooreung.businessservice.controller;

import com.netflix.discovery.converters.Auto;
import com.pro.baebooreung.businessservice.domain.Route;
import com.pro.baebooreung.businessservice.service.RouteService;
import com.pro.baebooreung.businessservice.vo.ResponseRoute;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/business-service")
public class BusinessController {

    RouteService routeService;

    @Autowired
    public BusinessController(RouteService routeService){
        this.routeService=routeService;
    }

    //드라이버의 해당하는 날짜의 루트들
    @GetMapping("/{userId}/routes") ///{date}
    public ResponseEntity<List<ResponseRoute>> getRouteByUserNDate(@PathVariable("userId") int userId){//}, @PathVariable("date") @DateTimeFormat(pattern = "yyyyMMdd") LocalDate dateTime){
        Iterable<Route> routeList = routeService.getRouteByUserNDate(userId);

        List<ResponseRoute> result = new ArrayList<>();
        routeList.forEach(v ->{
            result.add(new ModelMapper().map(v,ResponseRoute.class));
        });
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    //한 루트
    //드라이버의 모든 루트들?

}

package com.pro.baebooreung.businessservice.controller;

import com.netflix.discovery.converters.Auto;
import com.pro.baebooreung.businessservice.domain.Route;
import com.pro.baebooreung.businessservice.dto.RouteDto;
import com.pro.baebooreung.businessservice.service.RouteService;
import com.pro.baebooreung.businessservice.vo.RequestCheckIn;
import com.pro.baebooreung.businessservice.vo.ResponseRoute;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.Path;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/")
public class BusinessController {

    RouteService routeService;

    @Autowired
    public BusinessController(RouteService routeService){
        this.routeService=routeService;
    }

   //유저의 모든 루트들 가져오기
    @GetMapping("/{userId}/routes") ///{date}
    public ResponseEntity<List<ResponseRoute>> getRouteByUser(@PathVariable("userId") int userId){//}, @PathVariable("date") @DateTimeFormat(pattern = "yyyyMMdd") LocalDate dateTime){
        List<ResponseRoute> routeList = routeService.getRouteByUser(userId);

//        List<ResponseRoute> result = new ArrayList<>();
//        routeList.forEach(v ->{
//            result.add(new ModelMapper().map(v,ResponseRoute.class));
//        });

        return ResponseEntity.status(HttpStatus.OK).body(routeList);
    }

    //드라이버의 해당하는 날짜(?or 오늘???)의 루트들
    @GetMapping("/{userId}/routes/today/undone") ///{date}
    public ResponseEntity<List<ResponseRoute>> getRouteByUserNDate(@PathVariable("userId") int userId){//}, @PathVariable("date") @DateTimeFormat(pattern = "yyyyMMdd") LocalDate dateTime){
        List<ResponseRoute> routeList = routeService.getRouteByUserNDate(userId);

//        List<ResponseRoute> result = new ArrayList<>();
//        routeList.forEach(v ->{
//            result.add(new ModelMapper().map(v,ResponseRoute.class));
//        });

        return ResponseEntity.status(HttpStatus.OK).body(routeList);
    }


    //한 루트에 대한 정보 얻기
    @GetMapping("/route/{routeId}") ///{date}
    public ResponseEntity<ResponseRoute> getRoute(@PathVariable("routeId") int routeId){
        ResponseRoute routeList = routeService.getRoute(routeId);

//        List<ResponseRoute> result = new ArrayList<>();
//        routeList.forEach(v ->{
//            result.add(new ModelMapper().map(v,ResponseRoute.class));
//        });

        return ResponseEntity.status(HttpStatus.OK).body(routeList);
    }


    // 업무 시작
    @PutMapping("/{userId}/start/{routeId}")
    public ResponseEntity<?> startWork(@PathVariable("userId") int userId,@PathVariable("routeId") int routeId){
        // User에다가 routeId,deliveryId, workStatus 를 바꿔주고,
        // Route의 actual_start_time에 현재 시간을 넣어줌

        RouteDto result = routeService.startWork(userId, routeId);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }




//    @PostMapping("/check-in/{userId}")
//    public ResponseEntity<List<ResponseRoute>> checkIn(@PathVariable("userId")int userId, @RequestBody RequestCheckIn requestCheckIn){
//        //userId를 받아서 그 사람의 userId에다가
//    }
}

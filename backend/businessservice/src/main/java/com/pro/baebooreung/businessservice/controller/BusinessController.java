package com.pro.baebooreung.businessservice.controller;

import com.pro.baebooreung.businessservice.vo.ResponseRoute;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/business-service")
public class BusinessController {

    //드라이버의 해당하는 날짜의 루트들
//    @GetMapping("/{userId}/routes/{date}")
//    public ResponseEntity<List<ResponseRoute>> getRouteByUserNDate(@PathVariable("userId") int userId, @PathVariable("date") @DateTimeFormat(pattern = "yyyyMMdd") LocalDate dateTime){
////        List<ResponseRoute>
//        return ;
//    }

    //한 루트
    //드라이버의 모든 루트들?

}

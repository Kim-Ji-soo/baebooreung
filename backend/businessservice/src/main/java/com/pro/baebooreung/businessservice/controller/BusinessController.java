package com.pro.baebooreung.businessservice.controller;

import com.netflix.discovery.converters.Auto;
import com.pro.baebooreung.businessservice.domain.Route;
import com.pro.baebooreung.businessservice.dto.*;
import com.pro.baebooreung.businessservice.service.DeliveryService;
import com.pro.baebooreung.businessservice.service.OrderService;
import com.pro.baebooreung.businessservice.service.RouteService;
import com.pro.baebooreung.businessservice.vo.RequestCheckBusiness;
import com.pro.baebooreung.businessservice.vo.RequestCheckIn;
import com.pro.baebooreung.businessservice.vo.ResponseRoute;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.Path;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/")
@Slf4j
public class BusinessController {

    RouteService routeService;
    OrderService orderService;

    private DeliveryService deliveryService;

    @Autowired
    public BusinessController(RouteService routeService, DeliveryService deliveryService, OrderService orderService){
        this.routeService=routeService;
        this.deliveryService = deliveryService;
        this.orderService=orderService;
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
        // User에다가 routeId,deliveryId,workStatus 를 바꿔주고,
        // Route의 actual_start_time에 현재 시간을 넣어줌

        RouteDto result = routeService.startWork(userId, routeId);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }



    //근데 이 체크인이 요청을 계속 보내주나.....?
//    @PatchMapping("/check-in/{userId}")
//    public ResponseEntity<List<ResponseRoute>> checkIn(@PathVariable("userId")int userId, @RequestBody RequestCheckBusiness requestCheckBusiness){
//        routeService.checkIn(userId,requestCheckBusiness.getRouteId(), requestCheckBusiness.getSequence());
//        return null;
//    }

    // 업무 끝
    @PutMapping("/{userId}/end/{routeId}")
    public ResponseEntity<?> endWork(@PathVariable("userId") int userId,@PathVariable("routeId") int routeId){
        // User에다가 routeId,deliveryId,workStatus 를 바꿔주고,
        // Route의 actual_start_time에 현재 시간을 넣어줌

        routeService.endWork(userId, routeId);
        return ResponseEntity.status(HttpStatus.OK).body("업무 완료");
    }

    //한 안내 경로에 대한 정보 얻기
    @GetMapping("/route/{routeId}/navigation") ///{date}
    public ResponseEntity<ResponseRoute> getNaviRoute(@PathVariable("routeId") int routeId){
        ResponseRoute routeList = routeService.getRoute(routeId);

//        List<ResponseRoute> result = new ArrayList<>();
//        routeList.forEach(v ->{
//            result.add(new ModelMapper().map(v,ResponseRoute.class));
//        });

        return ResponseEntity.status(HttpStatus.OK).body(routeList);
    }

    // 체크인 처리
    @PostMapping("/check-in/{userId}")
    public ResponseEntity<?> checkIn(@PathVariable("userId") int userId, @RequestBody CheckInDto checkInDto) {
        log.info("request checkIn data : {}", checkInDto.toString());
        try {
            CheckinResponseDto responseDto = routeService.checkIn(userId, checkInDto);
            return ResponseEntity.status(HttpStatus.OK).body(responseDto);
        } catch (IllegalStateException e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("해당 deliveryId가 존재하지 않습니다.");
        } catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("SERVER ERROR");
        }
    }

    // 지역, 날짜에 모든 안내 경로 얻기
    @PostMapping("/route/navigps")
    public ResponseEntity<?> getRouteAndNavigations(@RequestBody RouteAndNaviRequestDto requestDto){
        log.info("request navigps data : {}", requestDto.toString());
        try {
            return ResponseEntity.status(HttpStatus.OK).body(routeService.getRouteByRegionAndDate(requestDto.getRegion(), requestDto.getDate()));
        } catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("SERVER ERROR");
        }
    }

    // 지역, 날짜, 대학에 모든 안내 경로 얻기
    @PostMapping("/route/navigps/univ")
    public ResponseEntity<?> getRouteAndNavigationsByUniv(@RequestBody RouteAndNaviByRouteNameRequestDto requestDto){
        log.info("request navigpsByUniv data : {}", requestDto.toString());
        try {
            return ResponseEntity.status(HttpStatus.OK).body(routeService.getRouteByRegionAndDateAndRouteName(requestDto.getRegion(), requestDto.getDate(), requestDto.getRouteName()));
        } catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("SERVER ERROR");
        }
    }

    // 지역, 날짜, 대학, 루트타입(점심, 저녁)에 모든 안내 경로 얻기
    @PostMapping("/route/navigps/routetype")
    public ResponseEntity<?> getRouteAndNavigationsByRouteType(@RequestBody RouteAndNaviByRouteTypeRequestDto requestDto){
        log.info("request navigpsByRouteType data : {}", requestDto.toString());
        try {
            return ResponseEntity.status(HttpStatus.OK).body(routeService.getRouteByRegionAndDateAndRouteNameAndRouteType(requestDto.getRegion(), requestDto.getDate(), requestDto.getRouteName(), requestDto.getRouteType()));
        } catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("SERVER ERROR");
        }
    }

    @GetMapping("/route/delivery/{userId}")
    public ResponseEntity<?> getDelivery(@PathVariable("userId") int userId){
        log.info("request get Delivery userId : {}", userId);
        try {
            return ResponseEntity.status(HttpStatus.OK).body(routeService.getDriverRouteAndDelivery(userId));
        } catch (IllegalStateException e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("현재 운행중이지 않은 드라이버입니다.");
        } catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("SERVER ERROR");
        }
    }

    @GetMapping("/delivery/name/{deliveryId}")
    public ResponseEntity<String> getDeliveryName(@PathVariable("deliveryId") int deliveryId){
        try {
            return ResponseEntity.status(HttpStatus.OK).body(routeService.getDeliveryName(deliveryId));
        } catch (IllegalStateException e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("존재하지 않는 목적지 입니다.");
        } catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("SERVER ERROR");
        }
    }

    @GetMapping("/route/actualstartTime/{routeId}")
    public ResponseEntity<String> getRouteActualStartTime(@PathVariable("routeId") int routeId){
        try {
            return ResponseEntity.status(HttpStatus.OK).body(String.valueOf(routeService.getRouteActualStartTime(routeId)));
        } catch (IllegalStateException e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("존재하지 않는 경로 입니다.");
        } catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("SERVER ERROR");
        }
    }

    @PostMapping("/delivery/save/Img")
    public void saveImg(@RequestBody CheckResponse res){
        System.out.println("왜 안돼!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        deliveryService.saveImg(res);
    }

    @GetMapping("/delivery/Img/{delId}")
    public String getImg(@PathVariable("delId") int delId){
        return deliveryService.getImg(delId);
    }

    // 루트 번호로 해당하는 모든 경유지 리스트 가져오기
    @GetMapping("/delivery/{routeId}")
    public ResponseEntity<?> getDeliveryByRouteId(@PathVariable("routeId") int routeId) {
        log.info("getDeliveryByRouteId request path date = {}", routeId);
        try {
            return ResponseEntity.status(HttpStatus.OK).body(deliveryService.getDeliveryList(routeId));
        } catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("SERVER ERROR");
        }
    }

    @GetMapping("/order/cnt/{routeId}")
    public ResponseEntity<?> getOrderCntByDeliveryId(@PathVariable("routeId") int routeId){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(orderService.getOrderCntByRoute(routeId));
        } catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("SERVER ERROR");
        }
    }
}

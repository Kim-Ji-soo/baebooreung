package com.pro.baebooreung.gpsservice.controller;


import com.pro.baebooreung.gpsservice.dto.GpsResponseDto;
import com.pro.baebooreung.gpsservice.service.GpsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class GpsController {
    private final GpsService gpsService;

    @GetMapping("/gps/{userId}")
    public ResponseEntity<?> getGps(@PathVariable("userId") int user_id) {
        try {
            log.info("get GPS, userId : {}", user_id);

            GpsResponseDto gpsResponseDto = gpsService.findGps(user_id);
            return new ResponseEntity<>(gpsResponseDto, HttpStatus.OK);
        } catch (IllegalStateException e){
            return new ResponseEntity<>("현재 배달 중인 배달원이 아닙니다.", HttpStatus.BAD_REQUEST);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>("SERVER ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/gps/route/{routeId}")
    public ResponseEntity<?> getGpsListByRouteId(@PathVariable("routeId") int routeId){
        try {
            log.info("get GPS, routeId : {}", routeId);
            return new ResponseEntity<>(gpsService.findGpsByRouteId(routeId), HttpStatus.OK);
        } catch (IllegalStateException e){
            return new ResponseEntity<>("현재 배달 중인 배달원이 아닙니다.", HttpStatus.BAD_REQUEST);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>("SERVER ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/gps/user/{userId}")
    public ResponseEntity<?> getGpsListByUserId(@PathVariable("userId") int userId){
        try {
            log.info("get GPS, userId : {}", userId);
            return new ResponseEntity<>(gpsService.findGpsByUserId(userId), HttpStatus.OK);
        } catch (IllegalStateException e){
            return new ResponseEntity<>("현재 배달 중인 배달원이 아닙니다.", HttpStatus.BAD_REQUEST);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>("SERVER ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

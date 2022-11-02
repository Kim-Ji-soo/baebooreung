package com.pro.baebooreung.producerservice.controller;

import com.pro.baebooreung.producerservice.dto.GpsSaveDto;
import com.pro.baebooreung.producerservice.service.GpsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class GpsController {

    private final GpsService gpsService;

    @PostMapping("/kafka/gps")
    public ResponseEntity<?> gpsSave(@RequestBody GpsSaveDto gpsSaveDto){
        try {
            log.info("userId : {}", gpsSaveDto.getUserId());
            log.info("latitude : {}", gpsSaveDto.getLatitude());
            log.info("longitude : {}", gpsSaveDto.getLongitude());
            log.info("requestDateTime : {}", gpsSaveDto.getRequestDateTime());
            gpsService.sendGps(gpsSaveDto);
            return new ResponseEntity<String>("Success", HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<String>("Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}

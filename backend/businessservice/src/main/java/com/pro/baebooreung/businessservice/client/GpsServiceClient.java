package com.pro.baebooreung.businessservice.client;

import com.pro.baebooreung.businessservice.vo.ResponseGps;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "gps-service")
public interface GpsServiceClient {

    @GetMapping("/gps/{userId}")
    public ResponseGps getGps(@PathVariable("userId") int user_id);
}

package com.pro.baebooreung.businessservice.client;

import com.pro.baebooreung.businessservice.dto.ResponseDriverRoute;
import com.pro.baebooreung.businessservice.vo.RequestCheckIn;
import com.pro.baebooreung.businessservice.vo.RequestStart;
import com.pro.baebooreung.businessservice.vo.ResponseRoute;
import com.pro.baebooreung.businessservice.vo.ResponseUser;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "user-service")
public interface UserServiceClient {

    @PutMapping("/start")
    public ResponseUser startWork(@RequestBody RequestStart start);

    @PutMapping("/checkIn")
    public ResponseEntity<String> checkIn(@RequestBody RequestCheckIn requestCheckIn);

    @PutMapping("/end/{userId}")
    public ResponseEntity<String> endWork(@PathVariable("userId") int userId);

    @GetMapping("/route/delivery/{userId}")
    public ResponseDriverRoute checkRouteAndDelivery(@PathVariable("userId") int userId);


}

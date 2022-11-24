package com.pro.baebooreung.checkinservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "user-service")
public interface UserServiceClient {

    @GetMapping("/fcm/user/{id}") //회원이 다음에 향할 지점인 deliveryId 가져오기
    public int getUserDeliveryId(@PathVariable int id);


}

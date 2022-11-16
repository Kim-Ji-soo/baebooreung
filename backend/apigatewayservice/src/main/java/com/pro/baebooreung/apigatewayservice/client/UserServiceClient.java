package com.pro.baebooreung.apigatewayservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service")
public interface UserServiceClient {

    @GetMapping("/fcm/specialkey/{userId}")
    public String getSpecialkey(@PathVariable("userId") int userId);
}

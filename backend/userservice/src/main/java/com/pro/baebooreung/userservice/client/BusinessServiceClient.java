package com.pro.baebooreung.userservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "business-service")
public interface BusinessServiceClient {

//    @GetMapping("/business-service/{id}/route")
//    List<>
}

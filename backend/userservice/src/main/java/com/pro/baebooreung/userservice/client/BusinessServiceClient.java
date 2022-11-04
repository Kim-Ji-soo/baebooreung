package com.pro.baebooreung.userservice.client;

import com.pro.baebooreung.userservice.vo.ResponseRoute;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "business-service")
public interface BusinessServiceClient {

    @GetMapping("/business-service/{userId}/routes")
    List<ResponseRoute> getRouteByUserNDate(@PathVariable("userId") int userId);
}

package com.pro.baebooreung.s3service.client;

import com.pro.baebooreung.s3service.dto.CheckResponse;
import com.pro.baebooreung.s3service.dto.ProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "business-service")
public interface DeliveryTaskClient {

    @PostMapping("/delivery/save/Img")
    void saveImg(CheckResponse res);

    @GetMapping("/delivery/Img/{delId}")
    String getImg(@PathVariable("delId") int delId);
}

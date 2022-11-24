package com.pro.baebooreung.checkinservice.client;


import com.pro.baebooreung.checkinservice.dto.DeliveryGPSDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "business-service")
public interface BusinessServiceClient {

    @GetMapping("/delivery/gps/{deliveryId}")
    public DeliveryGPSDto getDeliveryGps(@PathVariable("deliveryId") int deliveryId);
}

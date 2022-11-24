package com.pro.baebooreung.businessservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
public class DeliveryGPSDto {
    String delName;
    double latitude;
    double longitude;

    @Builder
    public DeliveryGPSDto(String delName, double latitude, double longitude){
        this.delName = delName;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}

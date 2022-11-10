package com.pro.baebooreung.businessservice.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@NoArgsConstructor
public class NavigationDto {
    double latitude;
    double longitude;

    @Builder
    public NavigationDto(double latitude, double longitude){
        this.latitude = latitude;
        this.longitude = longitude;
    }
}

package com.pro.baebooreung.businessservice.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CheckinResponseDto {
    int deliveryId;

    @Builder
    public CheckinResponseDto(int deliveryId){
        this.deliveryId = deliveryId;
    }
}

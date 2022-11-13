package com.pro.baebooreung.businessservice.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DriverRouteAndDeliveryDto {
    int route_id;
    int delivery_id;
    int sequence;
    int all_delvery;

    @Builder
    public DriverRouteAndDeliveryDto(int route_id, int delivery_id, int sequence, int all_delvery){
        this.route_id = route_id;
        this.delivery_id = delivery_id;
        this.sequence = sequence;
        this.all_delvery = all_delvery;
    }
}

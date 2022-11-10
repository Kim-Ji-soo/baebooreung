package com.pro.baebooreung.userservice.dto;

import lombok.Data;

@Data
public class CheckinDto {
    private int id;
    private int routeId;
    private int deliveryId;

    @Override
    public String toString() {
        return "CheckinDto{" +
                "id=" + id +
                ", routeId=" + routeId +
                ", deliveryId=" + deliveryId +
                '}';
    }
}

package com.pro.baebooreung.businessservice.vo;

import lombok.Data;

@Data
public class RequestCheckIn {
    private int id;
//    private int routeId;
    private int deliveryId;

    public RequestCheckIn(int id, int deliveryId) {
        this.id = id;
        this.deliveryId = deliveryId;
    }

}

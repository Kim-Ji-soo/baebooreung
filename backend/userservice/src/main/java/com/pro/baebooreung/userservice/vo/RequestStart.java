package com.pro.baebooreung.userservice.vo;

import lombok.Data;

import javax.persistence.Column;

@Data
public class RequestStart {
    private int id;
    private int routeId;
    private int deliveryId;
}

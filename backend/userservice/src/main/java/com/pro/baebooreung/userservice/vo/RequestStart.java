package com.pro.baebooreung.userservice.vo;

import lombok.Data;

import javax.persistence.Column;

@Data
public class RequestStart {
    private int id;
    private Integer routeId;
    private Integer deliveryId;
}

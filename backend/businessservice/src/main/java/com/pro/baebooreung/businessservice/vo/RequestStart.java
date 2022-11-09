package com.pro.baebooreung.businessservice.vo;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor//(access = AccessLevel.PROTECTED)
public class RequestStart {
    private int id;
    private int routeId;
    private int deliveryId;
}

package com.pro.baebooreung.businessservice.vo;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class ResponseRoute {
    private int id;
    private String routeName;

    private List<ResponseDelivery> deliveryList;

    @Builder
    public ResponseRoute(int id, String routeName, List<ResponseDelivery> deliveryList) {
        this.id = id;
        this.routeName = routeName;
        this.deliveryList = deliveryList;
    }
}

package com.pro.baebooreung.businessservice.dto;

import com.pro.baebooreung.businessservice.domain.RouteType;
import com.pro.baebooreung.businessservice.vo.ResponseDelivery;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class RouteDto {
    private int id;
    private String routeName;
    private RouteType routeType;
    private boolean done;
    private LocalDate date;
    private LocalTime scheduledStartTime;
    private LocalTime actualStartTime; // 업무를 실제로 시작한 시간

    private List<DeliveryDto> deliveryList;

    @Builder
    public RouteDto(int id, String routeName, List<DeliveryDto> deliveryList) {
        this.id = id;
        this.routeName = routeName;
        this.deliveryList = deliveryList;
    }
}

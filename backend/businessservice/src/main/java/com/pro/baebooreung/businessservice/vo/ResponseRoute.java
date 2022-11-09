package com.pro.baebooreung.businessservice.vo;

import com.pro.baebooreung.businessservice.domain.RouteType;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
public class ResponseRoute {
    private int id;
    private String routeName;
    private RouteType routeType;
    private boolean done;
    private LocalDate date;
    private LocalTime scheduledStartTime;
    //private LocalTime actualStartTime; // 업무를 실제로 시작한 시간

    private List<ResponseDelivery> deliveryList;

    @Builder
    public ResponseRoute(int id, String routeName, List<ResponseDelivery> deliveryList) {
        this.id = id;
        this.routeName = routeName;
        this.deliveryList = deliveryList;
    }
}

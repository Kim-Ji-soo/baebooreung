package com.pro.baebooreung.businessservice.dto;

import com.pro.baebooreung.businessservice.domain.RouteType;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

@Data
@NoArgsConstructor
public class RouteByRegionAndDateDto {
    int routeId;
    RouteType routeType;
    String routeName;
    boolean done;
    List<NavigationDto> navigationList = new ArrayList<>();

    @Builder
    public RouteByRegionAndDateDto(int routeId, RouteType routeType, String routeName, boolean done){
        this.routeId = routeId;
        this.routeType = routeType;
        this.routeName = routeName;
        this.done = done;
    }
}

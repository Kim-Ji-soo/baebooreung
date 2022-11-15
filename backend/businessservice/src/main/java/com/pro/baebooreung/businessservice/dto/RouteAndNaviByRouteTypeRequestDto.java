package com.pro.baebooreung.businessservice.dto;

import com.pro.baebooreung.businessservice.domain.Region;
import com.pro.baebooreung.businessservice.domain.RouteType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RouteAndNaviByRouteTypeRequestDto {
    Region region;
    LocalDate date;
    String routeName;
    RouteType routeType;
}

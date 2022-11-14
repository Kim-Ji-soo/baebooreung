package com.pro.baebooreung.businessservice.service;

import com.pro.baebooreung.businessservice.domain.Region;
import com.pro.baebooreung.businessservice.domain.Route;
import com.pro.baebooreung.businessservice.dto.*;
import com.pro.baebooreung.businessservice.vo.ResponseRoute;
import lombok.Data;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface RouteService {
//    public Iterable<Route> getRouteByUserNDate(int userId);//, Data date);

    public List<ResponseRoute> getRouteByUserNDate(int userId);//, Data date);
    public List<ResponseRoute> getRouteByUser(int userId);

    public ResponseRoute getRoute(int routeId);

    public RouteDto startWork(int userId, int routId);
    public void endWork(int userId,int routeId);
    public CheckinResponseDto checkIn(int userId, CheckInDto checkInDto) throws Exception;
    public List<RouteByRegionAndDateDto> getRouteByRegionAndDate(Region region, LocalDate localDate) throws Exception;
    List<RouteByRegionAndDateDto> getRouteByRegionAndDateAndRouteName(Region region, LocalDate localDate, String routeName) throws Exception;
    DriverRouteAndDeliveryDto getDriverRouteAndDelivery(int user_id) throws Exception;
    public String getDeliveryName(int deliveryId) throws Exception;

}

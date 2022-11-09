package com.pro.baebooreung.businessservice.service;

import com.pro.baebooreung.businessservice.domain.Route;
import com.pro.baebooreung.businessservice.dto.RouteDto;
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
}

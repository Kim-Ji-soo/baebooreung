package com.pro.baebooreung.businessservice.service;

import com.pro.baebooreung.businessservice.domain.Route;
import com.pro.baebooreung.businessservice.vo.ResponseRoute;
import lombok.Data;

import java.util.List;

public interface RouteService {
    public Iterable<Route> getRouteByUserNDate(int userId);//, Data date);
    public List<ResponseRoute> getRouteByUser(int userId);
}

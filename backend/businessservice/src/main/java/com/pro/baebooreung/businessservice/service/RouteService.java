package com.pro.baebooreung.businessservice.service;

import com.pro.baebooreung.businessservice.domain.Route;
import lombok.Data;

public interface RouteService {
    public Iterable<Route> getRouteByUserNDate(int userId);//, Data date);
}

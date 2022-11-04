package com.pro.baebooreung.businessservice.service;

import lombok.Data;

public interface RouteService {
    public void getRouteByUserNDate(int userId, Data date);
}

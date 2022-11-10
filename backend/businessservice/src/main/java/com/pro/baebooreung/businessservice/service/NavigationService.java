package com.pro.baebooreung.businessservice.service;

import com.pro.baebooreung.businessservice.dto.NavigationDto;

import java.util.List;

public interface NavigationService {
    void saveNavigationGps(int route_id, List<NavigationDto> path) throws Exception;
    List<NavigationDto> getNavigationGpsByRouteId(int route_id) throws Exception;
}

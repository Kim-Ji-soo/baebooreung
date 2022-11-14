package com.pro.baebooreung.businessservice.service;

import com.pro.baebooreung.businessservice.dto.OrderCntResponseDto;

public interface OrderService {
    OrderCntResponseDto getOrderCntByRoute(int route) throws Exception;
}

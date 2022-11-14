package com.pro.baebooreung.businessservice.service;

import com.pro.baebooreung.businessservice.dto.CheckResponse;

public interface DeliveryService {

    public void saveImg(CheckResponse res);

    public String getImg(int delId);
}

package com.pro.baebooreung.businessservice.service;

import com.pro.baebooreung.businessservice.domain.Delivery;
import com.pro.baebooreung.businessservice.dto.CheckResponse;
import com.pro.baebooreung.businessservice.dto.DeliveryDto;
import java.util.*;

public interface DeliveryService {

    public void saveImg(CheckResponse res);

    public String getImg(int delId);

    public List<DeliveryDto> getDeliveryList(int routeId) throws Exception;

    public boolean getCheckDelivery(int deliveryId) throws Exception;
}

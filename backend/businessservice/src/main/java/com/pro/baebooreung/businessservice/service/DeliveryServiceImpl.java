package com.pro.baebooreung.businessservice.service;

import com.pro.baebooreung.businessservice.domain.Delivery;
import com.pro.baebooreung.businessservice.domain.repository.DeliveryRepository;
import com.pro.baebooreung.businessservice.dto.CheckResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class DeliveryServiceImpl implements DeliveryService {

    DeliveryRepository deliveryRepository;

    @Override
    public void saveImg(CheckResponse res) {
        Optional<Delivery> findDel = deliveryRepository.findById(res.getDelId());
        if(findDel.isPresent()){
            findDel.get().updateImg(res.getImgUrl());
            deliveryRepository.save(findDel.get());
        }

    }

    @Override
    public String getImg(int delId) {
        Optional<Delivery> findDel = deliveryRepository.findById(delId);
        return findDel.get().getImg();
    }
}

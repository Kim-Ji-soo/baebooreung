package com.pro.baebooreung.businessservice.service;

import com.pro.baebooreung.businessservice.domain.Delivery;
import com.pro.baebooreung.businessservice.domain.repository.DeliveryRepository;
import com.pro.baebooreung.businessservice.dto.CheckResponse;
import com.pro.baebooreung.businessservice.dto.DeliveryDto;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.print.DocFlavor;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class DeliveryServiceImpl implements DeliveryService {

    DeliveryRepository deliveryRepository;
//    BCryptPasswordEncoder passwordEncoder;
//
//    Environment env;
//    @Autowired
//    public DeliveryServiceImpl(DeliveryRepository deliveryRepository,
//                           BCryptPasswordEncoder passwordEncoder,
//                           Environment env ) {
//        this.deliveryRepository= deliveryRepository;
//        this.passwordEncoder = passwordEncoder;
//        this.env = env;
//    }

    @Override
    public void saveImg(CheckResponse res) {
        log.info(res.getDelId()+":delivery Id");
        Optional<Delivery> findDel = deliveryRepository.findById(res.getDelId());
        Delivery delivery = findDel.get();
        log.info(delivery+":delivery!!!!!!!!!");
        delivery.updateImg(res.getImgUrl());
        deliveryRepository.save(delivery);
    }

    @Override
    public String getImg(int delId) {
        Optional<Delivery> findDel = deliveryRepository.findById(delId);
        return findDel.get().getImg();
    }

    @Override
    public List<DeliveryDto> getDeliveryList(int routeId) throws Exception {
        List<Delivery> findDelivery = deliveryRepository.findByRouteId(routeId);
        List<DeliveryDto> deliveryDtoList = new ArrayList<>();
        if(findDelivery == null) return deliveryDtoList;
        for(Delivery delivery:findDelivery){
            deliveryDtoList.add(DeliveryDto.builder().id(delivery.getId())
                    .delName(delivery.getDelName())
                    .address(delivery.getAddress())
                    .latitude(delivery.getLatitude())
                    .longitude(delivery.getLongitude())
                    .sequence(delivery.getSequence())
                    .type(delivery.getType())
                    .check(delivery.isCheck())
                    .delScheduledTime(delivery.getDelScheduledTime())
                    .orderNum(0).build());
        }
        return deliveryDtoList;
    }


}

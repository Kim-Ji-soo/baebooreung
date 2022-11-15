package com.pro.baebooreung.businessservice.service;

import com.pro.baebooreung.businessservice.domain.Delivery;
import com.pro.baebooreung.businessservice.domain.Order;
import com.pro.baebooreung.businessservice.domain.repository.DeliveryRepository;
import com.pro.baebooreung.businessservice.domain.repository.OrderRepository;
import com.pro.baebooreung.businessservice.dto.OrderCntResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Service
@Slf4j
@Transactional
public class OrderServiceImpl implements OrderService{
    DeliveryRepository deliveryRepository;
    OrderRepository orderRepository;

    @PersistenceContext
    private final EntityManager em;

    public OrderServiceImpl(DeliveryRepository deliveryService, OrderRepository orderRepository, EntityManager em){
        this.deliveryRepository = deliveryService;
        this.orderRepository = orderRepository;
        this.em = em;
    }

    @Override
    public OrderCntResponseDto getOrderCntByRoute(int routeId) throws Exception {
        List<Delivery> deliveryList = deliveryRepository.findByRouteId(routeId);
        if(deliveryList == null || deliveryList.size() == 0) return OrderCntResponseDto.builder().all(0).done(0).build();
        int all_cnt = 0;
        int done_cnt = 0;
        for(Delivery delivery:deliveryList){
            List<Order> orderList = orderRepository.findByDeliveryId(delivery.getId());
            if(orderList != null && orderList.size() != 0){
                if(delivery.isCheck()){
                    done_cnt += orderList.size();
                }
                all_cnt += orderList.size();
            }
        }
        return OrderCntResponseDto.builder().all(all_cnt).done(done_cnt).build();
    }
}

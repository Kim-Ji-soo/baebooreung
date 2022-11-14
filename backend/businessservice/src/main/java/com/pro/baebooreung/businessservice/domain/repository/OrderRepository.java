package com.pro.baebooreung.businessservice.domain.repository;

import com.pro.baebooreung.businessservice.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.*;

public interface OrderRepository extends JpaRepository<OrderRepository, Integer> {
    List<Order> findByDelivery(int deliveryId);
}

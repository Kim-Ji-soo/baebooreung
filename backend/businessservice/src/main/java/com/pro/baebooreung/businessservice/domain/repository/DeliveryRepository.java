package com.pro.baebooreung.businessservice.domain.repository;

import com.pro.baebooreung.businessservice.domain.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeliveryRepository extends JpaRepository<Delivery,Integer> {
    List<Delivery> findByRouteId(int routeId);
}

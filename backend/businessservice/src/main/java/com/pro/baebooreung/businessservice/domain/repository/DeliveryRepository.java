package com.pro.baebooreung.businessservice.domain.repository;

import com.pro.baebooreung.businessservice.domain.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeliveryRepository extends JpaRepository<Delivery,Integer> {
    List<Delivery> findByRouteId(int routeId);
    Optional<Delivery> findByRouteIdAndSequence(int routId, int sequence);

//
//    @Override
//    Optional<Delivery> findById(Integer id);
}

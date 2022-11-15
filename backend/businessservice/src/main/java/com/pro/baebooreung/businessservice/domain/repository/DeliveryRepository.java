package com.pro.baebooreung.businessservice.domain.repository;

import com.pro.baebooreung.businessservice.domain.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DeliveryRepository extends JpaRepository<Delivery,Integer> {
    @Query("SELECT d FROM Delivery as d WHERE d.route = :routeId")
    List<Delivery> findByRouteId(@Param("routeId")int routeId);
    Optional<Delivery> findByRouteIdAndSequence(int routId, int sequence);

//
//    @Override
//    Optional<Delivery> findById(Integer id);
}

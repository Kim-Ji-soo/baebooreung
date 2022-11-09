package com.pro.baebooreung.businessservice.domain.repository;

import com.pro.baebooreung.businessservice.domain.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface RouteRepository extends JpaRepository<Route,Integer> {
    Iterable<Route> findByUserId(int userId);
    @Query("SELECT r FROM Route as r WHERE r.userId = :userId and r.deliveryDateTime = :dateTime")
    Iterable<Route> findByUserIdAndDeliveryDateTime(@Param("userId") int userId, @Param("datetime")LocalDate date);
}
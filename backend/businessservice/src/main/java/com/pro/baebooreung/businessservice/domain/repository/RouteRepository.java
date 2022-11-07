package com.pro.baebooreung.businessservice.domain.repository;

import com.pro.baebooreung.businessservice.domain.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.time.LocalDate;

public interface RouteRepository extends JpaRepository<Route,Integer> {
    Iterable<Route> findByUserId(int userId);
    Iterable<Route> findByUserIdAndDeliveryDateTime(int userId, LocalDate date);
}

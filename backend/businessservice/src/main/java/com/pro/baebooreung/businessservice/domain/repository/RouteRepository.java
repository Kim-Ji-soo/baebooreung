package com.pro.baebooreung.businessservice.domain.repository;

import com.pro.baebooreung.businessservice.domain.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Transactional
public interface RouteRepository extends JpaRepository<Route,Integer> {
    Iterable<Route> findByUserId(int userId);
    @Query("SELECT r FROM Route as r WHERE r.userId = :userId and r.date = :date")
    Iterable<Route> findByUserIdAndDeliveryDateTime(@Param("userId") int userId, @Param("date")LocalDate date);

//    @Override
//    Optional<Route> findById(int id);
}

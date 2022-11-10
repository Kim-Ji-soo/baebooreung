package com.pro.baebooreung.businessservice.domain.repository;

import com.pro.baebooreung.businessservice.domain.Navigation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NavigationRepository extends JpaRepository<Navigation, Integer> {
    List<Navigation> findByRouteId(int route_id) throws Exception;
}

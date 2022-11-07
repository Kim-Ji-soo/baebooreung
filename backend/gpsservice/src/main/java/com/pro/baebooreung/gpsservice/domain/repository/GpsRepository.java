package com.pro.baebooreung.gpsservice.domain.repository;

import com.pro.baebooreung.gpsservice.domain.Gps;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GpsRepository extends JpaRepository<Gps, Integer> {

    @Query(value = "select * from gps g where g.user_id = :user_id order by gps_datetime desc LIMIT 1", nativeQuery = true)
    Gps findGps(@Param("user_id") int user_id) throws Exception;
}


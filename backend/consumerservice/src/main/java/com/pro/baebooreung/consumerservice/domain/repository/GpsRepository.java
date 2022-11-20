package com.pro.baebooreung.consumerservice.domain.repository;

import com.pro.baebooreung.consumerservice.domain.Gps;
import com.pro.baebooreung.consumerservice.domain.User;
import com.pro.baebooreung.consumerservice.dto.GpsSaveDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;


@Repository
@RequiredArgsConstructor
@Transactional
public class GpsRepository {

    @PersistenceContext
    private final EntityManager em;

    public void save(GpsSaveDto gpsSaveDto, User user){
        Gps gps = Gps.builder().latitude(Double.parseDouble(gpsSaveDto.getLatitude()))
                .longitude(Double.parseDouble(gpsSaveDto.getLongitude()))
                .user(user)
                .routeId(1)
                .delivery_id(1)
                .requestDateTime(gpsSaveDto.getRequestDateTime()).build();
        em.persist(gps);
    }


}

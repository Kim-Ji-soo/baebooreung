package com.pro.baebooreung.checkinservice.domain.repository;

import com.pro.baebooreung.checkinservice.domain.Delivery;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Repository
@RequiredArgsConstructor
@Transactional
public class DeliveryRepository {
    @PersistenceContext
    private final EntityManager em;

    public Delivery findOne(int delivery_id){
        Delivery findDelivery = em.find(Delivery.class, delivery_id);
        return findDelivery;
    }
}

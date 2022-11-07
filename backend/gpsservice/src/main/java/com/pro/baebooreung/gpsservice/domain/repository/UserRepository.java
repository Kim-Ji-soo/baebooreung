package com.pro.baebooreung.gpsservice.domain.repository;

import com.pro.baebooreung.gpsservice.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Repository
@RequiredArgsConstructor
@Transactional
public class UserRepository {
    @PersistenceContext
    private final EntityManager em;

    public User findOne(int id){
        User findUser = em.find(User.class, id);
        return findUser;
    }
}

package com.pro.baebooreung.consumerservice.domain.repository;

import com.pro.baebooreung.consumerservice.domain.User;
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

    public User findOne(int user_id){
        User findUser = em.find(User.class, user_id);
        return findUser;
    }
}

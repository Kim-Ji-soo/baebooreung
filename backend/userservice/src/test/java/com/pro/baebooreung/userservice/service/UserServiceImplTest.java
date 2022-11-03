package com.pro.baebooreung.userservice.service;

import com.pro.baebooreung.userservice.domain.UserEntity;
import com.pro.baebooreung.userservice.domain.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import static org.junit.jupiter.api.Assertions.*;

class UserServiceImplTest {
    @Autowired
    UserRepository userRepository;

    @Test
    void getUserByAll() {
        Iterable<UserEntity> result = userRepository.findAll();
        System.out.println(result.toString());
    }
}
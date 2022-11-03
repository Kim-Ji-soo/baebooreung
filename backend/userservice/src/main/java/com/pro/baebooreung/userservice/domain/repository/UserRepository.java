package com.pro.baebooreung.userservice.domain.repository;

import com.pro.baebooreung.userservice.domain.UserEntity;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<UserEntity,Integer> {
    UserEntity findByUserId(String userId);
    UserEntity findByEmail(String username);

    UserEntity findById(int id);
}

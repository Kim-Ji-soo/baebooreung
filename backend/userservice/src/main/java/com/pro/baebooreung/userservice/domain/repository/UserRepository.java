package com.pro.baebooreung.userservice.domain.repository;

import com.pro.baebooreung.userservice.domain.UserEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


@Repository
public interface UserRepository extends CrudRepository<UserEntity,Integer> {
    UserEntity findBySpecialKey(String specialKey);
    UserEntity findByEmail(String username);

    UserEntity findById(int id);

    @Override
    <S extends UserEntity> S save(S entity);
}

package com.pro.baebooreung.userservice.service;

import com.pro.baebooreung.userservice.domain.UserEntity;
import com.pro.baebooreung.userservice.dto.UserDto;
import com.pro.baebooreung.userservice.vo.ResponseUser;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
    UserDto createUser(UserDto userDto);

//    UserDto getUserByUserId(String userId);
    Iterable<UserEntity> getUserByAll();

    ResponseUser getUserById(int id);

    UserDto getUserDetailsByEmail(String userName);
}

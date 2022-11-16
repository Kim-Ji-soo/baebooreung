package com.pro.baebooreung.userservice.service;

import com.pro.baebooreung.userservice.domain.UserEntity;
import com.pro.baebooreung.userservice.dto.*;
import com.pro.baebooreung.userservice.vo.ResponseUser;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
    UserJoinDto createUser(UserJoinDto userDto);

//    UserDto getUserByUserId(String userId);
    Iterable<UserEntity> getUserByAll();

    UserDto getUserById(int id);

    UserDto getUserDetailsByEmail(String userName);

    ResponseUser setUsertoDriver(int id);

    UserDto setStart(StartDto startDto);

    public void setCheckIn(CheckinDto checkinDto);

    public void setEnd(int id);

    ResponseDriverRoute getDriverRoute(int id);


    public void saveProfile(ProfileResponse res);

    public String getProfile(int userId);

    public String getSpecialKey(int id);
}

package com.pro.baebooreung.userservice.service;

import com.pro.baebooreung.userservice.domain.UserEntity;
import com.pro.baebooreung.userservice.dto.CheckinDto;
import com.pro.baebooreung.userservice.dto.ProfileResponse;
import com.pro.baebooreung.userservice.dto.ResponseDriverRoute;
import com.pro.baebooreung.userservice.dto.StartDto;
import com.pro.baebooreung.userservice.dto.UserDto;
import com.pro.baebooreung.userservice.vo.ResponseUser;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
    UserDto createUser(UserDto userDto);

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

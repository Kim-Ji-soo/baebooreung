package com.pro.baebooreung.userservice.dto;

import com.pro.baebooreung.userservice.domain.Grade;
import com.pro.baebooreung.userservice.vo.ResponseRoute;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class UserDto {
    private int id;
    private String email;
    private String name;
    private String password;
    private String specialKey;
    private Date createdAt;

    private Grade grade; //?

    private String phone;

    private int region;
//    private String decryptedPwd;

    private String encryptedPwd;

    private List<ResponseRoute> routeList;

}

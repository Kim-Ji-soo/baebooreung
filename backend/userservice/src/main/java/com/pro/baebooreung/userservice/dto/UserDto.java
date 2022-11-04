package com.pro.baebooreung.userservice.dto;

import lombok.Data;

import java.util.Date;

@Data
public class UserDto {
    private int id;
    private String email;
    private String name;
    private String password;
    private String specialKey;
    private Date createdAt;

    private String grade; //?

    private String phone;

    private int region;
//    private String decryptedPwd;

    private String encryptedPwd;

}

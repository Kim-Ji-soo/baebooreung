package com.pro.baebooreung.userservice.dto;

import com.pro.baebooreung.userservice.domain.Grade;
import lombok.Data;

@Data
public class UserJoinDto {
    private String email;
    private String name;
    private String password;
    private String specialKey;
    private Grade grade;
    private String encryptedPwd;
    private String profile;
    private String phone;
    private Integer region;

}

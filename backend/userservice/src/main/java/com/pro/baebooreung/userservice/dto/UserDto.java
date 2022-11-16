package com.pro.baebooreung.userservice.dto;

import com.pro.baebooreung.userservice.domain.WorkStatus;
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

    private String grade; //?

    private String phone;
    private WorkStatus workStatus;

    private int region;
//    private String decryptedPwd;

    private String encryptedPwd;

    private List<ResponseRoute> routeList;

}

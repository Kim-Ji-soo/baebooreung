package com.pro.baebooreung.gpsservice.domain;

public enum Grade {
    UNAUTHORIZED, // 권한받지 않은 드라이버
    DRIVER,  // 권한 받은 드라이버
    MANAGER,  // 관리자
    ADMIN  // 총관리자(EX. 개발자)
}

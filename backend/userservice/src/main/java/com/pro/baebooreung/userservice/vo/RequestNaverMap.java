package com.pro.baebooreung.userservice.vo;

import lombok.Data;

@Data
public class RequestNaverMap {
    private String start;
    private String goal;
    private String waypoints;
    private String option;
}

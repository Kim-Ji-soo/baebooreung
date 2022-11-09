package com.pro.baebooreung.businessservice.dto;

import com.pro.baebooreung.businessservice.domain.Type;

import java.time.LocalTime;

public class DeliveryDto {
    private int id;
    private String delName;
    private String address;
    private double latitude;
    private double longitude;
    private int sequence;
    private Type type;
    private boolean check;

    private LocalTime delScheduledTime;

    private int orderNum;
}

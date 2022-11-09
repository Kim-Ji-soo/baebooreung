package com.pro.baebooreung.businessservice.vo;

import com.pro.baebooreung.businessservice.domain.Type;
import lombok.Data;

import java.time.LocalTime;

@Data
public class ResponseDelivery {
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

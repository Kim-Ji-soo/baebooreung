package com.pro.baebooreung.businessservice.dto;

import com.pro.baebooreung.businessservice.domain.Type;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
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

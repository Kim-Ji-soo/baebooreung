package com.pro.baebooreung.businessservice.dto;

import com.pro.baebooreung.businessservice.domain.Type;
import lombok.*;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@ToString
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

    @Builder
    public DeliveryDto(int id, String delName, String address, double latitude, double longitude, int sequence, Type type, boolean check, LocalTime delScheduledTime, int orderNum){
        this.id = id;
        this.delName = delName;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.sequence = sequence;
        this.type = type;
        this.check = check;
        this.delScheduledTime = delScheduledTime;
        this.orderNum = orderNum;
    }
}

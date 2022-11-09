package com.pro.baebooreung.businessservice.vo;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Data
public class ResponseGps {
    private String latitude;
    private String longitude;
    private LocalDateTime requestDateTime;
}

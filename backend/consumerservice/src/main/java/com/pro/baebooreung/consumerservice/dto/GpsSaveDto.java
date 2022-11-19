package com.pro.baebooreung.consumerservice.dto;

import com.pro.baebooreung.consumerservice.domain.Gps;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;

@ToString
@Getter
@Setter
@NoArgsConstructor
public class GpsSaveDto {
    private int userId;
    private String latitude;
    private String longitude;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime requestDateTime;

    @Builder
    public GpsSaveDto(int userId, String latitude, String longitude, LocalDateTime requestDateTime){
        this.userId = userId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.requestDateTime = requestDateTime;
    }

}

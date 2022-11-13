package com.pro.baebooreung.businessservice.dto;

import com.pro.baebooreung.businessservice.domain.Region;
import lombok.Data;

import java.time.LocalDate;

@Data
@ToString
public class RouteAndNaviRequestDto {
    Region region;
    LocalDate date;
}

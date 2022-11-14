package com.pro.baebooreung.businessservice.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class OrderCntResponseDto {
    private int done;
    private int all;

    @Builder
    public OrderCntResponseDto(int done, int all){
        this.done = done;
        this.all = all;
    }
}

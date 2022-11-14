package com.pro.baebooreung.s3service.dto;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CheckResponse {
    private String imgUrl;
    private int delId;
}

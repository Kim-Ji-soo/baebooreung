package com.pro.baebooreung.s3service.dto;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProfileResponse {

    private String profileUrl;
    private String userId;
}

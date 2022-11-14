package com.pro.baebooreung.userservice.dto;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProfileResponse {

    private String profileUrl;
    private int userId;
}

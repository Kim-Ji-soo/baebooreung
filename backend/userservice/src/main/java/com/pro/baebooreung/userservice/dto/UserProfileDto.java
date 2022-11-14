package com.pro.baebooreung.userservice.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserProfileDto {
    private String profile;

    @Builder
    public UserProfileDto(String profile){
        this.profile = profile;
    }
}

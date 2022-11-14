package com.pro.baebooreung.s3service.dto;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProfileRequest {

    MultipartFile image;
    int userId;
}

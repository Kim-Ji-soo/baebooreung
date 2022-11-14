package com.pro.baebooreung.s3service.dto;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CheckRequest {
    MultipartFile image;
    int delId;
}

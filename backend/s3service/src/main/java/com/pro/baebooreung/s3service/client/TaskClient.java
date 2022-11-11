package com.pro.baebooreung.s3service.client;

import com.pro.baebooreung.s3service.dto.ProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(name = "fegin", url = "https://k7c207.p.ssafy.io:8000")
public interface TaskClient {

    @PostMapping("/save/profile")
    String saveProfile(ProfileResponse res);

    @GetMapping("/get/profile")
    String getProfile(String userId);
}

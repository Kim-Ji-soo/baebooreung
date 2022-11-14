package com.pro.baebooreung.s3service.client;

import com.pro.baebooreung.s3service.dto.ProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(name = "user-service")
public interface TaskClient {

    @PostMapping("/user/save/profile")
    void saveProfile(ProfileResponse res);

    @GetMapping("/user/profile/{userId}")
    String getProfile(@PathVariable("userId") int userId);
}

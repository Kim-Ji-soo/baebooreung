package com.pro.baebooreung.s3service.client;

import com.pro.baebooreung.s3service.dto.ProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "user-service")
public interface UserTaskClient {

    @PostMapping("/user/save/profile")
    void saveProfile(@RequestBody ProfileResponse res);

    @GetMapping("/user/profile/{userId}")
    String getProfile(@PathVariable("userId") int userId);
}

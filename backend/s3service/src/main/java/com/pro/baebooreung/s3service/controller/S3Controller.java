package com.pro.baebooreung.s3service.controller;

import com.pro.baebooreung.s3service.client.TaskClient;
import com.pro.baebooreung.s3service.dto.ProfileRequest;
import com.pro.baebooreung.s3service.dto.ProfileResponse;
import com.pro.baebooreung.s3service.service.S3FileUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*", allowCredentials = "false")
public class S3Controller {

    private final S3FileUploadService s3FileUploadService;

    private final TaskClient taskClient;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(ProfileRequest profileReq) throws IOException {

        ProfileResponse res = s3FileUploadService.uploadFile(profileReq);
        taskClient.saveProfile(res);

        if(res!=null)
            return new ResponseEntity<>("성공", HttpStatus.OK);
        else
            return new ResponseEntity<>("실패!!", HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/getProfile")
    public ResponseEntity<?> getFile(int userId) throws IOException {

        System.out.println("왜 안돼");
        System.out.println(taskClient.getProfile(userId));
        String url = taskClient.getProfile(userId);
        System.out.println(url);

        if(url!=null)
            return ResponseEntity.status(HttpStatus.OK).body(url);
        else
            return new ResponseEntity<>("실패!!", HttpStatus.BAD_REQUEST);
    }

}

package com.pro.baebooreung.s3service.controller;

import com.pro.baebooreung.s3service.client.DeliveryTaskClient;
import com.pro.baebooreung.s3service.client.UserTaskClient;
import com.pro.baebooreung.s3service.dto.CheckRequest;
import com.pro.baebooreung.s3service.dto.CheckResponse;
import com.pro.baebooreung.s3service.dto.ProfileRequest;
import com.pro.baebooreung.s3service.dto.ProfileResponse;
import com.pro.baebooreung.s3service.service.S3FileUploadService;
import com.pro.baebooreung.s3service.service.S3ImgUploadService;
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

    private final S3ImgUploadService s3ImgUploadService;

    private final UserTaskClient userTaskClient;

    private final DeliveryTaskClient deliveryTaskClient;

    //프로필 이미지 저장
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(ProfileRequest profileReq) throws IOException {

        ProfileResponse res = s3FileUploadService.uploadFile(profileReq);
        userTaskClient.saveProfile(res);

        if(res!=null)
            return new ResponseEntity<>("성공", HttpStatus.OK);
        else
            return new ResponseEntity<>("실패!!", HttpStatus.BAD_REQUEST);
    }

    //프로필 이미지 불러오기
    @GetMapping("/getProfile")
    public ResponseEntity<?> getFile(@RequestParam("userId") int userId) throws IOException {

        String url = userTaskClient.getProfile(userId);

        if(url!=null)
            return ResponseEntity.status(HttpStatus.OK).body(url);
        else
            return new ResponseEntity<>("실패!!", HttpStatus.BAD_REQUEST);
    }

    //자동체크인 사진 저장
    @PostMapping("/checkIn")
    public ResponseEntity<?> uploadImg(CheckRequest checkRequest) throws IOException {

        CheckResponse res = s3ImgUploadService.uploadImg(checkRequest);
        deliveryTaskClient.saveImg(res);

        if(res!=null)
            return new ResponseEntity<>("성공", HttpStatus.OK);
        else
            return new ResponseEntity<>("실패!!", HttpStatus.BAD_REQUEST);
    }

    //자동체크인 사진 불러오기
    @GetMapping("/getCheckIn")
    public ResponseEntity<?> getImg(@RequestParam("delId") int delId) throws IOException {

        String url = deliveryTaskClient.getImg(delId);

        if(url!=null)
            return ResponseEntity.status(HttpStatus.OK).body(url);
        else
            return new ResponseEntity<>("실패!!", HttpStatus.BAD_REQUEST);
    }
}

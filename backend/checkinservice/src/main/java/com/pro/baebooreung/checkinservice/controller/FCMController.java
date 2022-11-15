package com.pro.baebooreung.checkinservice.controller;

import com.pro.baebooreung.checkinservice.dto.FCMDto;
import com.pro.baebooreung.checkinservice.dto.FCMTokenDto;
import com.pro.baebooreung.checkinservice.service.FCMService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.io.IOException;

@RestController
@RequiredArgsConstructor
public class FCMController {
    private final FCMService fcmService;

    @PostMapping("/fcm/message/{userId}")
    public ResponseEntity pushMessage(@PathVariable("userId") int userId, @RequestBody FCMDto fcmDto) throws IOException {
//    public ResponseEntity pushMessage(@RequestBody FCMDto fcmDto) throws IOException {
        fcmService.sendMessageTo(
                userId,
//                fcmDto.getTargetToken(),
                fcmDto.getTitle(),
                fcmDto.getBody());
        return ResponseEntity.status(HttpStatus.OK).body("푸시 알림 성공 - "+fcmDto.getTitle());
    }

    @PutMapping("/fcm/saveToken")
    public ResponseEntity saveFcmToken(@RequestBody FCMTokenDto requestFcmToken) throws IOException {


        fcmService.saveToken(requestFcmToken);
        return ResponseEntity.status(HttpStatus.OK).body("토큰 저장 성공");
    }

    @PostMapping("/fcm/message/check-in/{userId}")
    public ResponseEntity pushMessageCheckIn(@PathVariable("userId") int userId) throws IOException {
        String title = "체크인 가능";
        String body = "체크인이 가능한 위치입니다. 사진을 찍어 체크인해주세요!";
        fcmService.sendMessageCheckIn(
                userId,
                title,
                body);
        return ResponseEntity.ok().build();
    }
}

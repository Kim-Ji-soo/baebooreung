package com.pro.baebooreung.userservice.controller;

import com.pro.baebooreung.userservice.dto.FCMDto;
import com.pro.baebooreung.userservice.service.FCMService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
public class FCMController {

    private final FCMService fcmService;

    @PostMapping("/fcm/check")
    public ResponseEntity pushMessage(@RequestBody FCMDto fcmDto) throws IOException {
        System.out.println(fcmDto.getTargetToken() + " "
                +fcmDto.getTitle() + " " + fcmDto.getBody());

        fcmService.sendMessageTo(
                fcmDto.getTargetToken(),
                fcmDto.getTitle(),
                fcmDto.getBody());
        return ResponseEntity.ok().build();
    }


}

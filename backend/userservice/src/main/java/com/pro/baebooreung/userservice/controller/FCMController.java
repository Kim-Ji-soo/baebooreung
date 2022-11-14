package com.pro.baebooreung.userservice.controller;

import com.pro.baebooreung.userservice.dto.FCMDto;
import com.pro.baebooreung.userservice.dto.FcmTokenDto;
import com.pro.baebooreung.userservice.service.FCMService;
import com.pro.baebooreung.userservice.vo.RequestFcmToken;
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


        fcmService.sendMessageTo(
                    userId,
//                fcmDto.getTargetToken(),
                fcmDto.getTitle(),
                fcmDto.getBody());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/fcm/saveToken")
    public ResponseEntity saveFcmToken(@RequestBody RequestFcmToken requestFcmToken) throws IOException {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);

        FcmTokenDto fcmTokenDto = mapper.map(requestFcmToken, FcmTokenDto.class);

        fcmService.saveToken(fcmTokenDto);
        return ResponseEntity.status(HttpStatus.OK).body("저장 성공");
    }

}

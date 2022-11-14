package com.pro.baebooreung.userservice.service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.auth.oauth2.GoogleCredentials;
import com.pro.baebooreung.userservice.domain.UserEntity;
import com.pro.baebooreung.userservice.domain.repository.UserRepository;
import com.pro.baebooreung.userservice.dto.FcmMessage;
import com.pro.baebooreung.userservice.dto.FcmTokenDto;
import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class FCMService {
    @Autowired
    UserRepository userRepository; //필드단위에서 @Autowired사용할 수 있지만 생성자 통해서 주입하는 것이 더 좋음


//    @Autowired
//    public FCMService(UserRepository userRepository) {
//        this.userRepository = userRepository;
//    }



    private final String API_URL = "https://fcm.googleapis.com/v1/projects/baebooreung-398a1/messages:send";

    private final ObjectMapper objectMapper;

    public void sendMessageTo(String targetToken, String title, String body) throws IOException {
//    public void sendMessageTo(int userId, String title, String body) throws IOException {
//        String targetToken = getTargetToken(userId);

        String message = makeMessage(targetToken, title, body);

        OkHttpClient client = new OkHttpClient();
        RequestBody requestBody = RequestBody.create(message,
                MediaType.get("application/json; charset=utf-8"));
        Request request = new Request.Builder()
                .url(API_URL)
                .post(requestBody)
                .addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + getAccessToken())
                .addHeader(HttpHeaders.CONTENT_TYPE, "application/json; UTF-8")
                .build();

        Response response = client.newCall(request).execute();

        System.out.println(response.body().string());
    }

    private String makeMessage(String targetToken, String title, String body) throws JsonParseException, JsonProcessingException {
        FcmMessage fcmMessage = FcmMessage.builder()
                .message(FcmMessage.Message.builder()
                        .token(targetToken)
                        .notification(FcmMessage.Notification.builder()
                                .title(title)
                                .body(body)
                                .image(null)
                                .build()
                        ).build()).validateOnly(false).build();

        return objectMapper.writeValueAsString(fcmMessage);
    }

    private String getAccessToken() throws IOException {
//        String firebaseConfigPath = "firebase/firebase_service_key.json";
        String firebaseConfigPath = "baebooreung-398a1-firebase-adminsdk-f7l3r-ef613b3b15.json";


        GoogleCredentials googleCredentials = GoogleCredentials
                .fromStream(new ClassPathResource(firebaseConfigPath).getInputStream())
                .createScoped(List.of("https://www.googleapis.com/auth/cloud-platform"));

        googleCredentials.refreshIfExpired();
        return googleCredentials.getAccessToken().getTokenValue();
    }

    public void saveToken(FcmTokenDto fcmTokenDto) {
        UserEntity findUser = userRepository.findById(fcmTokenDto.getId());
        findUser.updateFcmToken(fcmTokenDto.getFcmToken());
        userRepository.save(findUser);
    }

    public String getTargetToken(int id) {
        UserEntity findUser = userRepository.findById(id);
        return findUser.getFcmToken();
    }
}

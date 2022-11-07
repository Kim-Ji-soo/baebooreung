package com.pro.baebooreung.chat.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pro.baebooreung.chat.dto.ChatMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
/**
 * 레디스 구독 서비스 구현
 * 레디스에 메시지 발행이 될 때까지 대기하였다가 메시지가 발행되면 해당 메시지를 읽어 처리
 * 레디스에 메시지가 발행되면 해당 메시지를 Chat Message로 변환하고
 * messaging Template을 이용하여 채팅방의 모든 websocket 클라이언트들에게 메시지 전달
 */
public class RedisSubscriber {

    private final ObjectMapper objectMapper;
    private final SimpMessageSendingOperations messagingTemplate;


    /**
     * Redis에서 메시지가 발행(publish)되면 대기하고 있던 Redis Subscriber가 해당 메시지를 받아 처리한다.
     */
    public void sendMessage(String publishMessage){
        try{
            //ChatMessage 객체로 맵핑
            ChatMessage chatMessage = objectMapper.readValue(publishMessage, ChatMessage.class);
            System.out.println("메시지 send");
            //채팅방을 구독한 클라이언트에게 메시지 발송
            messagingTemplate.convertAndSend("/chat-service/sub/chat/room/" + chatMessage.getRoomId(), chatMessage);
        } catch (Exception e) {
            log.error("Exception {}", e);
        }
    }

}

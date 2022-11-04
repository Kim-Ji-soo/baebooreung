package com.pro.baebooreung.chat.controller;

import com.pro.baebooreung.chat.dto.ChatMessage;
import com.pro.baebooreung.chat.repository.ChatRoomRepository;
import com.pro.baebooreung.chat.service.ChatService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@RequiredArgsConstructor
@Controller
public class ChatController {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatService chatService;

    /**
     * web socket "/api/pub/chat/messgage"로 들어오는 메시징을 처리한다.
     */
    @ApiOperation(value = "메시지를 보낸다.",notes = "채팅방에 구독되어 있는 사용자들에게 메시지를 보낸다.")
    @MessageMapping("/chat/message")
    public void message(ChatMessage message){

        //채팅방 인원수 세팅
        message.setUserCount(chatRoomRepository.getUserCount(message.getRoomId()));
        //web socket에 발행된 메시지를 redis로 발행(publish)
        chatService.sendChatMessage(message);
    }



}

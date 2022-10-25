package com.pro.baebooreung.chat.controller;

import com.pro.baebooreung.chat.dto.ChatMessage;
import com.pro.baebooreung.chat.repository.ChatRoomRepository;
import com.pro.baebooreung.chat.service.RedisPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@RequiredArgsConstructor
@Controller
public class ChatController {

    private final RedisPublisher redisPublisher;
    private final ChatRoomRepository chatRoomRepository;

    /**
     * web socket "/pub/chat/messgage"로 들어오는 메시징을 처리한다.
     */
    @MessageMapping("/chat/message")
    public void message(ChatMessage message){
        if(ChatMessage.MessageType.ENTER.equals(message.getType())){
            chatRoomRepository.enterChatRoom(message.getRoomId());
            message.setMessage(message.getSender() + "님이 입장하셨습니다.");
        }

        //web socket에 발해된 메시지를 redis로 발행한다(publish)
        redisPublisher.publish(chatRoomRepository.getTopic(message.getRoomId()), message);


    }



}

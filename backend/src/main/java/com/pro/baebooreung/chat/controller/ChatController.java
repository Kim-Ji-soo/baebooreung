package com.pro.baebooreung.chat.controller;

import com.pro.baebooreung.chat.dto.ChatMessage;
import com.pro.baebooreung.chat.repository.ChatRoomRepository;
import com.pro.baebooreung.chat.service.RedisPublisher;
import io.swagger.annotations.ApiOperation;
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
    @ApiOperation(value = "메시지를 보낸다.",notes = "채팅방에 구독되어 있는 사용자들에게 메시지를 보낸다.")
    @MessageMapping("/chat/message")
    public void message(ChatMessage message){
        if(ChatMessage.MessageType.ENTER.equals(message.getType())){
            //클라이언트가 채팅방 입장시 채팅방에서 대화가 가능하도록 리스너 연동
            chatRoomRepository.enterChatRoom(message.getRoomId());
            message.setMessage(message.getSender() + "님이 입장하셨습니다.");
        }

        //web socket에 발행된 메시지를 redis로 발행한다(publish)
        //--> 서로 다른 서버에 공유하기 위함
        redisPublisher.publish(chatRoomRepository.getTopic(message.getRoomId()), message);


    }



}

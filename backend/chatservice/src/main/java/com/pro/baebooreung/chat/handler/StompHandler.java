package com.pro.baebooreung.chat.handler;

import com.pro.baebooreung.chat.dto.ChatMessage;
import com.pro.baebooreung.chat.repository.ChatRoomRepository;
import com.pro.baebooreung.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Component
public class StompHandler implements ChannelInterceptor {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatService chatService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        System.out.println("presend");
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        System.out.println("acceesor.getCommand = " + accessor.getCommand());
        if(StompCommand.CONNECT == accessor.getCommand()){ //웹 소켓 연결 요청
            System.out.println("웹 소켓 연결 요청");
        } else if(StompCommand.SUBSCRIBE == accessor.getCommand()){ // 채팅룸 구독 요청
            System.out.println("구독 요청");
            //header 정보에서 구독 destination 정보를 얻고, roomId를 추출한다.
            String roomId = chatService.getRoomId(Optional.ofNullable((String)message.getHeaders().get("simpDestination")).orElse("InvalidRoomId"));
            //채팅방에 들어온 클라이언트 sessionId를 roomId와 맵핑해 놓는다.(나중에 특정 세션이 어떤 채팅방에 들어가 있는지 알기 위함)
            String sessionId = (String) message.getHeaders().get("simpSessionId");
            chatRoomRepository.setUserEnterInfo(sessionId, roomId);
            //채팅방 인원수 +1
            chatRoomRepository.plusUserCount(roomId);
            //클라이언트 입장 메시지를 채팅방에 발송한다. (redis publish)
//            chatService.sendChatMessage(ChatMessage.builder().type(ChatMessage.MessageType.ENTER).roomId(roomId).sender(sessionId).build());
            log.info("SUBSCRIBED {}, {}", sessionId, roomId);
        } else if(StompCommand.DISCONNECT == accessor.getCommand()){ // Web Socket 연결 종료
            System.out.println("연결 종료");
            //연결이 종료된 클라이언트 sessionId로 채팅방 id를 얻는다.
            String sessionId = (String) message.getHeaders().get("simpSessionId");
            String roomId = chatRoomRepository.getUserEnterRoomId(sessionId);
            //채팅방의 인원수를 -1한다.
//            chatRoomRepository.minusUserCount(roomId);
            //클라이언트 퇴장 메시지를 채팅방에 발송한다. (redis publish)
//            chatService.sendChatMessage(ChatMessage.builder().type(ChatMessage.MessageType.QUIT).roomId(roomId).sender(sessionId).build());
            //퇴장한 클라이언트의 roomId 맵핑 정보를 삭제한다.
//            chatRoomRepository.removeUserEnterInfo(sessionId);

            log.info("DISCONNECTED {}, {}", sessionId, roomId);
        }


        return message;
    }





}

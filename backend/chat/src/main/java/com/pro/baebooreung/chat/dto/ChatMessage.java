package com.pro.baebooreung.chat.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessage {

    /**
     * 메세지 타입
     * ENTER : 입장
     * TALK : 대화
     * QUIT : 퇴장
     */

    public ChatMessage(){
    }

    @Builder
    public ChatMessage(MessageType type, String roomId, String sender, String message, long userCount) {
        this.type = type;
        this.roomId = roomId;
        this.sender = sender;
        this.message = message;
        this.userCount = userCount;
    }
    public enum MessageType{
        ENTER, TALK, QUIT
    }
    private MessageType type; //메세지 타입
    private String roomId; //방번호
    private String sender; //메시지 보낸 사람
    private String message; // 메시지
    private long userCount; //채팅방 인원 수, 채팅방 내에서 메시지가 전달될때 인원수 갱신시 사용
}

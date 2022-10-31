package com.pro.baebooreung.chat.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessage {

    /**
     * 메세지 타입
     * ENTER : 입장
     * TALK : 대화
     */
    public enum MessageType{
        ENTER, TALK, JOIN
    }
    private MessageType type;
    private String roomId;
    private String sender;
    private String message;
}

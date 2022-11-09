package com.pro.baebooreung.chat.domain;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@Table(name = "chatroom_record")
public class ChatRoomRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name="chatroom_id")
    private String roomId;

    @Column(name="create_time")
    private LocalDateTime createTime;

    public ChatRoomRecord(int id, String roomId, LocalDateTime createTime) {
        this.id = id;
        this.roomId = roomId;
        this.createTime = createTime;
    }
}



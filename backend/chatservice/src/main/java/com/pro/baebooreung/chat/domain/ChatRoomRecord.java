package com.pro.baebooreung.chat.domain;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "chatroom_record")
public class ChatRoomRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name="chatroom_id")
    private String roomId;

    @Column(name="create_time")
    private LocalDateTime createTime;

    @Column(name="chatroom_name")
    private String roomName;

    public ChatRoomRecord(String roomId, LocalDateTime createTime, String roomName) {
        this.roomId = roomId;
        this.createTime = createTime;
        this.roomName = roomName;
    }
}



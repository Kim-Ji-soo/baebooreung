package com.pro.baebooreung.chat.domain;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Data
@Builder
@Table(name = "chatroom_record")
public class ChatRoomRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name="chatroom_id")
    private String roomId;

    @Column(name="record_datetime")
    private LocalDate createTime;


}



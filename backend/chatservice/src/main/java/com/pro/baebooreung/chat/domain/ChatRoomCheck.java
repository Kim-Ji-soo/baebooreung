package com.pro.baebooreung.chat.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@Table(name = "chatroom_check")
public class ChatRoomCheck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name="member")
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="chatroom_id")
    private ChatRoomRecord roomId;

    @Column(name="is_enter")
    private boolean IsEnter;

    @Column(name="is_subscribe")
    private boolean IsSubscribe;

    public ChatRoomCheck(String userId, ChatRoomRecord roomId, boolean IsEnter, boolean IsSubscribe) {
        this.userId = userId;
        this.roomId = roomId;
        this.IsEnter = IsEnter;
        this.IsSubscribe = IsSubscribe;
    }
}

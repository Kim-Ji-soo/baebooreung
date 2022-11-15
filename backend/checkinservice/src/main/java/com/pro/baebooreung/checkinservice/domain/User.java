package com.pro.baebooreung.checkinservice.domain;

import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(nullable = false, length = 50, unique = true)
    private String email;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, unique = true)
    private String specialKey; // bearer token을 위한 랜덤값

    @Enumerated(EnumType.STRING)
    private Grade grade;

    @Column(nullable = false, unique = true)
    private String encryptedPwd; // 암호화된 비밀번호

    @Column(name = "profile",nullable = true)
    private String profile;

    private String phone;

    private Integer region;

    @Enumerated(EnumType.STRING)
    private WorkStatus workStatus;

    @Column(name = "route_id",nullable = true)
    private Integer routeId;

    @Column(name = "delivery_id",nullable = true)
    private Integer deliveryId;

    @Column(name = "fcm_token",nullable = true)
    private String fcmToken;

    public void updateFcmToken(String fcmToken) {
        this.fcmToken = fcmToken;
    }
}

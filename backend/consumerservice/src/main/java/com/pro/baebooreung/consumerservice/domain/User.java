package com.pro.baebooreung.consumerservice.domain;

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
    private int id;

    @Column(nullable = false, length = 50, unique = true)
    private String email;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, unique = true)
    private String userId; // bearer token을 위한 랜덤값

    @Column(nullable = false, unique = true)
    private String encryptedPwd; // 암호화된 비밀번호


    private String profile;

    @Enumerated(EnumType.STRING)
    private Grade grade;

    private String phone;

    private Integer region;

    @Enumerated(EnumType.STRING)
    private WorkStatus workStatus;

    @Column(name = "route_id",nullable = true)
    private Integer routeId;

    @Column(name = "delivery_id",nullable = true)
    private Integer deliveryId;

}

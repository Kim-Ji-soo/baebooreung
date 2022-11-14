package com.pro.baebooreung.userservice.domain;

import lombok.*;

import javax.persistence.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name="user")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    private String profile;

    private String phone;

    private Integer region;

    @Enumerated(EnumType.STRING)
    private WorkStatus workStatus;

    @Column(name = "route_id",nullable = true)
    private Integer routeId;

    @Column(name = "delivery_id",nullable = true)
    private Integer deliveryId;

    public void updateGrade(Grade grade) {
        this.grade = grade;
    }

    public void updateStartEnd(int routeId,int deliveryId,WorkStatus workStatus){
        this.routeId = routeId;
        this.deliveryId = deliveryId;
        this.workStatus = workStatus;
    }

    public void updateDelivery(int deliveryId){
        this.deliveryId = deliveryId;
    }

    public void updateProfile(String profileUrl) {
        this.profile = profileUrl;
    }


    @Builder
    public UserEntity(int id, String email, String name, String specialKey, Grade grade, String encryptedPwd, String profile, String phone, Integer region, WorkStatus workStatus, Integer routeId, Integer deliveryId) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.specialKey = specialKey;
        this.grade = grade;
        this.encryptedPwd = encryptedPwd;
        this.profile = profile;
        this.phone = phone;
        this.region = region;
        this.workStatus = workStatus;
        this.routeId = routeId;
        this.deliveryId = deliveryId;
    }

    @Override
    public String toString() {
        return "UserEntity{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", specialKey='" + specialKey + '\'' +
                ", grade=" + grade +
                ", encryptedPwd='" + encryptedPwd + '\'' +
                ", profile='" + profile + '\'' +
                ", phone='" + phone + '\'' +
                ", region=" + region +
                ", workStatus=" + workStatus +
                ", routeId=" + routeId +
                ", deliveryId=" + deliveryId +
                '}';
    }
}

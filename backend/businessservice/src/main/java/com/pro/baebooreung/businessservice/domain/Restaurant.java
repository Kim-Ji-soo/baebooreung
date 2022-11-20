package com.pro.baebooreung.businessservice.domain;

import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "restaurant")
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;

    @Column(name="name", nullable = false)
    private String name;

    @Column(name="latitude", nullable = false)
    private double latitude;

    @Column(name="longitude", nullable = false)
    private double longitude;

    @Column(name="address", nullable = false)
    private String address;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Builder
    public Restaurant(String name, double latitude, double longitude, String address, String phone) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.phone = phone;
    }
}

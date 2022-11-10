package com.pro.baebooreung.businessservice.domain;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "navigation")
public class Navigation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;

    @Column(name = "latitude", nullable = false)
    private double latitude;

    @Column(name = "longitude", nullable = false)
    private double longitude;

    @Column(name = "route_id", nullable = false)
    private int routeId;

    @Builder
    public Navigation(double latitude, double longitude, int routeId){
        this.latitude = latitude;
        this.longitude = longitude;
        this.routeId = routeId;
    }

}

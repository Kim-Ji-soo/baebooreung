package com.pro.baebooreung.businessservice.domain;

import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "delivery")
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name ="latitude", nullable = false)
    private double latitude;

    @Column(name ="longitude", nullable = false)
    private double longitude;

    @Column(name = "seqeunce", nullable = false)
    private int sequence;

    @Column(name="type", nullable = false)
    private Type type;

    @Column(name="check_in", nullable = false)
    private boolean checkIn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(referencedColumnName = "id",name = "routeId")
    private Route route;

//    @Builder.Default
    @OneToMany(mappedBy = "delivery",cascade = CascadeType.ALL)
    private List<Order> orderList = new ArrayList<>();

    //builder에 id 안넣음
    @Builder
    public Delivery(String address, double latitude, double longitude, int sequence, Type type, boolean checkIn, Route route) {
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.sequence = sequence;
        this.type = type;
        this.checkIn = checkIn;
        this.route = route;
    }
}

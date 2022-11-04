package com.pro.baebooreung.businessservice.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
    @JoinColumn(name = "route_id")
    private Route route;

    @Builder.Default
    @OneToMany(mappedBy = "order",cascade = CascadeType.ALL)
    private List<Order> orderList = new ArrayList<>();
}

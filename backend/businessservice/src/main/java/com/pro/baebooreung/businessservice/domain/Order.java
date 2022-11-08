package com.pro.baebooreung.businessservice.domain;

import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "order")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;

    @Column(name = "customer_id", nullable = false)
    private String customerId;

    @Column(name ="customer_name", nullable = false)
    private String customerName;

    @Column(name ="customer_phone", nullable = false)
    private String customerPhone;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;

    @Column(name="address", nullable = false)
    private String address;

//    @Column(name="delivery_time", nullable = false)
//    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
//    private LocalDateTime deliveryTime;
//
//    @Column(name="pickup_time", nullable = false)
//    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
//    private LocalDateTime pickupTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(referencedColumnName = "id",name = "deliveryId")
    private Delivery delivery;

//    @Builder.Default
    @OneToMany(mappedBy = "order",cascade = CascadeType.ALL)
    private List<OrderMenu> orderMenuList = new ArrayList<>();

    @Builder
    public Order(String customerId, String customerName, String customerPhone, Restaurant restaurant, String address, LocalDateTime deliveryTime, LocalDateTime pickupTime, Delivery delivery) {
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.restaurant = restaurant;
        this.address = address;
        this.deliveryTime = deliveryTime;
        this.pickupTime = pickupTime;
        this.delivery = delivery;
    }
}

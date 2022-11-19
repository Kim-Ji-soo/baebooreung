package com.pro.baebooreung.businessservice.domain;

import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "ordermenu")
public class OrderMenu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(referencedColumnName = "id",name = "orderId")
    private Order order;

    @Column(name="menu", nullable = false)
    private String menu;

    @Column(name="number", nullable = false)
    private int number;

    @Builder
    public OrderMenu(Order order, String menu, int number) {
        this.order = order;
        this.menu = menu;
        this.number = number;
    }
}

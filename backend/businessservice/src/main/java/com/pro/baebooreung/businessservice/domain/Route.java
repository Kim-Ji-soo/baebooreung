package com.pro.baebooreung.businessservice.domain;

import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "route")
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id")
//    private User user;

    @Column(name = "user_id")
    private int userId; //사용자 id(토큰관련아니고 리얼 id)

    @Column(name = "delivery_datetime", nullable = false)
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime deliveryDateTime;

    @Column(name = "route_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private RouteType routeType;

    @Column(name = "route_name", nullable = false)
    private String routeName;

    private boolean done; //완료된 업무인지 체크

    @Builder.Default
    @OneToMany(mappedBy = "delivery",cascade = CascadeType.ALL)
    private List<Delivery> deliveryList = new ArrayList<>();
}

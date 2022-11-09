package com.pro.baebooreung.businessservice.domain;

import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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

    @Column(name = "del_name", nullable = true)
    private String delName;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name ="latitude", nullable = false)
    private double latitude;

    @Column(name ="longitude", nullable = false)
    private double longitude;

    @Column(name = "sequence", nullable = false)
    private int sequence;

    @Column(name="type", nullable = false)
    @Enumerated(EnumType.STRING)
    private Type type;

    @Column(name="check", nullable = false)
    private boolean check;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @Column(name="del_scheduled_time", nullable = true)
    @DateTimeFormat(pattern = "HH:mm")
    private LocalTime delScheduledTime; //픽업지든 배송지든 그 장소에 도착해야할 시간

    @Column(name="del_actual_time", nullable = true)
    @DateTimeFormat(pattern = "HH:mm")
    private LocalTime delActualTime; // 실제로 도착한 시간

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(referencedColumnName = "id",name = "routeId")
    private Route route;

//    @Builder.Default
    @OneToMany(mappedBy = "delivery",cascade = CascadeType.ALL)
    private List<Order> orderList = new ArrayList<>();

    //builder에 id 안넣음
    @Builder
    public Delivery(int id, String delName,LocalDate date, LocalTime delScheduledTime, LocalTime delActualTime, String address, double latitude, double longitude, int sequence, Type type, boolean check, Route route) {
        this.id = id;
        this.delName = delName;
        this.date = date;
        this.delScheduledTime = delScheduledTime;
        this.delActualTime = delActualTime;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.sequence = sequence;
        this.type = type;
        this.check = check;
        this.route = route;
    }
}

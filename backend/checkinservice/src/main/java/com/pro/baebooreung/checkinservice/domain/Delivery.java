package com.pro.baebooreung.checkinservice.domain;

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

    @Column(name="check", nullable = false)
    private boolean check;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @Column(name="route_id")
    private int routeId;

}

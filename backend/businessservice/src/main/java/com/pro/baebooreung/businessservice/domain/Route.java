package com.pro.baebooreung.businessservice.domain;

import jdk.jshell.execution.LoaderDelegate;
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

//    @Column(name = "delivery_datetime", nullable = false)
//    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
//    private LocalDateTime deliveryDateTime;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @Column(name="scheduled_start_time", nullable = true)
    @DateTimeFormat(pattern = "HH:mm")
    private LocalTime scheduledStartTime; //업무를 시작해야할 시간

    @Column(name="actual_start_time", nullable = true)
    @DateTimeFormat(pattern = "HH:mm")
    private LocalTime actualStartTime; // 업무를 실제로 시작한 시간


    @Column(name = "route_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private RouteType routeType;

    @Column(name = "route_name", nullable = false)
    private String routeName;

    private boolean done; //완료된 업무인지 체크
    // 이거를 enum으로 해서 ready, start, end로 해야할지 고민

//    @Builder.Default
    @OneToMany(mappedBy = "route",cascade = CascadeType.ALL)
    private List<Delivery> deliveryList = new ArrayList<>();


    public void setActualStartTime(LocalTime startTime){
        this.actualStartTime = startTime;
    }

    public void updateDone(boolean done){
        this.done = done;
    }
    @Builder
    public Route(int id, LocalDate date, LocalTime scheduledStartTime, LocalTime actualStartTime, int userId, RouteType routeType, String routeName, boolean done,List<Delivery> deliveryList) {
        this.id = id;
        this.date = date;
        this.scheduledStartTime = scheduledStartTime;
        this.actualStartTime = actualStartTime;
        this.userId = userId;
        this.routeType = routeType;
        this.routeName = routeName;
        this.done = done;
        this.deliveryList = deliveryList;
    }
}

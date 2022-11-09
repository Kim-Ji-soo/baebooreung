package com.pro.baebooreung.businessservice;

import com.pro.baebooreung.businessservice.domain.Route;
import com.pro.baebooreung.businessservice.domain.repository.RouteRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@SpringBootTest
@Transactional
public class RouteRepoTest {
    @Autowired
    RouteRepository routeRepository;

    @Test
    void 루트얻기(){
        int userId = 3;
        LocalDate date = LocalDate.now();

        Iterable<Route> routes = routeRepository.findByUserIdAndDeliveryDateTime(userId,date);
        System.out.println(routes.toString());
    }


}

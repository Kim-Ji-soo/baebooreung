package com.pro.baebooreung.checkinservice.service;

import com.pro.baebooreung.checkinservice.domain.Delivery;
import com.pro.baebooreung.checkinservice.domain.User;
import com.pro.baebooreung.checkinservice.domain.repository.DeliveryRepository;
import com.pro.baebooreung.checkinservice.domain.repository.UserRepository;
import com.pro.baebooreung.checkinservice.dto.GpsSaveDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CheckinService {
    private final UserRepository userRepository;
    private final DeliveryRepository deliveryRepository;

    public void checkin(GpsSaveDto gpsSaveDto) throws Exception {
        // 유저 찾기
        User user = userRepository.findOne(gpsSaveDto.getUserId());
        if(user == null) throw new IllegalStateException("해당 회원이 존재하지 않습니다.");

        // 향하는 배달 지점 찾기
        Delivery delivery = deliveryRepository.findOne(user.getDeliveryId());
        if(delivery == null) throw new IllegalStateException("해당 회원이 존재하지 않습니다.");

        // 향하는 지점 ~ 현재 위치 간이 거리 계산(meter)
        double dist = distance(Double.parseDouble(gpsSaveDto.getLatitude()), Double.parseDouble(gpsSaveDto.getLongitude()), delivery.getLatitude(), delivery.getLongitude());
        log.info("거리 계산 결과 : {} m", dist);

        // 거리가 체크인 범위 안 -> webhook logic
        if(dist <= 10.0){

        }
    }

    //두 지점 간의 거리 계산
    private static double distance(double lat1, double lon1, double lat2, double lon2) {

        double theta = lon1 - lon2;
        double dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));

        dist = Math.acos(dist);
        dist = rad2deg(dist);
        dist = dist * 60 * 1.1515;


        dist = dist * 1609.344;

        // meter
        return (dist);
    }


    // This function converts decimal degrees to radians
    private static double deg2rad(double deg) {
        return (deg * Math.PI / 180.0);
    }

    // This function converts radians to decimal degrees
    private static double rad2deg(double rad) {
        return (rad * 180 / Math.PI);
    }
}

package com.pro.baebooreung.gpsservice.service;

import com.pro.baebooreung.gpsservice.domain.Gps;
import com.pro.baebooreung.gpsservice.domain.User;
import com.pro.baebooreung.gpsservice.domain.repository.GpsRepository;
import com.pro.baebooreung.gpsservice.domain.repository.UserRepository;
import com.pro.baebooreung.gpsservice.dto.GpsResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class GpsService {
    private final GpsRepository gpsRepository;
    private final UserRepository userRepository;

    public GpsResponseDto findGps(int user_id) throws Exception {
        User user = userRepository.findOne(user_id);
        if(user.getWorkStatus() == null || user.getWorkStatus().equals("OFF")){
            throw new IllegalStateException("현재 운행중인 드라이버가 아닙니다.");
        }
        Gps gps = gpsRepository.findGps(user_id);
        GpsResponseDto gpsResponseDto = GpsResponseDto.builder()
                .latitude(String.valueOf(gps.getLatitude()))
                .longitude(String.valueOf(gps.getLongitude()))
                .requestDateTime(gps.getRequestDateTime()).build();
        return gpsResponseDto;
    }

    public List<GpsResponseDto> findGpsByRouteId(int routeId) throws Exception {
        List<Gps> gps = gpsRepository.findByRouteId(routeId);
        List<GpsResponseDto> gpsList = new ArrayList<>();
        if(gps == null || gps.size() == 0){
            return gpsList;

        }
        for(Gps g:gps){
            GpsResponseDto gpsResponseDto = GpsResponseDto.builder()
                    .latitude(String.valueOf(g.getLatitude()))
                    .longitude(String.valueOf(g.getLongitude()))
                    .requestDateTime(g.getRequestDateTime()).build();
            gpsList.add(gpsResponseDto);
        }
        return gpsList;
    }

    public List<GpsResponseDto> findGpsByUserId(int userId) throws Exception {
        User user = userRepository.findOne(userId);
        if(user.getWorkStatus() == null || user.getWorkStatus().equals("OFF")){
            throw new IllegalStateException("현재 운행중인 드라이버가 아닙니다.");
        }
        List<Gps> gps = gpsRepository.findByUserId(userId);
        List<GpsResponseDto> gpsList = new ArrayList<>();
        if(gps == null || gps.size() == 0){
            return gpsList;

        }
        for(Gps g:gps){
            GpsResponseDto gpsResponseDto = GpsResponseDto.builder()
                    .latitude(String.valueOf(g.getLatitude()))
                    .longitude(String.valueOf(g.getLongitude()))
                    .requestDateTime(g.getRequestDateTime()).build();
            gpsList.add(gpsResponseDto);
        }
        return gpsList;
    }
}

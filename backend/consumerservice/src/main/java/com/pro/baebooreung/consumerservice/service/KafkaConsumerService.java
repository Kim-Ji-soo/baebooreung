package com.pro.baebooreung.consumerservice.service;

import com.pro.baebooreung.consumerservice.domain.User;
import com.pro.baebooreung.consumerservice.domain.repository.GpsRepository;
import com.pro.baebooreung.consumerservice.domain.repository.UserRepository;
import com.pro.baebooreung.consumerservice.dto.GpsSaveDto;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaConsumerService {
    private final GpsRepository gpsRepository;
    private final UserRepository userRepository;

    @KafkaListener(topics = "gps-kafka", groupId = "testgroup", containerFactory = "kafkaListener")
    public void consume(GpsSaveDto gpsSaveDto) throws Exception {
        User user = userRepository.findOne(gpsSaveDto.getUserId());
        if(user == null) throw new IllegalStateException("해당 회원이 존재하지 않습니다.");
        gpsRepository.save(gpsSaveDto, user);
        System.out.println("gps Save = "+ gpsSaveDto.toString());
    }
}

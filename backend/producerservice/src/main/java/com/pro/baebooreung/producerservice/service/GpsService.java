package com.pro.baebooreung.producerservice.service;

import com.pro.baebooreung.producerservice.dto.GpsSaveDto;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class GpsService {

    private static final String TOPIC = "testkafka";
    private final KafkaTemplate<String, GpsSaveDto> kafkaTemplate;


    public void sendGps(GpsSaveDto gpsSaveDto){
        kafkaTemplate.send(TOPIC, gpsSaveDto);
    }

}

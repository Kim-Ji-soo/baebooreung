package com.pro.baebooreung.checkinservice;

import com.pro.baebooreung.checkinservice.dto.GpsSaveDto;
import com.pro.baebooreung.checkinservice.service.CheckinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableDiscoveryClient //유레카 서버에 등록
@EnableFeignClients //Feign클라이언트로 등록
public class CheckinserviceApplication {
	@Autowired
	private CheckinService checkinService;

	public static void main(String[] args) {
		SpringApplication.run(CheckinserviceApplication.class, args);
	}
	@KafkaListener(topics = "gps-kafka", groupId = "testgroups", containerFactory = "kafkaListener")
	public void consume(GpsSaveDto gpsSaveDto){
		System.out.println("Received Message = "+ gpsSaveDto.toString());
		try {
			checkinService.checkin(gpsSaveDto);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}

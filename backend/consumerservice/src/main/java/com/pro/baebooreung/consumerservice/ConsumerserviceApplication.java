package com.pro.baebooreung.consumerservice;

import com.pro.baebooreung.consumerservice.dto.GpsSaveDto;
import com.pro.baebooreung.consumerservice.service.KafkaConsumerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ConsumerserviceApplication {
	@Autowired
	private KafkaConsumerService kafkaConsumerService;

	public static void main(String[] args) {
		SpringApplication.run(ConsumerserviceApplication.class, args);
	}

	@KafkaListener(topics = "gps-kafka", groupId = "testgroups", containerFactory = "kafkaListener")
	public void consume(GpsSaveDto gpsSaveDto){
//		System.out.println("=========================");
//		System.out.println(gpsSaveDto.toString());
//		System.out.println("Received Message = "+ gpsSaveDto.toString());
//		try {
//			//kafkaConsumerService.consume(gpsSaveDto);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
	}

}

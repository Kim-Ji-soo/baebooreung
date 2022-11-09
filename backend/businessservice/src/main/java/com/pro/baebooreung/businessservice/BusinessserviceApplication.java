package com.pro.baebooreung.businessservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient //유레카 서버에 등록
@EnableFeignClients //Feign클라이언트로 등록
public class BusinessserviceApplication {

	public static void main(String[] args) {
		SpringApplication.run(BusinessserviceApplication.class, args);
	}

}

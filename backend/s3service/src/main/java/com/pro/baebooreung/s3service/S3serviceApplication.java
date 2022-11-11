package com.pro.baebooreung.s3service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class S3serviceApplication {

	public static void main(String[] args) {
		SpringApplication.run(S3serviceApplication.class, args);
	}

}

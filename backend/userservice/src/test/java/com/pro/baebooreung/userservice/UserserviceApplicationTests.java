package com.pro.baebooreung.userservice;

import com.pro.baebooreung.userservice.domain.UserEntity;
import com.pro.baebooreung.userservice.domain.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class UserserviceApplicationTests {
	@Autowired
	UserRepository userRepository;

	@Test
	void findAll테스트() {
		Iterable<UserEntity> result = userRepository.findAll();
		System.out.println(result.toString());
	}
	@Test
	void contextLoads() {
	}

}

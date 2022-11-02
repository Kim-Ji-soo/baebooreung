package com.pro.baebooreung.userservice.service;

import com.pro.baebooreung.userservice.domain.UserEntity;
import com.pro.baebooreung.userservice.domain.repository.UserRepository;
import com.pro.baebooreung.userservice.dto.UserDto;
import com.pro.baebooreung.userservice.vo.ResponseUser;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.modelmapper.spi.MatchingStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.core.env.Environment;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    UserRepository userRepository; //필드단위에서 @Autowired사용할 수 있지만 생성자 통해서 주입하는 것이 더 좋음
    BCryptPasswordEncoder passwordEncoder;

    Environment env;
//    RestTemplate restTemplate;

//    OrderServiceClient orderServiceClient;

//    CircuitBreakerFactory circuitBreakerFactory;

    public ResponseUser getUserById(int id) {
        UserEntity userEntity = userRepository.findById(id);

        if (userEntity == null) throw new UsernameNotFoundException(id + ": not found");

        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        ResponseUser responseUser = mapper.map(userEntity, ResponseUser.class);
        return responseUser;
    }


    @Override //Username으로
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity userEntity = userRepository.findByEmail(username);

        if (userEntity == null)
            throw new UsernameNotFoundException(username + ": not found");

        // spring security 안에 포함되어 있던 user 모델이 만들어짐
        return new User(userEntity.getEmail(), userEntity.getEncryptedPwd(),
                true, true, true, true,
                new ArrayList<>()); //로그인되었을 때 그다음에 할 수 있는 작업 중 권한 추가하는 작업넣을 것
    }

    @Autowired
    public UserServiceImpl(UserRepository userRepository,
                           BCryptPasswordEncoder passwordEncoder,
                           Environment env
//                           RestTemplate restTemplate,
//                           OrderServiceClient orderServiceClient,
//                           CircuitBreakerFactory circuitBreakerFactory
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.env = env;
//        this.restTemplate = restTemplate;
//        this.orderServiceClient = orderServiceClient;
//        this.circuitBreakerFactory = circuitBreakerFactory;
    }

    @Override
    public UserDto createUser(UserDto userDto) {
        userDto.setUserId(UUID.randomUUID().toString());

        //길게 set하지 않고 간편하게 쓰는 법
        ModelMapper mapper = new ModelMapper();
        //매칭 전략을 딱 맞아 떨어지는 것만 되게끔 강력하게 설정
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        //전달받은 userDto 값을 UserEntity로 변환
        UserEntity userEntity = mapper.map(userDto, UserEntity.class);
        userEntity.setEncryptedPwd(passwordEncoder.encode(userDto.getPassword())); // 비밀번호 암호화

        userRepository.save(userEntity);

        //반환해서 확인하기 위함
        UserDto returnUserDto = mapper.map(userEntity, UserDto.class);
        return returnUserDto;
    }

    @Override
    public Iterable<UserEntity> getUserByAll() {
        return userRepository.findAll();
    }

    @Override
    public UserDto getUserDetailsByEmail(String email) {
        UserEntity userEntity = userRepository.findByEmail(email);
        if (userEntity == null) //데이터 존재 여부 확인
            throw new UsernameNotFoundException(email);

        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);

        //Entity를 db에서 가져와서 dto로 바꿈
        UserDto userDto = mapper.map(userEntity, UserDto.class);
        return userDto;
    }

    public void logout(String token){

    }
}


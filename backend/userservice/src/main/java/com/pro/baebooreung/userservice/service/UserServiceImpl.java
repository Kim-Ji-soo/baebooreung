package com.pro.baebooreung.userservice.service;

import com.pro.baebooreung.userservice.client.BusinessServiceClient;
import com.pro.baebooreung.userservice.domain.Grade;
import com.pro.baebooreung.userservice.domain.UserEntity;
import com.pro.baebooreung.userservice.domain.repository.UserRepository;
import com.pro.baebooreung.userservice.dto.StartDto;
import com.pro.baebooreung.userservice.dto.UserDto;
import com.pro.baebooreung.userservice.vo.ResponseRoute;
import com.pro.baebooreung.userservice.vo.ResponseUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
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
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    UserRepository userRepository; //필드단위에서 @Autowired사용할 수 있지만 생성자 통해서 주입하는 것이 더 좋음
    BCryptPasswordEncoder passwordEncoder;

    Environment env;
//    RestTemplate restTemplate;
    BusinessServiceClient businessServiceClient;
//    CircuitBreakerFactory circuitBreakerFactory;

    @Autowired
    public UserServiceImpl(UserRepository userRepository,
                           BCryptPasswordEncoder passwordEncoder,
                           Environment env,
//                           RestTemplate restTemplate,
                              BusinessServiceClient businessServiceClient
//                           CircuitBreakerFactory circuitBreakerFactory
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.env = env;
//        this.restTemplate = restTemplate;
        this.businessServiceClient=businessServiceClient;
//        this.circuitBreakerFactory = circuitBreakerFactory;
    }

    public UserDto getUserById(int id) {
        UserEntity userEntity = userRepository.findById(id);

        if (userEntity == null) throw new UsernameNotFoundException(id + ": not found");

        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        UserDto response = mapper.map(userEntity, UserDto.class);

        /* feign client */
        List<ResponseRoute> routeList = businessServiceClient.getRouteByUserNDate(id);
        response.setRouteList(routeList);

        return response;
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



    @Override
    public UserDto createUser(UserDto userDto) {
        userDto.setSpecialKey(UUID.randomUUID().toString());

        //길게 set하지 않고 간편하게 쓰는 법
        ModelMapper mapper = new ModelMapper();
        //매칭 전략을 딱 맞아 떨어지는 것만 되게끔 강력하게 설정
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        //전달받은 userDto 값을 UserEntity로 변환
        UserEntity userEntity = mapper.map(userDto, UserEntity.class);
        if(userEntity.getGrade()==Grade.DRIVER) {
            userEntity.builder().grade(Grade.UNAUTHORIZED).build();// 드라이버로 가입한 사람은 임시권한
        }
        userEntity.builder().encryptedPwd(passwordEncoder.encode(userDto.getPassword())).build(); // 비밀번호 암호화

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

    public ResponseUser setUsertoDriver(int id){
        UserEntity findUser = userRepository.findById(id);
        findUser.builder().grade(Grade.DRIVER).build();
        userRepository.save(findUser);

        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        ResponseUser responseUser = mapper.map(findUser, ResponseUser.class);
        return responseUser;
    }

    public UserDto setStart(StartDto startDto){
        UserEntity findUser = userRepository.findById(startDto.getId());

        findUser.builder()
                .routeId(startDto.getRouteId())
                .deliveryId(startDto.getDeliveryId())
                .build();
        userRepository.save(findUser);

        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        UserDto responseUser = mapper.map(findUser, UserDto.class);

        /* feign client */
        List<ResponseRoute> routeList = new ArrayList<>();
        routeList.add(businessServiceClient.getRoute(startDto.getRouteId()));
        responseUser.setRouteList(routeList);

        return responseUser;
    }
}


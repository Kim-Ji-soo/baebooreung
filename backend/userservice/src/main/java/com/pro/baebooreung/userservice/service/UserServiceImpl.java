package com.pro.baebooreung.userservice.service;

import com.pro.baebooreung.userservice.client.BusinessServiceClient;
import com.pro.baebooreung.userservice.domain.Grade;
import com.pro.baebooreung.userservice.domain.UserEntity;
import com.pro.baebooreung.userservice.domain.WorkStatus;
import com.pro.baebooreung.userservice.domain.repository.UserRepository;
import com.pro.baebooreung.userservice.dto.*;
import com.pro.baebooreung.userservice.vo.ResponseRoute;
import com.pro.baebooreung.userservice.vo.ResponseUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    UserRepository userRepository; //필드단위에서 @Autowired사용할 수 있지만 생성자 통해서 주입하는 것이 더 좋음
    BCryptPasswordEncoder passwordEncoder;

    Environment env;
    BusinessServiceClient businessServiceClient;
//    CircuitBreakerFactory circuitBreakerFactory;

    @Autowired
    public UserServiceImpl(UserRepository userRepository,
                           BCryptPasswordEncoder passwordEncoder,
                           Environment env,
                              BusinessServiceClient businessServiceClient
//                           CircuitBreakerFactory circuitBreakerFactory
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.env = env;
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
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        log.info("userDto:"+userDto.toString());
        UserEntity userEntity = UserEntity.builder().email(userDto.getEmail()).name(userDto.getName()).specialKey(userDto.getSpecialKey()).phone(userDto.getPhone()).region(userDto.getRegion()).build();
//        UserEntity userEntity = mapper.map(userDto, UserEntity.class);
        log.info("userEntity: "+userEntity.toString());

        if(userEntity.getGrade()==Grade.DRIVER) {
            userEntity.builder().grade(Grade.UNAUTHORIZED).build();// 드라이버로 가입한 사람은 임시권한
        }else userEntity.builder().grade(Grade.MANAGER).build();

        userEntity.builder().encryptedPwd(passwordEncoder.encode(userDto.getPassword())).build(); // 비밀번호 암호화

        userRepository.save(userEntity);
        log.info("userEntity2: "+userEntity.toString());
        //반환해서 확인하기 위함
        UserDto returnUserDto = mapper.map(userEntity, UserDto.class);
        log.info("userDto2:"+returnUserDto.toString());
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
        findUser.updateGrade(Grade.DRIVER);
        userRepository.save(findUser);
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        ResponseUser responseUser = mapper.map(findUser, ResponseUser.class);
        return responseUser;
    }

    @Transactional
    public UserDto setStart(StartDto startDto){
        UserEntity findUser = userRepository.findById(startDto.getId());
        findUser.updateStartEnd(startDto.getRouteId(), startDto.getDeliveryId(),WorkStatus.DRIVING);

        userRepository.save(findUser);

        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        UserDto responseUser = mapper.map(findUser, UserDto.class);

//        /* feign client */
//        List<ResponseRoute> routeList = new ArrayList<>();
//        routeList.add(businessServiceClient.getRoute(startDto.getRouteId()));
//        responseUser.setRouteList(routeList);

        return responseUser;
    }

    @Override
    public void setCheckIn(CheckinDto checkinDto){
        UserEntity findUser = userRepository.findById(checkinDto.getId());
        findUser.updateDelivery(checkinDto.getDeliveryId());

        userRepository.save(findUser);
    }

    @Override
    public void setEnd(int id) {
        UserEntity findUser = userRepository.findById(id);
        findUser.updateStartEnd(0,0,WorkStatus.OFF);
        userRepository.save(findUser);
    }

    @Override
    public void saveProfile(ProfileResponse res) {
        UserEntity findUser = userRepository.findById(res.getUserId());
        findUser.updateProfile(res.getProfileUrl());
        userRepository.save(findUser);
    }

    @Override
    public String getProfile(int userId) {
        UserEntity findUser = userRepository.findById(userId);
        return findUser.getProfile();
    }



    @Override
    public ResponseDriverRoute getDriverRoute(int id) {
        UserEntity findUser  = userRepository.findById(id);
        boolean isDriver = findUser.getWorkStatus().equals(WorkStatus.DRIVING)?true:false;
        if(isDriver){
            return ResponseDriverRoute.builder().route_id(findUser.getRouteId()).delivery_id(findUser.getDeliveryId()).drive(isDriver).build();
        } else {
            return ResponseDriverRoute.builder().route_id(0).delivery_id(0).drive(false).build();
        }
    }

    public String getSpecialKey(int id){
        UserEntity findUser  = userRepository.findById(id);
        if(!findUser.getSpecialKey().isEmpty()){
            return findUser.getSpecialKey();
        }else{
            throw new NullPointerException("id: "+id+"의 special key 값이 비어있습니다.");
        }
    }
}


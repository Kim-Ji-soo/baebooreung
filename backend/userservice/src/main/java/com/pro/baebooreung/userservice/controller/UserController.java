package com.pro.baebooreung.userservice.controller;

import com.pro.baebooreung.userservice.domain.UserEntity;
import com.pro.baebooreung.userservice.dto.UserDto;
import com.pro.baebooreung.userservice.service.UserService;
import com.pro.baebooreung.userservice.vo.Greeting;
import com.pro.baebooreung.userservice.vo.RequestUser;
import com.pro.baebooreung.userservice.vo.ResponseUser;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/")
public class UserController {

    @Autowired
    private Greeting greeting; //인스턴스로 생성
    private Environment env;
    private UserService userService;

    @Autowired //이건 생성자로 따로 빼서 하는게 좋음. 바로 @Autowired쓰기보다는.
    public UserController(Environment env, UserService userService) {
        this.env = env;
        this.userService = userService;
    }

    @GetMapping("/welcome")
    public String welcome(){
//        return env.getProperty("greeting.message");
        return greeting.getMessage();
    }

    @GetMapping("/health_check")
    public String status(){
        return String.format("It's Working in User Service on PORT %s", env.getProperty("local.server.port"));
    }

    @PostMapping("/join") //회원가입
    public ResponseEntity<ResponseUser> CreateUser(@RequestBody RequestUser user){
        //userService로 넘겨주기 위해서는 Requestuser를 dto로 바꿔야함
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        UserDto userDto = mapper.map(user, UserDto.class);
        System.out.println(userDto.toString());
        UserDto response = userService.createUser(userDto);
        System.out.println(response.toString());

        //반환값 설정정
       ResponseUser responseUser = mapper.map(response, ResponseUser.class);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseUser);
        //201 성공코드 반환환
    }
    @GetMapping("/users") //회원정보 얻어오기
    public ResponseEntity<List<ResponseUser>> getUsers() {
        Iterable<UserEntity> userList = userService.getUserByAll();

        List<ResponseUser> result = new ArrayList<>();
        userList.forEach(v -> {
            result.add(new ModelMapper().map(v, ResponseUser.class));
        });

        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

}

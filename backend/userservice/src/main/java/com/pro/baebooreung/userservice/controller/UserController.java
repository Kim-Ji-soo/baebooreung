package com.pro.baebooreung.userservice.controller;

import com.pro.baebooreung.userservice.domain.UserEntity;
import com.pro.baebooreung.userservice.dto.UserDto;
import com.pro.baebooreung.userservice.service.UserService;
import com.pro.baebooreung.userservice.vo.Greeting;
import com.pro.baebooreung.userservice.vo.RequestNaverMap;
import com.pro.baebooreung.userservice.vo.RequestUser;
import com.pro.baebooreung.userservice.vo.ResponseUser;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/")
@CrossOrigin(originPatterns = "https://localhost:3000, http://localhost:3000, https://k7c207.p.ssafy.io, http://k7c207.p.ssafy.io, https://k7c207.p.ssafy.io:8000, http://k7c207.p.ssafy.io:8000",maxAge=3600)
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

    @Autowired
    RestTemplate restTemplate;

    @GetMapping("/map")
    public ResponseEntity<Object> getData(@RequestBody RequestNaverMap request) {
        String url =
                "https://naveropenapi.apigw.ntruss.com/map-direction-15/v1/driving?start="+request.getStart()
                        +"&goal="+request.getGoal()
                        +"&option="+request.getOption()
                        +"&waypoints="+request.getWaypoints();
        //Spring restTemplate
        HashMap<String, Object> result = new HashMap<String, Object>();
        ResponseEntity<Object> resultMap = new ResponseEntity<>(null,null,200);

        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders header = new HttpHeaders();
            header.add("X-NCP-APIGW-API-KEY-ID","i3oq00t777");
            header.add("X-NCP-APIGW-API-KEY","SKQeRSOuZty3XKmuYfGHjQ2GNGUUS6c3wGhroXsG");
            HttpEntity<?> entity = new HttpEntity<>(header);

            UriComponents uri = UriComponentsBuilder.fromHttpUrl(url).build();

            resultMap = restTemplate.exchange(uri.toString(), HttpMethod.GET, entity, Object.class);

            result.put("statusCode", resultMap.getStatusCodeValue()); //http status code를 확인
            result.put("header", resultMap.getHeaders()); //헤더 정보 확인
            result.put("body", resultMap.getBody()); //실제 데이터 정보 확인

            //에러처리해야댐
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            result.put("statusCode", e.getRawStatusCode());
            result.put("body"  , e.getStatusText());
            System.out.println("error");
            System.out.println(e.toString());

            return resultMap;
        }
        catch (Exception e) {
            result.put("statusCode", "999");
            result.put("body"  , "excpetion오류");
            System.out.println(e.toString());

            return resultMap;

        }

        return resultMap;
    }


    @GetMapping("/welcome")
    public String welcome(){
//        return env.getProperty("greeting.message");
        System.out.println("????????????????????????????????");
        return greeting.getMessage();
    }

    @GetMapping("/port_check")
    public String status(){
        return String.format("It's Working in User Service on PORT %s", env.getProperty("local.server.port"));
    }

    @PostMapping("/join") //회원가입
    public ResponseEntity<ResponseUser> CreateUser(@RequestBody RequestUser user){
        //userService로 넘겨주기 위해서는 Requestuser를 dto로 바꿔야함
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        UserDto userDto = mapper.map(user, UserDto.class);

        UserDto response = userService.createUser(userDto);

        //반환값 설정정
       ResponseUser responseUser = mapper.map(response, ResponseUser.class);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseUser);
        //201 성공코드 반환환
    }
    @GetMapping("/users") //회원정보 얻어오기
    public ResponseEntity<List<ResponseUser>> getUserList() {
        Iterable<UserEntity> userList = userService.getUserByAll();
        System.out.println(userList.toString());
        List<ResponseUser> result = new ArrayList<>();
        userList.forEach(v -> {
            ModelMapper mapper = new ModelMapper();
            mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
            result.add(mapper.map(v, ResponseUser.class));
        });

        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @GetMapping("/user/{id}") //회원정보 얻어오기
    public ResponseEntity<ResponseUser> getUser(@PathVariable int id) {
        UserDto user = userService.getUserById(id);
        ResponseUser result = new ModelMapper().map(user,ResponseUser.class);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

//    @GetMapping("/api/logout")
//    public ResponseEntity<?> logout(@RequestHeader(value="token") String token) {
//        //근데 그냥 토큰이 로그인 할 떄마다 발급되는데 내가 없애줄 게 있나? 강제로 만료하게 하는 것도 불가능 하잖아
//    }

    @PutMapping("/authdriver/{id}") //관리자가 가입한 사람 드라이버라고 인증해주기
    public ResponseEntity<ResponseUser> authDriver(@PathVariable int id) {
        ResponseUser user = userService.setUsertoDriver(id);

        return ResponseEntity.status(HttpStatus.OK).body(user);
    }
}


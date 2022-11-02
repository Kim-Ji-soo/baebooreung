package com.pro.baebooreung.userservice.security;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.pro.baebooreung.userservice.dto.UserDto;
import com.pro.baebooreung.userservice.service.UserService;
import com.pro.baebooreung.userservice.vo.RequestLogin;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;

@Slf4j
public class AuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    //AuthenticationFilter는 빈으로 등록해서 쓰는게 아니라 인스턴스 직접 생성해서 사용중
    // WebSecurity에서 getAuthenticationFilter에서
    private UserService userService;
    private Environment env;

    public AuthenticationFilter(AuthenticationManager authenticationManager,
                                UserService userService,
                                Environment env) {
        super.setAuthenticationManager(authenticationManager);
        this.userService = userService;
        this.env = env;
    }


    @Override //로그인 시도하면 제일 먼저 실행되는 함수
    public Authentication attemptAuthentication(HttpServletRequest request,
                                                HttpServletResponse response) throws AuthenticationException {
        try {
            //전달받은 inputstream에 어떤 값이 있을 떄 RequestLogin 형태로 바꾸기 (RequestBody로 들어와서 stream)
            RequestLogin creds = new ObjectMapper().readValue(request.getInputStream(), RequestLogin.class);

            //실제 인증정보로 만들기-> UsernamePasswordAuthenticationFilter에 전달해줘야함 -> 토큰으로 변경해줘야함
            return getAuthenticationManager().authenticate( //-> 인증처리해주는 매니저에게 넘겨서 id, pwd 비교
                    new UsernamePasswordAuthenticationToken(
                            creds.getEmail(),
                            creds.getPassword(),
                            new ArrayList<>() //권한?
                    )
            );
        } catch(IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request,
                                            HttpServletResponse response,
                                            FilterChain chain,
                                            Authentication authResult) throws IOException, ServletException {
        
//        log.debug(((User)authResult.getPrincipal()).getUsername());
        //토큰 만료시간 이런 설정
        String userName = ((User)authResult.getPrincipal()).getUsername(); // 사용자 userName 추출
        UserDto userDetails = userService.getUserDetailsByEmail(userName);
        String token = Jwts.builder()
                .setSubject(userDetails.getUserId()) //이걸 갖고 토큰 만들 것임
                .setExpiration(new Date(System.currentTimeMillis() +
                        Long.parseLong(env.getProperty("token.expiration_time")))) // 하루짜리 토큰(properties에 써았음
                        // application에 써있는 건 전부 String 형으로 가져오기 떄문에 Long으로 parse 해줌
                .signWith(SignatureAlgorithm.HS512, env.getProperty("token.secret"))//암호화(알고리즘방식,키조합)
                .compact();

        response.addHeader("token", token); // 헤더에 위에 만들어진 토큰을 token이란 이름으로 넣을 것
        response.addHeader("userId", userDetails.getUserId()); //토큰 확인을 위해 userId 같이 넣음
        response.addIntHeader("id",userDetails.getId()); // 사람 id 값 헤더에 같이 보내주기
    }
}

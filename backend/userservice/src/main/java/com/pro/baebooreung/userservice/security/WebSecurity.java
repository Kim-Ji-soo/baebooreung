package com.pro.baebooreung.userservice.security;

import com.pro.baebooreung.userservice.service.UserService;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@EnableWebSecurity
public class WebSecurity extends WebSecurityConfigurerAdapter {

    private UserService userService;
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    private Environment env;

    public WebSecurity(Environment env, UserService userService, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.env = env;
        this.userService = userService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception { // 권한관련
        http.csrf().disable();
//        http.authorizeRequests().antMatchers("/users/**").permitAll(); //users로 들어온 모든 요청 허용

        //인증된 상태에서만 어떤 일을 할 수 있도록
//        http.authorizeRequests().antMatchers("/actuator/**").permitAll();
//        http.authorizeRequests().antMatchers("/health_check/**").permitAll();
        http.authorizeRequests().antMatchers("/**")
//                .hasIpAddress(env.getProperty("gateway.ip")) // <- IP 제한적으로 받는 것
                .hasIpAddress("172.24.0.3") // <- IP 제한적으로 받는 것 // 지금 넣은건
//                .hasIpAddress("k7c207.p.ssafy.io") // <- IP 제한적으로 받는 것
//                .access("hasIpAddress('" + env.getProperty("gateway.ip") + "')")
//                .access("hasIpAddress('k7c207.p.ssafy.io')")
                .and()
                .addFilter(getAuthenticationFilter()); //이 필터를 통한 데이터에 한해서만 권한을 부여하고 작업 진행

//        http.authorizeRequests().antMatchers("/users")
//                .hasIpAddress(env.getProperty("gateway.ip")) // <- IP 변경
//                .and()
//                .addFilter(getAuthenticationFilter());
//
//        http.authorizeRequests().anyRequest().denyAll();

        http.headers().frameOptions().disable();
    }

    private AuthenticationFilter getAuthenticationFilter() throws Exception {
        AuthenticationFilter authenticationFilter =
                new AuthenticationFilter(authenticationManager(), userService, env);
//        authenticationFilter.setAuthenticationManager(authenticationManager());

        return authenticationFilter;
    }

    // select pwd from users where email=?
    // db_pwd(encrypted) == input_pwd(encrypted)
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception { //인증관련
        auth.userDetailsService(userService).passwordEncoder(bCryptPasswordEncoder);
    }
}

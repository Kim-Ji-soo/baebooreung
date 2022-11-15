package com.pro.baebooreung.apigatewayservice.filter;

import com.pro.baebooreung.apigatewayservice.client.UserServiceClient;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Date;

@Component
@Slf4j
public class AuthorizationHeaderFilter extends AbstractGatewayFilterFactory<AuthorizationHeaderFilter.Config> {
    Environment env;
//    UserServiceClient userServiceClient;

    public AuthorizationHeaderFilter(Environment env){
//            ,UserServiceClient userServiceClient) {
        super(Config.class);
        this.env = env;
//        this.userServiceClient = userServiceClient;
    }

    public static class Config {
        // Put configuration properties here
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            // 사용자가 어떤 요청을 했을 때 해당하는 정보에서 헤더에 토큰을 전달해주기 때문에
            // 토큰이 잘 들어가 있는지, 적절한 인증이 처리되어있는지 등등 해줄 것임

            //헤더에 토큰값이 잘 들어가 있는지 확인
            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                return onError(exchange, "No authorization header", HttpStatus.UNAUTHORIZED);
            }
//            if(!request.getHeaders().containsKey(HttpHeaders.USER_AGENT)){
//                return onError(exchange, "No authorization header", HttpStatus.UNAUTHORIZED);
//            }

            //인증정보 가져오기(authorizationHeader에는 bearer 토큰 값이 있을 것임
            String authorizationHeader = request.getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
            String jwt = authorizationHeader.replace("Bearer", ""); //헤더에 있는지 확인
            //String 값으로 Bearer라는 값을 토큰 정보 전달됨 -> 그 값을 비어있는 문자열로 바꾸고 나머지 값이 토큰 값
            int userId = Integer.valueOf(request.getHeaders().get("id").get(0));
            String specialkey = request.getHeaders().get("specialkey").get(0);
            // Create a cookie object
//            ServerHttpResponse response = exchange.getResponse();
//            ResponseCookie c1 = ResponseCookie.from("my_token", "test1234").maxAge(60 * 60 * 24).build();
//            response.addCookie(c1);

            //토큰 검증
            if (!isJwtValid(jwt,userId,specialkey)) {
                return onError(exchange, "JWT token is not valid", HttpStatus.UNAUTHORIZED);
            }

            return chain.filter(exchange); //잘 되어있으면 해당하는 값이 통과
        };
    }

    private boolean isJwtValid(String jwt, int userId, String specialkey) {
        boolean returnValue = true;

        String subject = null; // jwt에서 원했던 데이터 타입이 정상적인지 확인하는 것
        Date expiration = null; // 만료일자내에 있는지 확인하는 것
        try {
            //subject 값 얻기
            Claims claims = Jwts.parser().setSigningKey(env.getProperty("token.secret"))
                    .parseClaimsJws(jwt).getBody();
            subject = claims.getSubject();
            expiration = claims.getExpiration();

        } catch (Exception ex) {
            returnValue = false;
        }

        if (subject == null || subject.isEmpty() || expiration.before(new Date())) { //null이거나 속이 비어있거나 만료일자가 지나면 false
            returnValue = false;
        }
        //userId와 같은 값인지도 확인하면 좋음
//        log.info(">>>subject: "+subject);
//        log.info(">>>specialkey: "+specialkey);
//        log.info(">>>equal? "+ specialkey.equals(subject));
//        String returnKey = userServiceClient.getSpecialkey(userId);
//        if(!returnKey.equals(specialkey)){
//            log.info(">>>feign client "+ returnKey);
//            returnValue = false;
//        }

        return returnValue;
    }

    private Mono<Void> onError(ServerWebExchange exchange, String errMessage, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);

        log.error(errMessage);
        return response.setComplete();
    }

}

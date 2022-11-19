package com.pro.baebooreung.chat.config;

import com.pro.baebooreung.chat.handler.StompHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RequiredArgsConstructor
@Configuration
@EnableWebSocketMessageBroker
public class WebSockConfig implements WebSocketMessageBrokerConfigurer {

    private final StompHandler stompHandler;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/api/sub");
        config.setApplicationDestinationPrefixes("/api/pub");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        System.out.println("register stomp end points--");
        registry.addEndpoint("/api/ws-stomp").setAllowedOriginPatterns("*").withSockJS()
                .setHeartbeatTime(1700);

    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        System.out.println("인터셉터 설정");
        registration.interceptors(stompHandler);
    }
}

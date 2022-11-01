package com.pro.baebooreung.userservice.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component //spring boot 안에서 spring context로 사용되기 위해서 빈으로 등록하기 위해 사용(서비스, 레포 처럼 정해지지 않은 용도 일 때 사용)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Greeting {
    @Value("${greeting.message}")
    private String message;
}

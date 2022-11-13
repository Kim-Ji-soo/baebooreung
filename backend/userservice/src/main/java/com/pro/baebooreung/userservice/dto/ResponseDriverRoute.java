package com.pro.baebooreung.userservice.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ResponseDriverRoute {
    int route_id;
    int delivery_id;
    boolean drive;

    @Builder
    public ResponseDriverRoute(int route_id, int delivery_id, boolean drive){
        this.route_id = route_id;
        this.delivery_id = delivery_id;
        this.drive = drive;
    }
}

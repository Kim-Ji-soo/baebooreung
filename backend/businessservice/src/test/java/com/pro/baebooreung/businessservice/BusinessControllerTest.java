package com.pro.baebooreung.businessservice;

import com.pro.baebooreung.businessservice.controller.BusinessController;
import com.pro.baebooreung.businessservice.service.RouteService;
import com.pro.baebooreung.businessservice.vo.ResponseRoute;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BusinessController.class)
public class BusinessControllerTest {

    @Autowired
    MockMvc mvc;

    @MockBean
    RouteService routeService;

    @Test
    @DisplayName("routeId로 루트 한개 조회 테스트")
    void 루트한개조회테스트() throws Exception {
        int routeId = 1;
//        mvc.perform(get("/business-service/route/"+routeId))
//                .andExpect(status().isOk())
//                .andDo(print());
        ResponseRoute routeList = routeService.getRoute(routeId);
        System.out.println(routeList);
    }

}

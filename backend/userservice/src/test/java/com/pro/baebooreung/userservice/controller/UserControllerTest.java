package com.pro.baebooreung.userservice.controller;

import com.pro.baebooreung.userservice.vo.ResponseUser;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
class UserControllerTest {
//    @PersistenceContext
//    private EntityManager em;
//    @Autowired
//    UserController userController;

    @Autowired
    MockMvc mvc;

    private static final String BASE_URL = "/user-service/";


    @Test
    @DisplayName("유저 한명 정보 받아오기 테스트")
    void getUser() throws Exception {
        int id = 2;
//        ResponseEntity<ResponseUser> result = userController.getUser(id);
//        System.out.println(result);

        mvc.perform(get(BASE_URL + "/user"+id))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());

    }


}
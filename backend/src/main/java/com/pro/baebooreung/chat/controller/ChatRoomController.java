package com.pro.baebooreung.chat.controller;

import com.pro.baebooreung.chat.dto.ChatRoom;
import com.pro.baebooreung.chat.repository.ChatRoomRepository;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@Controller
@RequestMapping("/chat")
public class ChatRoomController {

    private final ChatRoomRepository chatRoomRepository;

    //채팅 리스트 화면
//    @ApiOperation(value = "채팅 리스트 화면",notes = "채팅방에 구독되어 있는 사용자들에게 메시지를 보낸다.")
//    @GetMapping("/room")
//    public String rooms(Model model){
//        return "/chat/room";
//    }

    //모든 채팅방 목록 반환
    @ApiOperation(value = "모든 채탕방의 목록을 반환한다.",notes = "생성되어 있는 모든 채팅방의 리스트를 출력한다.")
    @GetMapping("/rooms")
    @ResponseBody
    public List<ChatRoom> room(){
        return chatRoomRepository.findAllRoom();
    }

    //채팅방 생성
    @ApiOperation(value = "채팅방을 생성한다.",notes = "채팅방의 name을 입력해 채팅방을 생성한다.")
    @PostMapping("/room")
    @ResponseBody
    public ChatRoom createRoom(@RequestParam String name){
        return chatRoomRepository.createChatRoom(name);
    }

    //채팅방 입장 화면
//    @GetMapping("/room/enter/{roomId}")
//    public String roomDetail(Model model, @PathVariable String roomId){
//        model.addAttribute("roomId", roomId);
//        return "/chat/roomdetail";
//    }


    //특정 채팅방 조회
    @ApiOperation(value = "특정 채팅방을 조회한다.",notes = "roomId에 해당하는 채팅방을 조회한다.")
    @GetMapping("/room/{roomId}")
    @ResponseBody
    public ChatRoom roomInfo(@PathVariable String roomId){
        return chatRoomRepository.findRoomById(roomId);
    }
}

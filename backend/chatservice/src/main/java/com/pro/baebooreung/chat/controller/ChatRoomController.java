package com.pro.baebooreung.chat.controller;

import com.pro.baebooreung.chat.domain.ChatRoomCheck;
import com.pro.baebooreung.chat.domain.ChatRoomRecord;
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
@RequestMapping("/api/chat")
public class ChatRoomController {

    private final ChatRoomRepository chatRoomRepository;

    //채팅 리스트 화면
//    @ApiOperation(value = "채팅 리스트 화면",notes = "채팅방에 구독되어 있는 사용자들에게 메시지를 보낸다.")
//    @GetMapping("/room")
//    public String rooms(Model model){
//        return "/chat/room";
//    }

    //모든 채팅방 목록 반환
//    @ApiOperation(value = "모든 채탕방의 목록을 반환한다.",notes = "생성되어 있는 모든 채팅방의 리스트를 출력한다.")
//    @GetMapping("/rooms")
//    @ResponseBody
//    public List<ChatRoom> room(){
//        List<ChatRoom> chatRooms = chatRoomRepository.findAllRoom();
//        chatRooms.stream().forEach(room -> room.setUserCount(chatRoomRepository.getUserCount(room.getRoomId())));
//        return chatRooms;
//    }

    @ApiOperation(value = "모든 채탕방의 목록을 반환한다.",notes = "생성되어 있는 모든 채팅방의 리스트를 출력한다.")
    @GetMapping("/rooms")
    @ResponseBody
    public List<ChatRoomRecord> room(){
        List<ChatRoomRecord> chatRooms = chatRoomRepository.findAllRoom();
        return chatRooms;
    }

    //채팅방 생성
    @ApiOperation(value = "채팅방을 생성한다.",notes = "채팅방의 name을 입력해 채팅방을 생성한다.")
    @PostMapping("/room")
    @ResponseBody
    public ChatRoom createRoom(@RequestParam String name, @RequestParam String userId){
        return chatRoomRepository.createChatRoom(name, userId);
    }

    //채팅방 입장 화면
//    @GetMapping("/room/enter/{roomId}")
//    public String roomDetail(Model model, @PathVariable String roomId){
//        model.addAttribute("roomId", roomId);
//        return "/chat/roomdetail";
//    }


    //특정 채팅방 조회
//    @ApiOperation(value = "특정 채팅방을 조회한다.",notes = "roomId에 해당하는 채팅방을 조회한다.")
//    @GetMapping("/room/{roomId}")
//    @ResponseBody
//    public ChatRoom roomInfo(@PathVariable String roomId){
//        return chatRoomRepository.findRoomById(roomId);
//    }

//    @ApiOperation(value = "특정 채팅방을 조회한다.",notes = "roomId에 해당하는 채팅방을 조회한다.")
//    @GetMapping("/room/{roomId}")
//    @ResponseBody
//    public ChatRoom roomInfo(@PathVariable String roomId){
//        return chatRoomRepository.findRoomById(roomId);
//    }

    @ApiOperation(value = "특정 채팅방을 조회한다.",notes = "roomId에 해당하는 채팅방을 조회한다.")
    @GetMapping("/room/{roomId}")
    @ResponseBody
    public ChatRoomRecord roomInfo(@PathVariable String roomId){
        return chatRoomRepository.findRoomById(roomId);
    }

    @ApiOperation(value = "구독 정보를 true로 바꿔준다.",notes = "해당 유저가 들어온 방의 구독을 true로 바꿔준다.")
    @PutMapping("/room/update/subscribe/{roomId}/{userId}")
    public void updateSub(@PathVariable String roomId, @PathVariable String userId){
        chatRoomRepository.updateSub(roomId, userId);
    }

    @ApiOperation(value = "입장 정보를 true로 바꿔준다.",notes = "해당 유저가 들어온 방의 입장 정보를 true로 바꿔준다.")
    @PutMapping("/room/update/enter/{roomId}/{userId}")
    public void updateEnt(@PathVariable String roomId, @PathVariable String userId){
        chatRoomRepository.updateEnt(roomId, userId);
    }

    @ApiOperation(value = "퇴장한다.",notes = "해당 채팅방을 나간다.")
    @PutMapping("/room/delete/{roomId}/{userId}")
    public void roomQuit(@PathVariable String roomId, @PathVariable String userId){
        chatRoomRepository.roomQuit(roomId, userId);
    }

    @ApiOperation(value = "해당 유저에 대한 입장, 구독 정보를 보여준다.",notes = "해당 유저에 대한 입장과 구독 정보를 보여준다.")
    @GetMapping("/room/user/info/{roomId}/{userId}")
    @ResponseBody
    public ChatRoomCheck userRoomCheck(@PathVariable String roomId, @PathVariable String userId){
        return chatRoomRepository.userRoomCheck(roomId, userId);
    }


}

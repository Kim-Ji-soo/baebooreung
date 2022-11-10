package com.pro.baebooreung.chat.repository;

import com.pro.baebooreung.chat.domain.ChatRoomCheck;
import com.pro.baebooreung.chat.domain.ChatRoomRecord;
import com.pro.baebooreung.chat.dto.ChatRoom;
import com.pro.baebooreung.chat.service.RedisSubscriber;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RequiredArgsConstructor
//@Service
@Component
public class ChatRoomRepository {

    @PersistenceContext
    private final EntityManager em;


    //Redis CacheKeys
     private static final String CHAT_ROOMS = "CHAT_ROOM"; //채팅룸 저장
     private static final String USER_COUNT = "USER_COUNT"; //채팅룸에 입장한 클라이언트 수 저장
     private static final String ENTER_INFO = "ENTER_INFO"; //채팅룸에 입장한 클라이언트의 sessionId와 채팅룸 id를 맵핑한 정보 저장

     @Resource(name = "redisTemplate")
     private HashOperations<String, String, ChatRoom> hashOpsChatroom;
     @Resource(name = "redisTemplate")
     private HashOperations<String, String, String> hashOpsEnterInfo;
     @Resource(name = "redisTemplate")
     private ValueOperations<String, String> valueOps;

//     public List<ChatRoom> findAllRoom(){
//         return hashOpsChatroom.values(CHAT_ROOMS);
//     }

    @Transactional
     public List<ChatRoomRecord> findAllRoom(){
         List<ChatRoomRecord> chatRoomRecords = em.createQuery("select cr from ChatRoomRecord cr")
                 .getResultList();
         return chatRoomRecords;
     }

//     public ChatRoom findRoomById(String id){
//            return hashOpsChatroom.get(CHAT_ROOMS, id);
//        }


    @Transactional
    public ChatRoomRecord findRoomById(String id){
         ChatRoomRecord chatRoomRecord = em.find(ChatRoomRecord.class, id);
         return chatRoomRecord;
    }

    /**
     * 채팅방 생성 : 서버간 채팅방 공유를 위해 redis hash에 저장한다.
     */
    @Transactional
    public ChatRoom createChatRoom(String name, String userId){
            ChatRoom chatRoom = ChatRoom.create(name);
            hashOpsChatroom.put(CHAT_ROOMS, chatRoom.getRoomId(), chatRoom);

//            ChatRoomRecord chatRoomRecord = ChatRoomRecord.builder().roomId(chatRoom.getRoomId()).createTime(LocalDateTime.now()).roomName(name).build();
            ChatRoomRecord chatRoomRecord = new ChatRoomRecord(chatRoom.getRoomId(), LocalDateTime.now(), name);
            em.persist(chatRoomRecord);

            ChatRoomCheck chatRoomCheck = new ChatRoomCheck(userId, chatRoomRecord, false, false);
            em.persist(chatRoomCheck);

            System.out.println("채팅방 생성됨");
            return chatRoom;
     }

    /**
     * 유저가 입장한 채팅방 id와 유저 세션 id 맵핑 정보 저장
     */
    public void setUserEnterInfo(String sessionId, String roomId){
        System.out.println("set user enter info");
        hashOpsEnterInfo.put(ENTER_INFO, sessionId, roomId);
    }

    /**
     * 유저 세션으로 입장해 있는 채팅방 id 조회
     */
    public String getUserEnterRoomId(String sessionId){
        return hashOpsEnterInfo.get(ENTER_INFO, sessionId);
    }

    /**
     * 유저 세션정보와 맵핑된 채팅방 id 삭제
     */
    public void removeUserEnterInfo(String sessionId){
        hashOpsEnterInfo.delete(ENTER_INFO, sessionId);
    }

    /**
     * 채팅방 유저 수 조회
     */
    public long getUserCount(String roomId){
        return Long.valueOf(Optional.ofNullable(valueOps.get(USER_COUNT + "_" + roomId)).orElse("0"));
    }

    /**
     * 채팅방에 입장한 유저 수 +1
     */
    public long plusUserCount(String roomId){
        return Optional.ofNullable(valueOps.increment(USER_COUNT + "_" + roomId)).orElse(0L);
    }

    /**
     * 채팅방에 입장한 유저 수 -1
     */
    public long minusUserCount(String roomId){
        return Optional.ofNullable(valueOps.decrement(USER_COUNT + "_" + roomId)).filter(count -> count > 0).orElse(0L);
    }

    @Transactional
    public void updateSub(String roomId, String userId) {
        ChatRoomCheck chatRoomCheck = userRoomCheck(roomId, userId);
        chatRoomCheck.setIsSubscribe(true);
        em.persist(chatRoomCheck);
    }

    @Transactional
    public void updateEnt(String roomId, String userId) {
        ChatRoomCheck chatRoomCheck = userRoomCheck(roomId, userId);
        chatRoomCheck.setIsEnter(true);
        em.persist(chatRoomCheck);
    }


    @Transactional
    public void roomQuit(String roomId, String userId) {
        ChatRoomRecord chatRoomRecord = em.createQuery("SELECT cr FROM ChatRoomRecord cr WHERE cr.roomId = :roomId", ChatRoomRecord.class)
                .setParameter("roomId", roomId)
                .getSingleResult();
        em.createQuery("DELETE FROM ChatRoomCheck c WHERE c.userId = :userId AND c.roomId.id = :roomId", ChatRoomCheck.class)
                .setParameter("userId", userId)
                .setParameter("roomId", chatRoomRecord.getId())
                        .executeUpdate();
    }

    @Transactional
    public ChatRoomCheck userRoomCheck(String roomId, String userId) {
        ChatRoomRecord chatRoomRecord = em.createQuery("SELECT cr FROM ChatRoomRecord cr WHERE cr.roomId = :roomId", ChatRoomRecord.class)
                .setParameter("roomId", roomId)
                .getSingleResult();
        ChatRoomCheck chatRoomCheck = em.createQuery("SELECT c FROM ChatRoomCheck c WHERE c.userId = :userId AND c.roomId.id = :roomId", ChatRoomCheck.class)
                .setParameter("userId", userId)
                .setParameter("roomId", chatRoomRecord.getId())
                .getSingleResult();
        return chatRoomCheck;
    }


}

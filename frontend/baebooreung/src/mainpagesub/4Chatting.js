import React from "react";
import styles from "./4Chatting.module.css";
import { Client } from "@stomp/stompjs";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { chat } from "../api/api";

const Chatting = () => {
  const [page, setPage] = useState(false); // 유저 / 채팅방목록 / 채팅방 분기처리
  const [chatRoomList, setChatRoomList] = useState([]); //채팅방 목록
  const [roomName, setRoomName] = useState(""); // 방 제목
  const [roomId, setRoomId] = useState(""); // 입장할 방 설정
  const [userCount, setUserCount] = useState(0);
  const [message, setMessage] = useState(""); // 메세지
  const [messages, setMessages] = useState([]); // 채팅 목록
  const [createChatVisible, setCreateChatVisible] = useState(false); // 채팅창 생성 모달창
  const [createChatCheckBox, setCreateChatCheckBox] = useState([]);
  const [roomNamePlaceholder, setRoomNamePlaceholder] = useState("black");
  const [quitChatVisible, setQuitChatVisible] = useState(false); // 채팅방 수정/나가기 모달창
  const [quitChatRoomInfo, setQuitChatRoomInfo] = useState({});
  const userList = useSelector((state) => state.userList.userList);

  const user = useSelector((state) => state.user);
  const [userProfileList, setUserProfileList] = useState([]);
  const name = user.name; //메세지를 전송하는 주체
  const dispatch = useDispatch();
  const client = useRef({});

  useEffect(() => {
    console.log(userList);
    userList.map((item, idx) => {
      setCreateChatCheckBox((createChatCheckBox) => {
        const newArr = [...createChatCheckBox];
        newArr.push(false);
        return newArr;
      });
    });
  }, []);

  async function connect() {
    client.current = new Client();
    client.current.configure({
      brokerURL: "wss://k7c207.p.ssafy.io:8080/api/ws-stomp/websocket",
      onConnect: () => {
        console.log("성공");
      },
      onChangeState: () => {
        console.log("change");
      },
      onDisconnect: () => {
        console.log("실패");
      },
      forceBinaryWSFrames: true,
      appendMissingNULLonIncoming: true,
      logRawCommunication: true,
      connectHeaders: {},
      onStompError: function (frame) {
        // Will be invoked in case of error encountered at Broker
        // Bad login/passcode typically will cause an error
        // Complaint brokers will set `message` header with a brief message. Body may contain details.
        // Compliant brokers will terminate the connection after any error
        console.log("Broker reported error: " + frame.headers["message"]);
        console.log("Additional details: " + frame.body);
      },
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
    await client.current.activate();
  }

  async function findAllRooms() {
    //방 전체 출력
    await axios({
      method: "get",
      url: chat.findAllRooms(),
    })
      .then((res) => {
        console.log("방 정보 전체 출력", res.data);
        // setChatRoomList(res.data);
        const newArr = res.data;
        {
          newArr.map((item, idx) => {
            axios({
              method: "get",
              url: chat.getInfo() + `${item.roomId}/${user.email}`,
            })
              .then((result) => {
                console.log("getInfo", result.data);
                if (result.data.userId === user.email) {
                  setChatRoomList((chatRoomList) => {
                    const newChatRoomList = [...chatRoomList];
                    newChatRoomList.push(item);
                    return newChatRoomList;
                  });
                }
              })
              .catch((e) => {
                console.log(e);
              });
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
  async function enterRoom(roomId, userId) {
    setRoomId(roomId);
    axios({
      method: "get",
      url: chat.getInfo() + `${roomId}/${userId}`,
    })
      .then((res) => {
        console.log("getInfo", res.data.isEnter, res.data.isSubscribe);
        if (res.data.isSubscribe === false) {
          axios({
            method: "put",
            url: chat.updateSubscribeInfo() + `${roomId}/${userId}/`,
          })
            .then(() => {
              console.log("update Subscribe");
            })
            .catch((e) => {
              console.log(e);
            })
            .finally(() => {
              subscribe(roomId, userId);
            });
        }

        if (res.data.isEnter === false) {
          axios({
            method: "put",
            url: chat.updateEnterInfo() + `${roomId}/${userId}/`,
            // params: {
            //   roomId: roomId,
            //   userId: user,
            // },
          })
            .then(() => {
              console.log("update Enter");
            })
            .catch((e) => {
              console.log(e);
            })
            .finally(() => {
              enter(roomId, userId);
            });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function sendMessage() {
    client.current.publish({
      destination: "/api/pub/chat/message",
      headers: { id: user.name },
      body: JSON.stringify({
        type: "TALK",
        roomId: roomId,
        sender: user.email,
        message: message,
        userCount: userCount,
        name: user.name,
      }),
    });
    setMessage("");
  }

  function recvMessage(recv) {
    setMessages((messages) => {
      const newMessages = [...messages];
      newMessages.push({
        roomId: recv.roomId,
        type: recv.type,
        sender: recv.sender,
        name: recv.name,
        message: recv.message,
      });
      return newMessages;
    });
  }

  const subscribe = async (roomId, userId) => {
    client.current.subscribe(
      "/api/sub/chat/room/" + roomId,
      (body) => {
        // console.log('body', body.body);
        const recv = JSON.parse(body.body);
        recvMessage(recv);
      },
      { id: user.name }
    );
  };

  const disconnect = () => {
    client.current.deactivate();
  };

  const handleChange = (event) => {
    //채팅 입력시 state에 값 설정
    setMessage(event);
  };

  const RoomNameChange = (event) => {
    setRoomName(event);
  };
  async function enter(roomId, userId) {
    await client.current.publish({
      destination: "/api/pub/chat/message",
      headers: {},
      body: JSON.stringify({
        type: "ENTER",
        roomId: roomId,
        sender: userId,
        name: user.name,
      }),
    });
  }

  async function quit(roomId, userId) {
    await client.current.publish({
      destination: "/api/pub/chat/message",
      headers: {},
      body: JSON.stringify({
        type: "QUIT",
        roomId: roomId,
        sender: userId,
        name: user.name,
      }),
    });
  }

  useEffect(() => {
    setChatRoomList([]);
    findAllRooms();
  }, []);

  useEffect(() => {
    // 유저목록 프로필사진 가능하면...?
    // if (userList.length !== 0 && userList !== undefined) {
    //   userList.map(item => {
    //     axios({
    //       method: 'get',
    //       url: user_service.getProfile() + `${item.id}`,
    //     })
    //       .then(res => {
    //         console.log('파일가져오기', res.data);
    //         setUserProfileList(userProfileList => {
    //           const newUserProfileList = [...userProfileList];
    //           newUserProfileList.push({
    //             email: item.email,
    //             grade: item.grade,
    //             id: item.id,
    //             name: item.name,
    //             profile: res.data,
    //           });
    //         });
    //       })
    //       .catch(e => {});
    //   });
    // }
    connect();
    return () => disconnect();
  }, []);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <div className={styles.background}>
      {/*유저목록 div */}
      <div className={styles.userListLayout}>
        {userList.map((item, idx) => {
          return (
            <div className={styles.userList}>
              <div className={styles.userListName}>{item.name}</div>
              <div className={styles.userListPhone}>{item.phone}</div>
            </div>
          );
        })}
      </div>
      <div className={styles.chatLayout}>
        {/* 채팅창 div */}
        {page && <div className={styles.chatRoomLayout}>채팅창목록</div>}

        {/* 채팅방 목록 div */}
        <div className={styles.chatRoomListLayout}>채팅방목록</div>
      </div>
    </div>
  );
};

export default Chatting;

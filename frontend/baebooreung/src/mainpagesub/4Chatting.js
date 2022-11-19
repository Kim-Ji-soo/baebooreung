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
  const userList = useSelector((state) => state.userList.userList);
  const user = useSelector((state) => state.user);
  const [userProfileList, setUserProfileList] = useState([]);
  const name = user.name; //메세지를 전송하는 주체
  const dispatch = useDispatch();
  const client = useRef({});

  useEffect(() => {
    // console.log(userList);
    // 채팅창 생성 모달창의 체크박스 상태를 모두 false로 초기화 시킴
    userList
      .filter((item) => item.email !== user.email)
      .map((item, idx) => {
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

  //전체 방정보 중 내가 소속되어있는 방 정보만 출력하기 위한 함수
  async function findAllRooms() {
    //방 전체 출력
    await axios({
      method: "get",
      url: chat.findAllRooms(),
    })
      .then((res) => {
        // console.log("방 정보 전체 출력", res.data);

        //전체 방 목록중에 내가 연관되어 있는 방정보만 출력하기 위하여 아래 axios 사용
        //그 후 그 채팅방의 데이터(id, roomId, roomName,createTime)를 chatRoomList에 저장
        const newArr = res.data;
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
      })
      .catch((e) => {
        console.log(e);
      });
  }

  //방입장에 관한 함수 구독정보 입장정보를 얻은뒤에
  //구독정보가 false면 mySQL의 구독정보를 true로 바꾸고
  //Redis에 저장된 채팅DB에 subscribe 요청을 보냄
  //입장정보가 false면 mySQL의 입장정보를 true로 바꾸고
  //Redis에 저장된 채팅DB에 type이 ENTER인 publish 요청을 보냄
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

  //메세지 보내기
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

  //구독되어 있는 Redis의 채팅 내역을 가져오는 함수
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

  //Redis 채팅 구독 함수
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

  //웹소켓 disconnect 함수
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

  // publish 요청 중 입장에 관한 함수
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

  // publish 요청 중 퇴장에 관한 함수
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

  function createRoomModal() {
    return (
      <div className={styles.createModal}>
        <div className={styles.modalView}>
          <div className={styles.createRoomNameLayout}>
            <p>방제목</p>
            <input
              type="text"
              placeholder="방 제목을 입력하세요"
              onChange={(e) => {
                RoomNameChange(e.target.value);
              }}
              value={roomName}
              maxLength="45"
            ></input>

            {/* 채팅방에 추가할 초대 유저목록을 내 정보를 제외한 유저목록으로 갱신 후
             체크박스를 통해 초대할 유저정보 입력*/}
            {userList
              .filter((item) => item.email !== user.email)
              .map((item, idx) => {
                return (
                  <div key={idx} className={styles.createChatListStyle}>
                    <div className={styles.userListDetailText}>
                      {item.name}
                      {item.grade === "MANAGER" && "관리자"}
                      {item.grade === "DRIVER" && "드라이버"}
                    </div>
                    <div className={styles.userListDetailCheckBox}>
                      {/* 체크박스 상태가 변하면 유저정보를 저장한 
                      createChatCheckBox의 상태도 같이 변화*/}
                      <input
                        type="checkbox"
                        onChange={() => {
                          setCreateChatCheckBox((el) => {
                            const newArr = [...el];
                            newArr[idx] = !newArr[idx];
                            return newArr;
                          });
                        }}
                      ></input>
                    </div>
                  </div>
                );
              })}
            {/* 초대버튼을 누를 시 나를 주체로 채팅방을 생성하고 
              체크박스로 추가된 유저목록의 유저들을 채팅방에 초대한다
              그 후에 체크박스의 체크된 요소들을 초기화시키고
              변경된 모든사항을 초기화시킨후(방목록)
              추가된 방목록을 재갱신 시킨다.*/}
            <div
              className={styles.buttonLayout}
              onClick={async () => {
                if (roomName !== "") {
                  await axios({
                    method: "post",
                    url: chat.createRoom(),
                    params: {
                      name: roomName,
                      userId: user.email,
                    },
                  })
                    .then((res) => {
                      createChatCheckBox.map((item, idx) => {
                        if (item === true) {
                          axios({
                            method: "post",
                            url:
                              chat.invite() +
                              `${res.data.roomId}/${userList[idx].email}/`,
                          })
                            .then((res) => {
                              console.log("초대", res.data);
                            })
                            .catch((e) => {
                              console.log(e);
                            });
                        }
                      });
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                  createChatCheckBox.map((item, idx) => {
                    if (item === true) {
                      setCreateChatCheckBox((createChatCheckBox) => {
                        const newArr = [...createChatCheckBox];
                        newArr[idx] = false;
                        return newArr;
                      });
                    }
                  });

                  setRoomName("");
                  setChatRoomList([]);
                  findAllRooms();
                  setCreateChatVisible(!createChatVisible);
                }
              }}
            >
              <button>초대</button>
              <button
                onClick={() => {
                  setCreateChatVisible(!createChatVisible);
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.background}>
      {/*유저목록 div */}
      <div className={styles.userListLayout}>
        {/* filter를 이용하여 나를 제외한 유저목록 출력 */}
        <p>유저 목록</p>
        {userList
          .filter((item) => item.email !== user.email)
          .map((item, idx) => {
            return (
              <div key={idx} className={styles.userList}>
                <div className={styles.userListName}>{item.name}</div>
                <div className={styles.userListPhone}>{item.phone}</div>
              </div>
            );
          })}
      </div>
      <div className={styles.chatLayout}>
        {/* 채팅창 div */}
        {page && (
          <div className={styles.chatRoomLayout}>
            <p>채팅창</p>
            <button
              onClick={() => {
                setPage(false);
              }}
            >
              x
            </button>
            {messages.map((item, idx) => {
              return (
                <div key={idx}>
                  {/* messages에 저장된 roomId가 내가 입장한 roomId와 일치하고
                  sender의 정보가 현재 나의 user정보와 같다면 나의 채팅 UI(flex-direction : row-reverse)를
                  sender의 정보가 현재 나의 user정보와 다르다면 다른사람의 채팅UI(flex-direction : row)를*/}
                  <div
                    className={
                      item.roomId === roomId && item.sender === user.email
                        ? styles.myChatComponent
                        : item.roomId === roomId && item.sender !== user.email
                        ? styles.otherChatComponent
                        : {}
                    }
                  >
                    {/* messages에 저장된 roomId가 내가 입장한 roomId와 일치하고
                    type이 'TALK'인 메세지가 sender가 내가 아닐때 그 유저의 프로필 출력(준비중) */}
                    {item.roomId === roomId &&
                      item.type === "TALK" &&
                      item.sender !== user.email && (
                        <div className={styles.otherChatProfile}></div>
                      )}
                    {/*  */}
                    <div
                      className={
                        (item.type === "ENTER" || item.type === "QUIT") &&
                        styles.noticeChatLayout
                      }
                    >
                      {/* messages에 저장된 roomId가 내가 입장한 roomId와 일치하고
                        type이 'TALK'인 메세지가 sender가 내가 아닐때 그 유저의 이름 출력
                       */}
                      {item.roomId === roomId &&
                        item.type === "TALK" &&
                        item.sender !== user.email && (
                          <div className={styles.otherChatName}>
                            {item.name}
                          </div>
                        )}

                      {/* messages에 저장된 roomId가 내가 입장한 roomId와 일치하고 
                        type이 'ENTER'라면 noticeChat 스타일을
                        sender가 유저의 아이디와 일치한다면 myChat 스타일을
                        sender가 유저의 아이디와 일치하지 않는다면 otherChat 스타일을 적용
                      */}
                      <div
                        className={
                          item.roomId === roomId && item.type === "ENTER"
                            ? styles.noticeChat
                            : item.roomId === roomId &&
                              item.sender === user.email
                            ? styles.myChat
                            : item.roomId === roomId &&
                              item.sender !== user.email
                            ? styles.otherChat
                            : {}
                        }
                      >
                        {/* messages에 저장된 roomId가 내가 입장한 roomId와 일치하고
                        type이 'ENTER'라면 아래 메세지 출력 */}
                        {item.roomId === roomId && item.type === "ENTER" && (
                          <div className={styles.noticeChatText}>
                            {item.name}님이 입장하셨습니다.
                          </div>
                        )}

                        {/* messages에 저장된 roomId가 내가 입장한 roomId와 일치하고
                        type이 'QUIT' 이라면 아래 메세지 출력 */}
                        {item.roomId === roomId && item.type === "QUIT" && (
                          <div className={styles.noticeChatText}>
                            {item.name}님이 퇴장하셨습니다.
                          </div>
                        )}

                        {/* messages에 저장된 roomId가 내가 입장한 roomId와 일치하고
                        type이 'TALK' 라면 sender가 나인지 아닌지를 구분하여 스타일 적용 */}
                        {item.roomId === roomId && item.type === "TALK" && (
                          <div
                            className={
                              item.sender === user.email
                                ? styles.myChatText
                                : styles.otherChatText
                            }
                          >
                            {item.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 채팅 메세지 입력 컴포넌트  */}
            <div className={styles.bottomContainer}>
              <textarea
                className={styles.messageInput}
                placeholder={"메세지를 입력하세요"}
                onChange={(e) => {
                  handleChange(e.target.value);
                }}
                value={message}
              ></textarea>
              <button
                clsssName={styles.buttonStyle}
                onClick={sendMessage}
                disabled={message === ""}
              >
                전송
              </button>
            </div>
          </div>
        )}

        {/* 채팅방 목록 div */}
        <div className={styles.chatRoomListLayout}>
          <p>채팅방 목록</p>
          <button
            onClick={() => {
              setCreateChatVisible(!createChatVisible);
            }}
          >
            채팅방 생성
          </button>
          {/* 채팅방 생성 모달 불러오기 */}
          {createChatVisible && createRoomModal()}

          {/* 채팅방 리스트 출력 */}
          {chatRoomList.map((item, idx) => {
            return (
              <div key={idx} className={styles.chatRoomList}>
                <button
                  onClick={() => {
                    setPage(true);
                    // console.log(
                    //   "enterRoom에 보낼 데이터",
                    //   item.roomId,
                    //   user.email
                    // );
                    enterRoom(item.roomId, user.email);
                  }}
                >
                  {item.roomName}
                </button>
                <button
                  onClick={() => {
                    setPage(false);
                    axios({
                      method: "delete",
                      url: chat.exitRoom() + `${item.roomId}/${user.email}`,
                    })
                      .then((res) => {
                        // console.log('채팅방 삭제', res.data);
                        quit(item.roomId, user.email);
                      })
                      .catch((e) => {
                        console.log(e);
                      });
                    setChatRoomList([]);
                    findAllRooms();
                  }}
                >
                  채팅방 나가기
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Chatting;

import React from "react";
import styles from "./4Chatting.module.css";
import { Client } from "@stomp/stompjs";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { chat } from "../api/api";
import { camera_service } from "../api/api";
import logout from "../assets/images/logout2.png";
import Swal from "sweetalert2";
import send from "../assets/images/send.png";


const Chatting = () => {

  // document.getElementById('textarea').addEventListener('keydown', function () {
  //   sendMessage()
  // })
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
    connect();
    return () => disconnect();
  }, []);

  //프로필 사진을 받아오기 위하여 userList가 갱신되면
  useEffect(() => {
    if (userList.length !== 0) {
      userList
        .filter((item) => item.email !== user.email)
        .map((item) => {
          // console.log(item.email, item.grade, item.id, item.name);
          axios({
            method: "get",
            url: camera_service.getFile(),
            params: {
              userId: item.id,
            },
          })
            .then((res) => {
              console.log("파일가져오기", res.data);

              setUserProfileList((userProfileList) => {
                const newUserProfileList = [...userProfileList];
                newUserProfileList.push({
                  email: item.email,
                  grade: item.grade,
                  id: item.id,
                  name: item.name,
                  profile: res.data,
                  phone: item.phone,
                });
                return newUserProfileList;
              });
            })
            .catch((e) => {
              console.log(e);
            });
        });
    }
  }, [userList]);

  useEffect(() => {
    console.log(userProfileList);
  }, [userProfileList]);

  useEffect(() => {
    setCreateChatVisible(!createChatVisible);
  }, []);

  useEffect(() => {
    console.log(userProfileList);
    console.log(createChatCheckBox);
  }, [createChatCheckBox]);

  function createRoomModal() {
    return (
      <div className={styles.createModal}>
        <div className={styles.modalView}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <br />
            <input
              style={{ width: "85%", height: "50px", marginTop: "25px", borderRadius: "10px", fontSize: "20px", fontFamily: "NanumSquareNeo-Variable", }}
              type="text"
              autoFocus
              placeholder=" 방 제목을 입력하세요(필수)"
              onChange={(e) => {
                RoomNameChange(e.target.value);
              }}
              value={roomName}
              maxLength="45"
            ></input>
          </div>
          <hr style={{ width: "90%" }}></hr>
          <div className={styles.createRoomNameLayout}>
            {/* 채팅방에 추가할 초대 유저목록을 갱신 후
             체크박스를 통해 초대할 유저정보 입력*/}
            {userProfileList
              // .filter((item) => item.email !== user.email)

              .map((item, idx) => {
                return (
                  <div key={idx}>
                    {createChatCheckBox[idx] === false && (
                      <div className={styles.createChatListStyle}>
                        <div
                          style={{
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onClick={() => {
                            setCreateChatCheckBox((el) => {
                              const newArr = [...el];
                              newArr[idx] = !newArr[idx];
                              return newArr;
                            });
                            setPage(false)
                          }}
                        >
                          <div className={styles.userListDetailText}>
                            <img
                              src={`${item.profile}`}
                              style={{
                                width: "70px",
                                height: "70px",
                                borderRadius: "50%",
                                border: "3px solid #0F1839",
                              }}
                            ></img>
                            <div style={{ marginLeft: "20px" }}>
                              <div>
                                <span
                                  style={{
                                    fontSize: "25px",
                                    fontFamily: "NanumSquareNeo-Variable",
                                  }}
                                >
                                  {item.name}
                                </span>
                                <span
                                  style={{
                                    fontSize: "20px",
                                    fontFamily: "NanumSquareNeo-Variable",
                                  }}
                                >
                                  {item.grade === "MANAGER" && "   (관리자)"}
                                </span>
                              </div>
                              <div className={styles.userListPhone}>
                                {item.phone}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            {/* 초대버튼을 누를 시 나를 주체로 채팅방을 생성하고 
              체크박스로 추가된 유저목록의 유저들을 채팅방에 초대한다
              그 후에 체크박스의 체크된 요소들을 초기화시키고
              변경된 모든사항을 초기화시킨후(방목록)
              추가된 방목록을 재갱신 시킨다.*/}

          </div>

        </div>
      </div>
    );
  }
  return (
    <div className={styles.background}>
      {!createChatVisible && (
        <div style={{ height: "100%", width: "33%", marginRight: "1%" }}>
          <div
            style={{
              fontFamily: "NanumSquareNeo-Variable",
              fontSize: "25px",
              cursor: "pointer",
              width: "100%",
              height: "100%",
              border: "3px solid #0F1839",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "20px",

            }}
            onClick={() => {
              setCreateChatVisible(!createChatVisible);
            }}
          >
            눌러서 사용자 초대하기
          </div>
        </div>
      )}
      {/* 채팅방 생성 모달 불러오기 */}
      {createChatVisible && createRoomModal()}

      {/*유저목록 div */}
      {/* <div className={styles.userListLayout}>
        {userProfileList
          .filter((item) => item.email !== user.email)
          .map((item, idx) => {
            return (
              <div key={idx} className={styles.userList}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <img
                    src={`${item.profile}`}
                    style={{ width: "100px", height: "100px", borderRadius: "50%", border: "3px solid #F5CC1F" }}
                  ></img>
                </div>
                <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", marginLeft: "10px", fontFamily: "BMJUA" }}>
                  <div className={styles.userListName}>{item.name}</div>
                  <div className={styles.userListPhone}>{item.phone}</div>
                </div>
              </div>
            );
          })}
      </div> */}
      <div className={styles.chatLayout}>
        {/* 채팅창 div */}
        {page && (
          <div className={styles.chatRoomLayout2}>

            <div className={styles.chatheadder}>
              <div></div>
              <div style={{ fontSize: "24px" }}>여긴 방제목</div>
              <button style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "NanumSquareNeo-Variable", marginRight: "10px", color: "white" }}
                onClick={() => {
                  setPage(false);
                }}
              >
                나가기
              </button>
            </div>

            <div className={styles.chatRoomLayout}>
              <div className={styles.chatOutDiv}>
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
                        <div style={{ width: "100%" }}
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
              </div>

            </div>
            {/* 채팅 메세지 입력 컴포넌트  */}
            <div className={styles.bottomContainer}>
              <hr style={{ width: "95%" }} />
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "0px" }}>
                <textarea id="textarea"
                  style={{ width: "85%", marginLeft: "1%", marginRight: "1%", marginTop: "1%", marginBottom: "1%", borderRadius: "10px", height: "50px", fontSize: "20px", fontFamily: "NanumSquareNeo-Variable", }}
                  className={styles.messageInput}
                  placeholder={" 메세지를 입력하세요"}
                  onChange={(e) => {
                    handleChange(e.target.value);
                  }}
                  value={message}
                ></textarea>
                <button style={{ marginTop: "1%", marginBottom: "1%", background: "none", border: "none", cursor: "pointer", backgroundColor: "#0F1839", borderRadius: "10px", fontFamily: "NanumSquareNeo-Variable", }}
                  clsssName={styles.buttonStyle}
                  onClick={sendMessage}
                  disabled={message === ""}
                >
                  <img src={send} style={{ width: "30px" }} alt="" />
                </button>
              </div>
            </div>

          </div>
        )}

        {!page && (
          <div
            style={{ width: "50%", height: "100%", marginRight: "1.5%" }}>
            <div
              style={{
                // backgroundColor: "blue",
                width: "100%",
                height: "100%",
                border: "3px solid #0F1839",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "20px",
                fontFamily: "NanumSquareNeo-Variable",
                fontSize: "25px",
              }}
            >
              {/* 여기는 createChatcheckBox가 true인 친구들만 나오게 */}
              {!createChatCheckBox.includes(true) && (
                <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
                // onClick={() => {
                //   setCreateChatVisible(!createChatVisible);
                // }}
                >선택된 사용자나 열린 채팅방이 없습니다.</div>
              )}
              {(createChatCheckBox.includes(true) && <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>

                <div className={styles.createRoomNameLayout2}>
                  {userProfileList
                    // .filter((item) => item.email !== user.email)

                    .map((item, idx) => {
                      return (
                        <div key={idx} style={{}}>
                          {createChatCheckBox[idx] === true && (
                            <div className={styles.createChatListStyle2}>
                              <div
                                style={{
                                  cursor: "pointer",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                                onClick={() => {
                                  setCreateChatCheckBox((el) => {
                                    const newArr = [...el];
                                    newArr[idx] = !newArr[idx];
                                    return newArr;
                                  });
                                  console.log(createChatCheckBox)
                                }}
                              >
                                <div className={styles.userListDetailText2}>
                                  <img
                                    src={`${item.profile}`}
                                    style={{
                                      width: "70px",
                                      height: "70px",
                                      borderRadius: "50%",
                                      border: "3px solid #0F1839",
                                    }}
                                  ></img>
                                  <div style={{ marginLeft: "20px" }}>
                                    <div>
                                      <span
                                        style={{
                                          fontSize: "25px",
                                          fontFamily: "NanumSquareNeo-Variable",
                                        }}
                                      >
                                        {item.name}
                                      </span>
                                      <span
                                        style={{
                                          fontSize: "20px",
                                          fontFamily: "NanumSquareNeo-Variable",
                                        }}
                                      >
                                        {item.grade === "MANAGER" &&
                                          "   (관리자)"}
                                      </span>
                                    </div>
                                    <div className={styles.userListPhone}>
                                      {item.phone}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
                {/* 버튼 시작 */}
                {/* 여기에 크리에이트체크박스 여부에 따라 파악하기 */}
                <div className={styles.buttonLayout}>
                  <hr style={{ width: "90%" }} />
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      // backgroundColor: "black",
                      justifyContent: "center",
                      marginTop: "10px",
                      marginBottom: "10px",
                    }}
                  >

                    <button
                      onClick={async () => {
                        if (!roomName) {
                          Swal.fire({
                            icon: 'error',
                            title: '방 제목을 입력해주세요',
                            confirmButtonText: '확인',
                            confirmButtonColor: '#0F1839'
                          })
                        }
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
                                      `${res.data.roomId}/${userProfileList[idx].email}/`,
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
                              console.log("방제목잇음?")
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
                        }
                      }}
                      style={{
                        width: "120px",
                        height: "60px",
                        border: "none",
                        backgroundColor: "#F5CC1F",
                        cursor: "pointer",
                        borderRadius: "10px",
                        fontSize: "25px",
                        marginRight: "5%",
                        fontFamily: "NanumSquareNeo-Variable",
                      }}
                    >
                      생성
                    </button>
                    <button
                      style={{
                        width: "120px",
                        height: "60px",
                        border: "none",
                        backgroundColor: "#0F1839",
                        cursor: "pointer",
                        color: "white",
                        borderRadius: "10px",
                        fontSize: "25px",
                        marginLeft: "5%",
                        fontFamily: "NanumSquareNeo-Variable",
                      }}
                      onClick={() => {
                        setCreateChatVisible(!createChatVisible);
                        createChatCheckBox.map((item, idx) => {
                          if (item === true) {
                            setCreateChatCheckBox((createChatCheckBox) => {
                              const newArr = [...createChatCheckBox];
                              newArr[idx] = false;
                              return newArr;
                            });
                          }
                        });
                      }}
                    >
                      취소
                    </button>
                  </div>
                </div>
                {/* 버튼 끝 */}
              </div>)}
            </div>
          </div>
        )}

        {/* 채팅방 목록 div */}
        <div className={styles.chatRoomListLayout}>

          {/* 채팅방 리스트 출력 */}
          <div style={{ paddingTop: "20px" }}>
            {chatRoomList.map((item, idx) => {
              // console.log(chatRoomList)
              return (
                <div key={idx} className={styles.chatRoomList}>
                  <button style={
                    {
                      width: "85%",
                      background: "none",
                      border: "none",
                      paddingTop: "5px",
                      paddingBottom: "5px",
                      fontSize: "20px",
                      marginLeft: "20px",
                      textAlign: "start",
                      cursor: "pointer",
                      fontFamily: "NanumSquareNeo-Variable"
                    }}
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
                    style={{ background: "none", border: "none", cursor: "pointer" }}
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
                    <img src={logout} style={{ width: "30px", marginTop: "10px", marginBottom: "10px" }} alt="" />
                  </button>
                </div>
              );
            })}
          </div>

          {!chatRoomList.length && <div
            style={{
              height: "100%",
              display: "flex",
              fontSize: "25px",
              fontFamily: "NanumSquareNeo-Variable",
              justifyContent: "center",
              alignItems: "center",

            }}
          >
            존재하는 채팅방이 없습니다.
          </div>}

        </div>
      </div>
    </div>
  );
};

export default Chatting;

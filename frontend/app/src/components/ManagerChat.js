import {useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {setUser} from '../redux/user';
import {Client} from '@stomp/stompjs';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {chat, user, user_service} from '../api/api';
import CheckBox from '@react-native-community/checkbox';
import Truck from '../assets/images/truck.png';
import AudioRecord from '../components/AudioRecord';
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

export default function ManagerChat({navigation}) {
  const [page, setPage] = useState('user'); // 유저 / 채팅방목록 / 채팅방 분기처리
  const [chatRoomList, setChatRoomList] = useState([]); //채팅방 목록
  const [roomName, setRoomName] = useState(''); // 방 제목
  const [roomId, setRoomId] = useState(''); // 입장할 방 설정
  const [userCount, setUserCount] = useState(0);
  const [message, setMessage] = useState(''); // 메세지
  const [messages, setMessages] = useState([]); // 채팅 목록
  const [createChatVisible, setCreateChatVisible] = useState(false); // 채팅창 생성 모달창
  const [createChatCheckBox, setCreateChatCheckBox] = useState([]);
  const [roomNamePlaceholder, setRoomNamePlaceholder] = useState('black');
  const [quitChatVisible, setQuitChatVisible] = useState(false); // 채팅방 수정/나가기 모달창
  const [quitChatRoomInfo, setQuitChatRoomInfo] = useState({});
  const userList = useSelector(state => state.userList.userList);
  const [userProfileList, setUserProfileList] = useState([]);
  const user = useSelector(state => state.user);
  const name = user.name; //메세지를 전송하는 주체
  const dispatch = useDispatch();
  const client = useRef({});

  useEffect(() => {
    userList.map((item, idx) => {
      setCreateChatCheckBox(createChatCheckBox => {
        const newArr = [...createChatCheckBox];
        newArr.push(false);
        return newArr;
      });
    });
  }, []);

  async function connect() {
    client.current = new Client();
    client.current.configure({
      brokerURL: 'wss://k7c207.p.ssafy.io:8080/api/ws-stomp/websocket',
      onConnect: () => {
        console.log('성공');
      },
      onChangeState: () => {
        console.log('change');
      },
      onDisconnect: () => {
        console.log('실패');
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
        console.log('Broker reported error: ' + frame.headers['message']);
        console.log('Additional details: ' + frame.body);
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
      method: 'get',
      url: chat.findAllRooms(),
    })
      .then(res => {
        console.log('방 정보 전체 출력', res.data);
        // setChatRoomList(res.data);
        const newArr = res.data;
        {
          newArr.map((item, idx) => {
            axios({
              method: 'get',
              url: chat.getInfo() + `${item.roomId}/${user.email}`,
            })
              .then(result => {
                console.log('getInfo', result.data);
                if (result.data.userId === user.email) {
                  setChatRoomList(chatRoomList => {
                    const newChatRoomList = [...chatRoomList];
                    newChatRoomList.push(item);
                    return newChatRoomList;
                  });
                }
              })
              .catch(e => {
                console.log(e);
              });
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  async function enterRoom(roomId, userId) {
    setRoomId(roomId);
    axios({
      method: 'get',
      url: chat.getInfo() + `${roomId}/${userId}`,
    })
      .then(res => {
        console.log('getInfo', res.data.isEnter, res.data.isSubscribe);
        if (res.data.isSubscribe === false) {
          axios({
            method: 'put',
            url: chat.updateSubscribeInfo() + `${roomId}/${userId}/`,
          })
            .then(() => {
              console.log('update Subscribe');
            })
            .catch(e => {
              console.log(e);
            })
            .finally(() => {
              subscribe(roomId, userId);
            });
        }

        if (res.data.isEnter === false) {
          axios({
            method: 'put',
            url: chat.updateEnterInfo() + `${roomId}/${userId}/`,
            // params: {
            //   roomId: roomId,
            //   userId: user,
            // },
          })
            .then(() => {
              console.log('update Enter');
            })
            .catch(e => {
              console.log(e);
            })
            .finally(() => {
              enter(roomId, userId);
            });
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  function sendMessage() {
    client.current.publish({
      destination: '/api/pub/chat/message',
      headers: {id: user.name},
      body: JSON.stringify({
        type: 'TALK',
        roomId: roomId,
        sender: user.email,
        message: message,
        userCount: userCount,
        name: user.name,
      }),
    });
    setMessage('');
  }

  function recvMessage(recv) {
    setMessages(messages => {
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
      '/api/sub/chat/room/' + roomId,
      body => {
        // console.log('body', body.body);
        const recv = JSON.parse(body.body);
        recvMessage(recv);
      },
      {id: user.name},
    );
  };

  const disconnect = () => {
    client.current.deactivate();
  };

  const handleChange = event => {
    //채팅 입력시 state에 값 설정
    setMessage(event);
  };

  const RoomNameChange = event => {
    setRoomName(event);
  };
  async function enter(roomId, userId) {
    await client.current.publish({
      destination: '/api/pub/chat/message',
      headers: {},
      body: JSON.stringify({
        type: 'ENTER',
        roomId: roomId,
        sender: userId,
        name: user.name,
      }),
    });
  }

  async function quit(roomId, userId) {
    await client.current.publish({
      destination: '/api/pub/chat/message',
      headers: {},
      body: JSON.stringify({
        type: 'QUIT',
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
    <View style={styles.container}>
      {/* 친구 목록 화면 */}
      {page === 'user' && (
        <View style={styles.container}>
          <View style={styles.leftBar}>
            <TouchableOpacity style={styles.leftBtn} activeOpacity={1}>
              <Icon name="person" size={40}></Icon>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.leftBtn}
              onPress={() => {
                setPage('chatRoomList');
                setChatRoomList([]);
                findAllRooms();
              }}>
              <Icon name="messenger-outline" size={40}></Icon>
            </TouchableOpacity>
          </View>
          <View style={styles.rightBar}>
            <FlatList
              style={styles.list}
              data={userList}
              keyExtractor={(item, idx) => idx}
              renderItem={({item}) => (
                <View style={styles.userListStyle}>
                  <View style={styles.userListDetailText}>
                    {<Image source={Truck} style={styles.image} />}
                    <Text style={styles.userListTextStyle}>
                      {item.name} {item.grade === 'MANAGER' && '관리자'}
                      {item.grade === 'DRIVER' && '드라이버'}
                    </Text>
                  </View>
                  {/* <View style={styles.userListDetailIcon}>
                    <TouchableOpacity>
                      <Icon name="phone-forwarded" size={30}></Icon>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        chatRoomList.forEach(value => {
                          subscribe(roomId, user.email);
                          setPage('chat');
                        });
                      }}>
                      <Icon
                        name="textsms"
                        size={30}
                        style={styles.userMessageIcon}></Icon>
                    </TouchableOpacity>
                  </View> */}
                </View>
              )}
            />
          </View>
        </View>
      )}
      {/* 친구 목록 화면 끝*/}

      {/* 채팅방 목록 화면 */}
      {page === 'chatRoomList' && (
        <View style={styles.container}>
          <View style={styles.leftBar}>
            <TouchableOpacity
              style={styles.leftBtn}
              onPress={() => {
                setPage('user');
              }}>
              <Icon name="person-outline" size={40}></Icon>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setChatRoomList([]);
                findAllRooms();
              }}
              style={styles.leftBtn}
              activeOpacity={1}>
              <Icon name="messenger" size={40}></Icon>
            </TouchableOpacity>
          </View>
          <View style={styles.rightBar}>
            <Pressable
              onPress={() => {
                setCreateChatVisible(!createChatVisible);
              }}>
              <View style={{alignItems: 'flex-end'}}>
                <Icon name="maps-ugc" size={40}></Icon>
              </View>
            </Pressable>
            <FlatList
              data={chatRoomList}
              keyExtractor={(item, idx) => idx}
              renderItem={({item}) => (
                <Pressable
                  activeOpacity={0.6}
                  onLongPress={() => {
                    console.log('방정보', item);
                    setQuitChatRoomInfo(() => {
                      return item;
                    });
                    setQuitChatVisible(!quitChatVisible);
                  }}
                  onPress={() => {
                    console.log(
                      'enterRoom에 보낼 데이터',
                      item.roomId,
                      user.email,
                    );
                    enterRoom(item.roomId, user.email);
                    setPage('chat');
                  }}>
                  {({pressed}) => (
                    <View
                      style={
                        pressed
                          ? styles.chatRoomListPressedStyle
                          : styles.chatRoomListStyle
                      }>
                      <View style={styles.profilePicture}>
                        <Icon name="person" size={30}></Icon>
                      </View>
                      <View style={styles.chatRoomDetail}>
                        <View style={styles.chatRoomDetailTop}>
                          <View style={{paddingLeft: 10}}>
                            <Text style={styles.chatRoomName}>
                              {item.roomName}
                            </Text>
                          </View>
                          <View>
                            <Text style={styles.chatRoomLastTime}>
                              {item.last_time}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.chatRoomDetailBottom}>
                          <Text style={styles.chatRoomLastMessage}>
                            {' '}
                            {item.last_message}{' '}
                          </Text>
                          <Text style={styles.chatRoomLastCount}>
                            {' '}
                            {item.last_count}{' '}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </Pressable>
              )}
            />
          </View>
        </View>
      )}
      {/* 채팅방 목록 화면 끝*/}

      {/* 채팅방 화면 */}
      {page === 'chat' && (
        <View style={styles.container}>
          <View style={styles.leftBar}>
            <TouchableOpacity
              style={styles.leftBtn}
              onPress={() => {
                setPage('user');
              }}>
              <Icon name="person-outline" size={40}></Icon>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.leftBtn}
              onPress={() => {
                setChatRoomList([]);
                findAllRooms();
                setPage('chatRoomList');
              }}>
              <Icon name="messenger" size={40}></Icon>
            </TouchableOpacity>
          </View>
          <View style={styles.rightBar}>
            <FlatList
              style={styles.chatHistroy}
              data={messages}
              keyExtractor={(item, index) => index}
              renderItem={({item}) => (
                <View>
                  {/*  */}
                  <View
                    style={
                      item.roomId === roomId && item.sender === user.email
                        ? styles.myChatComponent
                        : item.roomId === roomId && item.sender !== user.email
                        ? styles.otherChatComponent
                        : {}
                    }>
                    {/*  */}
                    {item.roomId === roomId &&
                      item.type === 'TALK' &&
                      item.sender !== user.email && (
                        <View style={styles.otherChatProfile}>
                          <Icon name="person" size={50}></Icon>
                        </View>
                      )}

                    <View
                      style={
                        (item.type === 'ENTER' || item.type === 'QUIT') && {
                          flex: 1,
                        }
                      }>
                      {/*  */}
                      {item.roomId === roomId &&
                        item.type === 'TALK' &&
                        item.sender !== user.email && (
                          <View style={styles.otherChatName}>
                            <Text style={{fontWeight: 'bold'}}>
                              {item.name}
                            </Text>
                          </View>
                        )}

                      {/*  */}
                      <View
                        style={
                          item.roomId === roomId && item.type === 'ENTER'
                            ? styles.noticeChat
                            : item.roomId === roomId &&
                              item.sender === user.email
                            ? styles.myChat
                            : item.roomId === roomId &&
                              item.sender !== user.email
                            ? styles.otherChat
                            : {}
                        }>
                        {item.roomId === roomId && item.type === 'ENTER' && (
                          <Text style={styles.noticeChatText}>
                            {item.name}님이 입장하셨습니다.
                          </Text>
                        )}

                        {/* */}
                        {item.roomId === roomId && item.type === 'TALK' && (
                          <Text
                            style={
                              item.sender === user.email
                                ? styles.myChatText
                                : styles.otherChatText
                            }>
                            {item.message}
                          </Text>
                        )}

                        {item.roomId === roomId && item.type === 'QUIT' && (
                          <Text style={styles.noticeChatText}>
                            {item.name}님이 퇴장하셨습니다.
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              )}></FlatList>
            <View style={styles.bottomContainer}>
              <AudioRecord propFunction={handleChange}></AudioRecord>
              <TextInput
                style={styles.messageInput}
                multiline={true}
                placeholder={'메세지를 입력하세요'}
                onChangeText={text => {
                  handleChange(text);
                }}
                value={message}></TextInput>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={sendMessage}
                disabled={message === ''}>
                <Text style={styles.buttonTextStyle}>전송</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {/* 채팅방 화면 끝 */}

      {/* 채팅방 생성 모달창 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={createChatVisible}
        onRequestClose={() => {
          setCreateChatVisible(!createChatVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.createRoomNameLayout}>
              <Text>방 제목</Text>
              <TextInput
                style={styles.roomNameInput}
                placeholder={'방 제목을 입력하세요'}
                placeholderTextColor={roomNamePlaceholder}
                onChangeText={text => {
                  RoomNameChange(text);
                }}
                value={roomName}
                maxLength={45}></TextInput>
            </View>
            <FlatList
              contentContainerStyle={{}}
              data={userList}
              keyExtractor={(item, index) => index}
              renderItem={({item, index}) => (
                <View style={styles.createChatListStyle}>
                  <View style={styles.userListDetailText}>
                    <Icon name="person" size={30}></Icon>
                    <Text style={styles.userListTextStyle}>
                      {item.name} {item.grade === 'MANAGER' && '관리자'}
                      {item.grade === 'DRIVER' && '드라이버'}
                    </Text>
                  </View>
                  <View style={styles.userListDetailIcon}>
                    <CheckBox
                      value={createChatCheckBox[index]}
                      onValueChange={newValue => {
                        setCreateChatCheckBox(el => {
                          const newArr = [...el];
                          newArr[index] = !newArr[index];
                          return newArr;
                        });
                      }}
                    />
                  </View>
                </View>
              )}
            />

            <View style={styles.buttonLayout}>
              <Pressable
                style={styles.submitButton}
                onPress={async () => {
                  if (roomName === '') {
                    setRoomNamePlaceholder('red');
                  } else {
                    await axios({
                      method: 'post',
                      url: chat.createRoom(),
                      params: {
                        name: roomName,
                        userId: user.email,
                      },
                    })
                      .then(res => {
                        console.log('결과확인', res.data.roomId, user.email);

                        createChatCheckBox.map((item, idx) => {
                          if (item === true) {
                            axios({
                              method: 'post',
                              url:
                                chat.invite() +
                                `${res.data.roomId}/${userList[idx].email}/`,
                            })
                              .then(res => {
                                console.log('초대', res.data);
                              })
                              .catch(e => {
                                console.log(e);
                              });
                          }
                        });
                      })
                      .catch(e => {
                        console.log(e);
                      });
                    createChatCheckBox.map((item, idx) => {
                      if (item === true) {
                        setCreateChatCheckBox(createChatCheckBox => {
                          const newArr = [...createChatCheckBox];
                          newArr[idx] = false;
                          return newArr;
                        });
                      }
                    });
                    setCreateChatVisible(!createChatVisible);
                    setRoomName('');
                    setRoomNamePlaceholder('black');
                    setChatRoomList([]);
                    findAllRooms();
                  }
                }}>
                <Text style={styles.createChatButtonTextStyle}>초대</Text>
              </Pressable>
              <Pressable
                style={styles.cancelButton}
                onPress={() => {
                  createChatCheckBox.map((item, idx) => {
                    if (item === true) {
                      setCreateChatCheckBox(createChatCheckBox => {
                        const newArr = [...createChatCheckBox];
                        newArr[idx] = false;
                        return newArr;
                      });
                    }
                  });
                  setCreateChatVisible(!createChatVisible);
                  setRoomName('');
                  setRoomNamePlaceholder('black');
                }}>
                <Text style={styles.createChatButtonTextStyle}>취소</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* 채팅방 생성 모달창 끝 */}

      {/* 채팅방 수정/나가기 모달창 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={quitChatVisible}
        onRequestClose={() => {
          setQuitChatRoomInfo({});
          setQuitChatVisible(!quitChatVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.quitModalView}>
            <View style={styles.roomNmaeModal}>
              <Text style={styles.roomNameModalText}>
                {quitChatRoomInfo.roomName}
              </Text>
            </View>
            <Pressable onPress={() => {}}>
              {({pressed}) => (
                <View
                  style={
                    pressed
                      ? styles.roomNameChangePressed
                      : styles.roomNameChange
                  }>
                  <Text style={styles.roomNameChangeText}>
                    채팅방 이름 변경
                  </Text>
                </View>
              )}
            </Pressable>
            <Pressable
              onPress={() => {
                axios({
                  method: 'delete',
                  url:
                    chat.exitRoom() +
                    `${quitChatRoomInfo.roomId}/${user.email}`,
                })
                  .then(res => {
                    console.log('채팅방 삭제', res.data);
                    quit(quitChatRoomInfo.roomId, user.email);
                  })
                  .catch(e => {
                    console.log(e);
                  });
                setChatRoomList([]);
                findAllRooms();
                setQuitChatRoomInfo({});
                setQuitChatVisible(!quitChatVisible);
              }}>
              {({pressed}) => (
                <View
                  style={pressed ? styles.exitRoomPressed : styles.exitRoom}>
                  <Text style={styles.exitRoomText}>채팅방 나가기</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* 채팅방 수정/나가기 모달창 끝 */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  leftBar: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    marginRight: 2,
    borderBottomLeftRadius: 10,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 7,
    shadowOpacity: 0.4,
  },
  leftBtn: {
    paddingTop: 10,
  },
  rightBar: {
    flex: 6,
  },
  userListStyle: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    marginVertical: 1,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 4,
    shadowOpacity: 0.4,
  },
  userListDetailText: {
    flex: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userListTextStyle: {
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  userListDetailIcon: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  userMessageIcon: {
    paddingLeft: 10,
  },
  chatRoomListStyle: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    marginVertical: 1,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 4,
    shadowOpacity: 0.4,
  },
  chatRoomListPressedStyle: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#BDBDBD',
    marginVertical: 1,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 4,
    shadowOpacity: 0.4,
  },
  chatRoomDetail: {
    flex: 1,
    flexDirection: 'column',
  },
  chatRoomDetailTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chatRoomDetailBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chatRoomName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatRoomLastTime: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  chatRoomLastMessage: {
    fontSize: 18,
  },
  chatRoomLastCount: {
    fontSize: 18,
    color: 'red',
  },
  titleText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  chatRoomList: {},
  chatRoom: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 5,
  },
  chatHistroy: {
    flex: 1,
  },
  myChatComponent: {
    flex: 1,
    flexDirection: 'row-reverse',
  },
  otherChatComponent: {
    flex: 1,
    flexDirection: 'row',
  },
  otherChatProfile: {
    maxWidth: SCREEN_WIDTH / 7,
  },
  otherChatName: {
    marginLeft: 2,
    paddingLeft: 2,
  },
  noticeChat: {
    flex: 1,
    margin: 1,
    alignItems: 'center',
  },
  myChat: {
    maxWidth: (SCREEN_WIDTH * 4) / 7,
    backgroundColor: '#58ACFA',
    borderRadius: 10,
    margin: 5,
    padding: 7,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 4,
    shadowOpacity: 0.4,
  },
  otherChat: {
    flex: 1,
    maxWidth: (SCREEN_WIDTH * 4) / 7,
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 5,
    padding: 7,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 4,
    shadowOpacity: 0.4,
  },

  noticeChatText: {
    fontSize: 16,
    color: '#BDBDBD',
    fontWeight: 'bold',
  },
  myChatText: {
    fontSize: 16,
    color: 'white',
  },
  otherChatText: {
    fontSize: 16,
    color: 'black',
  },
  bottomContainer: {
    flexDirection: 'row',
  },
  messageInput: {
    flex: 5,
    maxHeight: SCREEN_HEIGHT / 7.3,
    fontSize: 15,
    borderTopLeftRadius: 10,
    backgroundColor: 'white',
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 10,
    shadowOpacity: 0.4,
  },
  buttonStyle: {
    backgroundColor: 'black',

    paddingHorizontal: 10,
    justifyContent: 'center',
  },

  buttonTextStyle: {
    color: 'white',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
  },
  createChatListStyle: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 1,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 4,
    shadowOpacity: 0.4,
  },
  buttonLayout: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  submitButton: {
    alignItems: 'center',
    padding: 10,
    margin: 10,
    backgroundColor: '#58ACFA',
  },
  cancelButton: {
    alignItems: 'center',
    padding: 10,
    margin: 10,
    backgroundColor: 'red',
  },
  createChatButtonTextStyle: {
    fontSize: 16,
    color: 'white',
  },
  createRoomNameLayout: {
    margin: 10,
    alignItems: 'center',
  },
  roomNameInput: {
    fontSize: 15,
  },
  quitModalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  roomNmaeModal: {
    padding: 12,
    marginHorizontal: 3,
  },
  roomNameModalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  roomNameChange: {
    padding: 12,
    marginHorizontal: 3,
  },
  roomNameChangePressed: {
    backgroundColor: '#E6E6E6',
    padding: 12,
    marginHorizontal: 3,
  },
  roomNameChangeText: {
    fontSize: 16,
  },
  exitRoom: {
    padding: 12,
    marginHorizontal: 3,
  },
  exitRoomPressed: {
    backgroundColor: '#E6E6E6',
    padding: 12,
    marginHorizontal: 3,
  },
  exitRoomText: {
    fontSize: 16,
  },
  image: {
    resizeMode: 'stretch',
    width: 50,
    height: 40,
  },
});

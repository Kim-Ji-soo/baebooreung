import {Client} from '@stomp/stompjs';
import { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView,TouchableOpacity,FlatList,TextInput,Pressable } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BottomTabBarHeightCallbackContext } from '@react-navigation/bottom-tabs';

export default function Chat(){
    const [chatRoomList, setChatRoomList] = useState([
        {id : 1, chatroom_name : "김싸피", last_message : "점심1 배달 완료했습니다.", last_time : "오후 1시 12분", last_count : 2}, 
        {id :2, chatroom_name : "박싸피", last_message : "점심2 배달 완료했습니다.", last_time : "오후 1시 30분", last_count : 1}, 
        {id:3, chatroom_name : "이싸피", last_message : "저녁1 배달 완료했습니다.", last_time : "어제", last_count : 1}]);
    const [chatList, setChatList] = useState([]);
    const [chat, setChat] = useState('');
    const [page, setPage] = useState('user');
    const [userList, setUserList] = useState([{user_id :"kimssafy", grade : "드라이버", name : "김싸피", phone :"010-1111-1111", region : 1}, {user_id :"parkssafy", grade : "드라이버", name : "박싸피", phone :"010-2222-2222", region : 2},{user_id :"leessafy", grade : "관리자", name : "이싸피", phone :"010-3333-3333", region : 3}]);
    const [id, setId] = useState(0);
    const {apply_id} = "user"
    const client = useRef({});
    
    const connect = () =>{
        console.log(client.current);
        client.current = new Client({
            brokerURL : 'wss://k7c207.p.ssafy.io:8080/ws-stomp/websocket',
            onConnect : () =>{
                console.log('성공');
                subscribe();
            },
            logRawCommunication: true,
            connectHeaders: {
                login: 'user',
                passcode: 'password',
              },
            onStompError:  function (frame) {
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
        console.log(client.current);
        console.log(client.current.brokerURL);
        console.log(client.current.connected);
        client.current.activate();
        console.log(client.current.connected);
    }

    const publish = (chat) =>{
        if(!client.current.connected) return;
            console.log(chat);
            client.current.publish({
            destination : '/pub/chat',
            body : JSON.stringify({
                applyId : apply_id,
                chat : chat,
            })
        });
        setChat('');
    }

    const subscribe = () =>{
        client.current.subscribe('/sub/chat/'+apply_id,(body) =>{
            const json_body = JSON.parse(body.body);
            setChatList((_chat_list)=>[
                ..._chat_list, json_body
            ]);
        });
    };

    const disconnect = () =>{
        client.current.deactivate();
    }

    const handleChange = (event) =>{
        //채팅 입력시 state에 값 설정
        console.log("handleChange : "+ event);
        setChat(event);
    }

    const handleSubmit =(event,chat) =>{
        //보내기 버튼 눌렀을 경우 publish
        console.log(event);
        console.log("handleSubmit : "+chat);
        publish(chat);
    }

    useEffect(()=>{
        connect();
        return () => disconnect();
    },[]);

    return(
        <View style={styles.container}>
        {page === 'user' &&
            <View style={styles.container}>
            <View style={styles.leftBar}>
                <TouchableOpacity style={styles.leftBtn} activeOpacity={1}>
                    <Icon name="person" size={40}></Icon>
                </TouchableOpacity>
                <TouchableOpacity style={styles.leftBtn} onPress={()=>{
                    setPage('chatRoomList')
                }}>
                    <Icon name="messenger-outline" size={40}></Icon>
                </TouchableOpacity>
            </View>
            <View style={styles.rightBar}>
                <FlatList
                style={styles.list}
                data={userList}
                keyExtractor={item => item.user_id}
                renderItem={({item}) =>
                    <View style={styles.userListStyle}>
                        <View style={styles.userListDetailText}>
                            <Icon name="person" size={40}></Icon>
                            <Text style={styles.userListTextStyle}>{item.name} {item.grade}</Text>
                        </View>
                        <View style={styles.userListDetailIcon}>
                            <TouchableOpacity>
                                <Icon name="phone-forwarded" size={40}></Icon>
                            </TouchableOpacity>
                            <TouchableOpacity  onPress={ () =>{
                                chatRoomList.forEach((value)=>{
                                    if(value.chatroom_name === item.username){
                                        //만약 해당 채팅방이 존재한다면 그냥 그 채팅방 사용
                                        setPage('chat');
                                    }
                                })
                                //만약 해당 유저에대한 채팅방이 존재하지 않는다면 새로운 채팅방 생성
                                setPage('chat');
                            }}>
                                <Icon name="textsms" size={40}></Icon>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                />
            </View>
            </View>
        }
        {page === 'chatRoomList' &&
            <View style={styles.container}>
                <View style={styles.leftBar}>
                    <TouchableOpacity style={styles.leftBtn} onPress={()=>{
                        setPage('user')
                    }}>
                        <Icon name="person-outline" size={40}></Icon>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.leftBtn} activeOpacity={1}>
                        <Icon name="messenger" size={40}></Icon>
                    </TouchableOpacity>
                </View>
                <View style={styles.rightBar}>
                    <FlatList
                    style={styles.list}
                    data={chatRoomList}
                    keyExtractor={item => item.id}
                    renderItem={({item}) =>
                        <TouchableOpacity onPress={()=>{
                            setPage('chat');
                            setId(item.id);
                        }}>
                            <View style={styles.chatRoomListStyle}>
                                <View style={styles.profilePicture}>
                                    <Icon name="person" size={60}></Icon>
                                </View>
                                <View style={styles.chatRoomDetail}>
                                    <View style={styles.chatRoomDetailTop}>
                                        <View><Text style={styles.chatRoomName}>{item.chatroom_name}</Text></View>
                                        <View><Text style={styles.chatRoomLastTime}>{item.last_time}</Text></View>
                                    </View>
                                    <View style={styles.chatRoomDetailBottom}>
                                    <Text style={styles.chatRoomLastMessage}> {item.last_message} </Text>
                                    <Text style={styles.chatRoomLastCount}> {item.last_count} </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                    />
                </View>
            </View>
        }
        {page === 'chat' &&
            <View style={styles.container}>
                <View style={styles.leftBar}>
                    <TouchableOpacity style={styles.leftBtn} onPress={()=>{
                        setPage('user')
                        setId('')
                    }}>
                        <Icon name="person-outline" size={40}></Icon>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.leftBtn} onPress={()=>{
                        setPage('chatRoomList')
                        setId('')
                    }}>
                        <Icon name="messenger" size={40}></Icon>
                    </TouchableOpacity>
                </View>
            <View style={styles.rightBar}>
            <FlatList
            style={styles.list}
            data={chatList}
            keyExtractor={item => item.id}
            renderItem={({item}) =>
                item.user == userId ? (
                <Text style={styles.myChat}>{item.message}</Text>
                ) : (
                <Text style={styles.otherChat}>{item.message}</Text>
                )
            }
            />
              <View style={styles.bottomContainer}>
                <TextInput
                style={styles.input}
                placeholder={'Add Message'}
                onChangeText={text => {
                    handleChange(text);
                }}
                value={chat}></TextInput>
                <TouchableOpacity style={styles.buttonStyle} onPress={handleSubmit} disabled={chat === ''}>
                <Text style={styles.buttonTextStyle}>Send</Text>
                </TouchableOpacity>
            </View>
            </View>
            </View>
        }

    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex :1,
        flexDirection: 'row',
    },
    leftBar : {
        flex :1,
        flexDirection : 'column',
        alignItems :'center',
        borderWidth : 1,

    },
    leftBtn :{
        paddingTop : 10,
    },
    rightBar : {
        flex :6,
        flexDirection :'column',
        borderRightWidth : 1,
        borderTopWidth :1,
        borderBottomWidth :1,
    },
    userListStyle:{
        flexDirection : 'row',
        justifyContent : 'space-evenly',
        paddingVertical :10,
        paddingHorizontal :10,
        borderWidth :1,
    },
    userListDetailText : {
        flex :5,
        flexDirection : 'row',
        justifyContent : 'flex-start'
    },
    userListTextStyle : {
        paddingLeft :10,
        fontSize : 22,
        fontWeight : 'bold',
    },
    userListDetailIcon : {
        flex :2,
        flexDirection : 'row',
        justifyContent : 'space-between',
    },
    chatRoomListStyle : {
        flexDirection : 'row',
        paddingVertical :10,
        paddingHorizontal :10,
        borderWidth :1,
    },
    chatRoomDetail : {
        flex :1,
        flexDirection :'column',
    },
    chatRoomDetailTop : {
        flexDirection : 'row',
        justifyContent : 'space-between'
        
    },
    chatRoomDetailBottom : {
        flexDirection : 'row',
        justifyContent : 'space-between'
    },
    chatRoomName : {
        fontSize : 25,
        fontWeight : 'bold',
    },
    chatRoomLastTime : {
        fontSize : 15,
        fontWeight : 'bold'
    },
    chatRoomLastMessage : {
        fontSize : 18,
    },
    chatRoomLastCount : {
        fontSize : 18,
        color : 'red'
    },
    titleText : {
        fontSize :22,
        textAlign : 'center',
        fontWeight :'bold'
    },
    chatRoomList : {
        
    },
    chatRoom : {
        fontSize : 20,
        textAlign : 'center',
        marginVertical :5,
    },
    bottomContainer:{
        backgroundColor : 'green'
    },

    buttonStyle : {
        backgroundColor :'#000',
        marginTop :15,
        padding :10,
        marginRight :10,
        marginLeft :10,
    },

    buttonTextStyle:{
        color :'white',
    },

});

  
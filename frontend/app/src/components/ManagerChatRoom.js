import { useRef, useState, useEffect } from 'react';
import {Client} from '@stomp/stompjs';
import SockJs from 'socketjs-client';
import { StyleSheet,View,TouchableOpacity, FlatList,Text, TextInput} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { chat } from '../api/api';
import axios from 'axios';

export default function ManagerChatRoom({navigation, ID}) {

    const [roomId, setRoomId] = useState(ID);
    const [room, setRoom] = useState({});
    const [sender, setSender] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const client = useRef({});

    function findRoom(){
        axios({
            method : "get",
            url : chat.findRoom(),
            params :{
                roomId : ID
            }
        }).then((res)=>{
            setRoom(res.data);
        }).catch((e)=>{
            console.log(roomId);
            console.log("에러")
            console.log(e)
        });
    }

    const handleSubmit =(event,chat) =>{
        //보내기 버튼 눌렀을 경우 publish
        console.log(event);
        console.log("handleSubmit : "+chat);
        publish(chat);
    }

    function sendMessage(){
        client.current.send("pub/chat/message",{}, JSON.stringify({type:'TALK',roomId:roomId,sender:sender,message:message}));
        setMessage('');
    }

    function recvMessage(recv){
        setMessages((messages)=>{
            const newMessages = [...messages];
            newMessages.unshift({type : recv.type, sender : recv.type==='ENTER'?"[알림]":recv.sender, message : recv.message})
            return newMessages;
        })
    }

     async function connect() {
        client.current = new Client();
        client.current.configure({
            brokerURL : 'wss://k7c207.p.ssafy.io:8080/ws-stomp/websocket',
            onConnect : () =>{
                console.log('성공');
                subscribe();
            },
            onDisconnect : () =>{
                console.log('실패');
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
        await client.current.activate();
        await subscribe();
        // client.subscribe("sub/chat/room"+roomId, function(message){
        //     const recv = JSON.parse(message.body);
        //     recvMessage(recv);
        // })
    }

    const publish = (chat) =>{
        if(!client.current.connected) return;
            console.log(chat);
            client.current.publish({
            destination : '/pub/chat/message',
            body : JSON.stringify({
                applyId : apply_id,
                chat : chat,
            })
        });
        setMessage('');
    }

    const subscribe = () =>{
        client.current.subscribe('/sub/chat/room/'+roomId,(body) =>{
            const recv = JSON.parse(body.body);
            recvMessage(recv);
            // const json_body = JSON.parse(body.body);
            // setChatList((_chat_list)=>[
            //     ..._chat_list, json_body
            // ]);
        });
    };

    const disconnect = () =>{
        client.current.deactivate();
    }

    const handleChange = (event) =>{
        //채팅 입력시 state에 값 설정
        console.log("handleChange : "+ event);
        setMessage(event);
    }


    useEffect(()=>{
        const p1 = new Promise(function(resolve, reject){
            connect();
        })
        p1.then(function(val){
            subscribe()});
       
        return () => disconnect();    
    },[]);

    useEffect(()=>{
        console.log(client.current.connected)
    },[messages]);

    return (
    <View style={styles.container}>
        <View style={styles.rightBar}>
        <FlatList
        style={styles.list}
        data={messages}
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
            value={message}></TextInput>
            <TouchableOpacity style={styles.buttonStyle} onPress={sendMessage} disabled={message === ''}>
            <Text style={styles.buttonTextStyle}>Send</Text>
            </TouchableOpacity>
        </View>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex :1,
        flexDirection: 'row',
    },
    rightBar : {
        flex :6,
        flexDirection :'column',
        borderRightWidth : 1,
        borderTopWidth :1,
        borderBottomWidth :1,
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
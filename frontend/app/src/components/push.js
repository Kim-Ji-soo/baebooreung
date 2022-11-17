import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {setFcmToken} from '../redux/auth';
import {Alert} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import axios from 'axios';
import {camera_service} from '../api/api';
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

function getFCMToken() {
  messaging()
    .getToken()
    .then(token => {
      console.log('fcmToken', JSON.stringify(token));
      const fcmToken = JSON.stringify(token);
    });
}

export function NotificationListener(userId, routeId, delName) {
  console.log('notification is listening...');
  console.log('parameters----->', userId, routeId, delName);
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });
  messaging().onMessage(async remoteMessage => {
    console.log('notification on froground state.....', remoteMessage);
    // Alert.alert(
    //   {delName} + remoteMessage.notification.title,
    //   remoteMessage.notification.body,
    //   [
    //     {
    //       text: '아니요',
    //       onPress: () => console.log('아니라는데'), //onPress 이벤트시 콘솔창에 로그를 찍는다
    //       style: 'cancel',
    //     },
    //     {
    //       text: '네',
    //       onPress: () => {
    //         const image = {
    //           uri: '',
    //           type: 'image/jpeg',
    //           name: 'test',
    //         };
    //         launchCamera({}, res => {
    //           if (res.didCancel) {
    //             console.log('user cancelled image Picker');
    //           } else if (res.errorCode) {
    //             console.log('ImagePicker Error: ', res.errorCode);
    //           } else if (res.assets) {
    //             //정상적으로 사진을 반환 받았을 때
    //             console.log('ImagePicker res', res);
    //             image.name = res.assets[0].fileName;
    //             image.type = res.assets[0].type;
    //             image.uri = res.assets[0].uri;
    //           }
    //           const formdata = new FormData();
    //           formdata.append('image', image);
    //           formdata.append('delId', routeId); //delId 값 넣으면 됩니당
    //           axios({
    //             method: 'post',
    //             url: camera_service.uploadCheckIn(),
    //             data: formdata,
    //             headers: {
    //               'Content-Type': 'multipart/form-data',
    //             },
    //             transformRequest: (data, headers) => {
    //               return data;
    //             },
    //           })
    //             .then(res => {
    //               console.log('체크인 이미지 업로드');
    //               axios({
    //                 method: 'get',
    //                 url: camera_service.getCheckIn(),
    //                 params: {
    //                   delId: routeId, // delId 값 넣으면 됩니당
    //                 },
    //               })
    //                 .then(result => {
    //                   console.log('체크인 이미지 가져오기', result.data);
    //                   checkin(userId, routeId, result.data);
    //                 })
    //                 .catch(e => {
    //                   console.log(e);
    //                 });
    //             })
    //             .catch(e => {
    //               console.log(e);
    //             });
    //         });
    //       },
    //     }, //버튼 제목
    //   ],
    //   {cancelable: false},
    // );
  });
}

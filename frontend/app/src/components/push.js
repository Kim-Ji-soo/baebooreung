import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import axios from 'axios';
import {camera_service} from '../api/api';
import {business_service} from '../api/api';
import Geolocation from 'react-native-geolocation-service';
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

function checkin(
  userId,
  deliveryId,
  RouteId,
  image,
  navigation,
  delName,
  watchId,
  dispatch,
  setLunchDone,
  setDinnerDone,
  lunchRouteId,
  dinnerRouteId,
) {
  axios({
    method: 'post',
    url: business_service.checkIn() + `${userId}`,
    data: {
      deliveryId: deliveryId,
      img: image,
    },
  })
    .then(res => {
      console.log('체크인 성공--------->', res.data);
      Alert.alert('체크인', `${delName} 체크인이 완료 되었습니다. `);
      if (res.data.deliveryId === -1) {
        Alert.alert(
          '배송 완료',
          '업무를 종료하시겠습니까?',
          [
            {
              text: '아니오',
              style: 'cancel',
            },
            {
              text: '예',
              onPress: () => {
                axios({
                  url:
                    business_service.workDone() +
                    `${userId}` +
                    '/end/' +
                    `${RouteId}`,
                  method: 'put',
                })
                  .then(res => {
                    console.log('업무종료', res.data);
                    Alert.alert('업무 종료', '업무가 종료되었습니다');
                    if (RouteId === lunchRouteId) {
                      dispatch(setLunchDone(true));
                    } else {
                      dispatch(setDinnerDone(true));
                    }
                    navigation.reset({routes: [{name: 'home'}]});
                    if (watchId !== null) {
                      Geolocation.clearWatch(watchId);
                      console.log('tracking location stop');
                    }
                  })
                  .catch(Err => {
                    console.log('workDone is error', Err);
                    Alert.alert('업무 종료 실패', '관리자에게 문의해주세요');
                    navigation.reset({routes: [{name: 'home'}]});
                  });
              },
            },
          ],
          {cancelable: false},
        );
      }
      // setIsCheckIn(true);
      // setCheckMessage('체크인 성공');
    })
    .catch(err => {
      Alert.alert(
        '체크인',
        `${delName} 체크인이 실패했습니다. 관리자에게 문의 해주세요.`,
      );
      console.log('체크인 실패', err);
    });
}

export function NotificationListener(
  userId,
  deliveryId,
  RouteId,
  delName,
  pageIndex,
  sequence,
  navigation,
  watchId,
  dispatch,
  setLunchDone,
  setDinnerDone,
  lunchRouteId,
  dinnerRouteId,
) {
  console.log('notification is listening...');
  if (pageIndex) {
    console.log(
      'parameters----->',
      userId,
      deliveryId,
      RouteId,
      delName,
      pageIndex.current.getCurrentIndex(),
      sequence,
    );
  }
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
    if (pageIndex.current.getCurrentIndex() + 1 === sequence) {
      Alert.alert(
        {delName} + remoteMessage.notification.title,
        remoteMessage.notification.body,
        [
          {
            text: '아니요',
            onPress: () => console.log('취소'), //onPress 이벤트시 콘솔창에 로그를 찍는다
            style: 'cancel',
          },
          {
            text: '네',
            onPress: () => {
              const image = {
                uri: '',
                type: 'image/jpeg',
                name: 'test',
              };
              launchCamera({}, res => {
                if (res.didCancel) {
                  console.log('user cancelled image Picker');
                } else if (res.errorCode) {
                  console.log('ImagePicker Error: ', res.errorCode);
                } else if (res.assets) {
                  //정상적으로 사진을 반환 받았을 때
                  console.log('ImagePicker res', res);
                  image.name = res.assets[0].fileName;
                  image.type = res.assets[0].type;
                  image.uri = res.assets[0].uri;
                }
                const formdata = new FormData();
                formdata.append('image', image);
                formdata.append('delId', deliveryId); //delId 값 넣으면 됩니당
                axios({
                  method: 'post',
                  url: camera_service.uploadCheckIn(),
                  data: formdata,
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                  transformRequest: (data, headers) => {
                    return data;
                  },
                })
                  .then(res => {
                    console.log('체크인 이미지 업로드');
                    axios({
                      method: 'get',
                      url: camera_service.getCheckIn(),
                      params: {
                        delId: deliveryId, // delId 값 넣으면 됩니당
                      },
                    })
                      .then(result => {
                        console.log('체크인 이미지 가져오기', result.data);
                        checkin(
                          userId,
                          deliveryId,
                          RouteId,
                          result.data,
                          navigation,
                          delName,
                          watchId,
                          dispatch,
                          setLunchDone,
                          setDinnerDone,
                          lunchRouteId,
                          dinnerRouteId,
                        );
                      })
                      .catch(e => {
                        console.log(e);
                      });
                  })
                  .catch(e => {
                    console.log(e);
                  });
              });
            },
          }, //버튼 제목
        ],
        {cancelable: false},
      );
    }
  });
}

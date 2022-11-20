import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import camera from '../assets/images/camera.png';
import {useEffect} from 'react';
import {requestStoragePermission} from '../utils/permission';
import {camera_service, business_service} from '../api/api';
import axios from 'axios';
import Cam from '../components/Cam';
import NaverMapView, {Marker, Path} from 'react-native-nmap';
import {launchCamera} from 'react-native-image-picker';
import {useSelector, useDispatch} from 'react-redux';
import {NotificationListener} from './push';
import {useNavigation} from '@react-navigation/native';
import {setLunchDone, setDinnerDone, setWorkDone} from '../redux/work';
import Geolocation from 'react-native-geolocation-service';

const DetailJob = props => {
  const dispatch = useDispatch();
  const watchId = useSelector(state => state.gps.watchId);
  const lat = useSelector(state => state.gps.lat);
  const lng = useSelector(state => state.gps.lng);
  const [targetLocation, setTargetLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(false);
  const [markerCoords, setMarkerCoords] = useState(false);
  //<-------------------------checkin---------------------------->
  const userId = useSelector(state => state.auth.id);
  const [isCheckIn, setIsCheckIn] = useState(false);
  const [checkMessage, setCheckMessage] = useState('');
  const navigation = useNavigation();
  const [path, setPath] = useState(false);
  const lunchRouteId = useSelector(state => state.work.lunchRouteId);
  const dinnerRouteId = useSelector(state => state.work.dinnerRouteId);
  function checkin2(userId, deliveryId, image) {
    axios({
      method: 'post',
      url: business_service.checkIn() + `${userId}`,
      data: {
        deliveryId: deliveryId,
        img: image,
      },
    })
      .then(res => {
        // Alert.alert(
        //   '체크인',
        //   `[${props.item.delName}] 체크인이 완료 되었습니다. 다음 배송지로 이동해주세요.`,
        // );
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
                      `${props.RouteId}`,
                    method: 'put',
                  })
                    .then(res => {
                      console.log('업무종료', res.data);
                      Alert.alert('업무 종료', '업무가 종료되었습니다');
                      if (props.RouteId === lunchRouteId) {
                        dispatch(setLunchDone(true));
                      } else {
                        dispatch(setDinnerDone(true));
                      }
                      navigation.navigate('home');
                      if (watchId !== null) {
                        Geolocation.clearWatch(watchId);
                        console.log('tracking location stop');
                      }
                    })
                    .catch(Err => {
                      console.log('workDone is error', Err);
                      Alert.alert('업무 종료 실패', '관리자에게 문의해주세요');
                    });
                },
              },
            ],
            {cancelable: false},
          );
        }
        Alert.alert(
          '체크인',
          `[${props.item.delName}] 체크인이 완료 되었습니다. 다음 배송지로 이동해주세요.`,
        );
        setIsCheckIn(true);
        setCheckMessage('체크인 성공');
      })
      .catch(err => {
        Alert.alert(
          '체크인',
          `${props.item.delName} 체크인이 실패 했습니다. 관리자에게 문의해주세요.`,
        );
        console.log('체크인 실패', err);
        setIsCheckIn(false);
        setCheckMessage('체크인 실패');
      });
  }
  //<---------------------------cam------------------------------>
  function activeCam() {
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
      formdata.append('delId', props.item.id); //delId 값 넣으면 됩니당
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
              delId: props.item.id, // delId 값 넣으면 됩니당
            },
          })
            .then(result => {
              console.log('체크인 이미지 가져오기', result.data);
              checkin2(userId, props.item.id, result.data);
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(e => {
          console.log(e);
        });
    });
    return <Cam />;
  }

  useEffect(() => {
    requestStoragePermission();
    NotificationListener(
      userId,
      props.item.id,
      props.RouteId,
      props.item.delName,
      props.scrollRef,
      props.item.sequence,
      navigation,
      watchId,
      dispatch,
      setLunchDone,
      setDinnerDone,
      lunchRouteId,
      dinnerRouteId,
    );
  }, []);

  useEffect(() => {
    setTargetLocation(
      String(props.item.longitude) + ',' + String(props.item.latitude),
    );
    if (props !== undefined) {
      // NotificationListener();
    }
  }, []);

  useEffect(() => {
    if (lat !== 0 && lng !== 0) {
      setCurrentLocation(String(String(lng) + ',' + String(lat)));
      setMarkerCoords({
        latitude: lat,
        longitude: lng,
      });
    }
  }, [lat, lng]);

  // console.log('targetLocation', targetLocation);
  // console.log('currentLocation ---->', currentLocation);

  function reDefine(data) {
    let reDefineData = [];
    data.map((e, index) => {
      reDefineData.push({latitude: e[1], longitude: e[0]});
    });
    // console.log(reDefineData);
    return reDefineData;
  }

  const apiData = {
    start: currentLocation,
    goal: targetLocation,
    option: 'traoptimal',
  };

  function getDrawingData() {
    axios({
      method: 'post',
      url: 'https://k7c207.p.ssafy.io:8000/user-service/map',
      data: apiData,
    })
      .then(res => {
        // console.log('DrawingData ?');
        console.log('경로 데이터 성공');
        // console.log(res.data.route.trafast[0].path);
        const route = res.data.route.traoptimal[0].path;
        const redefineData = reDefine(route);
        setPath(redefineData);
      })
      .catch(err => {
        console.log('경로 데이터 에러');
        console.log(err);
      });
  }
  useEffect(() => {
    if (currentLocation !== false) {
      getDrawingData();
    }
  }, [currentLocation]);

  return (
    <View style={styles.DetailJobcontainer}>
      <Text style={styles.headerText}>배송 안내</Text>
      <View style={styles.MapContainer}>
        {markerCoords !== false ? (
          <NaverMapView
            style={{
              width: '100%',
              height: '100%',
            }}
            center={{...markerCoords, zoom: 14}}>
            <Marker
              coordinate={{latitude: lat, longitude: lng}}
              width={40}
              height={40}>
              <View
                style={{
                  // backgroundColor: 'rgba(255,0,0,0.2)',
                  borderRadius: 80,
                }}>
                <View
                  style={{
                    // backgroundColor: 'rgba(0,0,255,0.3)',
                    // borderWidth: 2,
                    borderColor: 'black',
                    flexDirection: 'row',
                  }}>
                  <Image
                    source={require('../assets/images/shuttle.png')}
                    style={{
                      width: 40,
                      height: 40,
                      // backgroundColor: 'rgba(0,0,0,0.2)',
                      resizeMode: 'stretch',
                      // borderWidth: 2,
                      // borderColor: 'black',
                    }}
                    fadeDuration={0}
                  />
                </View>
                {/* <ImageBackground
                        source={require('../assets/images/favorite.png')}
                        style={{width: 64, height: 64}}>
                        <Text>image background</Text>
                      </ImageBackground> */}
              </View>
            </Marker>
            <Marker
              coordinate={{
                latitude: props.item.latitude,
                longitude: props.item.longitude,
              }}
              width={40}
              height={40}>
              <View
                style={{
                  // backgroundColor: 'rgba(255,0,0,0.2)',
                  borderRadius: 80,
                }}>
                <View
                  style={{
                    // backgroundColor: 'rgba(0,0,255,0.3)',
                    // borderWidth: 2,
                    borderColor: 'black',
                    flexDirection: 'row',
                  }}>
                  <Image
                    source={require('../assets/images/shop.png')}
                    style={{
                      width: 40,
                      height: 40,
                      // backgroundColor: 'rgba(0,0,0,0.2)',
                      resizeMode: 'stretch',
                      // borderWidth: 2,
                      // borderColor: 'black',
                    }}
                    fadeDuration={0}
                  />
                </View>
                {/* <ImageBackground
                        source={require('../assets/images/favorite.png')}
                        style={{width: 64, height: 64}}>
                        <Text>image background</Text>
                      </ImageBackground> */}
              </View>
            </Marker>
            {path !== false ? (
              <Path coordinates={path} width={10} color="red" />
            ) : null}
          </NaverMapView>
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
      </View>
      <View style={styles.body}>
        <View style={styles.bodyLeft}>
          <View style={styles.RouteInfo}>
            <Text style={styles.delName}>{props.item.delName}</Text>
            <Text style={styles.address}>{props.item.address}</Text>
          </View>
          <View style={styles.TimeInfo}>
            <Text
              style={{
                color: 'white',
              }}>
              도착 예정 :{' '}
            </Text>
            <Text style={styles.delTime}>
              {props.item.delScheduledTime.split(':')[0] +
                '시' +
                props.item.delScheduledTime.split(':')[1] +
                '분'}
            </Text>
          </View>
          <View></View>
        </View>
        <View style={styles.bodyRight}>
          <Pressable onPress={activeCam}>
            <Image source={camera} style={styles.camera}></Image>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
export default DetailJob;
const styles = StyleSheet.create({
  DetailJobcontainer: {
    // borderWidth: 1,
    flex: 1,
    margin: 10,
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: 8,
    backgroundColor: '#0B0B3B',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 0.5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: 'white',
  },
  headerText2: {
    fontSize: 20,
    color: '#427ef5',
    fontWeight: 'bold',
  },
  MapContainer: {
    // borderWidth: 1,
    flex: 6,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    // borderWidth: 1,
    //  shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  bodyLeft: {
    flex: 2.5,
    height: '100%',
    // flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'center',
    // borderWidth: 1,
    paddingLeft: 10,
  },
  delName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 5,
    textAlignVertical: 'bottom',
    color: 'white',
  },
  address: {
    textAlignVertical: 'bottom',
    paddingBottom: 2,
    color: 'white',

    // borderWidth: 1,
  },
  bodyRight: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: 55,
    height: 55,
  },
  TimeInfo: {
    flexDirection: 'row',
  },
  delTime: {
    color: '#FACC2E',
  },
  RouteInfo: {
    // flexDirection: 'row',
    width: '100%',
    // borderWidth: 1,
  },
});

const ButtonStyle = {
  borderRadius: 10,
  width: '100%',
  height: '100%',
  backgroundColor: '#5d91de',
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#8559da',
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 4,
};

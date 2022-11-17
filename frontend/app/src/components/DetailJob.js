import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, Pressable, FlatList} from 'react-native';
import camera from '../assets/images/camera.png';
import {useEffect} from 'react';
import {requestStoragePermission} from '../utils/permission';
import {camera_service, business_service} from '../api/api';
import axios from 'axios';
import Cam from '../components/Cam';
import NaverMapView, {Marker, Path} from 'react-native-nmap';
import {launchCamera} from 'react-native-image-picker';
import {useSelector} from 'react-redux';
import {NotificationListener} from './push';

const DetailJob = props => {
  const lat = useSelector(state => state.gps.lat);
  const lng = useSelector(state => state.gps.lng);
  const [targetLocation, setTargetLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(false);
  const [markerCoords, setMarkerCoords] = useState(false);
  //<-------------------------checkin---------------------------->
  const userId = useSelector(state => state.auth.id);
  const [isCheckIn, setIsCheckIn] = useState(false);
  const [checkMessage, setCheckMessage] = useState('');

  function checkin(userId, deliveryId, image) {
    axios({
      method: 'post',
      url: business_service.checkIn() + `${userId}`,
      data: {
        deliveryId: deliveryId,
        img: image,
      },
    })
      .then(res => {
        console.log('checkin--------->', res);
        setIsCheckIn(true);
        setCheckMessage('체크인 성공');
      })
      .catch(err => {
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
              checkin(userId, props.item.id, result.data);
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
    // NotificationListener(userId, props.item.id, props.item.delName);
  }, []);

  useEffect(() => {
    setTargetLocation(
      String(props.item.longitude) + ',' + String(props.item.latitude),
    );
    if (props !== undefined) {
      NotificationListener();
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
    return reDefineData;
  }

  const apiData = {
    start: currentLocation,
    goal: targetLocation,
    option: 'trafast',
  };

  function getDrawingData() {
    axios({
      method: 'post',
      url: 'https://k7c207.p.ssafy.io:8000/user-service/map',
      data: apiData,
    })
      .then(res => {
        console.log('실행됨?');
        console.log(res.data);
      })
      .catch(err => {
        console.log('에러남');
        console.log(err);
      });
  }

  // useEffect(() => {
  //   if (currentLocation !== false) {
  //     getDrawingData();
  //   }
  // }, [currentLocation]);

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
            center={{...markerCoords, zoom: 16}}>
            <Marker
              coordinate={{latitude: lat, longitude: lng}}
              pinColor={'red'}
            />
            <Marker
              coordinate={{
                latitude: props.item.latitude,
                longitude: props.item.longitude,
              }}
            />
            {/* <Path coordinates={path} width={10} color="red" /> */}
          </NaverMapView>
        ) : (
          <View>
            <Text>Loading...</Text>
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
            <Text>도착 예정 : </Text>
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
    backgroundColor: '#e8e8e8',
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
  },
  address: {
    textAlignVertical: 'bottom',
    paddingBottom: 2,
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
    color: 'crimson',
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

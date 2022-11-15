import React from 'react';
import {View, Text, StyleSheet, Image, Pressable, FlatList} from 'react-native';
import camera from '../assets/images/camera.png';
import Map from './Map';
import {useSelector} from 'react-redux';
import separator from '../assets/images/separator.png';

import Cam from '../components/Cam';
import ImagePicker, {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {useEffect} from 'react';
import {requestStoragePermission} from '../utils/permission';
import {camera_service} from '../api/api';
import axios from 'axios';
const DetailJob = props => {
  // console.log(
  //   'DetailJob props-----------------------------------------',
  //   props,
  // );
  // 드라이버 현재 위치
  const lat = useSelector(state => state.gps.lat);
  const lng = useSelector(state => state.gps.lng);
  const mylocation = {
    latitude: lat,
    longitude: lng,
  };
  const activeCam = () => {
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
      formdata.append('delId', 1); //delId 값 넣으면 됩니당
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
              delId: 1, // delId 값 넣으면 됩니당
            },
          })
            .then(result => {
              console.log('체크인 이미지 가져오기', result.data);
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
  };
  useEffect(() => {
    requestStoragePermission();
  }, []);

  return (
    <View style={styles.DetailJobcontainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{props.date}</Text>
        <Text style={styles.headerText2}>{props.item.delName}</Text>
      </View>
      <View style={styles.MapContainer}>
        {mylocation.latitude === true || mylocation.longitude === true ? (
          <Map
            width="100%"
            height="100%"
            mylocation={mylocation}
            targerLocation={{
              latitude: props.item.latitude,
              longitude: props.item.longitude,
            }}></Map>
        ) : (
          <View style={styles.MapContainer}>
            <Text>Loading...</Text>
          </View>
        )}
      </View>
      <View style={styles.body}>
        <View style={styles.bodyLeft}>
          <View style={styles.RouteInfo}>
            <Text style={styles.TimeLabel}>도착시간</Text>
            <Text style={styles.Time}>{props.item.delScheduledTime}</Text>
          </View>
          <View>
            <Image source={separator} style={{width: 50, height: 50}} />
          </View>
          <View style={styles.Count}>
            <Text style={styles.CountTextLabel}>픽업 개수</Text>
            <Text style={styles.CountText}>{props.item.orderNum}</Text>
          </View>
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
// <View style={styles.DetailJobcontainer}>
//   <View style={styles.header}>
//     <Text style={styles.headerText}>{lunchDate}</Text>
//     <Text style={styles.headerText2}>{lunchRouteName}</Text>
//   </View>
//   <View style={styles.MapContainer}>
//     {mylocation.latitude === true || mylocation.longitude === true ? (
//       <Map
//         width="100%"
//         height="100%"
//         mylocation={mylocation}
//         targerLocation={{
//           latitude: item.latitude,
//           longitude: item.longitude,
//         }}></Map>
//     ) : (
//       <View style={styles.MapContainer}>
//         <Text>Loading...</Text>
//       </View>
//     )}
//   </View>
//   <View style={styles.body}>
//     <View style={styles.bodyLeft}>
//       <View style={styles.RouteInfo}>
//         <Text style={styles.TimeLabel}>도착시간</Text>
//         <Text style={styles.Time}>{item.delScheduledTime}</Text>
//       </View>
//       <View>
//         <Image source={separator} style={{width: 50, height: 50}} />
//       </View>
//       <View style={styles.Count}>
//         <Text style={styles.CountTextLabel}>픽업 개수</Text>
//         <Text style={styles.CountText}>{item.orderNum}</Text>
//       </View>
//     </View>
//     <View style={styles.bodyRight}>
//       <Pressable>
//         <Image source={camera} style={styles.camera}></Image>
//       </Pressable>
//     </View>
//   </View>
// </View>
// <View style={styles.DetailJobcontainer}>
//   <View style={styles.header}>
//     <Text style={styles.headerText}>11월 09일</Text>
//     <Text style={styles.headerText2}>삼성전자 광주캠퍼스</Text>
//   </View>
//   <View style={styles.MapContainer}>
//     {coordinate.latitude === true || coordinate.longitude === true ? (
//       <Map width="100%" height="100%" coords={coordinate}></Map>
//     ) : (
//       <View style={styles.MapContainer}>
//         <Text>오류</Text>
//       </View>
//     )}
//   </View>
//   <View style={styles.body}>
//     <View style={styles.bodyLeft}>
//       <View style={styles.RouteInfo}>
//         <Text style={styles.TimeLabel}>도착시간 </Text>
//         <Text style={styles.Time}>12 : 00</Text>
//       </View>
//       <View>
//         <Image source={separator} style={{width: 50, height: 50}} />
//       </View>
//       <View style={styles.Count}>
//         <Text style={styles.CountTextLabel}>픽업 개수</Text>
//         <Text style={styles.CountText}>12개</Text>
//       </View>
//     </View>
//     <View style={styles.bodyRight}>
//       <Pressable>
//         <Image source={camera} style={styles.camera}></Image>
//       </Pressable>
//     </View>
//   </View>
// </View>

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
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerText2: {
    fontSize: 22,
    color: '#427ef5',
    fontWeight: 'bold',
  },
  MapContainer: {
    // borderWidth: 1,
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    // borderWidth: 1,
  },
  bodyLeft: {
    flex: 2.5,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bodyRight: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Count: {
    justifyContent: 'center',
    // alignItems: 'center',
  },
  CountText: {
    fontSize: 18,
  },
  CountTextLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  camera: {
    width: 55,
    height: 55,
  },
  // footer: {
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  Time: {
    fontSize: 18,
    color: 'red',
  },
  TimeLabel: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  RouteInfo: {
    justifyContent: 'center',
    alignItems: 'center',
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

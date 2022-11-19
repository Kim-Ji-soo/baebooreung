import React, {useRef, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  FlatList,
  ImageEditor,
  ImageBackground,
  Image,
} from 'react-native';
import BottomSheet from 'react-native-gesture-bottom-sheet';
import CustomButton from './CustomButton';
import axios from 'axios';
import {business_service} from '../api/api';
import {setDinnerActualStartTime, setLunchActualStartTime} from '../redux/work';
import NaverMapView, {Marker, Polyline, Path, Circle} from 'react-native-nmap';
// gps 관련 import
// import Geolocation from 'react-native-geolocation-service';
// import {getLocationPermission} from '../utils/permission';
// import {setGps} from '../redux/gps';
// import {sendGps} from '../api/kafka';

const BottomScrollSheet = props => {
  const dispatch = useDispatch();
  const lunchRouteId = useSelector(state => state.work.lunchRouteId);
  const dinnerRouteId = useSelector(state => state.work.dinnerRouteId);
  // console.log('bottomscrollSheet------->', props.RouteId);
  const navigation = useNavigation();
  const ButtonStyle = {
    borderWidth: 0.5,
    borderRadius: 16,
    borderColor: 'gray',
    overflow: 'hidden',
    width: '40%',
    marginBottom: 11,
  };
  const id = useSelector(state => state.auth.id);

  function GetLunchActualstartTime() {
    if (lunchRouteId !== -1) {
      axios({
        url: business_service.getActualStartTime() + `${lunchRouteId}`,
        method: 'get',
      })
        .then(res => {
          console.log('점심 실제 시작 시간', res.data);
          setLunchActualStartTime(res.data);
        })
        .catch(err => {
          console.log("getActualStartTime's", err);
        });
    }
  }
  function GetDinnerActualStartTime() {
    if (dinnerRouteId !== -1) {
      axios({
        url: business_service.getActualStartTime() + `${dinnerRouteId}`,
        method: 'get',
      })
        .then(res => {
          console.log('저녁 실제 시작 시간', res.data);
          setDinnerActualStartTime(res.data);
        })
        .catch(err => {
          console.log("getActualStartTime's", err);
        });
    }
  }
  // 업무 시작
  function start(id, routeId) {
    axios({
      url: business_service.workStart() + `${id}` + '/start/' + `${routeId}`,
      method: 'put',
    })
      .then(res => {
        console.log('업무시작 성공');
        navigation.navigate('Detail', {
          data: props.data,
          RouteId: props.RouteId,
        });
        GetDinnerActualStartTime();
        GetLunchActualstartTime();
      })
      .catch(err => console.log('업무시작 실패'));
  }
  const renderDelivery = ({item}) => {
    return (
      <>
        <View style={styles.DeliveryContainer}>
          <View style={styles.DeliveryIdContainer}>
            <Text style={styles.DeliveryId}>{item.sequence}</Text>
          </View>
          <View style={styles.DeliveryStoreContainer}>
            <Text style={styles.DeliveryStore}>{item.delName}</Text>
            <Text style={{fontSize: 12}}>{item.address}</Text>
          </View>
          <View style={styles.DeliveryTimeContainer}>
            <Text>도착 시간</Text>
            <Text style={styles.DeliveryTime}>
              {item.delScheduledTime.split(':')[0] +
                '시' +
                ' ' +
                item.delScheduledTime.split(':')[1] +
                '분'}
            </Text>
          </View>
          <View style={styles.orderNumContainer}>
            <Text style={styles.DeliveryCount}>{item.orderNum}건</Text>
          </View>
        </View>
      </>
    );
  };
  const makeMarker = () => {
    const coords = [];
    for (let i = 0; i < props.data.length; i++) {
      coords.push({
        latitude: props.data[i].latitude,
        longitude: props.data[i].longitude,
      });
    }
    return coords;
  };

  const coords = makeMarker();
  // Needed in order to use .show()
  const bottomSheet = useRef();
  return (
    <SafeAreaView style={styles.container}>
      <BottomSheet hasDraggableIcon ref={bottomSheet} height={600}>
        <View style={styles.SheetContainer}>
          <View style={styles.Map}>
            <NaverMapView
              style={{width: '100%', height: '100%'}}
              center={{...coords[0], zoom: 13.5}}>
              {coords.map((el, index) => {
                return (
                  <Marker coordinate={el} width={35} height={40} key={index}>
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
                          source={require('../assets/images/favorite.png')}
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
                );
              })}
              <Path
                coordinates={coords}
                width={10}
                color="red"
                outlineWidth={0}
              />
            </NaverMapView>
          </View>
          <Text style={styles.workHeader}>배송</Text>
          <View style={styles.body}>
            <FlatList
              data={props.data}
              renderItem={renderDelivery}
              keyExtractor={item => item.id}
            />
          </View>
          <View style={styles.footer}>
            <CustomButton
              backgroundColor="#0B0B3B"
              ButtonStyle={ButtonStyle}
              onPress={() => {
                start(id, props.RouteId);
                bottomSheet.current.close();
              }}>
              <Text style={{color: 'white'}}>시작하기</Text>
            </CustomButton>
          </View>
        </View>
      </BottomSheet>
      <TouchableOpacity
        style={props.ButtonStyle}
        onPress={() => {
          bottomSheet.current.show();
        }}>
        <Text style={props.TextStyle}>{props.title}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  SheetContainer: {
    flex: 1,
    padding: 10,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    // borderWidth: 1,
  },
  headerText: {
    fontSize: 20,
  },
  Map: {
    flex: 4,
  },
  body: {
    flex: 5,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 10,
  },

  footer: {
    // borderWidth: 1,
    alignItems: 'center',
    marginTop: 5,
  },
  DeliveryContainer: {
    width: '100%',
    borderWidth: 0.5,
    borderRadius: 10,
    height: 55,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 5,
  },
  DeliveryIdContainer: {
    width: '10%',
  },
  DeliveryId: {
    textAlign: 'center',
  },
  DeliveryStoreContainer: {
    flexDirection: 'column',
    width: '60%',
  },
  DeliveryStore: {
    // textAlign: 'center',
    fontWeight: '800',
  },
  DeliveryTimeContainer: {
    width: '20%',
  },

  DeliveryTime: {
    // textAlign: 'center',
    fontSize: 13,
  },
  orderNumContainer: {
    width: '10%',
  },
  DeliveryCount: {
    textAlign: 'center',
  },

  pickupId: {
    width: '25%',
    // borderBottomWidth: 0.5,
    textAlign: 'center',
  },
  pickupStore: {
    width: '25%',
    // borderBottomWidth: 0.5,
    textAlign: 'center',
  },
  pickupTime: {
    width: '25%',
    // borderBottomWidth: 0.5,
    textAlign: 'center',
  },
  pickupCount: {
    width: '25%',
    // borderBottomWidth: 0.5,
    textAlign: 'center',
  },
  workHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default BottomScrollSheet;

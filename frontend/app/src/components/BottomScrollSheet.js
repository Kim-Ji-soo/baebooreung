import {useNavigation} from '@react-navigation/native';
import React, {useRef, useEffect, useState} from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  FlatList,
} from 'react-native';
import BottomSheet from 'react-native-gesture-bottom-sheet';
import CustomButton from './CustomButton';
import Geolocation from 'react-native-geolocation-service';
import {getLocationPermission} from '../utils/permission';
import {setGps} from '../redux/gps';
import {useDispatch, useSelector} from 'react-redux';
import {sendGps} from '../api/kafka';
const BottomScrollSheet = props => {
  const dispatch = useDispatch();
  // console.log(props.data);
  const navigation = useNavigation();
  const ButtonStyle = {
    borderWidth: 0.5,
    borderRadius: 16,
    borderColor: 'gray',
    overflow: 'hidden',
    width: '50%',
  };
  const id = useSelector(state => state.auth.id);
  const watchId = null;
  const [watchLocation, setWatchLocation] = useState(false);
  const getWatchLocation = () => {
    console.log('getWatchLocation is running...');
    const permission = getLocationPermission();
    permission.then(granted => {
      if (granted) {
        this.watchId = Geolocation.watchPosition(
          position => {
            const {latitude, longitude} = position.coords;
            const date = new Date(position.timestamp)
              .toISOString()
              .split('.')[0];
            setWatchLocation({
              latitude: latitude,
              longitude,
              longitude,
              requestDateTime: date,
            });
            dispatch(
              setGps({
                lat: latitude,
                lng: longitude,
              }),
            );
            navigation.navigate('Detail', {data: props.data});
          },
          error => {
            // console.log("driverApp/Gps => getWatchLocation's error", error);
            setWatchLocation(false);
          },
          {enableHighAccuracy: true, fastestInterval: 3000, distanceFilter: 0},
        );
      }
    });
    // console.log(watchLocation);
  };
  const setKafka = () => {
    const kafka = {
      userId: id,
      latitude: watchLocation.latitude,
      longitude: watchLocation.longitude,
      requestDateTime: String(watchLocation.requestDateTime),
    };
    return kafka;
  };

  useEffect(() => {
    if (watchLocation !== false) {
      sendGps(setKafka());
    }
  }, [watchLocation]);

  const killWatchLocation = () => {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      setWatchLocation(false);
      // console.log('getWatchLocation is stop...');
    }
  };

  const renderPickup = ({item}) => {
    return (
      <>
        {item.type === 'pickup' ? (
          <View style={styles.pickupContainer}>
            <Text style={styles.pickupId}>{item.sequence}</Text>
            <Text style={styles.pickupStore}>{item.delName}</Text>
            <Text style={styles.pickupTime}>
              {item.delScheduledTime.split(':')[0] +
                '시' +
                ' ' +
                item.delScheduledTime.split(':')[1] +
                '분'}
            </Text>
            <Text style={styles.pickupCount}>{item.orderNum}건</Text>
          </View>
        ) : null}
      </>
    );
  };
  const renderDelivery = ({item}) => {
    return (
      <>
        {item.type === 'delivery' ? (
          <View style={styles.DeliveryContainer}>
            <Text style={styles.DeliveryId}>{item.sequence}</Text>
            <Text style={styles.DeliveryStore}>{item.delName}</Text>
            <Text style={styles.DeliveryTime}>
              {item.delScheduledTime.split(':')[0] +
                '시' +
                ' ' +
                item.delScheduledTime.split(':')[1] +
                '분'}
            </Text>
            <Text style={styles.DeliveryCount}>{item.orderNum}건</Text>
          </View>
        ) : null}
      </>
    );
  };
  // Needed in order to use .show()
  const bottomSheet = useRef();
  return (
    <SafeAreaView style={styles.container}>
      <BottomSheet hasDraggableIcon ref={bottomSheet} height={600}>
        <View style={styles.SheetContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{props.data.date}</Text>
          </View>
          <Text style={styles.workHeader}>픽업</Text>
          <View style={styles.body}>
            <FlatList
              data={props.data}
              renderItem={renderPickup}
              keyExtractor={item => item.id}
            />
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
              ButtonStyle={ButtonStyle}
              onPress={() => {
                getWatchLocation();
              }}>
              <Text style={{color: 'blue'}}>시작하기</Text>
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
    padding: 20,
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
  body: {
    backgroundColor: '#b0aeae',
    flex: 5,
    justifyContent: 'space-around',
    alignItems: 'center',
    // marginVertical: 10,
    paddingHorizontal: 5,
    elevation: 3,
    shadowRadius: 3.84,
    shadowOpacity: 0.25,
    borderRadius: 10,
  },

  footer: {
    // borderWidth: 1,
    alignItems: 'center',
    marginTop: 5,
  },
  pickupContainer: {
    borderRadius: 5,
    backgroundColor: '#f8f8f8',
    height: 55,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 3,
  },
  DeliveryContainer: {
    borderRadius: 5,
    backgroundColor: '#f8f8f8',
    height: 55,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 3,
  },
  DeliveryId: {
    width: '25%',
    textAlign: 'center',
  },
  DeliveryStore: {
    width: '25%',
    textAlign: 'center',
  },
  DeliveryTime: {
    width: '25%',
    textAlign: 'center',
  },
  DeliveryCount: {
    width: '25%',
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

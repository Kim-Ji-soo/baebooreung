import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {requestLocationPermission} from '../../utils/permission';
import Map from '../../components/Map';
const Gps = () => {
  const [location, setLocation] = useState(null);
  const [rtlocation, setRTLocation] = useState(false);

  const getLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            setLocation(position);
          },
          error => {
            console.log(error.code, error.message);
            setLocation(false);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
    console.log(location);
  };
  const getRTLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      if (res) {
        Geolocation.watchPosition(
          position => {
            const date = new Date(position.timestamp)
              .toISOString()
              .split('.')[0]; // 2022-10-31T01:26:37
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const data = {
              timestamp: date,
              latitude: latitude,
              longitude: longitude,
            };
            setRTLocation(data);
          },
          error => {
            console.log(error.code, error.message);
            setRTLocation(false);
          },
          {
            enableHighAccuracy: true,
            fastestInterval: 3000,
            distanceFilter: 0,
          },
        );
      }
    });
    console.log(rtlocation);
  };
  const initLocation = () => {
    setLocation(null);
  };
  useEffect(() => {
    if (location !== false) {
      getLocation();
    }
  }, []);
  return (
    <View style={styles.container}>
      {location ? (
        <Map
          width="90%"
          height="25%"
          coords={{
            latitude: 35.2032514,
            longitude: 126.80133,
          }}
        />
      ) : // <View>
      //   <Text>latitude : {location.coords.latitude}</Text>
      //   <Text>longitude : {location.coords.longitude}</Text>
      // </View>
      null}
      {location ? (
        <View style={styles.location}>
          <Text>현재 위치 </Text>
          <Text>
            Time : {new Date(location.timestamp).toISOString().split('.')[0]}
          </Text>
          <Text>latitude : {location.coords.latitude}</Text>
          <Text>longitude : {location.coords.longitude}</Text>
        </View>
      ) : null}
      {rtlocation ? (
        <Map
          width="90%"
          height="25%"
          coords={{
            latitude: rtlocation.latitude,
            longitude: rtlocation.longitude,
          }}
        />
      ) : // <View>
      //   <Text>latitude : {location.coords.latitude}</Text>
      //   <Text>longitude : {location.coords.longitude}</Text>
      // </View>
      null}
      {rtlocation ? (
        <View style={styles.rtlocation}>
          <Text>실시간 위치 추적</Text>
          <Text>Time: {rtlocation.timestamp}</Text>
          <Text>latitude: {rtlocation.latitude}</Text>
          <Text>longitude: {rtlocation.longitude}</Text>
        </View>
      ) : null}
      <View style={styles.btnContainer}>
        <View
          style={{marginTop: 10, padding: 10, borderRadius: 10, width: '40%'}}>
          <Button title="현재위치" onPress={getLocation} />
        </View>
        <View
          style={{marginTop: 10, padding: 10, borderRadius: 10, width: '40%'}}>
          <Button title="실시간" onPress={getRTLocation} />
        </View>
        <View
          style={{marginTop: 10, padding: 10, borderRadius: 10, width: '40%'}}>
          <Button title="초기화" onPress={initLocation} />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rtlocation: {
    marginVertical: 20,
  },
  location: {
    marginVertical: 20,
  },
  btnContainer: {
    flexDirection: 'row',
    padding: 20,
  },
});
export default Gps;

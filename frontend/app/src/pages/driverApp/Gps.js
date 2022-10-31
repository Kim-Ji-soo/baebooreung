import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Button, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Map from '../../components/Map';

// Function to get permission for location
const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    console.log('Access: ', granted);
    if (granted === 'granted') {
      console.log('You can use Geolocation');
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};
const Gps = () => {
  // state to hold location
  const [location, setLocation] = useState([]);
  const [rtlocation, setRTLocation] = useState(false);

  // function to check permissions and get Location
  const getLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            console.log(position);
            // setLocation(position);
            setLocation([
              ...location,
              JSON.stringify({
                time: position.timestamp,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              }),
            ]);
          },
          error => {
            // See error code charts below.
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
            // const kafkaData = {
            //   date: date,
            //   latitude: latitude,
            //   longitude: longitude,
            // };
            // console.log(kafkaData);
            setRTLocation(position);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setRTLocation(false);
          },
          {
            enableHighAccuracy: true,
            // interval: 3000, // 위치 업데이트 간격 , 3000ms
            fastestInterval: 3000,
            distanceFilter: 0,
            // fastestInterval: 2000,
          },
        );
      }
    });
    console.log(rtlocation);
  };
  const initLocation = () => {
    setLocation([]);
  };
  //   useEffect(() => {
  //     getRTLocation();
  //   }, []);
  return (
    <View style={styles.container}>
      <Text>GPS TEST</Text>
      {/* <Map
        props={{
          latitude: rtlocation.coords.latitude,
          longitude: rtlocation.coords.longitude,
        }}
      /> */}
      <View
        style={{marginTop: 10, padding: 10, borderRadius: 10, width: '40%'}}>
        <Button title="현재위치 찾기" onPress={getLocation} />
      </View>
      <Text>{location}</Text>
      <View
        style={{marginTop: 10, padding: 10, borderRadius: 10, width: '40%'}}>
        <Button title="초기화" onPress={initLocation} />
      </View>
      <View
        style={{marginTop: 10, padding: 10, borderRadius: 10, width: '40%'}}>
        <Button title="watchLocation" onPress={getRTLocation} />
      </View>
      {rtlocation ? (
        <View>
          <Text>Time: {Date(rtlocation.timestamp)}</Text>
          <Text>latitude: {rtlocation.coords.latitude}</Text>
          <Text>longitude: {rtlocation.coords.longitude}</Text>
        </View>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default Gps;

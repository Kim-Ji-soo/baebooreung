import {React, useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {getLocationPermission} from '../../utils/permission';
import {sendGps} from '../../api/kafka';
import NaverMapView, {Marker} from 'react-native-nmap';
import ScrollBottom from '../../components/ScrollBottom';

const Gps = () => {
  const watchId = null;
  const [watchLocation, setWatchLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(false);
  const setKafka = () => {
    const kafka = {
      userId: 2,
      latitude: watchLocation.latitude,
      longitude: watchLocation.longitude,
      requestDateTime: String(watchLocation.requestDateTime),
    };
    return kafka;
  };
  // <------------------------current position-------------------------->
  const getCurrentLocation = () => {
    console.log('getCurrentLocation is running...');
    const permission = getLocationPermission();
    permission.then(granted => {
      if (granted) {
        Geolocation.getCurrentLocation(
          position => {
            const {latitude, longitude} = position.coords;
            const date = new Date(position.timestamp)
              .toISOString()
              .split('.')[0];
            setCurrentLocation({
              latitude: latitude,
              longitude: longitude,
              requestDateTime: date,
            });
          },
          error => {
            console.log("driverApp/Gps => getCurrentLocation's error", error);
            setCurrentLocation(false);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
    console.log(
      "driverApp/Gps => getCurrentLocation's return",
      currentLocation,
    );
  };
  // <-------------------------watch position-------------------------->
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
          },
          error => {
            console.log("driverApp/Gps => getWatchLocation's error", error);
            setWatchLocation(false);
          },
          {enableHighAccuracy: true, fastestInterval: 3000, distanceFilter: 0},
        );
      }
    });
    console.log(watchLocation);
  };
  // <-------------------------clear watch position-------------------------->
  const killWatchLocation = () => {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      console.log('getWatchLocation is stop...');
    }
  };

  // useEffect(() => {
  //   getWatchLocation();
  // }, []);

  useEffect(() => {
    if (watchLocation !== false) {
      sendGps(setKafka());
    }
  }, [watchLocation]);

  return (
    <SafeAreaView style={styles.DetailRootContainer}>
      <NaverMapView style={styles.map}></NaverMapView>
      <View style={styles.DetailInfo}>
        <ScrollBottom />
      </View>
      {/* <Button
        title="KILL watchLocation"
        onPress={() => {
          killWatchLocation();
        }}
        style={{height: 50}}></Button>
      <Button
        title="START watchLocation"
        onPress={() => {
          getWatchLocation();
        }}></Button> */}
    </SafeAreaView>
  );
};

export default Gps;
const styles = StyleSheet.create({
  DetailRootContainer: {
    zIndex: 3,
    borderWidth: 1,
  },
  map: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

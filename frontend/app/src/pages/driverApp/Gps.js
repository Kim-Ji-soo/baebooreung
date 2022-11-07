import {React, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Pressable,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {getLocationPermission} from '../../utils/permission';
import {sendGps} from '../../api/kafka';
import Map from '../../components/Map';

const Gps = () => {
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
  const watchId = null;
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
    <SafeAreaView style={styles.gpsContainer}>
      <View style={styles.mapContainer}>
        {watchLocation ? (
          <View style={styles.map}>
            <Map
              width="100%"
              height="100%"
              borderRadius="30"
              coords={{
                latitude: watchLocation.latitude,
                longitude: watchLocation.longitude,
              }}></Map>
          </View>
        ) : (
          <View style={styles.map}>
            <Text>Loading...</Text>
          </View>
        )}
      </View>
      <Text style={styles.workListHeader}> 배송 리스트 </Text>
      <ScrollView style={styles.workContainer}>
        <Pressable style={styles.work}>
          <Text style={styles.leftWorkText}>초돈 12 : 10</Text>
          <Text style={styles.rightWorkText}>5건</Text>
        </Pressable>
        <Pressable style={styles.work}>
          <Text style={styles.leftWorkText}>초돈 12 : 10</Text>
          <Text style={styles.rightWorkText}>5건</Text>
        </Pressable>
        <Pressable style={styles.work}>
          <Text style={styles.leftWorkText}>초돈 12 : 10</Text>
          <Text style={styles.rightWorkText}>5건</Text>
        </Pressable>
      </ScrollView>
      <View style={styles.gpsButtonContainer}>
        <Button
          title="KILL watchLocation"
          onPress={() => {
            killWatchLocation();
          }}
          style={{height: 50}}></Button>
        <Button
          title="START watchLocation"
          onPress={() => {
            getWatchLocation();
          }}></Button>
      </View>
    </SafeAreaView>
  );
};

export default Gps;
const styles = StyleSheet.create({
  gpsContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 8,
    // backgroundColor: '#232122',
  },
  mapContainer: {
    flex: 3,
    justifyContent: 'center',
    borderRadius: 16,
  },
  gpsButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 8,
  },
  workContainer: {
    flex: 2,
  },
  work: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginVertical: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  leftWorkText: {
    fontSize: 20,
  },
  rightWorkText: {
    color: 'red',
    fontSize: 20,
    fontWeight: 'bold',
  },
  workListHeader: {
    fontSize: 25,
    marginTop: 15,
    // borderWidth: 1,
    fontWeight: 'bold',
  },
});

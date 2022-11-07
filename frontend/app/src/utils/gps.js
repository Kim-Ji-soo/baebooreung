import {requestLocationPermission} from '../utils/permission';
import {useState} from 'react';
import Geolocation from 'react-native-geolocation-service';

export const getCurrentLocation = () => {
  const [currentLocation, setCurrentLocation] = useState(false);
  const permission = requestLocationPermission();

  permission.then(res => {
    if (res) {
      Geolocation.getCurrentLocation(
        position => {
          const {latitude, longitude} = position.coords;
          const date = new Date(position.timestamp).toISOString().split('.')[0];
          setCurrentLocation({
            latitude: latitude,
            longitude: longitude,
            requestDateTime: date,
          });
        },
        error => {
          console.log("utils/gps/ => getCurrentLocation's error", error);
          setCurrentLocation(false);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  });
  console.log("utils/gps/ => getCurrentLocation's return", currentLocation);
  return currentLocation;
};

export const getWatchLocation = () => {
  const [watchLocation, setWatchLocation] = useState(false);
  const permission = requestLocationPermission();
  permission.then(res => {
    if (res) {
      Geolocation.watchPosition(
        position => {
          const {latitude, longitude} = position.coords;
          const date = new Date(position.timestamp).toISOString().split('.')[0];
          setWatchLocation({
            latitude: latitude,
            longitude,
            longitude,
            requestDateTime: date,
          });
        },
        error => {
          console.log("utils/gps/ => getWatchLocation's error", error);
          setWatchLocation(false);
        },
        {enableHighAccuracy: true, fastestInterval: 3000, distanceFilter: 0},
      );
    }
  });
  console.log("utils/gps/ => getWatchLocation's return", watchLocation);
  // return watchLocation;
};

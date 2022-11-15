import {React} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import DetailJob from '../../components/DetailJob';

export const DetailRoutePage = props => {
  // 경로 데이터
  // const [currentLocation, setCurrentLocation] = useState(false);
  // // <------------------------current position-------------------------->
  // const getCurrentLocation = () => {
  //   const permission = getLocationPermission();
  //   permission.then(granted => {
  //     if (granted) {
  //       Geolocation.getCurrentLocation(
  //         position => {
  //           const {latitude, longitude} = position.coords;
  //           const date = new Date(position.timestamp)
  //             .toISOString()
  //             .split('.')[0];
  //           setCurrentLocation({
  //             latitude: latitude,
  //             longitude: longitude,
  //             requestDateTime: date,
  //           });
  //         },
  //         error => {
  //           // console.log("driverApp/Gps => getCurrentLocation's error", error);
  //           setCurrentLocation(false);
  //         },
  //         {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  //       );
  //     }
  //   });
  // };
  // <------------------------kafka data set---------------------------->
  // const setKafka = () => {
  //   const kafka = {
  //     userId: 2,
  //     latitude: watchLocation.latitude,
  //     longitude: watchLocation.longitude,
  //     requestDateTime: String(watchLocation.requestDateTime),
  //   };
  //   return kafka;
  // };

  // useEffect(() => {
  //   if (watchLocation !== false) {
  //     sendGps(setKafka());
  //   }
  // }, [watchLocation]);

  // // <-------------------------watch position-------------------------->
  // const watchId = null;
  // const [watchLocation, setWatchLocation] = useState(false);
  // const getWatchLocation = () => {
  //   // console.log('getWatchLocation is running...');
  //   const permission = getLocationPermission();
  //   permission.then(granted => {
  //     if (granted) {
  //       this.watchId = Geolocation.watchPosition(
  //         position => {
  //           const {latitude, longitude} = position.coords;
  //           const date = new Date(position.timestamp)
  //             .toISOString()
  //             .split('.')[0];
  //           setWatchLocation({
  //             latitude: latitude,
  //             longitude,
  //             longitude,
  //             requestDateTime: date,
  //           });
  //           dispatch(
  //             setGps({
  //               lat: latitude,
  //               lng: longitude,
  //             }),
  //           );
  //         },
  //         error => {
  //           // console.log("driverApp/Gps => getWatchLocation's error", error);
  //           setWatchLocation(false);
  //         },
  //         {enableHighAccuracy: true, fastestInterval: 3000, distanceFilter: 0},
  //       );
  //     }
  //   });
  //   // console.log(watchLocation);
  // };

  // useEffect(() => {
  //   // 업무시작 버튼을 누르면 실행되게 하기.
  //   getWatchLocation();
  // }, []);
  // <-------------------------kill watch position-------------------------->
  // const killWatchLocation = () => {
  //   if (this.watchId !== null) {
  //     Geolocation.clearWatch(this.watchId);
  //     setWatchLocation(false);
  //     // console.log('getWatchLocation is stop...');
  //   }
  // };
  const {width} = Dimensions.get('window');

  const renderItem = ({item}) => {
    return (
      <View style={{width: width}}>
        <DetailJob item={item} />
      </View>
    );
  };

  return (
    <SwiperFlatList data={props.route.params.data} renderItem={renderItem} />
  );
};

export default DetailRoutePage;
const styles = StyleSheet.create({});

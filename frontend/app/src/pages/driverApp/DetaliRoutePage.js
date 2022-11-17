import {React, useState, useEffect, useRef} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import DetailJob from '../../components/DetailJob';
import {getLocationPermission} from '../../utils/permission';
import Geolocation from 'react-native-geolocation-service';
import {sendGps} from '../../api/kafka';
import {useDispatch, useSelector} from 'react-redux';
import {setLat, setLng, setWatchId} from '../../redux/gps';
import {NotificationListener} from '../../components/push';

export const DetailRoutePage = props => {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.auth.id);
  function setKafka() {
    const kafka = {
      userId: userId,
      latitude: watchLocation.latitude,
      longitude: watchLocation.longitude,
      requestDateTime: String(watchLocation.requestDateTime),
    };
    return kafka;
  }

  // <-------------------------watch position-------------------------->
  const watchId = null;
  const [watchLocation, setWatchLocation] = useState(false);
  const getWatchLocation = () => {
    console.log('running WatchLocation');
    const permission = getLocationPermission();
    permission.then(granted => {
      if (granted) {
        this.watchId = Geolocation.watchPosition(
          position => {
            // console.log(position.coords);
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const date = new Date(position.timestamp)
              .toISOString()
              .split('.')[0];
            setWatchLocation({
              latitude: latitude,
              longitude: longitude,
              requestDateTime: date,
            });
            // dispatch(setWatchId(this.watchId));
          },
          error => {
            console.log("driverApp/Gps => getWatchLocation's error", error);
          },
          {enableHighAccuracy: true, fastestInterval: 3000, distanceFilter: 0},
        );
      }
    });
  };

  useEffect(() => {
    getWatchLocation();
    // NotificationListener(userId, props.item.id, props.item.delName);
  }, []);
  useEffect(() => {
    if (watchLocation !== false) {
      // sendGps(setKafka());
      dispatch(setLat(watchLocation.latitude));
      dispatch(setLng(watchLocation.longitude));
    }
  }, [watchLocation]);

  // console.log('root', watchLocation.latitude, watchLocation.longitude);
  // <-------------------------kill watch position-------------------------->
  function killWatchLocation() {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      setWatchLocation(false);
      console.log('getWatchLocation is stop...');
    }
  }

  const {width} = Dimensions.get('window');
  function renderItem({item}) {
    if (scrollRef.current) {
      console.log(
        'scrollRef.current.getCurrentIndex()',
        scrollRef.current.getCurrentIndex(),
      );
    }
    return (
      <View style={{width: width}}>
        <DetailJob item={item} scrollRef={scrollRef} />
      </View>
    );
  }
  const scrollRef = useRef(null);
  return (
    <SwiperFlatList
      ref={scrollRef}
      data={props.route.params.data}
      // renderItem={({item}) => (
      //   <View style={{width: width}}>
      //     <DetailJob item={item} />
      //   </View>
      // )}
      renderItem={renderItem}
      renderAll={false}
      showPagination
      paginationStyle={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
      paginationStyleItem={{width: 7, height: 7, borderRadius: 4}}
      paginationActiveColor={'crimson'}
    />
  );
};

export default DetailRoutePage;
const styles = StyleSheet.create({});

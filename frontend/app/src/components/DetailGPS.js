import {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  Pressable,
  Modal,
} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {gps_service} from '../api/api';
import NaverMapView, {Marker} from 'react-native-nmap';
import user from '../redux/user';
import {user_service} from '../api/api';
import logo from '../assets/images/logo.png';
import yonsei from '../assets/images/yonsei.png';
import CNU from '../assets/images/CNU.png';
import GIST from '../assets/images/gist.png';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
const identityColor = '#0B0B3B';
const identityTextColor = '#F7FE2E';

export default function DetailGPS(props) {
  const userList = useSelector(state => state.userList.userList);
  const [ID, setID] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [driverList, setDriverList] = useState([]);
  const [location, setLocation] = useState({
    latitude: 35.2028,
    longitude: 126.8091,
  });
  const [profile, setProfile] = useState('');
  useEffect(() => {
    props.routeList //props 로 받아온 조건에 맞는 루트 리스트를 driverList에 저장
      .map((item, idx) => {
        setDriverList(driverList => {
          const newDriverList = [...driverList];
          newDriverList.push({
            userId: item.userId,
            name: item.name,
            routeInfo: item.routeInfo,
            id: item.id,
          });
          return newDriverList;
        });
      });
  }, []);

  return (
    <View style={styles.container}>
      <NaverMapView
        style={{width: '100%', height: '70%'}}
        center={{...location, zoom: 16}}>
        <Marker
          coordinate={location}
          style={[profile !== '' ? styles.marker : styles.defaultMarker]}>
          <View
            style={[
              styles.markerView,
              props.routeName === '전남대학교'
                ? styles.JUMarkerColor
                : props.routeName === '연세대학교'
                ? styles.YUMarkerColor
                : props.routeName === '광주과학기술원'
                ? styles.GUMarkerColor
                : styles.MarkerColor,
            ]}>
            <View style={styles.markerInnerView}>
              <View style={{flex: 1, margin: 5}}>
                {profile !== null ? (
                  <Image
                    source={profile !== '' ? {uri: profile} : logo}
                    style={[
                      profile !== ''
                        ? styles.markerImage
                        : styles.defaultMarkerImage,
                    ]}></Image>
                ) : (
                  <Image
                    source={logo}
                    style={[
                      profile !== ''
                        ? styles.markerImage
                        : styles.defaultMarkerImage,
                    ]}></Image>
                )}
              </View>
            </View>
          </View>
        </Marker>
      </NaverMapView>

      <FlatList
        style={styles.driverListLayout}
        data={driverList}
        keyExtractor={(item, idx) => idx}
        renderItem={({item}) => (
          <View>
            {item.routeInfo.routeName === props.routeName && (
              <View>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    setID(item.id);
                    axios({
                      method: 'get',
                      url: gps_service.getRealTimeGPS() + `${item.id}`,
                    })
                      .then(res => {
                        // console.log('gps 정보 출력', res.data);
                        const latitude = parseFloat(res.data.latitude);
                        const longitude = parseFloat(res.data.longitude);
                        setLocation({
                          latitude: latitude,
                          longitude: longitude,
                        });
                      })
                      .catch(e => {
                        console.log(e);
                      });
                    axios({
                      method: 'get',
                      url: user_service.getProfile() + `${item.id}`,
                    })
                      .then(res => {
                        setProfile(res.data);
                      })
                      .catch(e => {
                        console.log(e);
                      });
                  }}>
                  <View style={{flex: 1}}>
                    <View
                      style={
                        ID === item.id
                          ? [
                              styles.driverListClick,
                              item.routeInfo.routeName === '전남대학교' && {
                                backgroundColor: '#CCFFE5',
                              },
                              item.routeInfo.routeName === '연세대학교' && {
                                backgroundColor: '#CCFFFF',
                              },
                              item.routeInfo.routeName === '광주과학기술원' && {
                                backgroundColor: '#FFCCE5',
                              },
                            ]
                          : styles.driverList
                      }>
                      {/* 대학 로고 Layout */}
                      <View style={styles.universityLogoLayout}>
                        {item.routeInfo.routeName === '전남대학교' && (
                          <Image
                            source={CNU}
                            style={styles.universityLogo}></Image>
                        )}
                        {item.routeInfo.routeName === '연세대학교' && (
                          <Image
                            source={yonsei}
                            style={styles.universityLogo}></Image>
                        )}
                        {item.routeInfo.routeName === '광주과학기술원' && (
                          <Image
                            source={GIST}
                            style={styles.universityLogo}></Image>
                        )}
                      </View>
                      <View style={styles.driverListTextLayout}>
                        <Text
                          style={
                            ID === item.id
                              ? styles.driverListClickText
                              : styles.driverListText
                          }>
                          {item.name} 기사님
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}></FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  driverListLayout: {
    flex: 1,
  },
  driverList: {
    flex: 1,
    flexDirection: 'row',
    height: SCREEN_HEIGHT / 15,
    marginHorizontal: 15,
    marginTop: 15,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 2,
    shadowOpacity: 0.4,
  },
  driverListClick: {
    flex: 1,
    flexDirection: 'row',
    height: SCREEN_HEIGHT / 15,
    marginHorizontal: 15,
    marginTop: 15,
    alignItems: 'center',
    borderRadius: 10,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 2,
    shadowOpacity: 0.4,
  },
  driverListTextLayout: {
    flex: 4,
    alignItems: 'center',
    paddingRight: 10,
  },
  driverListText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  driverListClickText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  driverListImageLayout: {
    felx: 1,
  },
  image: {
    resizeMode: 'stretch',
    width: 70,
    height: 50,
  },
  marker: {
    width: 60,
    height: 60,
  },
  defaultMarker: {
    width: 60,
    height: 60,
  },
  markerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 80,
  },
  markerInnerView: {
    flex: 1,
    margin: 10,
    borderRadius: 80,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerImage: {
    flex: 1,
    width: 36,
    height: 36,
  },
  defaultMarkerImage: {
    flex: 1,
    width: 36,
    height: 24,
  },
  JUMarkerColor: {
    backgroundColor: '#91fcaf',
  },
  YUMarkerColor: {
    backgroundColor: '#91effc',
  },
  GUMarkerColor: {
    backgroundColor: '#fc9c91',
  },
  MarkerColor: {
    backgroundColor: 'gray',
  },
  universityLogoLayout: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  universityLogo: {
    flex: 1,
    width: SCREEN_WIDTH / 6,
    height: SCREEN_HEIGHT / 6,
    opacity: 0.7,
  },
});

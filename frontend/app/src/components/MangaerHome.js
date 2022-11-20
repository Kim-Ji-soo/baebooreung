import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Pressable,
  PermissionsAndroid,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setProfile} from '../redux/user';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {business_service, camera_service} from '../api/api';
import ImagePicker, {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import defaultImage from '../assets/images/truck.png';
import logo from '../assets/images/logo.png';
import yonsei from '../assets/images/yonsei.png';
import CNU from '../assets/images/CNU.png';
import GIST from '../assets/images/gist.png';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
const identityColor = '#0B0B3B';
const identityTextColor = '#FACC2E';
const date = new Date();

function ManagerHome({navigation}) {
  const userInfo = useSelector(state => state.user);
  const token = useSelector(state => state.auth);
  const userList = useSelector(state => state.userList.userList);
  const [tempList, setTempList] = useState([]);
  const [list, setList] = useState([]);
  const [driverList, setDriverList] = useState([]);
  const [university, setUniversity] = useState('');
  const [pickupTotal, setPickupTotal] = useState(0);
  const [pickupFinish, setPickupFinish] = useState(0);
  const [deliveryTotal, setDeliveryTotal] = useState(0);
  const [deliveryFinish, setDeliveryFinish] = useState(0);
  const [index, setIndex] = useState(0);
  const [profileImage, setProfileImage] = useState(userInfo.profile);
  const [date, setDate] = useState('');
  const dispatch = useDispatch();

  const setInfoList = async () => {
    //userList(나를 제외한 유저리스트)가 갱신되었을 때 실행
    if (userList !== null) {
      //현재 날짜를 받음
      const realDate = toStringByFormatting(new Date());
      setDate(realDate);
      //현재 시간을 받음
      const realTime = new Date().getHours();
      //오후 10시부터 오후 2시까지는 점심정보를 띄움,오후 2시부터 오후 10시까지는 저녁정보를 띄움

      let realType; //점심, 저녁에 대한 정보를 시간에 따라 저장
      if (realTime >= 14) {
        realType = 'dinner';
      } else {
        realType = 'lunch';
      }

      // 먼저 유저리스트에서 grade가 DRIVER인 유저만 추출하여 드라이버가 가지고있는 루트ID를 추출
      userList
        .filter(item => item.grade === 'DRIVER')
        .map(async (item, idx) => {
          await axios({
            method: 'get',
            url: business_service.getDriverRoute() + `${item.id}/` + 'routes/',
          })
            .then(async res => {
              // console.log(
              //   item.name,
              //   '드라이버의 id를 통해 얻을 수 있는 정보',
              //   res.data,
              // );

              if (res.data.length !== 0) {
                //추출된 루트ID를 가지고 그 루트ID가 가지고있는 경로 정보 모두 추출
                res.data.map(async (el, idx) => {
                  axios({
                    method: 'get',
                    url: business_service.getRoute() + `${el.id}`,
                  })
                    .then(result => {
                      // console.log(
                      //   item.name,
                      //   '드라이버가 저장한 루트id를 통해 얻을 수 있는 정보',
                      //   result.data,
                      // );
                      // 루트 정보의 date값과 routeType을 비교하여(ex)date : 2022-01-01 routeType : lunch)
                      // (id, userId, name, routeInfo)라는 속성을 가지는 새로운 객체배열에 저장
                      if (
                        // true
                        realDate === result.data.date &&
                        realType === result.data.routeType
                      ) {
                        setTempList(tempList => {
                          const newTempList = [...tempList];
                          newTempList.push({
                            id: item.id,
                            userId: item.email,
                            name: item.name,
                            routeInfo: result.data,
                          });
                          return newTempList;
                        });
                      }
                    })
                    .catch(e => {
                      console.log(e);
                    });
                });
              }
            })
            .catch(e => {
              console.log(e);
            });
        });
    }
  };

  useEffect(() => {
    setInfoList();
  }, [userList]);

  useEffect(() => {
    // axios({
    //   method: 'get',
    //   url: business_service.getOrderCount() + 3,
    // })
    //   .then(res => {
    //     console.log(res.data);
    //   })
    //   .catch(e => {
    //     console.log(e);
    //   });
  }, []);

  useEffect(() => {
    //모든 루트 정보가 저장되었을 시 실행
    if (tempList.length !== 0) {
      tempList.map(item => {
        //픽업 현재 진행여부 체크하여 저장(finish/total)
        let totalPickupSum = 0;
        let finishPickupSum = 0;
        item.routeInfo.deliveryList
          .filter(el => el.type === 'pickup')
          .map(el => {
            if (el.check === false) {
              totalPickupSum += el.orderNum;
            } else {
              totalPickupSum += el.orderNum;
              finishPickupSum += el.orderNum;
            }
          });
        //배달 현재 진행여부 체크하여 저장(finish/total)
        let totalDeliverySum = 0;
        let finishDeliverySum = 0;
        item.routeInfo.deliveryList
          .filter(el => el.type === 'delivery')
          .map(el => {
            if (el.check === false) {
              totalDeliverySum += el.orderNum;
            } else {
              totalDeliverySum += el.orderNum;
              finishDeliverySum += el.orderNum;
            }
          });
        //list에 대학교가 있는지 여부 판단 후 없으면 리스트에 객체 추가
        //이때 배달기사는 하나의 학교(RouteName)에만 배달을 한다고 가정하고 진행
        setUniversity(item.routeInfo.routeName);
        setPickupTotal(totalPickupSum);
        setPickupFinish(finishPickupSum);
        setDeliveryTotal(totalDeliverySum);
        setDeliveryFinish(finishDeliverySum);

        const index = list.findIndex(function (find) {
          return find.routeName === item.routeInfo.routeName;
        });
        if (index === -1) {
          setDriverList(driverList => {
            const newDriverList = [...driverList];
            newDriverList.push({userId: item.userId, name: item.name});
            return newDriverList;
          });
          setIndex(index);
        }
        //학교(routerName)가 있다면 driver 목록에 있는지 여부 판단 후
        //이미 존재하는 driver라면 driver는 추가하지 않고 원래있던 학교에 배달 진행여부만 체크하여 추가
        //존재하지 않는 driver라면 driver도 추가
        else {
          let check = false;
          list[index].driver.map(el => {
            if (el.userId === item.userId) {
              check = true;
            }
          });

          //존재하지 않는 드라이버인 경우 드라이버 추가, 드라이버 숫자 업데이트
          if (!check) {
            setList(list => {
              const newList = [...list];
              newList[index].driver.push({
                userId: item.userId,
                name: item.name,
              });
              newList[index].driverNum += 1;
              newList[index].pickupTotal += totalPickupSum;
              newList[index].pickupFinish += finishPickupSum;
              newList[index].deliveryTotal += totalDeliverySum;
              newList[index].deliveryFinish += finishDeliverySum;
              return newList;
            });
          }
        }
      });
    }
  }, [tempList]);

  useEffect(() => {
    //새로 추가되는 학교일 때 실행(list 배열에 새로운 객체 업데이트)
    if (index === -1) {
      setList(list => {
        const newList = [...list];
        newList.push({
          routeName: university,
          driver: [driverList[driverList.length - 1]],
          driverNum: 1,
          pickupTotal: pickupTotal,
          pickupFinish: pickupFinish,
          deliveryTotal: deliveryTotal,
          deliveryFinish: deliveryFinish,
        });
        return newList;
      });
      setPickupTotal(0);
      setPickupFinish(0);
      setDeliveryTotal(0);
      setDeliveryFinish(0);
      setIndex(0);
    }
  }, [index]);

  function leftPad(value) {
    if (value >= 10) {
      return value;
    }
    return `0${value}`;
  }

  function toStringByFormatting(source, delimiter = '-') {
    const year = source.getFullYear();
    const month = leftPad(source.getMonth() + 1);
    const day = leftPad(source.getDate());

    return [year, month, day].join(delimiter);
  }

  const requestCameraPermission = async () => {
    try {
      granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the CAMERA');
      } else {
        console.log('CAMERA permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestStoragePermission = async () => {
    try {
      granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the STORAGE');
      } else {
        console.log('STORAGE permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const changeProfile = () => {
    const image = {
      uri: '',
      type: 'image/jpeg',
      name: 'test',
    };
    //launchImageLibrary : 사용자 앨범 접근
    launchImageLibrary({}, res => {
      if (res.didCancel) {
        // console.log('user cancelled image Picker');
      } else if (res.errorCode) {
        console.log('ImagePicker Error: ', res.errorCode);
      } else if (res.assets) {
        //정상적으로 사진을 반환 받았을 때
        console.log('ImagePicker res', res);
        image.name = res.assets[0].fileName;
        image.type = res.assets[0].type;
        image.uri = res.assets[0].uri;
      }
      const formdata = new FormData();
      formdata.append('image', image);
      formdata.append('userId', userInfo.id);
      axios({
        method: 'post',
        url: camera_service.uploadFile(),
        data: formdata,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data, headers) => {
          return data;
        },
      })
        .then(res => {
          console.log('파일업로드');
          axios({
            method: 'get',
            url: camera_service.getFile(),
            params: {
              userId: userInfo.id,
            },
          })
            .then(result => {
              console.log('파일가져오기', result.data);
              setProfileImage(result.data);
              dispatch(setProfile(result.data));
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(e => {
          console.log(e);
        });
    });
  };

  useEffect(() => {
    requestCameraPermission();
    requestStoragePermission();
  }, []);

  useEffect(() => {
    if (userInfo.profile !== '') {
      setProfileImage(userInfo.profile);
    }
  }, [userInfo.profile]);

  return (
    <View style={styles.container}>
      {/* 메인화면 헤더 */}
      <View style={styles.top}>
        {/* 배부릉 헤더 로고 */}
        <View style={styles.logoLayout}>
          <Image
            source={logo}
            style={{
              width: SCREEN_WIDTH / 8,
              height: SCREEN_HEIGHT / 16,
            }}></Image>
        </View>

        {/*헤더 텍스트 (*** 관리자님) */}
        <View style={styles.topTextLayout}>
          <Text style={styles.topText}> {userInfo.name} 관리자님</Text>
        </View>

        {/* 프로필 사진 */}
        <Pressable
          onPress={async () => {
            changeProfile();
          }}>
          <View
            style={{
              flex: 1,
              width: SCREEN_WIDTH / 3.7,
              height: SCREEN_HEIGHT / 7,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {profileImage === '' && (
              <Image
                source={defaultImage}
                style={{width: SCREEN_WIDTH / 7, height: SCREEN_HEIGHT / 16}}
              />
            )}
            {profileImage !== '' && (
              <Image
                source={profileImage ? {uri: userInfo.profile} : null}
                style={{
                  borderRadius: 50,
                  width: SCREEN_WIDTH / 8,
                  height: SCREEN_HEIGHT / 15,
                }}
              />
            )}
          </View>
        </Pressable>
      </View>

      <View style={styles.dailyWorkLayout}>
        <View style={styles.dailyWorkTitleTextLayout}>
          <Text style={styles.dailyWorkTitleText}>업무현황 ({date}) </Text>
        </View>
        <View style={styles.dailyWork}>
          <FlatList
            style={styles.dailyWorkListLayout}
            data={list}
            keyExtractor={(item, idx) => idx}
            renderItem={({item}) => (
              <Pressable
                onPress={() => {
                  navigation.navigate('DetailWork', {
                    headerTitle: `${item.routeName}`,
                    routeName: item.routeName,
                    routeList: tempList,
                  });
                }}>
                {({pressed}) => (
                  <View
                    style={
                      pressed
                        ? styles.dailyWorkListClick
                        : [
                            styles.dailyWorkList,
                            item.routeName === '전남대학교' && {
                              backgroundColor: '#CCFFE5',
                            },
                            item.routeName === '연세대학교' && {
                              backgroundColor: '#CCFFFF',
                            },
                            item.routeName === '광주과학기술원' && {
                              backgroundColor: '#FFCCE5',
                            },
                          ]
                    }>
                    <View style={styles.dailWorkFirstLine}>
                      <View style={{flex: 1}}>
                        <Text style={styles.dailyWorkListText}>
                          {item.routeName}
                        </Text>
                      </View>
                      <View style={{flex: 1}}>
                        <Text style={styles.driverNumText}>
                          드라이버 {item.driverNum}명
                        </Text>
                      </View>
                    </View>
                    {/* 대학 로고 Layout */}
                    <View style={styles.universityLogoLayout}>
                      {item.routeName === '연세대학교' && (
                        <Image
                          source={yonsei}
                          style={styles.universityLogo}></Image>
                      )}
                      {item.routeName === '전남대학교' && (
                        <Image
                          source={CNU}
                          style={styles.universityLogo}></Image>
                      )}
                      {item.routeName === '광주과학기술원' && (
                        <Image
                          source={GIST}
                          style={styles.universityLogo}></Image>
                      )}
                    </View>
                    <View style={styles.dailWorkFirstLine}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                        }}>
                        {item.pickupTotal === item.pickupFinish && (
                          <Text style={styles.dailyWorkFinishText}>
                            픽업 완료
                          </Text>
                        )}
                        {item.pickupTotal !== item.pickupFinish && (
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              justifyContent: 'flex-end',
                            }}>
                            <Text> 픽업 현황 : </Text>
                            <Text style={styles.dailyWorkText}>
                              {item.pickupFinish}{' '}
                            </Text>
                            <Text style={{fontWeight: 'bold'}}>
                              / {item.pickupTotal}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                        }}>
                        {item.deliveryTotal === item.deliveryFinish && (
                          <Text style={styles.dailyWorkFinishText}>
                            배달 완료
                          </Text>
                        )}
                        {item.deliveryTotal !== item.deliveryFinish && (
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              justifyContent: 'flex-end',
                            }}>
                            <Text> 배달 현황 : </Text>
                            <Text style={styles.dailyWorkText}>
                              {item.deliveryFinish}{' '}
                            </Text>
                            <Text style={{fontWeight: 'bold'}}>
                              / {item.deliveryTotal}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                )}
              </Pressable>
            )}></FlatList>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    flexDirection: 'row',
    height: SCREEN_HEIGHT / 9,
    backgroundColor: identityColor,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 2,
    shadowOpacity: 0.4,
  },
  logoLayout: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTextLayout: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: identityTextColor,
  },
  dailyWorkLayout: {
    flex: 1,
  },
  dailyWorkTitleTextLayout: {
    alignItems: 'flex-start',
    paddingLeft: 30,
    paddingTop: 15,
    justifyContent: 'center',
  },
  dailyWorkTitleText: {
    fontSize: 20,
    fontWeight: '900',
  },
  dailyWork: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 15,
  },
  dailyWorkListLayout: {
    marginHorizontal: 15,
    marginVertical: 15,
  },
  dailyWorkList: {
    flex: 1,
    height: SCREEN_HEIGHT / 10,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    marginBottom: 20,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 1,
    shadowOpacity: 0.4,
  },
  dailyWorkListClick: {
    flex: 1,
    height: SCREEN_HEIGHT / 10,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    marginBottom: 20,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 1,
    shadowOpacity: 0.4,
  },
  universityLogo: {
    flex: 1,
    width: SCREEN_WIDTH / 6,
    height: SCREEN_HEIGHT / 6,
    opacity: 0.7,
  },
  universityLogoLayout: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailWorkFirstLine: {
    flex: 1,
    flexDirection: 'column',
  },
  dailyWorkListText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  dailyWorkFinishText: {
    color: 'green',
  },
  dailyWorkText: {
    color: 'red',
  },
});
export default ManagerHome;

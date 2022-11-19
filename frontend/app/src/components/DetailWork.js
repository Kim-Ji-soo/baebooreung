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
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import yonsei from '../assets/images/yonsei.png';
import CNU from '../assets/images/CNU.png';
import GIST from '../assets/images/gist.png';
import axios from 'axios';
import {business_service, camera_service} from '../api/api';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
const identityColor = '#0B0B3B';
const identityTextColor = '#F7FE2E';

export default function DetailWork(props) {
  const [ok, setOk] = useState(false);
  const [workType, setWorkType] = useState(false); // 픽업장소 / 배달장소 분기처리
  const [ID, setID] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [driverList, setDriverList] = useState([]);
  const [currentLoc, setCurrentLoc] = useState('');
  const [checkImage, setCheckImage] = useState('');
  const [checkArr, setCheckArr] = useState([]); //현재 상황이 픽업/배달 완료인지 미완료인지 클릭이벤트로 checkArr 배열에 저장
  useEffect(() => {
    //props 로 받아온 조건에 맞는 루트 리스트를 driverList에 저장
    props.routeList.map((item, idx) => {
      setDriverList(driverList => {
        const newDriverList = [...driverList];
        newDriverList.push({
          id: item.id,
          userId: item.userId,
          name: item.name,
          routeInfo: item.routeInfo,
        });
        return newDriverList;
      });
    });
    setOk(true);
  }, []);

  useEffect(() => {
    checkArr.sort(function (a, b) {
      return b - a;
    });
    console.log(checkArr);
  }, [checkArr]);

  useEffect(() => {
    if (driverList.length !== 0) {
      // console.log('');
      // console.log('driverList목록 : item 값', driverList[0]);
      // console.log('');
      // console.log('driverList목록 : routerInfo값', driverList[0].routeInfo);
      // console.log('');
      // console.log(
      //   'driverList목록 : deliveryList값',
      //   driverList[0].routeInfo.deliveryList,
      // );
      // console.log('');
      // console.log(
      //   'driverList목록 : deliveryList의 첫번째 요소값',
      //   driverList[0].routeInfo.deliveryList[0],
      // );
    }
  }, [ok]);

  return (
    <View style={styles.container}>
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
                    if (ID !== item.id) {
                      //드라이버의 실제 배송 업무중 check 값이 실시간으로 바뀔때를 대비하여 만든 api / 클릭때마다 실행하여 상태를 확인할 수 있도록 한다.
                      //클릭시 모든 DELIVERYlIST의 완료/미완료 유무 저장
                      setCheckArr([]);
                      item.routeInfo.deliveryList.map(async el => {
                        await axios({
                          method: 'get',
                          url: business_service.getCheckStatus() + `${el.id}`,
                        })
                          .then(res => {
                            console.log(res.data);
                            setCheckArr(checkArr => {
                              const newCheckArr = [...checkArr];
                              newCheckArr.push(res.data);
                              return newCheckArr;
                            });
                          })
                          .catch(e => {
                            console.log(e);
                          });
                      });
                      setID(item.id);
                      setWorkType(false);
                    } else {
                      setID('');
                      setCheckArr([]);
                      setWorkType(false);
                    }
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

                {ID === item.id && (
                  <View style={styles.ScrollList}>
                    <View style={styles.driverHeader}>
                      {/* 픽업 장소 버튼 */}
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                          setWorkType(false);
                          setCheckArr([]);
                          item.routeInfo.deliveryList.map(async el => {
                            await axios({
                              method: 'get',
                              url:
                                business_service.getCheckStatus() + `${el.id}`,
                            })
                              .then(res => {
                                console.log(res.data);
                                setCheckArr(checkArr => {
                                  const newCheckArr = [...checkArr];
                                  newCheckArr.push(res.data);
                                  return newCheckArr;
                                });
                              })
                              .catch(e => {
                                console.log(e);
                              });
                          });
                        }}>
                        <Text
                          style={
                            workType
                              ? styles.driverHeaderText
                              : styles.driverHeaderClickText
                          }>
                          픽업 장소
                        </Text>
                      </TouchableOpacity>

                      {/* 배달 장소 버튼 */}
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                          setWorkType(true);
                          setCheckArr([]);
                          item.routeInfo.deliveryList.map(async el => {
                            await axios({
                              method: 'get',
                              url:
                                business_service.getCheckStatus() + `${el.id}`,
                            })
                              .then(res => {
                                console.log(res.data);
                                setCheckArr(checkArr => {
                                  const newCheckArr = [...checkArr];
                                  newCheckArr.push(res.data);
                                  return newCheckArr;
                                });
                              })
                              .catch(e => {
                                console.log(e);
                              });
                          });
                        }}>
                        <Text
                          style={
                            workType
                              ? styles.driverHeaderClickText
                              : styles.driverHeaderText
                          }>
                          배달 장소
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* 픽업 장소 부분 */}
                    {workType === false && (
                      //이중 FlatList 사용시 주의 (실제 renderItem은 (item,index값을 받음))
                      <View>
                        {/* 이름 / 시간 / 완료여부 */}
                        <View style={styles.pickupTopLayout}>
                          <View style={styles.pickupRestaurantName}>
                            <Text style={styles.pickupRestaurantNameText}>
                              픽업지명
                            </Text>
                          </View>
                          <View style={styles.pickupTime}>
                            <Text
                              style={[
                                styles.pickupTimeText,
                                {fontWeight: 'bold'},
                              ]}>
                              예상시간
                            </Text>
                          </View>
                          <View style={styles.pickupFinish}>
                            <Text style={{fontWeight: 'bold'}}>상태</Text>
                          </View>
                        </View>

                        {/* 픽업지 FlatList */}
                        <FlatList
                          style={styles.pickupListLayout}
                          data={item.routeInfo.deliveryList}
                          keyExtractor={(el, idx) => 'key' + idx}
                          renderItem={el => (
                            <View>
                              {el.item.type === 'pickup' && (
                                <View style={styles.pickupLayout}>
                                  <View style={styles.pickupRestaurantName}>
                                    <Text
                                      style={styles.pickupRestaurantNameText}>
                                      {el.item.delName}
                                    </Text>
                                    <Text
                                      style={
                                        checkArr[el.index] === true
                                          ? {color: 'green'}
                                          : styles.pickupOrderQuantityText
                                      }>
                                      {el.item.orderNum}건
                                    </Text>
                                  </View>
                                  <View style={styles.pickupTime}>
                                    <Text style={styles.pickupTimeText}>
                                      {el.item.delScheduledTime.substr(0, 5)}
                                    </Text>
                                  </View>
                                  <View style={styles.pickupFinish}>
                                    {checkArr[el.index] === true && (
                                      <Pressable
                                        onPress={() => {
                                          setModalVisible(!modalVisible);
                                          setCurrentLoc(el.item.delName);
                                          axios({
                                            method: 'get',
                                            url: camera_service.getCheckIn(),
                                            params: {
                                              delId: el.item.id,
                                            },
                                          })
                                            .then(res => {
                                              console.log(res.data);
                                              setCheckImage(res.data);
                                            })
                                            .catch(e => {
                                              console.log(e);
                                            });
                                        }}>
                                        <View style={{flexDirection: 'row'}}>
                                          <Text style={styles.pickupFinishText}>
                                            완료{' '}
                                          </Text>
                                          <Icon
                                            name="image-search"
                                            size={18}></Icon>
                                        </View>
                                      </Pressable>
                                    )}
                                    {checkArr[el.index] === false && (
                                      <Text style={styles.pickupFailText}>
                                        미완료
                                      </Text>
                                    )}
                                  </View>
                                </View>
                              )}
                            </View>
                          )}></FlatList>
                      </View>
                    )}

                    {workType === true && (
                      <View>
                        {/* 이름 / 시간 / 완료여부 */}
                        <View style={styles.pickupTopLayout}>
                          <View style={styles.pickupRestaurantName}>
                            <Text style={styles.pickupRestaurantNameText}>
                              배달지명
                            </Text>
                          </View>
                          <View style={styles.pickupTime}>
                            <Text
                              style={[
                                styles.pickupTimeText,
                                {fontWeight: 'bold'},
                              ]}>
                              예상시간
                            </Text>
                          </View>
                          <View style={styles.pickupFinish}>
                            <Text style={{fontWeight: 'bold'}}>상태</Text>
                          </View>
                        </View>

                        {/* 배달지 FlatList */}
                        <FlatList
                          style={styles.deliveryListLayout}
                          data={item.routeInfo.deliveryList}
                          keyExtractor={(el, idx) => idx}
                          renderItem={el => (
                            <View>
                              {el.item.type === 'delivery' && (
                                <View style={styles.deliveryLayout}>
                                  <View style={styles.deliveryLocationName}>
                                    <Text
                                      style={styles.deliveryLocationNameText}>
                                      {el.item.delName}
                                    </Text>
                                    <Text
                                      style={
                                        checkArr[el.index] === true
                                          ? {color: 'green'}
                                          : styles.deliveryQuantityText
                                      }>
                                      {el.item.orderNum}건
                                    </Text>
                                  </View>
                                  <View style={styles.deliveryTime}>
                                    <Text style={styles.deliveryTimeText}>
                                      {el.item.delScheduledTime.substr(0, 5)}
                                    </Text>
                                  </View>
                                  <View style={styles.deliveryFinish}>
                                    {/* 업무가 완료되었다면 해당 루트의 S3 사진파일 정보를 가져오고 
                                      해당 배달지의 이름 및 실제시간 갱신
                                    */}
                                    {checkArr[el.index] === true && (
                                      <Pressable
                                        onPress={() => {
                                          setModalVisible(!modalVisible);
                                          setCurrentLoc(el.item.delName);
                                          axios({
                                            method: 'get',
                                            url: camera_service.getCheckIn(),
                                            params: {
                                              delId: el.item.id,
                                            },
                                          })
                                            .then(res => {
                                              console.log(res.data);
                                              setCheckImage(res.data);
                                            })
                                            .catch(e => {
                                              console.log(e);
                                            });
                                        }}>
                                        <View style={{flexDirection: 'row'}}>
                                          <Text
                                            style={styles.deliveryFinishText}>
                                            완료{' '}
                                          </Text>
                                          <Icon
                                            name="image-search"
                                            size={18}></Icon>
                                        </View>
                                      </Pressable>
                                    )}
                                    {checkArr[el.index] === false && (
                                      <Text style={styles.deliveryFailText}>
                                        미완료
                                      </Text>
                                    )}
                                  </View>
                                </View>
                              )}
                            </View>
                          )}></FlatList>
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
        )}></FlatList>

      {/* 이미지 모달창 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalTextView}>
              <Text style={{fontWeight: 'bold', fontSize: 16}}>
                {currentLoc}
              </Text>
            </View>
            <View style={{alignItems: 'center'}}>
              {checkImage !== '' ? (
                <Image
                  source={checkImage !== '' ? {uri: checkImage} : null}
                  style={styles.modalImage}
                />
              ) : (
                <ActivityIndicator size="large"></ActivityIndicator>
              )}
            </View>
            <View style={styles.buttonLayout}>
              <Pressable
                style={[styles.button]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>확인</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: SCREEN_HEIGHT / 12,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 10,
    shadowOpacity: 0.4,
  },
  headerText: {
    fontSize: 18,
  },
  headerClickText: {
    fontSize: 18,
    color: '#00BFFF',
    fontWeight: 'bold',
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

  image: {
    resizeMode: 'stretch',
    width: 70,
    height: 50,
  },
  ScrollList: {
    marginHorizontal: 15,
    backgroundColor: 'white',
  },
  driverHeader: {
    height: SCREEN_HEIGHT / 15,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderColor: 'black',
  },
  driverHeaderText: {
    fontSize: 15,
  },
  driverHeaderClickText: {
    fontSize: 15,
    color: identityColor,
    fontWeight: 'bold',
  },
  pickupListLayout: {
    flex: 1,
    marginHorizontal: 10,
  },
  pickupLayout: {
    height: SCREEN_HEIGHT / 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  pickupRestaurantName: {
    flex: 4,
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  pickupRestaurantNameText: {
    fontWeight: 'bold',
  },
  pickupOrderQuantityText: {
    color: 'red',
  },
  pickupTime: {
    flex: 1.5,
    alignItems: 'center',
  },
  pickupTimeText: {},
  pickupFinish: {
    flex: 2,
    alignItems: 'center',
  },
  pickupFinishText: {
    color: 'green',
    fontWeight: 'bold',
  },
  pickupFailText: {
    color: 'red',
  },
  deliveryListLayout: {
    flex: 1,
    marginHorizontal: 10,
  },
  deliveryLayout: {
    height: SCREEN_HEIGHT / 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  deliveryLocationName: {
    flex: 4,
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  deliveryLocationNameText: {
    fontWeight: 'bold',
  },
  deliveryQuantityText: {
    color: 'red',
  },
  deliveryTime: {
    flex: 1.5,
    alignItems: 'center',
  },
  deliveryTimeText: {},
  deliveryFinish: {
    flex: 2,
    alignItems: 'center',
  },
  deliveryFinishText: {
    color: 'green',
    fontWeight: 'bold',
  },
  deliveryFailText: {
    color: 'red',
  },

  //모달 css
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTextView: {
    padding: 5,
  },
  buttonLayout: {
    alignItems: 'center',
  },

  button: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: identityColor,
  },

  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalImage: {
    resizeMode: 'stretch',
    width: (SCREEN_WIDTH * 2) / 3,
    height: SCREEN_HEIGHT / 3,
    marginVertical: 10,
  },
  ////////////////////////////////////////////모달 끝///
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

  pickupTopLayout: {
    height: SCREEN_HEIGHT / 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 10,
    borderBottomWidth: 1,
  },
});

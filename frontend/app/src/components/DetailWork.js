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
import Icon from 'react-native-vector-icons/MaterialIcons';
import Truck from '../assets/images/truck.png';
import Sample from '../assets/images/sample.png';
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
const identityColor = '#0B0B3B';
const identityTextColor = '#F7FE2E';

export default function DetailWork(props) {
  const [ok, setOk] = useState(false);
  const [workType, setWorkType] = useState(false); // 픽업장소 / 수령장소 분기처리
  const [ID, setID] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [driverList, setDriverList] = useState([]);

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
                      setID(item.id);
                      setWorkType(false);
                    } else {
                      setID('');
                      setWorkType(false);
                    }
                  }}>
                  <View>
                    <View
                      style={
                        ID === item.id
                          ? styles.driverListClick
                          : styles.driverList
                      }>
                      <View style={styles.driverListTextLayout}>
                        <Text
                          style={
                            ID === item.id
                              ? styles.driverListClickText
                              : styles.driverListText
                          }>
                          {item.routeInfo.routeName} {item.name} 드라이버
                        </Text>
                      </View>
                      <View style={styles.driverListImageLayout}>
                        <Image source={Truck} style={styles.image} />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                {ID === item.id && (
                  <View style={styles.ScrollList}>
                    <View style={styles.driverHeader}>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                          return setWorkType(false);
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
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                          return setWorkType(true);
                        }}>
                        <Text
                          style={
                            workType
                              ? styles.driverHeaderClickText
                              : styles.driverHeaderText
                          }>
                          수령 장소
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {workType === false && (
                      //이중 FlatList 사용시 주의 (실제 renderItem은 (item,index값을 받음))
                      <FlatList
                        style={styles.pickupListLayout}
                        data={item.routeInfo.deliveryList}
                        keyExtractor={(el, idx) => 'key' + idx}
                        renderItem={el => (
                          <View>
                            {el.item.type === 'pickup' && (
                              <View style={styles.pickupLayout}>
                                <View style={styles.pickupRestaurantName}>
                                  <Text style={styles.pickupRestaurantNameText}>
                                    {el.item.delName}
                                  </Text>
                                  <Text style={styles.pickupOrderQuantityText}>
                                    {el.item.orderNum}건
                                  </Text>
                                </View>
                                <View style={styles.pickupTime}>
                                  <Text style={styles.pickupTimeText}>
                                    {el.item.delScheduledTime.substr(0, 5)}
                                  </Text>
                                </View>
                                <View style={styles.pickupFinish}>
                                  {el.item.check === true && (
                                    <Pressable
                                      onPress={() => {
                                        setModalVisible(!modalVisible);
                                      }}>
                                      <View style={{flexDirection: 'row'}}>
                                        <Text style={styles.pickupFinishText}>
                                          픽업 완료
                                        </Text>
                                        <Icon
                                          name="image-search"
                                          size={18}></Icon>
                                      </View>
                                    </Pressable>
                                  )}
                                  {el.item.check === false && (
                                    <Text style={styles.pickupFailText}>
                                      미완료
                                    </Text>
                                  )}
                                </View>
                              </View>
                            )}
                          </View>
                        )}></FlatList>
                    )}

                    {workType === true && (
                      <FlatList
                        style={styles.deliveryListLayout}
                        data={item.routeInfo.deliveryList}
                        keyExtractor={(el, idx) => idx}
                        renderItem={el => (
                          <View>
                            {el.item.type === 'delivery' && (
                              <View style={styles.deliveryLayout}>
                                <View style={styles.deliveryLocationName}>
                                  <Text style={styles.deliveryLocationNameText}>
                                    {el.item.delName}
                                  </Text>
                                  <Text style={styles.deliveryQuantityText}>
                                    {el.item.orderNum}건
                                  </Text>
                                </View>
                                <View style={styles.deliveryTime}>
                                  <Text style={styles.deliveryTimeText}>
                                    {el.item.delScheduledTime.substr(0, 5)}
                                  </Text>
                                </View>
                                <View style={styles.deliveryFinish}>
                                  {el.item.check === true && (
                                    <Pressable
                                      onPress={() => {
                                        setModalVisible(!modalVisible);
                                      }}>
                                      <View style={{flexDirection: 'row'}}>
                                        <Text style={styles.deliveryFinishText}>
                                          수령 완료
                                        </Text>
                                        <Icon
                                          name="image-search"
                                          size={18}></Icon>
                                      </View>
                                    </Pressable>
                                  )}
                                  {el.item.check === false && (
                                    <Text style={styles.deliveryFailText}>
                                      미완료
                                    </Text>
                                  )}
                                </View>
                              </View>
                            )}
                          </View>
                        )}></FlatList>
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
            <Text></Text>
            <View style={{alignItems: 'center'}}>
              <Image source={Sample} style={styles.modalImage} />
            </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>확인</Text>
            </Pressable>
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
    backgroundColor: 'black',
    borderRadius: 10,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 2,
    shadowOpacity: 0.4,
  },
  driverListTextLayout: {
    flex: 1,
    alignItems: 'center',
  },
  driverListText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  driverListClickText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  driverListImageLayout: {
    felx: 1,
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
    color: '#00BFFF',
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
    flex: 3,
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
    flex: 1,
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
    flex: 3,
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
    flex: 1,
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
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: identityColor,
  },
  textStyle: {
    color: identityTextColor,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalImage: {
    resizeMode: 'stretch',
    width: (SCREEN_WIDTH * 2) / 3,
    height: SCREEN_HEIGHT / 3,
    marginVertical: 10,
  },
});

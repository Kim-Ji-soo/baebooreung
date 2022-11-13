import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Pressable,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {business_service} from '../api/api';
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
const identityColor = '#0B0B3B';
const identityTextColor = '#FACC2E';
const date = new Date();

function ManagerHome({navigation}) {
  const userInfo = useSelector(state => state.user);
  const userList = useSelector(state => state.userList.userList);
  const [tempList, setTempList] = useState([]);
  const [ok, setOk] = useState(false);
  const [list, setList] = useState([]);
  const [driverList, setDriverList] = useState([]);
  const [university, setUniversity] = useState('');
  const [pickupTotal, setPickupTotal] = useState(0);
  const [pickupFinish, setPickupFinish] = useState(0);
  const [deliveryTotal, setDeliveryTotal] = useState(0);
  const [deliveryFinish, setDeliveryFinish] = useState(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    //userList(나를 제외한 유저리스트)가 갱신되었을 때 실행
    if (userList !== null) {
      //현재 날짜를 받음
      const realDate = toStringByFormatting(new Date());
      console.log(realDate);
      //현재 시간을 받음
      const realTime = new Date().getHours();
      console.log(realTime);
      //오후 10시부터 오후 2시까지는 점심정보를 띄움,오후 2시부터 오후 10시까지는 저녁정보를 띄움

      let realType; //점심, 저녁에 대한 정보를 시간에 따라 저장
      if (realTime >= 14 && realTime < 22) {
        realType = 'dinner';
      } else {
        realType = 'lunch';
      }

      // 먼저 유저리스트에서 grade가 DRIVER인 유저만 추출하여 드라이버가 가지고있는 루트ID를 추출
      userList
        .filter(item => item.grade === 'DRIVER')
        .map((item, idx) => {
          axios({
            method: 'get',
            url: business_service.getDriverRoute() + `${item.id}/` + 'routes/',
          })
            .then(res => {
              console.log(
                item.name,
                '드라이버의 id를 통해 얻을 수 있는 정보',
                res.data,
              );

              //추출된 루트ID를 가지고 그 루트ID가 가지고있는 경로 정보 모두 추출
              if (res.data.length !== 0) {
                res.data.map((el, idx) => {
                  axios({
                    method: 'get',
                    url: business_service.getRoute() + `${el.id}`,
                  })
                    .then(result => {
                      console.log(
                        item.name,
                        '드라이버가 저장한 루트id를 통해 얻을 수 있는 정보',
                        result.data,
                      );
                      // 루트 정보의 date값과 routeType을 비교하여(ex)date : 2022-01-01 routeType : lunch)
                      // if(realDate === result.data.date && realType === result.data.routeType){
                      // }
                      // (userId, name, routeInfo)라는 속성을 가지는 새로운 객체배열에 저장
                      setTempList(tempList => {
                        const newTempList = [...tempList];
                        newTempList.push({
                          userId: item.email,
                          name: item.name,
                          routeInfo: result.data,
                        });
                        return newTempList;
                      });
                    })
                    .catch(e => {
                      console.log(e);
                    })
                    .finally(fin => {
                      setOk(true);
                    });
                });
              }
            })
            .catch(e => {
              console.log(e);
            });
        });
    }
  }, [userList]);

  useEffect(() => {
    //모든 루트 정보가 저장되었을 시 실행
    if (tempList.length !== 0) {
      console.log(tempList);
      tempList.map(item => {
        //routeInfo의 done이 false일때만 진행
        if (!item.routeInfo.done) {
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
          const index = list.findIndex(find => {
            find.routeName === item.routeInfo.routeName;
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
            //이미 존재하는 드라이버인 경우
            if (check) {
              setList(list => {
                const newList = [...list];
                newList[index].pickupTotal += totalPickupSum;
                newList[index].pickupFinish += finishPickupSum;
                newList[index].deliveryTotal += totalDeliverySum;
                newList[index].deliveryFinish += finishDeliverySum;
                return newList;
              });
            }
            //존재하지 않는 드라이버인 경우 드라이버 추가, 드라이버 숫자 업데이트
            else {
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
        }
      });
    }
  }, [ok]);

  useEffect(() => {
    //새로 추가되는 학교일 때 실행(list 배열에 새로운 객체 업데이트)
    console.log('useEffec문 실행', index);
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

  useEffect(() => {
    if (list.length !== 0) {
      // console.log('list update');
      // console.log('업데이트 worklist', list);
    }
  }, [list]);

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

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Icon
          name="person"
          size={SCREEN_HEIGHT / 8}
          color={identityTextColor}></Icon>
        <View style={styles.topTextLayout}>
          {userInfo.grade === 'MANAGER' && (
            <Text style={styles.topText}> {userInfo.name} 관리자님</Text>
          )}
          {userInfo.grade === 'DRIVER' && (
            <Text style={styles.topText}> {userInfo.name} 드라이버님</Text>
          )}
        </View>
      </View>

      <View style={styles.dailyWorkLayout}>
        <View style={styles.dailyWorkTitleTextLayout}>
          <Text style={styles.dailyWorkTitleText}>업무현황</Text>
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
                    routeList: tempList,
                  });
                }}>
                {({pressed}) => (
                  <View
                    style={
                      pressed ? styles.dailyWorkListClick : styles.dailyWorkList
                    }>
                    <View style={styles.dailWorkFirstLine}>
                      <View style={{flex: 1}}>
                        <Text style={styles.dailyWorkListText}>
                          {item.routeName}
                        </Text>
                      </View>
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
                    </View>
                    <View style={styles.dailWorkFirstLine}>
                      <View style={{flex: 1}}>
                        <Text style={styles.driverNumText}>
                          드라이버 {item.driverNum}명
                        </Text>
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
    height: SCREEN_HEIGHT / 8,
    backgroundColor: identityColor,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 2,
    shadowOpacity: 0.4,
  },
  topTextLayout: {
    flex: 1,
    alignItems: 'flex-start',
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
    justifyContent: 'space-between',
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
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgb(210, 230, 255)',
    marginBottom: 20,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 1,
    shadowOpacity: 0.4,
  },
  dailWorkFirstLine: {
    flex: 1,
    flexDirection: 'row',
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

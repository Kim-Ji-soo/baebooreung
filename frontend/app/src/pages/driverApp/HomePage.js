import * as React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Route from '../../components/Route';
import {useSelector, useDispatch} from 'react-redux';
import {business_service} from '../../api/api';
import axios from 'axios';
import {
  setDinnerActualStartTime,
  setLunchActualStartTime,
} from '../../redux/work';

const HomePage = ({navigation}) => {
  const dispatch = useDispatch();
  const lunchRouteId = useSelector(state => state.work.lunchRouteId);
  const dinnerRouteId = useSelector(state => state.work.dinnerRouteId);
  function GetLunchActualstartTime() {
    if (lunchRouteId !== -1) {
      axios({
        url: business_service.getActualStartTime() + `${lunchRouteId}`,
        method: 'get',
      })
        .then(res => {
          console.log('점심 실제 시작 시간', res.data);
          dispatch(setLunchActualStartTime(res.data));
        })
        .catch(err => {
          console.log("getActualStartTime's", err);
        });
    }
  }
  function GetDinnerActualTime() {
    if (dinnerRouteId !== -1) {
      axios({
        url: business_service.getActualStartTime() + `${dinnerRouteId}`,
        method: 'get',
      })
        .then(res => {
          console.log('저녁 실제 시작 시간', res.data);
          dispatch(setDinnerActualStartTime(res.data));
        })
        .catch(err => {
          console.log("getActualStartTime's", err);
        });
    }
  }
  React.useEffect(() => {
    GetLunchActualstartTime();
    GetDinnerActualTime();
  }, []);

  const name = useSelector(state => state.user.name);
  return (
    <View style={styles.MainRootContainer}>
      <View style={styles.MainHeader}>
        <Text style={styles.MainHeaderText}>안녕하세요 {name}님</Text>
        <Text style={styles.todayList}>오늘의 배송 목록</Text>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <Route navigation={navigation} />
      </ScrollView>
    </View>
  );
};
export default HomePage;

const styles = StyleSheet.create({
  MainRootContainer: {
    flex: 1,
    padding: 8,
  },
  MainHeader: {
    marginTop: 10,
    alignItems: 'center',
  },
  todayList: {
    fontSize: 20,
    marginVertical: 15,
    fontWeight: '600',
    borderBottomWidth: 0.5,
    width: '95%',
    textAlign: 'left',
  },
  MainHeaderText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  scrollContainer: {
    borderRadius: 8,
    height: '80%',
  },
});

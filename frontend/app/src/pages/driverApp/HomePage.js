import * as React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Route from '../../components/Route';
import {useSelector, useDispatch} from 'react-redux';
import {business_service} from '../../api/api';
import axios from 'axios';

const HomePage = ({navigation}) => {
  const dispatch = useDispatch();
  const lunchRouteId = useSelector(state => state.work.lunchRouteId);
  const dinnerRouteId = useSelector(state => state.work.dinnerRouteId);
  const today = useSelector(state => state.work.lunchDate);
  const [lunchActualStartTime, setLunchActualStartTime] = React.useState(null);
  const [dinnerActualStartTime, setDinnerActualStartTime] =
    React.useState(null);

  function GetLunchActualstartTime() {
    if (lunchRouteId !== -1) {
      axios({
        url: business_service.getActualStartTime() + `${lunchRouteId}`,
        method: 'get',
      })
        .then(res => {
          console.log('점심 실제 시작 시간', res.data);
          // dispatch(setLunchActualStartTime(res.data));
          setLunchActualStartTime(res.data);
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
          // dispatch(setDinnerActualStartTime(res.data));
          setDinnerActualStartTime(res.data);
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
        <View style={styles.today}>
          <Text style={styles.todayList}>오늘의 배송 목록</Text>
          <Text style={styles.todayList}>{today}</Text>
        </View>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <Route
          navigation={navigation}
          actualStartTime={{lunchActualStartTime, dinnerActualStartTime}}
        />
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
    justifyContent: 'center',
  },
  today: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    borderBottomWidth: 0.6,
  },
  todayList: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: '600',
    textAlign: 'left',
  },
  MainHeaderText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  scrollContainer: {
    borderRadius: 8,
  },
});

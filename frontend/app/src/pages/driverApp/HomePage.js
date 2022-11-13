import * as React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Route from '../../components/Route';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {business_service} from '../../api/api';
import {setDriverRouteList} from '../../redux/work';

const MainScreen = () => {
  const dispatch = useDispatch();
  const name = useSelector(state => state.auth.name);
  const id = useSelector(state => state.auth.id);

  const getDriverWorkRoute = id => {
    axios({
      method: 'get',
      url: business_service.getDriverRoute() + `${id}` + '/routes',
    })
      .then(res => {
        const response = res.data;
        const RouteInfo = [];
        for (let i = 0; i < response.length; i++) {
          for (let k = 0; k < response[i].deliveryList.length; k++) {
            RouteInfo.push(response[i].deliveryList[k]);
          }
        }
        console.log(RouteInfo);
        dispatch(setDriverRouteList(RouteInfo));
      })
      .catch(err => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    getDriverWorkRoute(id);
  }, []);

  return (
    <View style={styles.MainRootContainer}>
      <View style={styles.MainHeader}>
        <Text style={styles.MainHeaderText}>안녕하세요 {name}!</Text>
        <Text style={styles.todayList}>오늘의 배송 목록</Text>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <Route />
      </ScrollView>
    </View>
  );
};

export default MainScreen;

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

import * as React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Route from '../../components/Route';
import {useSelector} from 'react-redux';

const HomePage = ({navigation}) => {
  const name = useSelector(state => state.auth.name);
  return (
    <View style={styles.MainRootContainer}>
      <View style={styles.MainHeader}>
        <Text style={styles.MainHeaderText}>안녕하세요 {name}</Text>
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

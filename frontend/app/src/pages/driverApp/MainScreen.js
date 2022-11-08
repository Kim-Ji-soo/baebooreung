import * as React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Work from '../../components/Work';

const MainScreen = () => {
  return (
    <View style={styles.MainRootContainer}>
      <View style={styles.MainHeader}>
        <Text style={styles.MainHeaderText}>안녕하세요 username님!</Text>
        <Text style={styles.todayList}>오늘의 배송 목록</Text>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <Work />
        <Work />
        <Work />
        <Work />
        <Work />
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

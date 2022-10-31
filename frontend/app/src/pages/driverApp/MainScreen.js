import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const MainScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>안녕하세요 000 드라이버님!</Text>
      </View>
      {/* <View style={styles.notice}>
        <Text>공지사항</Text>
        <View style={styles.noticeContent}>
          <Text>자동체크인 기능 도입!</Text>
        </View>
      </View> */}
      <View style={styles.workList}>
        <Text style={styles.workTitle}>배송 리스트</Text>
        <View style={styles.workListOuter}>
          <View style={styles.workListInner}>
            <View style={styles.InnerContent}>
              <Text style={styles.workListText}>초돈 12:10 ~ SSAFY 13:10</Text>
              <Text style={styles.workListText}>45건</Text>
            </View>
            <View style={styles.InnerContent}>
              <Text style={styles.workListText}>초돈 12:10 ~ SSAFY 13:10</Text>
              <Text style={styles.workListText}>45건</Text>
            </View>
          </View>
        </View>
        <Text style={styles.workTitle}>배송 완료</Text>
        <View style={styles.workListOuter}>
          <View style={styles.workListInner}>
            <View style={styles.endworkList}>
              <Text style={styles.workListText}>초돈 12:10 ~ SSAFY 13:10</Text>
              <Text style={styles.workListText}>45건</Text>
            </View>
            <View style={styles.endworkList}>
              <Text style={styles.workListText}>초돈 12:10 ~ SSAFY 13:10</Text>
              <Text style={styles.workListText}>45건</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MainScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    justifyContent: 'center',
    flex: 1,
  },
  headerText: {
    fontSize: 25,
    fontWeight: '800',
  },
  workList: {
    flex: 5,
  },
  workTitle: {
    fontSize: 20,
    fontWeight: '800',
    padding: 8,
  },
  workListOuter: {
    backgroundColor: '#444444',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 16,
    margin: 8,
  },
  workListInner: {
    margin: 8,
    width: '90%',
    flexDirection: 'column',
  },
  endworkList: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#f9f9f9',
    marginVertical: 5,
    borderRadius: 16,
    padding: 10,
  },
  InnerContent: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#f9f9f9',
    marginVertical: 5,
    borderRadius: 16,
    padding: 10,
  },
  workListText: {
    fontSize: 20,
  },
});

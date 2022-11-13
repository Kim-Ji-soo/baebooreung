import React, {useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import line from '../assets/images/separator.png';
import BottomScrollSheet from './BottomScrollSheet';
const Route = () => {
  const ButtonStyle = {
    height: 30,
    width: '100%',
    backgroundColor: '#5d91de',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8559da',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  };
  const TextStyle = {
    color: 'white',
    fontWeight: '600',
  };
  const dummy2 = {
    id: 1,
    routeName: '전남대',
    routeType: 'launch',
    done: false,
    date: '2022-11-09',
    scheduledStartTime: '12:10:00',
    actualStartTime: '12:00:10',
    deliveryList: [
      {
        id: 1,
        delName: null,
        address: '상무초밥',
        latitude: 35.178507645020005,
        longitude: 126.89725214329398,
        sequence: 1,
        type: 'pickup',
        check: false,
        delScheduledTime: null,
        orderNum: 0,
      },
      {
        id: 2,
        delName: null,
        address: '제주돈사촌',
        latitude: 35.176550165280155,
        longitude: 126.89545696747228,
        sequence: 2,
        type: 'pickup',
        check: false,
        delScheduledTime: null,
        orderNum: 0,
      },
      {
        id: 3,
        delName: null,
        address: '민속촌 용봉점',
        latitude: 35.17463418534095,
        longitude: 126.89476782582572,
        sequence: 3,
        type: 'pickup',
        check: false,
        delScheduledTime: null,
        orderNum: 0,
      },
      {
        id: 4,
        delName: null,
        address: '수목원관리동',
        latitude: 35.173417033980826,
        longitude: 126.89970379232675,
        sequence: 4,
        type: 'delivery',
        check: false,
        delScheduledTime: null,
        orderNum: 0,
      },
      {
        id: 5,
        delName: null,
        address: '법학도서관',
        latitude: 35.17402792458988,
        longitude: 126.90273835097409,
        sequence: 5,
        type: 'delivery',
        check: false,
        delScheduledTime: null,
        orderNum: 0,
      },
    ],
  };
  return (
    <View style={styles.workRootContainer}>
      <View style={styles.workContainer}>
        <View style={styles.workTitle}>
          <View style={styles.workDate}>
            <Text style={styles.workDateText}>{dummy2.date}</Text>
            <Text style={styles.routeName}>{dummy2.routeName}</Text>
          </View>
          <View>
            {dummy2.actualStartTime === null && dummy2.done === false ? (
              <View style={styles.workReady}>
                <Text style={styles.workIndicatorText}>배송 예정</Text>
              </View>
            ) : null}
            {dummy2.actualStartTime !== null && dummy2.done === false ? (
              <View style={styles.workStart}>
                <Text style={styles.workIndicatorText}>배송 중</Text>
              </View>
            ) : null}
            {dummy2.actualStartTime !== null && dummy2.done !== false ? (
              <View style={styles.workEnd}>
                <Text style={styles.workIndicatorText}>배송 완료</Text>
              </View>
            ) : null}
          </View>
        </View>
        <View style={styles.workRoute}>
          <View style={styles.workRouteDate}>
            <Text style={styles.routeTime}>배송 시작</Text>
            <Text style={styles.routeTime}>
              {dummy2.scheduledStartTime.split(':')[0]} :{' '}
              {dummy2.scheduledStartTime.split(':')[1]}
            </Text>
          </View>
          <View style={styles.routeImage}>
            <Image source={line} style={styles.lineImage} />
          </View>
          <View style={styles.arrival}>
            <Text style={styles.arrivalText}>
              {dummy2.deliveryList[0].address}
            </Text>
            <Text style={styles.arrivalText}>
              {dummy2.deliveryList[dummy2.deliveryList.length - 1].address}
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <BottomScrollSheet
            title="상세보기"
            ButtonStyle={ButtonStyle}
            TextStyle={TextStyle}
            data={dummy2}
          />
        </View>
      </View>
    </View>
  );
};

export default Route;
const styles = StyleSheet.create({
  workRootContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
  },
  workContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '95%',
    height: 180,
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: '#e8e8e8',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingTop: 20,
    // paddingHorizontal: 10,
  },
  workTitle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  routeName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  workDateText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  workReady: {
    // borderWidth: 1,
    backgroundColor: '#5d91de',
    padding: 5,
    borderRadius: 5,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  workStart: {
    // borderWidth: 1,
    backgroundColor: '#a091ec',
    padding: 5,
    borderRadius: 5,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  workEnd: {
    // borderWidth: 1,
    backgroundColor: '#ec9191',
    padding: 5,
    borderRadius: 5,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  workIndicatorText: {
    fontSize: 15,
    color: 'white',
  },
  workRoute: {
    height: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  workRouteDate: {},
  routeTime: {
    fontSize: 15,
    marginBottom: 3,
  },
  lineImage: {
    width: 37,
    height: 37,
  },
  arrivalText: {
    fontSize: 15,
    marginBottom: 3,
  },
  footer: {
    marginBottom: 16,
    width: '100%',
  },
  deliveryReady: {},
  deliveryStart: {},
  deliveryEnd: {},
});

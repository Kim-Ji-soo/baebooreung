import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import line from '../assets/images/separator.png';
import BottomScrollSheet from './BottomScrollSheet';
import {business_service} from '../api/api';
import axios from 'axios';
import finalPropsSelectorFactory from 'react-redux/es/connect/selectorFactory';
import {produceWithPatches} from 'immer';

const Route = (props, {navigation}) => {
  const lunchRoute = useSelector(state => state.work.lunchRoute);
  const dinnerRoute = useSelector(state => state.work.dinnerRoute);
  const lunchRouteId = useSelector(state => state.work.lunchRouteId);
  const dinnerRouteId = useSelector(state => state.work.dinnerRouteId);
  const lunchRouteName = useSelector(state => state.work.lunchRouteName);
  const lunchDate = useSelector(state => state.work.lunchDate);
  const lunchScheduledStartTime = useSelector(
    state => state.work.lunchScheduledStartTime,
  );
  const dinnerRouteName = useSelector(state => state.work.dinnerRouteName);
  const dinnerDate = useSelector(state => state.work.dinnerDate);
  const dinnerScheduledStartTime = useSelector(
    state => state.work.dinnerScheduledStartTime,
  );
  const dinnerActualStartTime = useSelector(
    state => state.work.dinnerActualStartTime,
  );
  const lunchActualStartTime = useSelector(
    state => state.work.lunchActualStartTime,
  );
  const dinnerDone = useSelector(state => state.work.dinnerDone);
  const lunchDone = useSelector(state => state.work.lunchDone);

  console.log('route', lunchActualStartTime);
  console.log('route', dinnerActualStartTime);
  console.log('route lunchDone', lunchDone);
  console.log('route dinnerDone', dinnerDone);
  return (
    <View style={styles.workRootContainer}>
      {lunchRouteId !== -1 ? (
        <View style={styles.lunchWorkContainer}>
          <View style={styles.workTitle}>
            <View style={styles.workDate}>
              <Text style={styles.routeName}>{lunchRouteName}</Text>
            </View>
            <View>
              {props.actualStartTime.lunchActualStartTime === null ? (
                <View style={styles.workReady}>
                  <Text style={styles.workIndicatorText}>배송 예정 - 점심</Text>
                </View>
              ) : null}
              {props.actualStartTime.lunchActualStartTime !== null &&
              lunchDone === false ? (
                <View style={styles.workStart}>
                  <Text style={styles.workIndicatorText}>배송 중 - 점심</Text>
                </View>
              ) : null}
              {lunchDone === true ? (
                <View style={styles.workEnd}>
                  <Text style={styles.workIndicatorText}>배송 완료 - 점심</Text>
                </View>
              ) : null}
            </View>
          </View>
          <View style={styles.workRoute}>
            <View style={styles.workRouteDate}>
              <Text style={styles.routeTimeTitle}>배송 시작</Text>
              <Text style={styles.routeTime}>
                {lunchScheduledStartTime.split(':')[0]} :{' '}
                {lunchScheduledStartTime.split(':')[1]}
              </Text>
            </View>
            <View style={styles.routeImage}>
              <Image source={line} style={styles.lineImage} />
            </View>
            <View style={styles.arrival}>
              {lunchRoute[0].delName !== undefined ? (
                <>
                  <Text style={styles.arrivalText}>
                    {lunchRoute[0].delName}
                  </Text>
                  <Text style={styles.arrivalText}>
                    {lunchRoute[lunchRoute.length - 1].delName}
                  </Text>
                </>
              ) : null}
            </View>
          </View>
          <View style={styles.footer}>
            <BottomScrollSheet
              title="상세보기"
              ButtonStyle={ButtonStyle}
              TextStyle={TextStyle}
              data={lunchRoute}
              RouteId={lunchRouteId}
            />
          </View>
        </View>
      ) : (
        <View style={styles.nolunchWork}>
          <Text>점심 업무가 할당되지 않았습니다.</Text>
        </View>
      )}

      {dinnerRouteId !== -1 ? (
        <View style={styles.dinnerWorkContainer}>
          <View style={styles.workTitle}>
            <View style={styles.workDate}>
              <Text style={styles.routeName}>{dinnerRouteName}</Text>
            </View>
            <View>
              {props.actualStartTime.dinnerActualStartTime === null ? (
                <View style={styles.workReady}>
                  <Text style={styles.workIndicatorText}>배송 예정 - 저녁</Text>
                </View>
              ) : null}
              {props.actualStartTime.dinnerActualStartTime !== null &&
              dinnerDone === false ? (
                <View style={styles.workStart}>
                  <Text style={styles.workIndicatorText}>배송 중 - 저녁</Text>
                </View>
              ) : null}
              {dinnerDone === true ? (
                <View style={styles.workEnd}>
                  <Text style={styles.workIndicatorText}>배송 완료 - 저녁</Text>
                </View>
              ) : null}
            </View>
          </View>
          <View style={styles.workRoute}>
            <View style={styles.workRouteDate}>
              <Text style={styles.routeTimeTitle}>배송 시작</Text>
              <Text style={styles.routeTime}>
                {dinnerScheduledStartTime.split(':')[0]} :{' '}
                {dinnerScheduledStartTime.split(':')[1]}
              </Text>
            </View>
            <View style={styles.routeImage}>
              <Image source={line} style={styles.lineImage} />
            </View>
            <View style={styles.arrival}>
              {dinnerRoute[0].delName !== undefined ? (
                <>
                  <Text style={styles.arrivalText}>
                    {dinnerRoute[0].delName}
                  </Text>
                  <Text style={styles.arrivalText}>
                    {dinnerRoute[dinnerRoute.length - 1].delName}
                  </Text>
                </>
              ) : null}
            </View>
          </View>
          <View style={styles.footer}>
            <BottomScrollSheet
              title="상세보기"
              ButtonStyle={ButtonStyle}
              TextStyle={TextStyle}
              data={dinnerRoute}
              navigation={navigation}
              RouteId={dinnerRouteId}
            />
          </View>
        </View>
      ) : (
        <View style={styles.nodinnerWork}>
          <Text>저녁 업무가 할당되지 않았습니다.</Text>
        </View>
      )}
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
  lunchWorkContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '95%',
    height: 180,
    borderRadius: 8,
    marginVertical: 8,
    // backgroundColor: '#e8e8e8',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingTop: 20,
    // paddingHorizontal: 10,
    backgroundColor: '#0F1839',
  },
  nolunchWork: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '95%',
    height: 180,
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: '#e8e8e8',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // paddingHorizontal: 10,
  },
  nodinnerWork: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '95%',
    height: 180,
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: '#e8e8e8',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 6,
    // paddingHorizontal: 10,
  },

  dinnerWorkContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '95%',
    height: 180,
    borderRadius: 8,
    marginVertical: 8,
    // backgroundColor: '#e8e8e8',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 6,
    paddingTop: 20,
    backgroundColor: '#0F1839',
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
    fontSize: 25,
    fontWeight: 'bold',
    color: '#F5CC1F',
  },
  workDateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  workReady: {
    // borderWidth: 1,
    backgroundColor: 'gray',
    padding: 5,
    borderRadius: 5,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  workStart: {
    // borderWidth: 1,
    backgroundColor: '#f5cc1f',
    padding: 5,
    borderRadius: 5,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  workEnd: {
    // borderWidth: 1,
    // backgroundColor: '#a091ec',
    backgroundColor: '#f21800',
    padding: 5,
    borderRadius: 5,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  workIndicatorText: {
    fontSize: 15,
    fontWeight: 'bold',
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
    fontSize: 18,
    marginBottom: 3,
    color: '#F5CC1F',
  },
  routeTimeTitle: {
    fontSize: 18,
    marginBottom: 3,
    color: 'white',
  },

  lineImage: {
    width: 37,
    height: 37,
  },
  arrivalText: {
    fontSize: 18,
    marginBottom: 3,
    color: 'white',
    // color: '#F5CC1F',
  },
  footer: {
    marginBottom: 15,
    width: '100%',
  },
  deliveryReady: {},
  deliveryStart: {},
  deliveryEnd: {},
});

const ButtonStyle = {
  height: 30,
  width: '100%',
  backgroundColor: 'white',
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#8559da',
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 4,
};
const TextStyle = {
  color: 'black',
  fontSize: 16,
  fontWeight: '600',
};

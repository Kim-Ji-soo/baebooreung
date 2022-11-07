import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import line from '../assets/images/separator.png';

const Work = () => {
  return (
    <View style={styles.workRootContainer}>
      <View style={styles.workContainer}>
        <View style={styles.workTitle}>
          <View style={styles.workDate}>
            <Text style={styles.workDateText}>11월 05일(목)</Text>
          </View>
          <View style={styles.workIndicator}>
            <Text style={styles.workIndicatorText}>배송 예정</Text>
          </View>
        </View>
        <View style={styles.workRoute}>
          <View style={styles.workRouteDate}>
            <Text style={styles.routeTime}>12 : 10</Text>
            <Text style={styles.routeTime}>13 : 10</Text>
          </View>
          <View style={styles.routeImage}>
            <Image source={line} style={styles.lineImage} />
          </View>
          <View style={styles.arrival}>
            <Text style={styles.arrivalText}>초돈삼겹살</Text>
            <Text style={styles.arrivalText}>삼성전자 2공장</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>상세보기</Text>
        </View>
      </View>
    </View>
  );
};

export default Work;
const styles = StyleSheet.create({
  workRootContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
  workDateText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  workIndicator: {
    // borderWidth: 1,
    backgroundColor: '#5d91de',
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5d91de',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  footerText: {
    fontSize: 15,
    color: 'white',
  },
});

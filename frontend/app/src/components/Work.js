import React, {useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import line from '../assets/images/separator.png';
import BottomScrollSheet from './BottomScrollSheet';
const Work = () => {
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

  const [dummy, setDummy] = useState({
    date: '2022-11-05',
    workList: [
      {
        id: 1,
        type: 'pickup',
        store: '청화당',
        time: '12:05',
      },
      {
        id: 2,
        type: 'pickup',
        store: '김가네',
        time: '12:15',
      },
      {
        id: 3,
        type: 'pickup',
        store: '김밥천국',
        time: '12:20',
      },
      {
        id: 4,
        type: 'pickup',
        store: '이디야',
        time: '12:25',
      },
      {
        id: 5,
        type: 'pickup',
        store: '스타벅스',
        time: '12:35',
      },
      {
        id: 6,
        type: 'delivery',
        store: '행정동',
        time: '12:40',
      },
      {
        id: 7,
        type: 'delivery',
        store: '기숙사동',
        time: '12:50',
      },
      {
        id: 8,
        type: 'delivery',
        store: '체육관',
        time: '13:00',
      },
    ],
  });
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
          <BottomScrollSheet
            title="상세보기"
            ButtonStyle={ButtonStyle}
            TextStyle={TextStyle}
            workData={dummy}
          />
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
    marginBottom: 16,
    width: '100%',
  },
});

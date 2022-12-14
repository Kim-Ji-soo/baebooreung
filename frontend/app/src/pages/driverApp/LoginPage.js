import {React, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  View,
  Pressable,
  Alert,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import AppText from '../../components/AppText';

// axios
import axios from 'axios';
import {user_service} from '../../api/api';
import {business_service} from '../../api/api';

// redux
import {useDispatch, useSelector} from 'react-redux';
import {setUserInfo} from '../../redux/auth';
import {setUser, setProfile} from '../../redux/user';
import {setUserList} from '../../redux/userList';
import work, {
  setLunchRouteInfo,
  setDinnerRouteInfo,
  setLunchRoute,
  setDinnerRoute,
} from '../../redux/work';
//component and function
import CustomButton from '../../components/CustomButton';
import {isEmail, isPassword} from '../../utils/inputCheck';
import messaging from '@react-native-firebase/messaging';
import logo from '../../assets/images/logo.png';
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
const identityColor = '#0B0B3B';
const identityTextColor = '#FACC2E';

const Login = ({navigation}) => {
  const fcmToken = useSelector(state => state.auth.fcmToken);
  console.log(fcmToken);
  const ButtonStyle = {
    borderWidth: 0.8,
    borderRadius: 12,
    borderColor: 'white',
    borderWidth: 4,
    overflow: 'hidden',
    width: '100%',
  };
  const dispatch = useDispatch();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [idMessage, setIdMessage] = useState('');
  const [pwMessage, setPwMessage] = useState('');
  const userInfo = useSelector(state => state.user);
  // const [isId, setIsId] = useState(false);
  // const [isPw, setIsPw] = useState(false);

  useEffect(() => {
    //유저 연락처 업데이트 이후 권한에 따라 각 페이지로 보내기
    if (id !== '' && userInfo.grade === 'MANAGER') {
      fetchOthersInfo();
      navigation.reset({routes: [{name: 'ManagerTab'}]});
    }
    if (id !== '' && userInfo.grade === 'DRIVER') {
      fetchOthersInfo();
      navigation.reset({routes: [{name: 'DriverTab'}]});
    }
  }, [userInfo]);
  const getDriverWorkRoute = async id => {
    await axios({
      method: 'get',
      url: business_service.getDriverRoute() + `${id}` + '/routes/today/undone',
    })
      .then(res => {
        console.log('드라이버 업무 불러오기 성공', res.data);
        const workList = res.data;
        for (let i = 0; i < workList.length; i++) {
          console.log('드라이버 업무리스트', workList[i]);
          if (workList[i].routeType === 'lunch') {
            dispatch(
              setLunchRouteInfo({
                date: workList[i].date,
                id: workList[i].id,
                done: workList[i].done,
                routeType: workList[i].routeType,
                routeName: workList[i].routeName,
                scheduledStartTime: workList[i].scheduledStartTime,
              }),
            );
            dispatch(setLunchRoute(workList[i].deliveryList));
          } else {
            dispatch(
              setDinnerRouteInfo({
                date: workList[i].date,
                id: workList[i].id,
                done: workList[i].done,
                routeType: workList[i].routeType,
                routeName: workList[i].routeName,
                scheduledStartTime: workList[i].scheduledStartTime,
              }),
            );
            dispatch(setDinnerRoute(workList[i].deliveryList));
          }
        }
      })
      .catch(err => {
        console.log('드라이버 업무 불러오기 실패', err);
      });
  };
  const fetchUserInfo = async id => {
    await axios({
      method: 'get',
      url: user_service.getUserInfo() + `${id}`, //path variable로 id값을 받는다.
    })
      .then(res => {
        dispatch(setUser(res.data));
      })
      .catch(err => {
        console.log(err);
      });
  };

  const fetchUserProfile = async id => {
    await axios({
      method: 'get',
      url: user_service.getProfile() + `${id}`,
    })
      .then(res => {
        // console.log('프로필 이미지 : ', res.data);
        dispatch(setProfile(res.data));
      })
      .catch(e => {
        console.log(e);
      });
  };

  const fetchOthersInfo = async () => {
    await axios({
      metohd: 'get',
      url: user_service.getAllUser(),
    })
      .then(res => {
        // console.log('All userList', res.data);
        //나를 제외한 모든 유저들 연락처에 저장
        const userList = [];
        res.data
          .filter(item => item.id !== userInfo.id)
          .map((item, idx) => {
            // console.log(item.id);
            userList.push(item);
          });
        dispatch(setUserList(userList));
      })
      .catch(e => {
        console.log(e);
      });
  };
  const login = async () => {
    await axios({
      method: 'POST',
      url: user_service.login(),
      data: {
        email: id,
        password: password,
      },
    })
      .then(res => {
        console.log('유저네임--------->', res.headers.name);
        // axios global header configuration.
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${res.headers.token}`;
        axios.defaults.headers.common['id'] = res.headers.id;
        axios.defaults.headers.common['specialkey'] = res.headers.specialkey;
        //redux
        dispatch(
          setUserInfo({
            id: res.headers.id,
            accessToken: res.headers.token,
            specialkey: res.headers.specialkey,
            name: res.headers.name,
          }),
        );
        fetchUserInfo(res.headers.id);
        fetchUserProfile(res.headers.id);
        getDriverWorkRoute(res.headers.id);
        console.log('로그인성공');
        // send fcmToken to server
        messaging()
          .getToken()
          .then(token => {
            axios({
              method: 'put',
              url: user_service.saveFCMToken(),
              data: {
                id: res.headers.id,
                fcmToken: token,
              },
            })
              .then(res => {
                // console.log(res);
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        Alert.alert('로그인', '아이디 혹은 비밀번호가 틀렸습니다.');
        console.log('로그인 실패');
      });
  };
  // id 유효성 검사
  const onChangeId = event => {
    const ID = event.nativeEvent.text;
    if (isEmail(ID)) {
      setId(ID);
      setIdMessage('올바른 이메일 형식입니다.');
      // setIsId(true);
    } else {
      setIdMessage('이메일 형식으로 입력해주세요.');
      // setIsId(false);
    }
  };
  // 비밀번호 유효성 검사
  const onChangePw = event => {
    const PW = event.nativeEvent.text;

    setPassword(PW);

    /* 유효성 검사부분 test계정이슈로 잠시 주석처리
    if (isPassword(PW)) {
      setPwMessage('올바른 비밀번호입니다.');
      setPassword(PW);
      // setIsPw(true);
    } else {
      setPwMessage(
        '비밀번호는 영문자, 숫자, 특수기호를 포함하여  8 ~ 16자로 입력해주세요.',
      );
      // setIsPw(false);
    }
  */
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.headerContainer]}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Image
            source={logo}
            style={{
              width: SCREEN_WIDTH / 2.5,
              height: SCREEN_HEIGHT / 5,
            }}></Image>
        </View>
      </View>
      <ScrollView style={{flex: 1}}>
        <View style={styles.Body}>
          <Text style={[styles.label, {marginHorizontal: 40}]}>아이디</Text>
          <TextInput
            style={[styles.idForm, {marginHorizontal: 40}]}
            placeholder="아이디를 입력하세요."
            placeholderTextColor="white"
            onChange={onChangeId}
          />
          <Text style={[styles.label, {marginHorizontal: 40}]}>비밀번호</Text>
          <TextInput
            style={[styles.passwordForm, {marginHorizontal: 40}]}
            placeholder="비밀번호를 입력하세요."
            placeholderTextColor="white"
            onChange={onChangePw}
            secureTextEntry={true}
          />
          <Text>{pwMessage}</Text>
          <View style={styles.needSignUp}>
            <Text style={{color: 'white', marginHorizontal: 40}}>
              회원이 아니신가요?
            </Text>
            <Pressable
              onPress={() => {
                navigation.navigate('Signup');
              }}>
              <Text style={{color: identityTextColor, marginHorizontal: 40}}>
                회원가입
              </Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.btnContainer}>
            <CustomButton
              onPress={login}
              ButtonStyle={ButtonStyle}
              backgroundColor="white">
              <Text style={{color: identityColor, fontWeight: 'bold'}}>
                로그인
              </Text>
            </CustomButton>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItem: 'center',
    paddingHorizontal: 10,
    backgroundColor: identityColor,
  },
  headerContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItem: 'center',
    marginVertical: 10,
    // borderWidth: 1,
  },
  Body: {
    flex: 1,
    justifyContent: 'center',
    alignItem: 'center',
    marginBottom: 30,
    // borderWidth: 1,
  },
  idForm: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 30,
    paddingLeft: 20,
    borderColor: 'white',
    borderWidth: 4,
    color: 'white',
  },
  passwordForm: {
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    paddingLeft: 20,
    borderColor: 'white',
    borderWidth: 4,
    color: 'white',
  },
  needSignUp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 5,
  },
  btnContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // borderWidth: 1,
  },
  label: {
    marginBottom: 5,
    fontSize: 15,
    fontWeight: '800',
    color: 'white',
    fontFamily: 'BMJUA_ttf',
  },
});

export default Login;

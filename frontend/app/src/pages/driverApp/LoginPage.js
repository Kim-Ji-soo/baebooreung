import {React, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  View,
  Pressable,
} from 'react-native';

// axios
import axios from 'axios';
import {user_service} from '../../api/api';
// redux
import {useDispatch, useSelector} from 'react-redux';
import {setUserInfo} from '../../redux/auth';
import {setUser} from '../../redux/user';
import {setUserList} from '../../redux/userList';
//component and function
import CustomButton from '../../components/CustomButton';
import {isEmail, isPassword} from '../../utils/inputCheck';

const Login = ({navigation}) => {
  const ButtonStyle = {
    borderWidth: 0.8,
    borderRadius: 16,
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

  const fetchUserInfo = async id => {
    await axios({
      method: 'get',
      url: user_service.getUserInfo() + `${id}`, //path variable로 id값을 받는다.
    })
      .then(res => {
        console.log(res.data);
        dispatch(setUser(res.data));
      })
      .catch(err => {
        console.log(err);
      });
  };

  const fetchOthersInfo = async () => {
    await axios({
      metohd: 'get',
      url: user_service.getAllUser(),
    })
      .then(res => {
        console.log('All userList', res.data);
        //나를 제외한 모든 유저들 연락처에 저장
        const userList = [];
        res.data
          .filter(item => item.id !== userInfo.id)
          .map((item, idx) => {
            console.log(item.id);
            userList.push(item);
          });
        console.log(userList);
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
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${res.headers.token}`;
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
        console.log('Login Success!');
      })
      .catch(err => {
        console.log(err);
        console.log('Login failed!');
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
      <View style={styles.headerContainer}>
        <Text style={styles.header}>배부릉 로그인</Text>
      </View>
      <View style={styles.Body}>
        <Text style={styles.label}>아이디</Text>
        <TextInput
          style={styles.idForm}
          placeholder="아이디를 입력하세요."
          onChange={onChangeId}
        />

        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.passwordForm}
          placeholder="비밀번호를 입력하세요."
          onChange={onChangePw}
        />
        <Text>{pwMessage}</Text>
        <View style={styles.needSignUp}>
          <Text>회원이 아니신가요?</Text>
          <Pressable
            onPress={() => {
              navigation.navigate('Signup');
            }}>
            <Text style={{color: 'blue'}}>회원가입</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.btnContainer}>
          <CustomButton onPress={login} ButtonStyle={ButtonStyle}>
            <Text>로그인</Text>
          </CustomButton>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItem: 'center',
    paddingHorizontal: 10,
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItem: 'center',
    marginVertical: 10,
    // borderWidth: 1,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
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
    borderRadius: 8,
    marginBottom: 30,
    paddingLeft: 20,
  },
  passwordForm: {
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    paddingLeft: 20,
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
  },
});

export default Login;

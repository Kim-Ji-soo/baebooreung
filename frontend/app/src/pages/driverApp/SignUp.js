import {React, useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import CustomButton from '../../components/CustomButton';
import SelectList from 'react-native-dropdown-select-list';
import {isEmail, isPhoneNumber} from '../../utils/inputCheck';
import {isPassword} from '../../utils/inputCheck';
import {user} from '../../api/api';

const SignUp = () => {
  // grade 관련 state,
  const [selectedGrade, setSelectedGrade] = useState('1');
  const grade = [
    {key: '1', value: 'MANAGER'},
    {key: '2', value: 'DRIVER'},
  ];

  const [region, setRegion] = useState(null);
  const regionDrop = [
    {key: '1', value: '서울대학교'},
    {key: '2', value: '연세대학교'},
    {key: '3', value: '이화여자대학교'},
    {key: '4', value: '서강대학교'},
    {key: '5', value: 'GIST'},
    {key: '6', value: '전남대학교'},
    {key: '7', value: '고려대학교'},
    {key: '8', value: '서강대학교'},
    {key: '9', value: '성균관대학교'},
    {key: '10', value: '인천글로벌캠퍼스'},
    {key: '11', value: '관악우성아파트'},
  ];

  // 회원가입 관련 state
  // id(email), password, passwordConfirm
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  // message state
  const [idMessage, setIdMessage] = useState('');
  const [pwMessage, setPwMessage] = useState('');
  const [pwConfirmMessage, setPwConfirmMessage] = useState('');
  const [phoneNumMessage, setPhoneNumMessage] = useState('');
  // validation check
  const [isId, setIsId] = useState(false);
  const [isPw, setIsPw] = useState(false);
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);
  const [isPhoneNum, setIsPhoneNum] = useState(false);

  //autoFocus 관련
  // if you press the next button, then move to next TextInput
  const ref_input2 = useRef();
  const ref_input3 = useRef();
  const ref_input4 = useRef();
  const ref_input5 = useRef();

  // 회원가입 API
  const join = async () => {
    await axios({
      method: 'POST',
      url: user.join(),
      data: {
        email: id,
        password: password,
        name: name,
        grade: grade[selectedGrade].value,
        phone: phoneNumber,
        region: parseInt(region), // type : int
      },
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };
  // !! event.nativeEvent.text -> react.js의 event.target.value !!
  // 아이디(이메일) 유효성 검사
  const onChangeId = event => {
    const ID = event.nativeEvent.text;
    if (isEmail(ID)) {
      setId(ID);
      setIdMessage('* 올바른 이메일 형식입니다.');
      setIsId(true);
    } else {
      setIdMessage('* 이메일 형식으로 입력해주세요.');
      setIsId(false);
    }
  };
  // 비밀번호 유효성 검사
  const onChangePw = event => {
    const PW = event.nativeEvent.text;
    if (isPassword(PW)) {
      setPwMessage('* 올바른 비밀번호입니다.');
      setPassword(PW);
      setIsPw(true);
    } else {
      setPwMessage(
        '* 영문자, 숫자, 특수기호를 포함하여  8 ~ 16자로 입력해주세요.',
      );
      setIsPw(false);
    }
  };
  // 비밀번호 확인 유효성 검사(password랑 confirmPassword가 같은지 만 확인)
  const onChangePwConfirm = event => {
    const CONFIRM = event.nativeEvent.text;
    if (CONFIRM === password && password.length > 0) {
      setConfirmPassword(CONFIRM);
      setIsPasswordConfirm(true);
      setPwConfirmMessage('* 비밀번호가 일치합니다.');
    } else {
      setIsPasswordConfirm(false);
      setPwConfirmMessage('* 비밀번호가 일치하지 않습니다.');
    }
  };
  const onChangePhoneNum = event => {
    const NUMBER = event.nativeEvent.text;
    if (isPhoneNumber(NUMBER)) {
      setPhoneNumber(NUMBER);
      setPhoneNumMessage('* 올바른 전화번호입니다.');
      setIsPhoneNum(true);
    } else {
      setIsPhoneNum(false);
      setPhoneNumMessage('* 000-0000-0000 형식으로 입력해주세요.');
    }
  };
  const onChangeName = event => {
    const NAME = event.nativeEvent.text;
    setName(NAME);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>배부릉 회원가입</Text>
      </View>
      <ScrollView>
        <View style={styles.Scroll}>
          <View style={styles.login}>
            <Text style={styles.label}>아이디</Text>
            <TextInput
              style={styles.loginForm}
              placeholder="아이디를 입력하세요."
              onChange={onChangeId}
              // autoFocus={true}
              returnKeyType="next"
              onSubmitEditing={() => ref_input2.current.focus()}
            />
            {idMessage ? (
              <Text style={styles.checkMessage}>{idMessage}</Text>
            ) : null}
          </View>
          <View style={styles.password}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={styles.passwordForm}
              placeholder="비밀번호를 입력하세요."
              onChange={onChangePw}
              returnKeyType="next"
              onSubmitEditing={() => ref_input3.current.focus()}
              ref={ref_input2}
            />
            {pwMessage ? (
              <Text style={styles.checkMessage}>{pwMessage}</Text>
            ) : null}
            <TextInput
              style={styles.passwordForm}
              placeholder="비밀번호를 한번 더 입력하세요."
              onChange={onChangePwConfirm}
              ref={ref_input3}
              returnKeyType="next"
              onSubmitEditing={() => ref_input4.current.focus()}
            />
            {pwConfirmMessage ? (
              <Text style={styles.checkMessage}>{pwConfirmMessage}</Text>
            ) : null}
          </View>
          <View style={styles.extra}>
            <Text style={styles.label}>이름</Text>
            <TextInput
              style={styles.nameForm}
              placeholder="배부릉"
              onChange={onChangeName}
              ref={ref_input4}
              returnKeyType="next"
              onSubmitEditing={() => ref_input5.current.focus()}
            />
            <Text style={styles.label}>전화번호</Text>
            <TextInput
              style={styles.phoneNumberForm}
              placeholder="010-1234-5678"
              onChange={onChangePhoneNum}
              ref={ref_input5}
            />
            {phoneNumMessage ? (
              <Text style={styles.checkMessage}>{phoneNumMessage}</Text>
            ) : null}
          </View>
          <View style={styles.extra2}>
            <Text style={styles.label}>지역</Text>
            <SelectList
              setSelected={setRegion}
              data={regionDrop}
              search={false}
              placeholder="지역을 선택하세요."
            />
          </View>
          <View style={styles.extra2}>
            <Text style={styles.label}>회원 유형</Text>
            <SelectList
              setSelected={setSelectedGrade}
              onSelect={() => {
                console.log(selectedGrade);
              }}
              data={grade}
              search={false}
              placeholder="유형을 선택하세요"
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.btnContainer}>
        <View style={styles.signupBtn}>
          <CustomButton style={styles.btn} onPress={join}>
            <Text>회원가입</Text>
          </CustomButton>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    justifyContent: 'center',
    alignItem: 'center',
  },
  Scroll: {
    // borderWidth: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 5,
  },
  headerContainer: {
    marginVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 2,
  },
  header: {
    fontSize: 20,
  },
  login: {
    // borderWidth: 2,
    marginBottom: 20,
  },
  loginForm: {
    height: 45,
    borderWidth: 1,
    borderColor: 'gray',
    paddingLeft: 20,
    borderRadius: 8,
  },
  password: {
    // borderWidth: 2,
    marginBottom: 20,
  },
  passwordForm: {
    height: 45,
    paddingLeft: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    marginBottom: 5,
  },
  extra: {
    // borderWidth: 2,
    marginBottom: 20,
  },
  extra2: {
    marginBottom: 20,
  },
  nameForm: {
    height: 45,
    borderWidth: 1,
    borderColor: 'gray',
    paddingLeft: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  phoneNumberForm: {
    borderWidth: 1,
    borderColor: 'gray',
    height: 45,
    paddingLeft: 20,
    borderRadius: 8,
  },
  signupBtn: {
    width: '50%',
  },
  checkMessage: {
    color: 'red',
    paddingTop: 5,
  },
  btnContainer: {
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default SignUp;

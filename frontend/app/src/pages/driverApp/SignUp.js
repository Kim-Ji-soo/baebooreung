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
import {isEmail, isPhoneNumber} from '../../utils/auth';
import {isPassword} from '../../utils/auth';

const SignUp = () => {
  // dropdown 관련 state,
  const [selected, setSelected] = useState('');
  const [region, setRegion] = useState('');
  const dropdown = [
    {key: '1', value: 'MANAGER'},
    {key: '2', value: 'DRIVER'},
  ];
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

  // !! event.nativeEvent.text -> react.js의 event.target.value !!
  // 아이디(이메일) 유효성 검사
  const onChangeId = event => {
    const ID = event.nativeEvent.text;
    if (isEmail(ID)) {
      // 유효성 통과 시 true 반환
      setId(ID);
      setIdMessage('올바른 이메일 형식입니다.');
      setIsId(true);
    } else {
      setIdMessage('이메일 형식으로 입력해주세요.');
      setIsId(false);
    }
    // console.log(isId, '-', idMessage);
  };
  // 비밀번호 유효성 검사
  const onChangePw = event => {
    const PW = event.nativeEvent.text;
    if (isPassword(password)) {
      // 유효성 통과 시 true 반환
      setPwMessage('올바른 비밀번호입니다.');
      setPassword(PW);
      setIsPw(true);
    } else {
      setPwMessage(
        '비밀번호는 영문자, 숫자, 특수기호를 포함하여  8 ~ 16자로 입력해주세요.',
      );
      setIsPw(false);
    }
    // console.log(isPw, '-', pwMessage);
  };
  // 비밀번호 확인 유효성 검사(password랑 confirmPassword가 같은지 만 확인)
  const onChangePwConfirm = event => {
    const CONFIRM = event.nativeEvent.text;
    setConfirmPassword(CONFIRM);
    // console.log(CONFIRM === password);
    if (CONFIRM === password) {
      setPwConfirmMessage('비밀번호가 일치합니다.');
      setIsPasswordConfirm(true);
    } else {
      setPwConfirmMessage('비밀번호가 일치하지 않습니다.');
      setIsPasswordConfirm(false);
    }
    // console.log(isPasswordConfirm, '-', pwConfirmMessage);
  };
  const onChangePhoneNum = event => {
    const NUMBER = event.nativeEvent.text;
    setPhoneNumber(event.nativeEvent.text);
    if (isPhoneNumber(NUMBER)) {
      setPhoneNumMessage('올바른 전화번호입니다.');
      setIsPhoneNum(true);
    } else {
      setIsPhoneNum(false);
      setPhoneNumMessage('000-0000-0000 형식으로 입력해주세요.');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerFont}>배부릉</Text>
      </View>
      <ScrollView style={styles.scroll}>
        <View style={styles.inputContainer}>
          <Text style={styles.infoTitle}>아이디</Text>
          <TextInput
            style={styles.inputArea}
            placeholder="아이디를 입력하세요."
            onChange={onChangeId}
            autoFocus={true}
            returnKeyType="next"
            onSubmitEditing={() => ref_input2.current.focus()}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.infoTitle}>비밀번호</Text>
          <TextInput
            style={styles.inputArea}
            placeholder="비밀번호를 입력하세요."
            onChange={onChangePw}
            returnKeyType="next"
            onSubmitEditing={() => ref_input3.current.focus()}
            ref={ref_input2}
          />
          <TextInput
            style={styles.inputArea}
            placeholder="비밀번호를 한번 더 입력하세요."
            onChange={onChangePwConfirm}
            ref={ref_input3}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.infoTitle}>이름</Text>
          <TextInput style={styles.inputArea} placeholder="배부릉" />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.infoTitle}>전화번호</Text>
          <TextInput
            style={styles.inputArea}
            placeholder="010-1234-5678"
            onChange={onChangePhoneNum}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.infoTitle}>지역</Text>
          <SelectList
            setSelected={setRegion}
            data={regionDrop}
            onSelect={() => alert(region)}
            search={false}
            placeholder="지역을 선택하세요."
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.infoTitle}>회원 유형</Text>
          <SelectList
            setSelected={setSelected}
            data={dropdown}
            onSelect={() => alert(selected)}
            search={false}
            placeholder="유형을 선택하세요"
          />
        </View>
        <View style={styles.btnArea}>
          <CustomButton style={styles.btn}>
            <Text>회원가입</Text>
          </CustomButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerFont: {
    fontSize: 20,
    fontWeight: '800',
  },
  scroll: {
    width: '80%',
  },
  infoText: {
    width: '100%',
  },
  infoTitle: {
    fontWeight: '800',
    fontSize: 15,
    marginBottom: 8,
  },
  infoDescription: {
    fontWeight: '300',
    fontSize: 12,
    color: '#999999',
  },
  inputContainer: {
    marginBottom: 5,
  },
  inputArea: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 0.8,
    paddingHorizontal: 20,
  },
  btnArea: {
    marginTop: 25,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  numberArea: {
    marginBottom: 5,
    borderRadius: 8,
    borderWidth: 0.8,
    padding: 8,
    marginRight: 20,
  },
});
export default SignUp;

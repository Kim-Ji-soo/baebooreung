import {React, useState} from 'react';
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
const SignUp = () => {
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
          />
          {/* <Text style={styles.infoDescription}>
            아이디는 공백없이 10자 이하, 특수문자는 사용불가합니다.
          </Text> */}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.infoTitle}>비밀번호</Text>
          <TextInput
            style={styles.inputArea}
            // onChangeText={}
            // value={id}
            placeholder="비밀번호를 입력하세요."
          />
          <TextInput
            style={styles.inputArea}
            // onChangeText={}
            // value={id}
            placeholder="비밀번호를 한번 더 입력하세요."
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.infoTitle}>이름</Text>
          <TextInput style={styles.inputArea} placeholder="배부릉" />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.infoTitle}>전화번호</Text>
          <TextInput style={styles.inputArea} placeholder="010-1234-5678" />
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
    // borderWidth: 1,
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

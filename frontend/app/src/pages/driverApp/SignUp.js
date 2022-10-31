import {React, useState} from 'react';
import {View, Text, TextInput, StyleSheet, SafeAreaView} from 'react-native';
import CustomButton from '../../components/CustomButton';
const SignUp = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerFont}>배부릉에서 사용할</Text>
        <Text style={styles.headerFont}>아이디와 비밀번호를 입력해주세요.</Text>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.infoText}>
          <Text style={styles.infoTitle}>아이디</Text>
          <Text style={styles.infoDescription}>
            아이디는 공백없이 10자 이하, 특수문자는 사용불가합니다.
          </Text>
        </View>
        <TextInput
          style={styles.inputArea}
          // onChangeText={}
          // value={id}
          placeholder="아이디를 입력하세요."
        />
        <View style={styles.infoText}>
          <Text style={styles.infoTitle}>비밀번호</Text>
          <Text style={styles.infoDescription}>
            비밀번호는 10자 이상, 특수문자, 숫자, 영문을 포함해주세요.
          </Text>
        </View>
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
      <View style={styles.btnArea}>
        <CustomButton style={styles.btn}>
          <Text>회원가입</Text>
        </CustomButton>
      </View>
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
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerFont: {
    fontSize: 20,
    fontWeight: '800',
  },
  infoText: {
    width: '100%',
    marginVertical: 10,
  },
  infoTitle: {
    fontWeight: '800',
    fontSize: 18,
  },
  infoDescription: {
    fontWeight: '300',
    fontSize: 12,
    color: '#999999',
  },
  inputContainer: {
    justifyContent: 'center',
    // borderWidth: 1,
    flex: 5,
    width: '80%',
    // marginHorizontal: 16,
    // borderWidth: 1,
  },
  inputArea: {
    marginBottom: 15,
    height: 60,
    borderRadius: 16,
    borderWidth: 0.8,
    padding: 16,
  },
  btnArea: {
    justifyContent: 'center',
    flexDirection: 'column',
    // alignItems: 'center',
    flex: 2,
    width: '80%',
    height: 60,
    // borderWidth: 1,
  },
});
export default SignUp;

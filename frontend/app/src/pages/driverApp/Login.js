import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

import CustomButton from '../../components/CustomButton';

const Login = () => {
  const [id, setId] = React.useState();
  const [password, setPassword] = React.useState();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputArea}>
        <TextInput
          style={styles.id}
          onChangeText={setId}
          value={id}
          placeholder="아이디를 입력하세요."
        />
        <TextInput
          style={styles.pw}
          onChangeText={setPassword}
          value={password}
          placeholder="비밀번호 입력하세요."
          secureTextEntry={true}
        />
      </View>
      <View style={styles.signupArea}>
        <View>
          <Text>회원이 아니신가요?</Text>
        </View>
        <View>
          <Pressable
            onPress={() => {
              console.log('pressed');
            }}>
            <Text style={{color: 'blue'}}>회원가입</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.btnArea}>
        <CustomButton>
          <Text>로그인</Text>
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
  inputArea: {
    width: '80%',
    // borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupArea: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '80%',
    margin: 0,
  },
  btnArea: {
    marginTop: 25,
    width: '40%',
  },
  id: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 15,
    padding: 10,
    margin: 10,
    width: '100%',
  },
  pw: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 15,
    padding: 10,
    margin: 10,
    width: '100%',
  },
});

export default Login;

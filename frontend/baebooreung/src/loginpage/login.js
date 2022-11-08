import styles from './login.module.css'
import new_logo from '../assets/images/new_logo_2.png'
import { TextField } from '@mui/material';
import React, { useState } from 'react';
import ValidField from '../component/ValidField_test';


const Login = () => {


  const [value, setValue] = useState('');

  const onChange = (e)=> {
      setValue(e.target.value)
  }

  const validation =()=>{
      let check = /[~!@#$%^&*()_+|<>?:{}.,/;='"ㄱ-ㅎ | ㅏ-ㅣ |가-힣]/;
      return check.test(value);
  }
  return (
    <div className={styles.login_page}>
      {/* <img src={new_logo} alt="" /> */}
      <div className={styles.login_image_login_flex}>
        <div className={styles.login_main_image_div}>
          <img className={styles.login_main_image} src={new_logo} alt="" />
        </div>
        <div className={styles.login_box}>
          <div>Login</div>
          <div>
          <TextField
            id="standard-name"
            label="ID2"
            variant="outlined"
            value={value}
            onChange={onChange}
            error={validation()}
            helperText={validation() ? "특수기호나 한글은 입력 하실 수 없습니다.":""}
            InputLabelProps={{
              classes: {
                root: {
                  color: 'red !important',
                },
              },
            }}
            InputProps={{
              classes: {
                root: {
                  '&$cssFocused $notchedOutline': {
                    borderColor: `#000000 !important`,
                  },
                },
                notchedOutline: {
                  borderWidth: '10px',
                  borderColor: '#000000 !important',
                },
              },
              inputMode: 'numeric',
            }}
          />
          <ValidField></ValidField>
          <div>안녕하세요?</div>
          <ValidField></ValidField>
          <div>안녕하세요?</div>
          <ValidField></ValidField>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
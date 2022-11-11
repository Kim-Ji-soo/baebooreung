import styles from './login.module.css'
import new_logo from '../assets/images/new_logo_2.png'
import { TextField } from '@mui/material';
import React, { useState } from 'react';
import axios from 'axios';
import { isEmail, isPassword } from '../utill';
import { useNavigate } from "react-router-dom";

const Login = ({ history }) => {
  const navigate = useNavigate();
  const [Id, setId] = useState('');
  const [Password, setPassword] = useState('');

  const onChnageId = (e)=> {
      setId(e.target.value)
  }
  const onChangePassword = (e)=> {
      setPassword(e.target.value)
  }
  async function login () {
    await axios({
      url: "https://k7c207.p.ssafy.io:8000/user-service/login",
      method: "post",
      data: {
        email: Id,
        password: Password
      },
    }).then((res)=>{
      console.log(res.headers.token)
      localStorage.setItem("Token", res.headers.token)
      axios.defaults.headers.common["Authorization"] =`Bearer ${res.headers.token}`; 
      // 로그아웃 시 토큰 없애고, 디폴트 헤더 커몬 어스에 빈 문자열 넣기
      localStorage.setItem("specialKey", res.headers.specialkey)
      navigate("/main",{replace :true});
    })
  }

  const validation =()=>{
      let check = /[~!#$%^&*()_+|<>?:{}.,/;='"ㄱ-ㅎ | ㅏ-ㅣ |가-힣]/;
      return check.test(Id);
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
            size='small'
            sx={{
              width:300,
              height:20
            }}
            id="standard-name"
            label="ID2"
            variant="outlined"
            value={Id}
            onChange={onChnageId}
            error={isEmail()}
            // helperText={validation() ? "특수기호나 한글은 입력 하실 수 없습니다.":""}
            helperText={isEmail() ? "":""}
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
          <TextField
            size='small'
            sx={{
              width:300,
              height:20
            }}
            id="standard-name"
            label="ID2"
            variant="outlined"
            value={Password}
            onChange={onChangePassword}
            error={validation()}
            // helperText={validation() ? "특수기호나 한글은 입력 하실 수 없습니다.":""}
            helperText={validation() ? "":""}
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
          <button onClick={login}>제출</button>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
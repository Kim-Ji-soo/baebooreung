import styles from "./login.module.css";
import team_logo from "../assets/images/logo_team.png";
import animation from "../assets/images/animation.gif";
import { TextField } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import SliderSlick from "../component/slick/reactSlick";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { setToken } from "../redux/user";
import { useDispatch } from "react-redux";
import { user_service } from "../api/api";
import { setUserList } from "../redux/userList";
import { setUser } from "../redux/user";
import { useSelector } from "react-redux";

const theme = createTheme({
  overrides: {
    // Style sheet name
    MuiTouchRipple: {
      // Name of the rule
      child: {
        // Some CSS
        backgroundColor: "red",
      },
    },
  },
  palette: {
    mymaincolor: {
      main: "#0F1839",
    },
  },
  typography: {
    fontFamily: "BMJUA",
  },
});

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#0F1839",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#0F1839",
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "#0F1839",
    },
  },
});

const Login = ({ history }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [Id, setId] = useState("");
  const [Password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const userInfo = useSelector((state) => state.user);

  const onChnageId = (e) => {
    setId(e.target.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const fetchUserInfo = async (id) => {
    await axios({
      method: "get",
      url: user_service.getUserInfo() + `${id}`, //path variable로 id값을 받는다.
    })
      .then((res) => {
        dispatch(setUser(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchOthersInfo = async () => {
    await axios({
      metohd: "get",
      url: user_service.getAllUser(),
    })
      .then((res) => {
        // console.log('All userList', res.data);
        //나를 제외한 모든 유저들 연락처에 저장
        const userList = [];
        res.data
          .filter((item) => item.id !== userInfo.id)
          .map((item, idx) => {
            // console.log(item.id);
            userList.push(item);
          });
        // console.log(userList);
        dispatch(setUserList(userList));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  async function login() {
    await axios({
      url: "https://k7c207.p.ssafy.io:8000/user-service/login",
      method: "post",
      data: {
        email: Id,
        password: Password,
      },
    })
      .then((res) => {
        // console.log(res.headers.token)
        dispatch(setToken(res.headers.token));
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.headers.token}`;
        axios.defaults.headers.common["id"] = res.headers.id;
        axios.defaults.headers.common["specialkey"] = res.headers.specialkey;
        // 로그아웃 시 토큰 없애고, 디폴트 헤더 커몬 어스에 빈 문자열 넣기
        fetchUserInfo(res.headers.id);
        fetchOthersInfo();
      })
      .catch(() => {
        let timerInterval;
        Swal.fire({
          imageUrl:
            "https://user-images.githubusercontent.com/97590478/201513112-c13e3dd5-b4e0-432a-a900-deffb3a03400.gif",
          html: '<div style="font-family:BMJUA;"><strong>ID</strong> 혹은 <strong>Password</strong>를 잘못 입력하셨거나 <br><strong>등록되지 않은 ID</strong>입니다. <br><br> <strong style="color:red;"><b></b></strong>초 후 창이 닫힙니다.</div>',
          confirmButtonText: "닫기",
          confirmButtonColor: "#0F1839",
          timer: 5000,
          timerProgressBar: true,
          allowOutsideClick: false,
          didOpen: () => {
            const b = Swal.getHtmlContainer().querySelector("b");
            timerInterval = setInterval(() => {
              b.textContent = Math.floor(Swal.getTimerLeft() / 1000, 2) + 1;
            }, 10);
          },
          willClose: () => {
            clearInterval(timerInterval);
          },
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            console.log("I was closed by the timer");
          }
        });
      });
  }

  const validation = () => {
    let check =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    return check.test(Id);
  };

  return (
    <div className={styles.login_page}>
      <div className={styles.login_image_login_flex}>
        <SliderSlick></SliderSlick>
        {/* <div className={styles.login_main_image_div}>
          <a href="/">
            <img className={styles.login_main_image} src={new_logo} alt="" />
          </a>
        </div> */}
        <div className={styles.login_box}>
          <div></div>
          <div className={styles.login_box_space_between}>
            <img style={{ marginBottom: "20px" }} src={animation} alt="" />
            <div
              style={{
                marginBottom: "30px",
                fontWeight: "300",
                fontFamily: "BMJUA",
              }}
            >
              배부릉 관리자 페이지
            </div>
            <ThemeProvider theme={theme}>
              <CssTextField
                autoFocus
                required
                id="standard-basic"
                label="Email"
                variant="outlined"
                placeholder="Email을 입력해주세요."
                sx={{
                  width: 0.8,
                  marginBottom: 5,
                  color: "warning",
                }}
                value={Id}
                onChange={onChnageId}
                error={Id ? !validation() : false}
                helperText={
                  Id
                    ? !validation()
                      ? "이메일 형식으로 입력해주세요"
                      : ""
                    : ""
                }
              />
              <CssTextField
                id="custom-css-outlined-input"
                type={showPassword ? "password" : "text"}
                required
                label="Password"
                variant="outlined"
                placeholder="Password를 입력해주세요."
                sx={{
                  width: 0.8,
                  marginBottom: 5,
                }}
                value={Password}
                onChange={onChangePassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                onClick={login}
                type="submit"
                fullWidth
                variant="contained"
                color="mymaincolor"
                sx={{
                  width: 0.8,
                  "&& .MuiTouchRipple-child": {
                    backgroundColor: "white",
                  },
                }}
              >
                <div
                  style={{
                    color: "white",
                    height: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "15px",
                  }}
                >
                  LOG IN
                </div>
              </Button>
            </ThemeProvider>
          </div>
          <div></div>
          <div className={styles.copyright}>
            <img
              style={{ width: "47px", height: "47px", marginRight: "5px" }}
              src={team_logo}
              alt=""
            />
            <div style={{ fontSize: "13px" }}>
              우) 62218 광주광역시 광산구 하남산단6번로 107
              <br />
              COPYRIGHT (c) 2022. TEAM_93%. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

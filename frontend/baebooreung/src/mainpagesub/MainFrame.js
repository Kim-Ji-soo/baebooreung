import styles from "./MainFrame.module.css";
import "../assets/styles/font.css";

import React, { useEffect, useState, Link } from "react";

import logo from "../assets/images/new_logo_2.png";
import logo_fold from "../assets/images/new_logo_2_fold_stroke.png";
import notice from "../assets/images/notice2.png";
import map from "../assets/images/map.png";
import chat from "../assets/images/chat.png";
import logout from "../assets/images/logout_white.png";
import profile from "../assets/images/profile.png";
import task from "../assets/images/task.png";
import driver from "../assets/images/driver.png";
import tracking from "../assets/images/tracking.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/user";
import Swal from "sweetalert2";




const MainFrame = ({ setMainId, changeMenuHeader }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user);
  const [profileUrl, setProfileUrl] = useState('')

  axios({
    url: `https://k7c207.p.ssafy.io:8000/s3-service/getProfile`,
    method: "get",
    params: {
      userId: userInfo.id
    }
  }).then((res) => {
    setProfileUrl(res.data)
  })
  const navigate = useNavigate();
  const onClickImg = () => {
    navigate(`/`);
  };
  const menus = {
    0: "실시간 업무 현황",
    1: "업무 내역",
    2: "채팅",
  }
  const menus_fold = {
    0: "",
    1: "",
    2: "",
  }

  function changeBackground(id) {
    document.getElementById("button_1").className = styles.button_style;
    document.getElementById("button_2").className = styles.button_style;
    document.getElementById("button_3").className = styles.button_style;
    document.getElementById(id).className = styles.button_style_pick;
  }



  return (
    <div className={styles.main_display_flex} style={{ height: "100%" }}>
      <div className={styles.main_justify_content_space_between}>
        <div className={styles.main_display_flex_direction_col}>
          {/* <img className={styles.main_logo_fold_image} src={logo_fold} alt="" /> */}
          <img className={styles.main_logo_image} onClick={onClickImg} src={logo} alt="" />
          <button
            id="button_1"
            className={styles.button_style_pick}
            onClick={() => {
              setMainId(0);
              changeBackground("button_1");
              changeMenuHeader(0);
            }}
          >
            <img className={styles.main_frame_logo_image} src={driver} alt="" />
            &nbsp;&nbsp;&nbsp;<div style={{ fontFamily: "BMHANNAAir" }}>{menus[0]}</div>
            {/* &nbsp;&nbsp;&nbsp;{menus[0]} */}
          </button>
          <button
            id="button_2"
            className={styles.button_style}
            onClick={() => {
              setMainId(1);
              changeBackground("button_2");
              changeMenuHeader(1);
            }}
          >
            <img className={styles.main_frame_logo_image} src={task} alt="" />
            &nbsp;&nbsp;&nbsp;<div style={{ fontFamily: "BMHANNAAir" }}>{menus[1]}</div>
          </button>
          <button
            id="button_3"
            className={styles.button_style}
            onClick={() => {
              setMainId(2);
              changeBackground("button_3");
              changeMenuHeader(2);
            }}
          >
            <img className={styles.main_frame_logo_image} src={chat} alt="" />
            &nbsp;&nbsp;&nbsp;<div style={{ fontFamily: "BMHANNAAir" }}>{menus[2]}</div>
          </button>
        </div>
        <div>
          <div className={styles.profile}>
            <div className={styles.profile_div}>
              <img
                style={{ borderRadius: "50%", border: "3px solid #F5CC1F" }}
                className={styles.main_frame_logo_image}
                src={profileUrl}
                alt=""
              />
              &nbsp;&nbsp;&nbsp;<div style={{ fontFamily: "BMHANNAAir" }}>{userInfo.name}</div>
            </div>
            <a href="/" className={styles.button_style_profile} onClick={() => {
              setTimeout(
                Swal.fire({
                  imageUrl:
                    "https://user-images.githubusercontent.com/97590478/201513112-c13e3dd5-b4e0-432a-a900-deffb3a03400.gif",
                  html: '<div style="font-family:BMJUA;"><strong>ID</strong> 혹은 <strong>Password</strong>를 잘못 입력하셨거나 <br><strong>등록되지 않은 ID</strong>입니다. <br><br> <strong style="color:red;"><b></b></strong>초 후 창이 닫힙니다.</div>',
                  confirmButtonText: "닫기",
                  confirmButtonColor: "#0F1839",
                })
                , 3000)

              axios.defaults.headers.common[
                "Authorization"
              ] = ``;
              dispatch(setToken(''))
            }}
            >
              <img
                style={{ width: "20px", height: "20px" }}
                src={logout}
                alt=""
              />
            </a>
          </div>
        </div>
      </div >
    </div >
  );
};

export default MainFrame;

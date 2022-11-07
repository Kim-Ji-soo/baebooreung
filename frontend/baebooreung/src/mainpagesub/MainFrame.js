import styles from "./MainFrame.module.css";
import "../assets/styles/font.css";

import React, { useEffect, Link } from "react";

import logo from "../assets/images/logo_short_stroke.png";
import dashboard from "../assets/images/dashboard.png";
import notice from "../assets/images/notice.png";
import map from "../assets/images/map.png";
import chat from "../assets/images/chat.png";
import logout from "../assets/images/logout_white.png";
import profile from "../assets/images/profile.png";

const MainFrame = ({ setMainId, changeMenuHeader }) => {

  function changeBackground(id) {
    document.getElementById('button_1').className=styles.button_style
    document.getElementById('button_2').className=styles.button_style
    document.getElementById('button_3').className=styles.button_style
    document.getElementById('button_4').className=styles.button_style
    document.getElementById(id).className=styles.button_style_pick
  }

  return (
    <div className={styles.main_display_flex} style={{ height: "100%" }}>
      <div className={styles.main_justify_content_space_between}>
        <div className={styles.main_display_flex_direction_col}>
          <a href="/"><img className={styles.main_logo_image} src={logo} alt="" /></a>
          <button id="button_1"
            className={styles.button_style_pick}
            onClick={() => {
              setMainId(0);
              changeBackground('button_1');
              changeMenuHeader(0);
            }}
          >
            <img
              className={styles.main_frame_logo_image}
              src={dashboard}
              alt=""
            />
            &nbsp;&nbsp;&nbsp;대시보드
          </button>
          <button id="button_2"
            className={styles.button_style}
            onClick={() => {
              setMainId(1);
              changeBackground('button_2');
              changeMenuHeader(1);
            }}
          >
            <img className={styles.main_frame_logo_image} src={map} alt="" />
            &nbsp;&nbsp;&nbsp;드라이버위치
          </button>
          <button id="button_3"
            className={styles.button_style}
            onClick={() => {
              setMainId(2);
              changeBackground('button_3');
              changeMenuHeader(2);
            }}
          >
            <img className={styles.main_frame_logo_image} src={notice} alt="" />
            &nbsp;&nbsp;&nbsp;공지사항
          </button>
          <button id="button_4"
            className={styles.button_style}
            onClick={() => {
              setMainId(3);
              changeBackground('button_4');
              changeMenuHeader(3);
            }}
          >
            <img className={styles.main_frame_logo_image} src={chat} alt="" />
            &nbsp;&nbsp;&nbsp;채팅
          </button>
        </div>
        <div>
          <div className={styles.profile}>
            <img
              className={styles.main_frame_logo_image}
              src={profile}
              alt=""
            />
            &nbsp;&nbsp;&nbsp;내 이름&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button className={styles.button_style_profile}>
              <img style={{width:"30px", height:"30px"}} src={logout} alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFrame;

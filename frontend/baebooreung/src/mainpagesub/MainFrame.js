import styles from "./MainFrame.module.css";
import "../assets/styles/font.css";

import React, { useEffect } from "react";

import logo from "../assets/images/logo_short_stroke.png";
import dashboard from "../assets/images/dashboard.png";
import notice from "../assets/images/notice.png";
import map from "../assets/images/map.png";
import chat from "../assets/images/chat.png";
import logout from "../assets/images/logout.png";
import profile from "../assets/images/profile.png";

const MainFrame = ({ setMainId }) => {

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
          <img className={styles.main_logo_image} src={logo} alt="" />
          <button id="button_1"
            className={styles.button_style}
            onClick={() => {
              setMainId(0);
              changeBackground('button_1');
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
            }}
          >
            <img className={styles.main_frame_logo_image} src={chat} alt="" />
            &nbsp;&nbsp;&nbsp;채팅
          </button>
        </div>
        <div>
          <button className={styles.button_style}>
            <img
              className={styles.main_frame_logo_image}
              src={profile}
              alt=""
            />
            &nbsp;&nbsp;&nbsp;내 이름
            <img className={styles.main_frame_logo_image} src={logout} alt="" />
          </button>
          <button class={styles.btn5}>
            Button 5
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainFrame;

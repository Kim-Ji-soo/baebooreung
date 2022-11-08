import styles from "./MainFrame.module.css";
import "../assets/styles/font.css";

import React, { useEffect, Link } from "react";

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

const MainFrame = ({ setMainId, changeMenuHeader }) => {
  const menus = {
    0: "드라이버 현황",
    1: "업무 내역",
    2: "경로 분석",
    3: "채팅",
    4: "공지사항",
    5: "네이버지도테스트",
  }
  const menus_fold = {
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  }

  function changeBackground(id) {
    document.getElementById("button_1").className = styles.button_style;
    document.getElementById("button_2").className = styles.button_style;
    document.getElementById("button_3").className = styles.button_style;
    document.getElementById("button_4").className = styles.button_style;
    document.getElementById("button_5").className = styles.button_style;
    document.getElementById("button_6").className = styles.button_style;
    document.getElementById(id).className = styles.button_style_pick;
  }

  return (
    <div className={styles.main_display_flex} style={{ height: "100%" }}>
      <div className={styles.main_justify_content_space_between}>
        <div className={styles.main_display_flex_direction_col}>
          <a href="/">
            {/* <img className={styles.main_logo_fold_image} src={logo_fold} alt="" /> */}
            <img className={styles.main_logo_image} src={logo} alt="" />
          </a>
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
            &nbsp;&nbsp;&nbsp;<div>{menus[0]}</div>
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
            &nbsp;&nbsp;&nbsp;업무 내역
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
            <img
              className={styles.main_frame_logo_image}
              src={tracking}
              alt=""
            />
            &nbsp;&nbsp;&nbsp;경로 분석
          </button>
          <button
            id="button_4"
            className={styles.button_style}
            onClick={() => {
              setMainId(3);
              changeBackground("button_4");
              changeMenuHeader(3);
            }}
          >
            <img className={styles.main_frame_logo_image} src={chat} alt="" />
            &nbsp;&nbsp;&nbsp;채팅
          </button>
          <button
            id="button_5"
            className={styles.button_style}
            onClick={() => {
              setMainId(4);
              changeBackground("button_5");
              changeMenuHeader(4);
            }}
          >
            <img className={styles.main_frame_logo_image} src={notice} alt="" />
            &nbsp;&nbsp;&nbsp;공지사항
          </button>
          <button
            id="button_6"
            className={styles.button_style}
            onClick={() => {
              setMainId(5);
              changeBackground("button_6");
              changeMenuHeader(5);
            }}
          >
            <img className={styles.main_frame_logo_image} src={map} alt="" />
            &nbsp;&nbsp;&nbsp;네이버지도
          </button>
        </div>
        <div>
          <div className={styles.profile}>
            <div className={styles.profile_div}>
              <img
                className={styles.main_frame_logo_image}
                src={profile}
                alt=""
              />
              &nbsp;&nbsp;&nbsp;내 이름
            </div>
            <button className={styles.button_style_profile}>
              <img
                style={{ width: "20px", height: "20px" }}
                src={logout}
                alt=""
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFrame;

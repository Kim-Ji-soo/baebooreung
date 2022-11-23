import * as React from "react";
import { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
// import styles from './reactSlick.module.css';
import "./reactSlick.css";
import "./reactSlick2.css";
import new_logo from "../../assets/images/new_logo_2.png";
import { useNavigate } from "react-router-dom";
import ReactPlayer from 'react-player/lazy';
// import movie from '../../assets/배달긱영상40초.mp4';
// import movie2 from '../../assets/배부릉 UCC 저용량.mp4';
// import { fontSize } from "@mui/system";

// import "./styles.css";
const SliderSlick = () => {
  const navigate = useNavigate();
  const onClickImg = () => {
    navigate(`/`);
  };

  const [nav2, setNav2] = useState();
  return (
    // <div className={styles.main_div}>
    <div
      style={{
        padding: "0 50px",
        width: "60%",
        height: "100%",
        justifyContent: "center",
        borderStyle: "none",
        border: "none"
      }}
    >
      <Slider
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        // className="mainSlider"
        asNavFor={nav2}
        ref={(slider1) => setNav2(slider1)}
      >
        <div
          style={{
            height: "100%",
            width: "100%",
            borderStyle: "none",
            border: "5px solid red",
          }}
        >
          <div style={{ height: "48vh" }}></div>
          <img
            style={{
              position: "relative",
              top: "50%",
              left: "53%",
              height: "40vh",
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
              border: "none",
              borderStyle: "none",
            }}
            src={new_logo}
            alt=""
          />
        </div>
        {/* <div className='player-wrapper' style={{ height: "100%", width: "100%" }}>
          <div style={{
            position: "relative",
            top: "30%",
            left: "53%",
            height: "100%",
            transform: "translate(-53%, 25%)",
            cursor: "pointer",
            border: "none",
            borderStyle: "none",
          }}>
            <div style={{ fontSize: "36px", color: "white", fontFamily: "BMJUA", textAlign: "center", marginBottom: "10px" }}>배달긱 소개 영상</div>
            <ReactPlayer
              className='react-player'
              url={movie}   // 플레이어 url
              width='100%'         // 플레이어 크기 (가로)
              height='100%'        // 플레이어 크기 (세로)
              playing={false}        // 자동 재생 on
              muted={false}          // 자동 재생 on
              controls={true}       // 플레이어 컨트롤 노출 여부
              light={false}         // 플레이어 모드
              pip={true}            // pip 모드 설정 여부
            // onEnded={}  // 플레이어 끝났을 때 이벤트
            />
          </div>
        </div>
        <div className='player-wrapper' style={{ height: "100%", width: "100%" }}>
          <div style={{
            position: "relative",
            top: "30%",
            left: "53%",
            height: "80%",
            transform: "translate(-53%, 25%)",
            cursor: "pointer",
            border: "none",
            borderStyle: "none",
          }}>
            <div style={{ fontSize: "36px", color: "white", fontFamily: "BMJUA", textAlign: "center", marginBottom: "10px" }}>배부릉 발표 UCC</div>
            <ReactPlayer
              className='react-player'
              url={movie2}   // 플레이어 url
              width='100%'         // 플레이어 크기 (가로)
              height='100%'        // 플레이어 크기 (세로)
              playing={false}        // 자동 재생 on
              muted={false}          // 자동 재생 on
              controls={true}       // 플레이어 컨트롤 노출 여부
              light={false}         // 플레이어 모드
              pip={true}            // pip 모드 설정 여부
            // onEnded={}  // 플레이어 끝났을 때 이벤트
            />
          </div>
        </div> */}
        {/* <div
          style={{
            height: "100%",
            width: "100%",
            border: "none",
          }}
        >
          <div style={{ height: "48vh" }}></div>
          <img
            style={{
              position: "relative",
              top: "50%",
              left: "53%",
              height: "40vh",
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
              border: "none",
              borderStyle: "none",
            }}
            src={new_logo}
            alt=""
          />
        </div> */}

      </Slider>
    </div>
  );
};

export default SliderSlick;

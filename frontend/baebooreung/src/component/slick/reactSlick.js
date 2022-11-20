import * as React from "react";
import { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
// import styles from './reactSlick.module.css';
import "./reactSlick.css";
import "./reactSlick2.css";
import new_logo from "../../assets/images/new_logo_2.png";
import { useNavigate } from "react-router-dom";
import ReactPlayer from 'react-player/lazy';
import movie from '../../assets/배달긱영상40초.mp4';
import movie2 from '../../assets/배부릉 UCC 저용량.mp4';
import { fontSize } from "@mui/system";

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
        <div
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
        </div>
      </Slider>
    </div>
  );
};

export default SliderSlick;

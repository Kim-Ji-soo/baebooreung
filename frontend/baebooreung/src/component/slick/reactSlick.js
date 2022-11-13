import * as React from "react";
import { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
// import styles from './reactSlick.module.css';
import './reactSlick.css';
import "./reactSlick2.css";
import new_logo from '../../assets/images/new_logo_2.png'

// import "./styles.css";
const SliderSlick = () => {

  const [nav2, setNav2] = useState();
  return (

    // <div className={styles.main_div}>
    <div style={{ padding: "0 50px", width: "60%", height: "100%", justifyContent: "center" }}>
      <Slider style={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
        // className="mainSlider"
        asNavFor={nav2}
        ref={slider1 => setNav2(slider1)}
      >
        <div style={{
          height: "100%",
          width: "100%",
        }}>
          <a href="/" style={{ outline: "none" }}>
            <div style={{ height: "48vh" }}></div>
            <img style={{
              position: "relative",
              top: "50%",
              left: "50%",
              height: "40vh",
              transform: "translate(-50%, -50%)"
            }} src={new_logo} alt="" />
            <div style={{ height: "4vh" }}></div>
          </a>

        </div>
        <div style={{
          height: "100%",
          width: "100%",
        }}>
          <div style={{ height: "48vh" }}></div>
          <a href="/" style={{ outline: "none" }}>
            <img style={{
              position: "relative",
              top: "50%",
              left: "50%",
              width: "45%",
              transform: "translate(-50%, -50%)"
            }} src={new_logo} alt="" />
          </a>
        </div>
      </Slider>
    </div>
  );
};

export default SliderSlick;

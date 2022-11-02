import styles from '../MainPage/MainFrame.module.css'
import React, { useEffect } from 'react';
import logo from '../assets/iamges/배달긱.png'


const MainFrame = ({SetMainId}) => {

  return (
    <div className={styles.main_display_flex}  style={{height:"100%"}}>
      <div className={styles.main_justify_content_space_between}>
        <div className={styles.main_display_flex_direction_col}>
          <img className={styles.main_logo_image} src={logo} alt="" />
          <button onClick={() => {SetMainId(0)}}>대시보드</button>
          <button onClick={() => {SetMainId(1)}}>채팅</button>
          <button onClick={() => {SetMainId(2)}}>드라이버위치</button>
        </div>
        <div className={styles.main_display_flex_direction_col}>
          <button>내 이름</button>
        </div>
      </div>
      <div className={styles.main_content}>
      </div>
    </div>
  )
}

export default MainFrame;
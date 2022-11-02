import styles from '../MainPage/Main.module.css'
import React, { useEffect } from 'react';
import logo from '../assets/iamges/배달긱.png'
import { useState } from 'react';

const Main = () => {

  // useEffect(() => {
  //   document.body.style.height = document.body.scrollHeight < window.innerHeight ? window.innerHeight + 'px' : document.body.scrollHeight + 'px'
  // }, [])
  function add_div() {
    const newDiv = document.createElement('div');
    const newText = document.createTextNode('안녕하세요');
    newDiv.appendChild(newText)
    document.getElementById('123').appendChild(newDiv);
  }

  return (
    <div className={styles.main} id='div_height' style={{height:"100%"}}>
      <div>
        <img className={styles.main_logo_image} src={logo} alt="" />
      </div>
      <div className={styles.main_content} id= "123">
        <button onClick={add_div}>추가</button>
        <div>배부릉 로고</div>
        <div>대시보드</div>
        <div>드라이버 위치</div>
        <div>가입승인</div>
        <div>배부릉 로고</div>
        <div>가입승인</div>
        <div>배부릉 로고</div>
        <div>대시보드</div>
        <div>대시보드</div>
        <div>드라이버 위치</div>
        <div>채팅</div>
        <div>업무할당</div>
        <div>가입승인</div>
        <div>배부릉 로고</div>
        <div>가입승인</div>
        <div>배부릉 로고</div>
        <div>대시보드</div>
      </div>
      <div>
        안녕하세요?
      </div>
    </div>
  )
}

export default Main;
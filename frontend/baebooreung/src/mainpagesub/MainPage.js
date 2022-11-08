import styles from './MainPage.module.css';

import { useState } from 'react';

import RealTime from './1RealTime'
import AllWork from './2AllWork';
import RouteAnalysis from './3RouteAnalysis';
import Chatting from './4Chatting';
import Notice from './5Notice';
import MainFrame from './MainFrame';

import NaverMapApi from '../navermap/NaverMapApi';
import fold_on from '../assets/images/fold_on.png'
import fold_off from '../assets/images/fold_off.png'

const MainPage = () => {
  // console.log('')
  const [MainId, setactiveId] = useState(0);
  const clickhandler = (Id) => {
    setactiveId(Id);
  }
  const [MenuId, setMenuId] = useState(0);
  const clickhandler2 = (Id) => {
    setTimeout(() => {
      document.getElementById('menu_header').className=styles.menu_header_after;
    }, 0)
    document.getElementById('menu_header').className=styles.menu_header_before
    setMenuId(Id);
  }

  const contents = {
    0: <RealTime />,
    1: <AllWork />,
    2: <RouteAnalysis />,
    3: <Chatting />,
    4: <Notice />,
    5: <NaverMapApi />
  }
  const menu_header = {
    0: '드라이버 현황',
    1: '업무 내역',
    2: '경로 분석',
    3: '채팅',
    4: '공지사항',
    5: '네이버지도'
  }

  return (
    <div style={{ height:"100%", width:"100%" }}>
      {/* <button onClick={fold} className={styles.fold_button}> */}
      <div style={{ display: "flex", height:"100%", width:"100%" }}>
        <div style={{ display: "flex", height: "100%"}}>
          <button className={styles.fold_button}>
            <img src={fold_on} style={{width:"10px", height:"10px"}} alt="" />
          </button>
          <MainFrame setMainId={clickhandler} changeMenuHeader={clickhandler2} />
        </div>
        <div style={{ height:"100%", width:"100%" }}>
          <div className={styles.menu_header_after} id="menu_header">{menu_header[MenuId]}</div>
          <div className={styles.menu_content}>{contents[MainId]}</div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;

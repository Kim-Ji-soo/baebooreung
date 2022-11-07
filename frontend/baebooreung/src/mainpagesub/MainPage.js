import styles from './MainPage.module.css';

import { useState } from 'react';

import MainFrame from "./MainFrame";
import DashBoard from "./DashBoard";
import Chatting from "./Chatting";
import Notice from "./Notice";
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
    0: <DashBoard />,
    1: <NaverMapApi />,
    2: <Notice />,
    3: <Chatting />
  }
  const menu_header = {
    0: '대시보드',
    1: '드라이버 위치',
    2: '공지사항',
    3: '채팅'
  }

  return (
    <div style={{ height: "100%" }}>
      {/* <button onClick={fold} className={styles.fold_button}>
        <img src={fold_on} style={{width:"20px", height:"20px"}} alt="" />
      </button> */}
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ display: "flex", height: "100%"}}>
          <MainFrame setMainId={clickhandler} changeMenuHeader={clickhandler2} />
        </div>
        <div style={{ width:"100%" }}>
          <div className={styles.menu_header_after} id="menu_header">{menu_header[MenuId]}</div>
          <div className={styles.menu_content}>{contents[MainId]}</div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;

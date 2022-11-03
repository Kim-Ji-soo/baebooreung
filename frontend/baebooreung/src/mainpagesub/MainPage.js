import styles from './MainPage.module.css';

import { useState } from 'react';

import MainFrame from "./MainFrame";
import DashBoard from "./DashBoard";
import Chatting from "./Chatting";
import Notice from "./Notice";
import NaverMapApi from '../navermap/NaverMapApi';

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
    0: 'DASH BOARD',
    1: 'DRIVER LOCATION',
    2: 'NOTICE',
    3: 'CHATTING'
  }

  return (
    <div style={{ height: "100%" }}>
      <div style={{ display: "flex" }}>
        <div>
          <MainFrame setMainId={clickhandler} changeMenuHeader={clickhandler2} />
        </div>
        <div style={{ width: "100%" }}>
          <div className={styles.menu_header_after} id="menu_header">{menu_header[MenuId]}</div>
          {contents[MainId]}
        </div>
      </div>
    </div>
  );
};

export default MainPage;

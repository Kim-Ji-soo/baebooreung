import styles from './MainPage.module.css';

import { useState } from 'react';

import MainFrame from "./MainFrame";
import DashBoard from "./DashBoard";
import Chatting from "./Chatting";
import Notice from "./Notice";
// import NaverMapApi from '../navermap/NaverMapApi';

const MainPage = () => {
  // console.log('')
  const [MainId, setactiveId] = useState(0);
  const clickhandler = (Id) => {
    setactiveId(Id);
  }

  const contents = {
    0: <DashBoard />,
    // 1: <NaverMapApi />,
    2: <Notice />,
    3: <Chatting />
  }

  return (
    <div style={{ height: "100%" }}>
      <div style={{ display: "flex" }}>
        <div>
          <MainFrame setMainId={clickhandler} />
        </div>
        <div style={{ width: "100%" }}>
          <div className={styles.menu_header}>안녕하세요?</div>
          {contents[MainId]}
        </div>
      </div>
    </div>
  );
};

export default MainPage;

import styles from './Main.module.css';

import { useState } from 'react';

import MainFrame from "./MainFrame";
import DashBoard from "./DashBoard";
import Chatting from "./Chatting";
import Notice from "./Notice";
import NaverMapApi from '../navermap/NaverMapApi';

const Main = () => {
  // console.log('')
  const [MainId, setactiveId] = useState(0);
  const clickhandler = (Id) => {
    setactiveId(Id);
  }

  const contents = {
    0: <DashBoard />,
    1: <NaverMapApi />,
    2: <Notice />,
    3: <Chatting />
  }

  return (
    <div style={{ height: "100%" }}>
      <div style={{ display: "flex" }}>
        <div>
          <MainFrame SetMainId={clickhandler} />
        </div>
        <div style={{ width: "100%" }}>
          <div style={{backgroundColor:"aqua", margin:"30px", marginLeft:"0px"}}>안녕하세요?</div>
          {contents[MainId]}
          <a href="#" class={styles.btn5}>
            Button 5
          </a>
        </div>
      </div>
    </div>
  );
};

export default Main;

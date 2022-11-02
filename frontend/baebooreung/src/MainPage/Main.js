import styles from '../MainPage/Main.module.css';

import { useState } from 'react';

import MainFrame from "./MainFrame";
import DashBoard from "./DashBoard";
import Chatting from "./Chatting";
import DriverPosition from "./DriverPosition";

const Main = () => {
  const [MainId, setactiveId] = useState(0);
  const clickhandler = (Id) => {
    setactiveId(Id); 
  }

  const contents = {
    0: <DashBoard />,
    1: <Chatting />,
    2: <DriverPosition />,
  }

  return (
    <div className={styles.main_component} style={{height:"100%"}}>
      <div>
        <MainFrame SetMainId={clickhandler}/>
      </div>
      <div>
        {contents[MainId]}
      </div>
    </div>
  );
};

export default Main;

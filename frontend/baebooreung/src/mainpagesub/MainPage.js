import * as React from 'react';
import { useState } from 'react';
import styles from './MainPage.module.css';

import RealTime from './1RealTime'
import AllWork from './2AllWork';
import RouteAnalysis from './3RouteAnalysis';
import Chatting from './4Chatting';
import Notice from './5Notice';
import MainFrame from './MainFrame';

// import NaverMapApi from '../navermap/NaverMapApi';
import NowLocation from '../nowlocation/NowLocation';
import fold_on from '../assets/images/fold_on.png'
import fold_off from '../assets/images/fold_off.png'

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';



const theme = createTheme({
  overrides: {
    // Style sheet name
    MuiTouchRipple: {
      // Name of the rule
      child: {
        // Some CSS
        backgroundColor: "red"
      }
    }
  },
  palette: {
    mymaincolor: {
      main: '#0F1839',
    },
  },
  typography: {
    "fontFamily": "S-CoreDream-3Light"
  }
});

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#0F1839',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#0F1839',
  },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#0F1839',
    },
  },
});


const MainPage = () => {
  const [pickDate, pickDateValue] = React.useState(null);

  const [region, setRegion] = React.useState('');

  const handleChange1 = (event) => {
    setRegion(event.target.value);
  };

  const [univ, setUniv] = React.useState('');

  const handleChange2 = (event) => {
    setUniv(event.target.value);
  };

  const [taskTime, setTaskTime] = React.useState('');

  const handleChange3 = (event) => {
    setTaskTime(event.target.value);
  };

  const [MainId, setactiveId] = useState(0);
  const clickhandler = (Id) => {
    setactiveId(Id);
  }
  const [MenuId, setMenuId] = useState(0);
  const clickhandler2 = (Id) => {
    // setTimeout(() => {
    //   document.getElementById('menu_header').className=styles.menu_header_after;
    // }, 0)
    // document.getElementById('menu_header').className=styles.menu_header_before
    setMenuId(Id);
  }

  const contents = {
    5: <RealTime />,
    1: <AllWork />,
    2: <RouteAnalysis />,
    3: <Chatting />,
    4: <Notice />,
    0: <NowLocation />
  }
  const menu_header = {
    0: '실시간 업무 현황',
    1: '업무 내역',
    2: '경로 분석',
    3: '채팅',
    4: '공지사항',
    5: '네이버지도'
  }

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {/* <button onClick={fold} className={styles.fold_button}> */}
      <div style={{ display: "flex", height: "100%", width: "100%" }}>
        <div style={{ display: "flex", height: "100%" }}>
          {/* <button className={styles.fold_button}>
            <img src={fold_on} style={{width:"10px", height:"10px"}} alt="" />
          </button> */}
          <MainFrame
            setMainId={clickhandler}
            changeMenuHeader={clickhandler2}
          />
        </div>
        <div style={{ height: "100%", width: "100%" }}>
          <div className={styles.menu_header_after} id="menu_header">
            <div>{menu_header[MenuId]}</div>
            <div >
              {/* 지역 선택 */}
              <FormControl sx={{ m: 0, minWidth: 120 }} size="small">
                <InputLabel id="demo-select-small">지역</InputLabel>
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={region}
                  label="Age"
                  onChange={handleChange1}
                >
                  <MenuItem value={"seoul"}>서울</MenuItem>
                  <MenuItem value={"gwangju"}>광주</MenuItem>
                </Select>
              </FormControl>
              {/* 대학 선택 */}
              <FormControl sx={{ marginLeft: 1, minWidth: 120 }} size="small">
                <InputLabel id="demo-select-small">대학</InputLabel>
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={univ}
                  label="Age"
                  onChange={handleChange2}
                >
                  <MenuItem value={10}>전남대학교</MenuItem>
                  <MenuItem value={20}>광주과학기술원</MenuItem>
                </Select>
              </FormControl>
              {/* 시간 선택 */}
              <FormControl sx={{ marginLeft: 1, minWidth: 120 }} size="small">
                <InputLabel id="demo-select-small">시간</InputLabel>
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={taskTime}
                  label="Age"
                  onChange={handleChange3}
                >
                  <MenuItem value={"lunch"}>점심</MenuItem>
                  <MenuItem value={"dinner"}>저녁</MenuItem>
                </Select>
              </FormControl>
              {/* 날짜 선택 */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="날짜"
                  value={pickDate}
                  onChange={(newValue) => {
                    pickDateValue(newValue);
                  }}
                  renderInput={(params) => <TextField size='small' sx={{ marginRight: 3, marginLeft: 1, width: 150 }} {...params} />}
                />
              </LocalizationProvider>
            </div>
          </div>
          <div className={styles.menu_content}>{contents[MainId]}</div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;

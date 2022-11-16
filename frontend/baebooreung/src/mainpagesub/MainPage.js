import * as React from 'react';
import { useState } from 'react';
import styles from './MainPage.module.css';

import RealTime from './1RealTime';
import AllWork from './2AllWork';
import RouteAnalysis from './3RouteAnalysis';
import Chatting from './4Chatting';
import MainFrame from './MainFrame';
import NowLocation from '../nowlocation/NowLocation';
import Testpage from './testpage';

// import NaverMapApi from '../navermap/NaverMapApi';
import fold_on from '../assets/images/fold_on.png'
import fold_off from '../assets/images/fold_off.png'
import search from '../assets/images/search.png';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createTheme, styled, ThemeProvider, } from '@mui/material/styles';
import FormHelperText from '@mui/material/FormHelperText';
import { nodeName } from 'jquery';
import { display } from '@mui/system';




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
    "fontFamily": "BMJUA"
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

  const [region, setRegion] = React.useState('');
  const [univ, setUniv] = React.useState('');
  const [taskTime, setTaskTime] = React.useState('');
  const [pickDate, pickDateValue] = React.useState(new Date().getMonth() + 1 > 10 ? (new Date().getDate() > 10 ? `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}` : `${new Date().getFullYear()}-${new Date().getMonth() + 1}-0${new Date().getDate()}`) : `${new Date().getFullYear()}-0${new Date().getMonth() + 1}-0${new Date().getDate()}`);

  const handleChange1 = (event) => {
    setRegion(event.target.value);

  };
  const handleChange2 = (event) => {
    setUniv(event.target.value);
  };
  const handleChange3 = (event) => {
    setTaskTime(event.target.value);
  };

  const [MainId, setactiveId] = useState(0);
  const clickhandler = (Id) => {
    setactiveId(Id);
  }
  const [MenuId, setMenuId] = useState(0);
  const clickhandler2 = (Id) => {
    setMenuId(Id);
  }

  const myParams = {
    region: region,
    univ: univ,
    taskTime: taskTime,
    pickDate: pickDate
  }

  const contents = {
    0: <RealTime myParams={myParams} />,
    1: <AllWork myParams={myParams} />,
    2: <RouteAnalysis myParams={myParams} />,
    3: <Chatting />,
    // 4: <NowLocation myParams={myParams} />,
  }
  const menu_header = {
    0: '실시간 업무 현황',
    1: '업무 내역',
    2: '경로 분석',
    3: '채팅',
    // 4: '테스트',
  }
  React.useEffect(() => {
    setRegion('')
    setUniv('')
    setTaskTime('')
    pickDateValue(new Date().getMonth() + 1 > 10 ? (new Date().getDate() > 10 ? `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}` : `${new Date().getFullYear()}-${new Date().getMonth() + 1}-0${new Date().getDate()}`) : `${new Date().getFullYear()}-0${new Date().getMonth() + 1}-0${new Date().getDate()}`)
  }, [MainId])

  React.useEffect(() => {
    setUniv('')
  }, [myParams.region])

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
            <div className={styles.menu_setting}>

              <ThemeProvider theme={theme}>
                {/* 지역 선택 */}
                <FormControl color="mymaincolor" sx={{ m: 0, minWidth: 120 }} size="small">
                  <InputLabel
                    id="demo-select-small"
                    color="mymaincolor"
                    sx={{
                      fontFamily: "BMJUA",
                      color: "mymaincolor"
                    }}>지역</InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={region}
                    label="Age"
                    onChange={handleChange1}
                    sx={{
                      color: "warning",
                    }}
                  >
                    <MenuItem sx={{ fontFamily: "BMJUA" }} value={"SEOUL"}>서울</MenuItem>
                    <MenuItem sx={{ fontFamily: "BMJUA" }} value={"GWANGJU"}>광주</MenuItem>
                  </Select>
                </FormControl>
                {/* 대학 선택 */}
                {
                  region === "" ?
                    <FormControl color="mymaincolor" sx={{ marginLeft: 2, minWidth: 120 }} disabled size="small">
                      <InputLabel sx={{ fontFamily: "BMJUA" }} color="mymaincolor" id="demo-select-small">대학</InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={univ}
                        label="Age"
                        onChange={handleChange2}
                      >
                      </Select>
                    </FormControl>
                    :
                    <></>
                }
                {
                  region === "SEOUL" ?
                    <FormControl color="mymaincolor" sx={{ marginLeft: 2, minWidth: 120 }} size="small">
                      <InputLabel sx={{ fontFamily: "BMJUA" }} color="mymaincolor" id="demo-select-small">대학</InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={univ}
                        label="Age"
                        onChange={handleChange2}
                      >
                        <MenuItem sx={{ fontFamily: "BMJUA" }} value={'연세대학교'}>연세대학교</MenuItem>
                      </Select>
                    </FormControl>
                    :
                    <></>
                }
                {
                  region === "GWANGJU" ?
                    <FormControl color="mymaincolor" sx={{ marginLeft: 2, minWidth: 120 }} size="small">
                      <InputLabel sx={{ fontFamily: "BMJUA" }} color="mymaincolor" id="demo-select-small">대학</InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={univ}
                        label="Age"
                        onChange={handleChange2}
                      >
                        <MenuItem sx={{ fontFamily: "BMJUA" }} value={'전남대학교'}>전남대학교</MenuItem>
                        <MenuItem sx={{ fontFamily: "BMJUA" }} value={'광주과학기술원'}>광주과학기술원</MenuItem>
                      </Select>
                    </FormControl>
                    :
                    <></>
                }
                {/* 시간 선택 */}
                {
                  univ !== "" ?
                    <FormControl color="mymaincolor" sx={{ marginRight: 2, marginLeft: 2, minWidth: 120, fontFamily: "BMJUA" }} size="small">
                      <InputLabel sx={{ fontFamily: "BMJUA" }} placeholder="시간" color="mymaincolor" id="demo-select-small">시간</InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={taskTime}
                        label="Age"
                        onChange={handleChange3}
                      >
                        <MenuItem sx={{ fontFamily: "BMJUA" }} value={"lunch"}>점심</MenuItem>
                        <MenuItem sx={{ fontFamily: "BMJUA" }} value={"dinner"}>저녁</MenuItem>
                      </Select>
                    </FormControl>
                    : <FormControl disabled color="mymaincolor" sx={{ marginRight: 2, marginLeft: 2, minWidth: 120, fontFamily: "BMJUA" }} size="small">
                      <InputLabel sx={{ fontFamily: "BMJUA" }} placeholder="시간" color="mymaincolor" id="demo-select-small">시간</InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={taskTime}
                        label="Age"
                        onChange={handleChange3}
                      >
                        <MenuItem sx={{ fontFamily: "BMJUA" }} value={"lunch"}>점심</MenuItem>
                        <MenuItem sx={{ fontFamily: "BMJUA" }} value={"dinner"}>저녁</MenuItem>
                      </Select>
                    </FormControl>
                }
                {/* 날짜 선택 */}
                {
                  MainId !== 0
                    ? <LocalizationProvider sx={{ fontFamily: "BMJUA" }} color="mymaincolor" dateAdapter={AdapterDayjs}>
                      <DatePicker
                        inputFormat='YYYY년 MM월 DD일'
                        fontFamily="BMJUA"
                        color="mymaincolor"
                        label="날짜"
                        value={pickDate}
                        sx={{ fontFamily: "BMJUA" }}
                        maxDate={new Date()}
                        onChange={(newValue) => {
                          pickDateValue(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField color="mymaincolor"
                            size="small"
                            sx={{ marginRight: 2, marginLeft: 0, width: 200, fontFamily: "BMJUA" }}
                            {...params}
                            inputProps={{
                              ...params.inputProps,
                              placeholder: "2022년 01월 01일"
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                    : <LocalizationProvider sx={{ fontFamily: "BMJUA" }} color="mymaincolor" dateAdapter={AdapterDayjs}>
                      <DatePicker
                        inputFormat='YYYY년 MM월 DD일'
                        fontFamily="BMJUA"
                        color="mymaincolor"
                        label="날짜"
                        disabled={true}
                        value={pickDate}
                        sx={{ fontFamily: "BMJUA" }}
                        maxDate={new Date()}
                        onChange={(newValue) => {
                          pickDateValue(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField color="mymaincolor"
                            size="small"
                            sx={{ marginRight: 2, marginLeft: 0, width: 200, fontFamily: "BMJUA" }}
                            {...params}
                            inputProps={{
                              ...params.inputProps,
                              placeholder: "2022년 01월 01일"
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                }
              </ThemeProvider>
              {/* <button className={styles.searchBUtton} >
                <img style={{ width: "25px", height: "25px", marginTop: "2px", marginRight: "10px" }} src={search} alt="" />
              </button> */}
            </div>
          </div>
          <div className={styles.menu_content}>{contents[MainId]}</div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;

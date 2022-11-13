import React from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import new_logo from './assets/images/new_logo.png'
import NaverMapApi from './navermap/NaverMapApi';
import MainPage from './mainpagesub/MainPage';
// import Testpage from './testpage';
import Page404 from './other/Page404';
import Login from './loginpage/login';
import SliderSlick from './component/slick/reactSlick'

function App() {
  // const [islogin, setIsLogin] = useState(false)
  function accessToken() {
    if (localStorage.getItem("accessToken")) {
      return true
    }
    else {
      return false
    }
  }

  return (
    <div className="App" style={{ height: "100%", width: "100%" }}>
      <BrowserRouter style={{ height: "100%", width: "100%" }}>
        {/* {accessToken()  && ( */}
        <Routes style={{ height: "100%", width: "100%" }}>
          <Route path="/main" element={<MainPage />} />
        </Routes>
        {/* )} */}
        {/* {(!accessToken()) && ( */}
        <Routes style={{ height: "100%", width: "100%" }}>
          <Route path="/test" element={<Page404 />} />
          <Route path="/tesk" element={<SliderSlick />} />
          <Route path="/" element={<Login />} />
          {/* <Route path="/main" element={<Page404 />} /> */}
        </Routes>
        {/* )} */}
      </BrowserRouter>
    </div>
  );
}
export default App;
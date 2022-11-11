import React from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import NaverMapApi from './navermap/NaverMapApi';
import Page404 from './Page404';
import MainPage from './mainpagesub/MainPage';
// import Testpage from './testpage';
import Login from './loginpage/login';


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
            <Route path="/" element={<Login />} />
            {/* <Route path="/main" element={<Page404 />} /> */}
          </Routes>
        {/* )} */}
      </BrowserRouter>
    </div>
  );
}
export default App;
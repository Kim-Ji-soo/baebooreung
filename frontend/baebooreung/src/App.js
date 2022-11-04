import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import NaverMapApi from './navermap/NaverMapApi';
// import Page404 from './Page404';
import MainPage from './mainpagesub/MainPage';
// import Testpage from './testpage';
import Login from './loginpage/login';

function App() {

  // useEffect(() => {
  //   document.body.style.height = document.body.scrollHeight < window.innerHeight ? window.innerHeight + 'px' : document.body.scrollHeight + 'px'
  // }, [])

  return (
    <div className="App" style={{ height: "100%" }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          {/* <Route path="/" element={< />}/> */}
          {/* 로그인 + 비로그인 */}
          {/* <Route path="/main" element={<MainPage />} /> */}
          {/* <Route path="/" element={<Testpage></Testpage>}></Route> */}
          <Route path="/admin/naver" element={<NaverMapApi />} />
          {/* 로그인  */}
          {/* 비로그인  */}
          {/* <Route path="*" element={<Page404 />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
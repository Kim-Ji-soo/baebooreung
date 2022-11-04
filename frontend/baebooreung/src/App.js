import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import NaverMapApi from './navermap/NaverMapApi';
// import Page404 from './Page404';
// import MainPage from './mainpagesub/MainPage';
// import Testpage from './testpage';
// import Login from './loginpage/login';

function App() {

  // useEffect(() => {
  //   document.body.style.height = document.body.scrollHeight < window.innerHeight ? window.innerHeight + 'px' : document.body.scrollHeight + 'px'
  // }, [])

  return (
    <div className="App" style={{ height: "100%" }}>
      안녕하세요? 빌드 테스트
      빌드테스트 2
      {/* <Login></Login> */}
      {/* <BrowserRouter> */}
      {/* <Routes> */}
      {/* <Route path="/" element={< />}/> */}
      {/* <Route path="/" element={<Login />} /> */}
      {/* 로그인 + 비로그인 */}
      {/* <Route path="/main" element={<MainPage />} /> */}
      {/* <Route path="/" element={<Testpage></Testpage>}></Route> */}
      {/* <Route path="/admin/naver" element={<NaverMapApi />} /> */}
      {/* 로그인  */}
      {/* 비로그인  */}
      {/* <Route path="*" element={<Page404 />} /> */}
      {/* </Routes> */}
      {/* </BrowserRouter> */}
    </div>
  );
}
export default App;
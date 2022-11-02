import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import NaverMapApi from './NaverMap/NaverMapApi';
import Page404 from './Page404';
import Main from './MainPage/Main';

export default function App() {
  
  useEffect(() => {
    document.body.style.height = document.body.scrollHeight < window.innerHeight ? window.innerHeight + 'px' : document.body.scrollHeight + 'px'
    console.log('스크롤 변화')
  }, [document.body.scrollheight])

  return (
    <div className="App" style={{height:"100%"}}>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={< />}/> */}
          <Route path="/" element={<Main/>}/>
          <Route path="/naver" element={<NaverMapApi/>}/>
          {/* <Route path="/naver" element={<NaverMapApi start={start}/>}/> */}
          <Route path="/page404" element={<Page404/>}/>
        </Routes>
      </BrowserRouter> 

    </div>
  );
}

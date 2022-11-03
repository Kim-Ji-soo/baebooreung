import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import NaverMapApi from './navermap/NaverMapApi';
import Page404 from './Page404';
import Main from './mainpage/Main';

export default function App() {
  
  // useEffect(() => {
  //   document.body.style.height = document.body.scrollHeight < window.innerHeight ? window.innerHeight + 'px' : document.body.scrollHeight + 'px'
  // }, [])

  return (
    <div className="App" style={{height:"100%"}}>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={< />}/> */}
          
          {/* 로그인 + 비로그인 */}
          <Route path="/" element={<Main/>}/>
          <Route path="/admin/naver" element={<NaverMapApi/>}/>
          
          {/* 로그인  */}


          {/* 비로그인  */}
          
          
          <Route path="*" element={<Page404/>}/>
        </Routes>
      </BrowserRouter> 

    </div>
  );
}

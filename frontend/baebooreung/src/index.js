import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.module.css';
import App from './App';
// import { RenderAfterNavermapsLoaded } from 'react-naver-maps'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
  // <RenderAfterNavermapsLoaded clientId={"i3oq00t777"}>
  // </RenderAfterNavermapsLoaded>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

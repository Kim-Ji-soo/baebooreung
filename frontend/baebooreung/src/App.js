import './App.css';
import NaverMapApi from './navermap/NaverMapApi';
import { useState } from "react"

export default function App() {
  const [start, setStart] = useState("126.9042,35.1780") // 출발지

  return (
    <div className="App">
      <div id="app_width">
        <div id="app_color">
          <div id="app_color_height">
            <div id="app_color_white">
              <div>출발지좌표</div>
              <input type="text" value={start} onChange={(e)=>{
                setStart(e.target.value)
              }} />
            </div>
            <div>{start}</div>
          </div>
          <div>
            {/* <button onClick={add_course}>경유지 추가</button>
            <button onClick={cal_course}>경로계산</button> */}
          </div>
        </div>
        <NaverMapApi start={start}/>
      </div>
    </div>
  );
}

import { NaverMap, Polyline, Marker } from 'react-naver-maps'
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function App() {
  const X_NCP_APIGW_API_KEY_ID = "i3oq00t777"
  const X_NCP_APIGW_API_KEY = "SKQeRSOuZty3XKmuYfGHjQ2GNGUUS6c3wGhroXsG"
  const headers = {
    "X-NCP-APIGW-API-KEY-ID": X_NCP_APIGW_API_KEY_ID,
    "X-NCP-APIGW-API-KEY" : X_NCP_APIGW_API_KEY
  }

  // function add_course() {
  //   const newDiv = document.createElement('div');
  //   const newText = document.createTextNode('안녕하세요');
  //   newDiv.appendChild(newText);
  //   document.querySelector('#app_color_height').appendChild(newDiv);
  // }
  

  const [start, setStart] = useState("126.9043,35.1777") // 알촌
  const goal = "126.9108,35.1804" //
  const waypoints2 = "126.8982,35.1786" // 킹스샌드
  const waypoints3 = "126.9043,35.1777" // 알촌
  const waypoints4 = "126.903,35.1777" // 봉구스밥버거
  const waypoints5 = "126.9028,35.1779" // 카츠앤맘
  const waypoints6 = "126.9021,35.1774" // 덮덮밥 광주용봉점
  const waypoints7 = "126.9011,35.1779" // 마라미녀
  const waypoints8 = "126.9012,35.1798" // 오늘하루가
  const waypoints9 = "126.9029,35.1807" // 김밥나라
  const waypoints10 = "126.9108,35.1804" // 생활관5동입구
  const waypoints11 = "126.9101,35.1813" // 생핼관4동입구
  const waypoints12 = "126.9109,35.1802" // 생핼관6동입구
  const waypoints13 = "126.8997,35.1765" // 8동생활관콜라자판기옆
  const waypoints = waypoints2.concat(
    '|',
    waypoints3, '|', 
    waypoints4, '|', 
    waypoints5, '|', 
    waypoints6, '|', 
    waypoints7, '|', 
    waypoints8, '|', 
    waypoints9, '|', 
    waypoints10, '|', 
    waypoints11, '|', 
    waypoints12, '|', 
    waypoints13, ':'
  )
  const url = `/map-direction-15/v1/driving?start=${start}&goal=${goal}&waypoints=${waypoints}`
  const url_now = `/map-direction-15/v1/driving?start=${start}&goal=${waypoints2}`
  
  async function cal_course() {
    const course = []
    await axios.get(url, {
      headers: headers
    }).then((res) => {
      const path = res.data.route.traoptimal[0].path
      for (let i = 0; i <= path.length-1; i ++) {
        course.push({lat:path[i][1],lng:path[i][0]})
      }
    })
    console.log(course)
    setTestCourse(course)
  }
  async function cal_course_now() {
    const course_now = []
    await axios.get(url_now, {
      headers: headers
    }).then((res) => {
      const path = res.data.route.traoptimal[0].path
      for (let i = 0; i <= path.length-1; i ++) {
        course_now.push({lat:path[i][1],lng:path[i][0]})
      }
    })
    setTestCourseNow(course_now)
  }
  
  

  function translate_coordinate_lat_lng(payload) {
    const path = payload.split(',')
    return {lat:parseFloat(path[1], 10),lng:parseFloat(path[0], 10)}
  }

  const [test_course, setTestCourse] = useState([])
  const [test_course_now, setTestCourseNow] = useState([])

  useEffect(()=>{
    cal_course()
    cal_course_now()
  }, [])

  useEffect(() => {
    cal_course()
    cal_course_now()
  }, [start])

  useEffect(()=>{
  }, [test_course])
  
  return (
    <div className="App">
      안녕하세요?
      <div id="app_width">
        <div id="app_color">
          <div id="app_color_height">
            <div id="app_color_white">
              <div>출발지좌표</div>
              <input type="text" value={start} onChange={(e)=>{
                setStart(e.target.value)
              }} />
            </div>
          </div>
          <div>
            {/* <button onClick={add_course}>경유지 추가</button> */}
            {/* <button onClick={cal_course}>경로계산</button> */}
          </div>
        </div>
        <NaverMap 
          id='maps-examples-polyline'
          style={{
            width: '80%',
            height: '100vh',
          }}
          defaultCenter={{lat:35.1804,lng:126.9108}}
          defaultZoom={15}
          >
          <Marker 
            position={translate_coordinate_lat_lng(start)}
            animation={1}
          />
          <Marker position={translate_coordinate_lat_lng(waypoints2)}/>
          <Marker position={translate_coordinate_lat_lng(waypoints3)}/>
          <Marker position={translate_coordinate_lat_lng(waypoints4)}/>
          <Marker position={translate_coordinate_lat_lng(waypoints5)}/>
          <Marker position={translate_coordinate_lat_lng(waypoints6)}/>
          <Marker position={translate_coordinate_lat_lng(waypoints7)}/>
          <Marker position={translate_coordinate_lat_lng(waypoints8)}/>
          <Marker position={translate_coordinate_lat_lng(waypoints9)}/>
          <Marker position={translate_coordinate_lat_lng(waypoints10)}/>
          <Marker position={translate_coordinate_lat_lng(waypoints11)}/>
          <Marker position={translate_coordinate_lat_lng(waypoints12)}/>
          <Marker position={translate_coordinate_lat_lng(waypoints13)}/>
          <Marker position={translate_coordinate_lat_lng(goal)}/>
          <Polyline 
            path = {test_course}
            strokeColor={'#000000'}
            strokeStyle={'solid'}
            strokeLineCap={'round'}
            strokeOpacity={0.5}
            strokeWeight={5}        
          />
          <Polyline
            path = {test_course_now}
            strokeColor={'red'}
            strokeStyle={'solid'}
            strokeLineCap={'round'}
            strokeOpacity={0.6}
            strokeWeight={10}        
          />
        </NaverMap>
      </div>
    </div>
  );
}

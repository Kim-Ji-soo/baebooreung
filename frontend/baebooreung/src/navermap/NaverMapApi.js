import React from "react";
import { useEffect, useState } from 'react';
import { RenderAfterNavermapsLoaded, NaverMap, Polyline, Marker } from 'react-naver-maps'
import styles from './NaverMapApi.module.css'
import axios from 'axios';
// import jsonpAdapter from 'axios-jsonp';



// 출발지 | 1, 2, 3, 4, 5 ~ 11번까지 경유지 | 도착지가 있음
// 출발지에서 출발하다가, 다음 경유지에 도달(root(x*2+y*2) <= 오차범위)하면 다음 목적지는 체크된다.
// 네이버 API로 다음 다음 경유지 길찾기 시작 / 다음 다음 목적지로 goal이 변경된다.
// goal에 도달하면 특정 이벤트 발생

export default function NaverMapApi() {
  // const X_NCP_APIGW_API_KEY_ID = "i3oq00t777"
  // const X_NCP_APIGW_API_KEY = "SKQeRSOuZty3XKmuYfGHjQ2GNGUUS6c3wGhroXsG"
  // const X_NCP_APIGW_API_KEY_ID = "g05t2a43ik"
  // const X_NCP_APIGW_API_KEY = "K2jWBmNcWQ3vgKdPE95fexbTrS2Mz4fDXQvfSeFt"

  // const headers = {
  //   "X-NCP-APIGW-API-KEY-ID": X_NCP_APIGW_API_KEY_ID,
  //   "X-NCP-APIGW-API-KEY": X_NCP_APIGW_API_KEY
  // }
  
  // waypoints 만들기
  const [start, setStart] = useState("126.8950,35.1790") // 출발지
  const waypoints1 = "126.8982,35.1786" // 킹스샌드
  const waypoints2 = "126.9043,35.1777" // 알촌
  const waypoints3 = "126.903,35.1777" // 봉구스밥버거
  const waypoints4 = "126.9028,35.1779" // 카츠앤맘
  const waypoints5 = "126.9021,35.1774" // 덮덮밥 광주용봉점
  const waypoints6 = "126.9011,35.1779" // 마라미녀
  const waypoints7 = "126.9012,35.1798" // 오늘하루가
  const waypoints8 = "126.9029,35.1807" // 김밥나라
  const waypoints9 = "126.9101,35.1813" // 생핼관4동입구
  const waypoints10 = "126.9109,35.1802" // 생핼관6동입구
  const waypoints11 = "126.8997,35.1765" // 8동생활관콜라자판기옆

  // let waypoints = []

  // function make_waypoints() {
  //   for (let i = 1; i <= 11; i++) {
  //     waypoints.push(eval('waypoints' + i))
  //   }
  //   waypoints = waypoints.join('|') + ':'
  // }
  // make_waypoints()

  const goal = "126.9108,35.1804" // 생활관5동입구

  const waypoints = "126.9153,35.1810" // 근처입니다.

  // const url = `https://naveropenapi.apigw.ntruss.com/map-direction-15/v1/driving?start=${waypoints1}&goal=${goal}&waypoints=${waypoints}&option="trafast"`
  // const url_now = `https://naveropenapi.apigw.ntruss.com/map-direction-15/v1/driving?start=${start}&goal=${waypoints1}&option="trafast"`
  const url = `http://k7c207.p.ssafy.io:8000/user-service/map`

  // const config = {"Content-Type": 'application/json'};


  
  const [test_course, setTestCourse] = useState([])
  const [test_course_now, setTestCourseNow] = useState([])

  async function cal_course() {
    const course = []
    // axios({
    //   url: url,
    //   headers:headers,
    //   // adaptor: jsonpAdapter,
    // }).then((res) => {
    //   console.log(res)
    //   console.log(res.data.route)
      // const path = res.data.route.traoptimal[0].path
      // for (let i = 0; i <= path.length - 1; i++) {
      //   course.push({ lat: path[i][1], lng: path[i][0] })
      // }
    // })
    setTestCourse(course)

    await axios({
      url: 'https://k7c207.p.ssafy.io:8000/user-service/map',
      method: 'get',
      data : {
          start: start,
          goal: goal,
          option: 'trafast',
          waypoints: waypoints
      }
    })
    .then((res) => {
      console.log(res);
      const path = res.data.route.traoptimal[0].path
      for (let i = 0; i <= path.length - 1; i++) {
        course.push({ lat: path[i][1], lng: path[i][0] })
      }
      setTestCourse(course)
    })
    .catch((error) => {
      console.log(error);
    })

    // await axios.get(url, {
    //   headers: headers
    // }).then((res) => {
    //   console.log(res)
    //   console.log(res.data.route)
    //   const path = res.data.route.traoptimal[0].path
    //   for (let i = 0; i <= path.length - 1; i++) {
    //     course.push({ lat: path[i][1], lng: path[i][0] })
    //   }
    //   console.log(process.env.REACT_APP_DB_HOST)
    // })
    // setTestCourse(course)

    // const course_now = []
    // await axios.get(url_now, {
    //   headers: headers
    // }).then((res) => {
    //   const path_now = res.data.route.traoptimal[0].path
    //   for (let j = 0; j <= path_now.length - 1; j++) {
    //     course_now.push({ lat: path_now[j][1], lng: path_now[j][0] })
    //   }
    // })
    // setTestCourseNow(course_now)
  }

  function translate_coordinate_lat_lng(payload) {
    const path = payload.split(',')
    return { lat: parseFloat(path[1], 10), lng: parseFloat(path[0], 10) }
  }

  useEffect(() => {
    cal_course()
  }, [start])

  return <div style={{ height: "100%", width:"100%" }}>
    <div className={styles.App}>
      <div className={styles.app_width}>
        {/* <div className={styles.app_color}>
          <div className={styles.app_color_height}>
          <div className={styles.app_color_white}>
          <div>출발지좌표</div>
          <input type="text" value={start} onChange={(e) => {
            setStart(e.target.value)
          }} />
          </div>
          <div>{start}</div>
          </div>
        </div> */}
        <NaverMap
          id='maps-examples-polyline'
          style={{ 
            width: '100%',
            height: '100%',
          }}
          center={translate_coordinate_lat_lng(start)}
          zoom={16}
          >
          <Marker
            position={translate_coordinate_lat_lng(start)}
            animation={1}
            />
          <Marker position={translate_coordinate_lat_lng(waypoints1)} />
          <Marker position={translate_coordinate_lat_lng(waypoints2)} />
          <Marker position={translate_coordinate_lat_lng(waypoints3)} />
          <Marker position={translate_coordinate_lat_lng(waypoints4)} />
          <Marker position={translate_coordinate_lat_lng(waypoints5)} />
          <Marker position={translate_coordinate_lat_lng(waypoints6)} />
          <Marker position={translate_coordinate_lat_lng(waypoints7)} />
          <Marker position={translate_coordinate_lat_lng(waypoints8)} />
          <Marker position={translate_coordinate_lat_lng(waypoints9)} />
          <Marker position={translate_coordinate_lat_lng(waypoints10)} />
          <Marker position={translate_coordinate_lat_lng(waypoints11)} />
          <Marker
            position={translate_coordinate_lat_lng(goal)}
            animation={1}
            />
          <Polyline
            path={test_course}
            strokeColor={'#000000'}
            strokeStyle={'solid'}
            strokeLineCap={'round'}
            strokeOpacity={0.5}
            strokeWeight={10}
            />
          <Polyline
            path={test_course_now}
            strokeColor={'red'}
            strokeStyle={'solid'}
            strokeLineCap={'round'}
            strokeOpacity={1}
            strokeWeight={10}
            />
        </NaverMap>
      </div>
    </div>
  </div>

}
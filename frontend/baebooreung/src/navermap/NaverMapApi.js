import React from "react";
import { useEffect, useState } from 'react';
import { RenderAfterNavermapsLoaded, NaverMap, Polyline, Marker } from 'react-naver-maps'
import styles from './NaverMapApi.module.css'
import axios from 'axios';
import jnu from '../assets/images/전남대학교.png'
import gist from '../assets/images/지스트.png'
import { width } from "@mui/system";


// waypoints -> 시작|1|2|3|4|5~11|도착지:
// 출발지에서 출발하다가, 다음 경유지에 도달(root(x*2+y*2) <= 오차범위)하면 다음 목적지는 체크된다.
// 네이버 API로 다음 다음 경유지 길찾기 시작 / 다음 다음 목적지로 goal이 변경된다.
// goal에 도달하면 특정 이벤트 발생



export default function NaverMapApi() {
  // // API 1번
  // const X_NCP_APIGW_API_KEY_ID = "i3oq00t777"
  // const X_NCP_APIGW_API_KEY = "SKQeRSOuZty3XKmuYfGHjQ2GNGUUS6c3wGhroXsG"
  // // API 2번
  // const X_NCP_APIGW_API_KEY_ID = "g05t2a43ik"
  // const X_NCP_APIGW_API_KEY = "K2jWBmNcWQ3vgKdPE95fexbTrS2Mz4fDXQvfSeFt"
  // // API 3번
  // const X_NCP_APIGW_API_KEY_ID = "lzyp7jzxro"
  // const X_NCP_APIGW_API_KEY = "CrXHLpd2o9Fh7ow6ScjEh7WC3KiSMuQ7V21M7BBt" 
  // const headers = {
  //   "X-NCP-APIGW-API-KEY-ID": X_NCP_APIGW_API_KEY_ID
  //   "X-NCP-APIGW-API-KEY": X_NCP_APIGW_API_KEY
  // }

  const [zoom, setZoom] = useState(16)
  // const [start, setStart] = useState("126.8116,35.2053") // 출발지
  const [start, setStart] = useState("126.8938,35.1785") // 출발지
  const [center, setCenter] = useState(start)
  // waypoints 만들기
  // { lat: "35.2053", lng: "126.8116" }
  let waypoints = []
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
  const goal = "126.9108,35.1804" // 생활관5동입구
  function make_waypoints() {
    for (let i = 1; i <= 11; i++) {
      waypoints.push(eval('waypoints' + i))
    }
    waypoints = waypoints.join('|') + ':'
  }
  make_waypoints()

  function translate_coordinate_lat_lng(payload) {
    const path = payload.split(',')
    return { lat: parseFloat(path[1], 10), lng: parseFloat(path[0], 10) }
  }

  const data = {
    start: start,
    goal: goal,
    option: "trafast",
    waypoints: waypoints
  }

  const data_now = {
    start: start,
    goal: waypoints1,
    option: "trafast",
  }

  const [test_course, setTestCourse] = useState([])
  const [test_course_now, setTestCourseNow] = useState([])
  const [params_temp, setParamsTemp] = useState(0)


  const course = []
  const course_now = []
  async function cal_course() {
    await axios({
      url: `https://k7c207.p.ssafy.io:8000/business-service/navigps/${params_temp}`,
      method: "get",
      headers: {
        token: `${localStorage.getItem("token")}`,
      }
    }).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
    await axios({
      url: "https://k7c207.p.ssafy.io:8000/user-service/map",
      method: "post",
      data: data,
    })
      .then((res) => {
        const path = res.data.route.trafast[0].path
        // console.log('path', path)
        for (let i = 0; i <= path.length - 1; i++) {
          course.push({ lat: path[i][1], lng: path[i][0] })
        }
        setTestCourse(course)
      })
      .catch((error) => {
        console.log('에러', error);
      })

    await axios({
      url: 'https://k7c207.p.ssafy.io:8000/user-service/map',
      method: 'post',
      data: data_now
    })
      .then((res) => {
        const path_now = res.data.route.trafast[0].path
        for (let i = 0; i <= path_now.length - 1; i++) {
          course_now.push({ lat: path_now[i][1], lng: path_now[i][0] })
        }
        setTestCourseNow(course_now)
      })
      .catch((error) => {
        console.log('에러', error);
      })
  }

  // useEffect(() => {
  //   setTimeout(() => {
  //     axios({
  //       url: `https://k7c207.p.ssafy.io:8000/gps-service/gps/2`,
  //       method: 'get'
  //     }).then((res) => {
  //       setStart(res.data.longitude + ',' + res.data.latitude)
  //     })
  //     setParamsTemp(params_temp + 1)
  //     // setCenter((parseFloat(center.split(',')[0]) + 0.001) + ',' + center.split(',')[1])
  //     // setStart((parseFloat(center.split(',')[0]) + 0.001) + ',' + center.split(',')[1])
  //   }
  //     , 3000)
  // }, [params_temp])

  useEffect(() => {
    cal_course()
  }, [start])

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div className={styles.App}>
        <div className={styles.app_width}>
          {/* <div>
            <div className={styles.profileList}>
              <button className={styles.profileImageContent}>
                <img className={styles.profileImage} src={jnu} alt="" />
                <div className={styles.profileContent}>전남대A</div>
              </button>
              <button className={styles.profileImageContent}>
                <img className={styles.profileImage} src={jnu} alt="" />
                <div className={styles.profileContent}>전남대B</div>
              </button>
              <div className={styles.profileImageContent}>
                <img className={styles.profileImage} src={jnu} alt="" />
                <div className={styles.profileContent}>전남대C</div>
              </div>
              <button className={styles.profileImageContent}>
                <img className={styles.profileImage} src={gist} alt="" />
                <div className={styles.profileContent}>지스트A</div>
              </button>
              <button className={styles.profileImageContent}>
                <img className={styles.profileImage} src={gist} alt="" />
                <div className={styles.profileContent}>지스트B</div>
              </button>
              <button className={styles.profileImageContent}>
                <img className={styles.profileImage} src={gist} alt="" />
                <div className={styles.profileContent}>지스트C</div>
              </button>
              <input
                type="text"
                onChange={(e) => {
                  setZoom(e.target.value);
                }
                }
                style={{ width: "20px" }}
                value={zoom}
              ></input>
            </div>
          </div> */}
          {/* <div id="navermap" style={{ width: "100%", height: "100%" }}> */}
          <NaverMap
            id="maps-examples-polyline"
            style={{
              width: "100%",
              height: "100%",
            }}
            center={translate_coordinate_lat_lng(center)}
            zoom={zoom}
          >
            <Marker
              position={translate_coordinate_lat_lng(start)}
              animation={1}
            />
            <Marker position={translate_coordinate_lat_lng(goal)} />
            {/* <Marker position={translate_coordinate_lat_lng(waypoints2)} /> */}
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
              position={translate_coordinate_lat_lng(waypoints1)}
              animation={1}
            />
            <Polyline
              path={test_course}
              strokeColor={"#000000"}
              strokeStyle={"solid"}
              strokeLineCap={"round"}
              strokeOpacity={0.5}
              strokeWeight={10}
            />
            <Polyline
              path={test_course_now}
              strokeColor={"red"}
              strokeStyle={"solid"}
              strokeLineCap={"round"}
              strokeOpacity={1}
              strokeWeight={10}
            />
          </NaverMap>
          {/* </div> */}
        </div>
      </div>
    </div >
  );
}
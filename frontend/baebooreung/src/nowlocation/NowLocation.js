import React, { useEffect, useState } from 'react';
import styles from './NowLocation.module.css'
import axios from 'axios';
import jnu from '../assets/images/전남대학교.png'
import gist from '../assets/images/지스트.png'
import $, { now } from "jquery";

const { naver } = window;

const NowLocation = () => {
  // const [start, setStart] = useState("126.8116,35.2053") // SSAFY 광주 캠퍼스 출발지
  const [zoom, setZoom] = useState(15)
  const [now_loc, setStart] = useState([126.8938, 35.1785]) // 전남대A출발지
  const [center, setCenter] = useState(now_loc)
  let waypoints = [
    [126.8982, 35.1786], // 킹스샌드
    [126.9043, 35.1777], // 알촌
    [126.9030, 35.1777], // 봉구스밥버거
    [126.9028, 35.1779], // 카츠앤맘
    [126.9021, 35.1774], // 덮덮밥 광주용봉점
    [126.9011, 35.1779], // 마라미녀
    [126.9012, 35.1798], // 오늘하루가
    [126.9029, 35.1807], // 김밥나라
    [126.9101, 35.1813], // 생핼관4동입구
    [126.9109, 35.1802], // 생핼관6동입구
    [126.8997, 35.1765], // 8동생활관콜라자판기옆
    [126.9108, 35.1804]  // 생활관5동입구
  ]

  const route = {
    start: make_LatLng(now_loc),
    goal: make_LatLng(waypoints[waypoints.length - 1]),
    option: "trafast",
    waypoints: make_waypoints(waypoints)
  }

  const route_now = {
    start: make_LatLng(now_loc),
    goal: make_LatLng(waypoints[0]),
    option: "trafast",
  }

  const [test_course, setTestCourse] = useState([])
  const [test_course_now, setTestCourseNow] = useState([])


  function make_waypoints(waypoints_temp) {
    return waypoints_temp.join('|') + ':'
  }

  function make_LatLng(now_loc_temp) {
    return `${now_loc_temp.join(',')}`
  }

  function translate_coordinate_lat_lng(payload) {
    return { lat: parseFloat(payload[0]), lng: parseFloat(payload[1]) }
  }

  async function cal_course() {
    const course = []
    const course_now = []
    await axios({
      url: "https://k7c207.p.ssafy.io:8000/user-service/map",
      method: "post",
      data: route,
    })
      .then((res) => {
        const path = res.data.route.trafast[0].path
        for (let i = 0; i <= path.length - 1; i++) {
          course.push(new naver.maps.LatLng(path[i][1], path[i][0]))
        }
        setTestCourse(course)
      })
    await axios({
      url: 'https://k7c207.p.ssafy.io:8000/user-service/map',
      method: 'post',
      data: route_now
    })
      .then((res) => {
        const path_now = res.data.route.trafast[0].path
        for (let i = 0; i <= path_now.length - 1; i++) {
          course_now.push(new naver.maps.LatLng(path_now[i][1], path_now[i][0]))
        }
        setTestCourseNow(course_now)
      })
  }

  const [params_temp, setParamsTemp] = useState(0)

  useEffect(() => {
    let map = new naver.maps.Map('map', {
      center: center,
      zoom: zoom
    });
    let marker = new naver.maps.Marker({
      map: map,
      position: new naver.maps.LatLng(now_loc[1], now_loc[0]),
      animation: 1,
      icon: {
        content: '<img src="https://user-images.githubusercontent.com/97590478/201535873-7a8335ee-9b27-498c-b7e9-ffb5cb80dfdb.png" alt="" ' +
          'style="margin: 0px; padding: 0px; border: 0px solid transparent; display: block; max-width: none; max-height: none; ' +
          '-webkit-user-select: none; position: absolute; width: 60px; height: 70px; left: -15px; top: -30px;">',
        size: new naver.maps.Size(22, 35),
        anchor: new naver.maps.Point(11, 35)
      }
    })
    for (let i = 0; i < waypoints.length; i++) {
      let marker = new naver.maps.Marker({
        map: map,
        position: new naver.maps.LatLng(waypoints[i][1], waypoints[i][0]),
        icon: {
          content: '<div style="display:flex;justify-content:center;align-items:center;text-align:center"><img src="https://user-images.githubusercontent.com/97590478/201535636-aa05a014-2697-4016-81e6-e639593a68c5.png" alt="" ' +
            'style="margin: 0px; padding: 0px; border: 0px solid transparent; display: block; max-width: none; max-height: none; ' +
            '-webkit-user-select: none; position: absolute; width: 50px; height: 50px; left: -15px; top: -20px;">' +
            `<div class=${styles.mydiv}>${i + 1}</div>` + '</div>',
          size: new naver.maps.Size(22, 35),
          anchor: new naver.maps.Point(11, 35)
        }
      })
    }
    let polyline = new naver.maps.Polyline({
      map: map,
      path: test_course,
      strokeColor: "#000000",
      strokeStyle: "solid",
      strokeLineCap: "round",
      strokeWeight: 5,
      strokeOpacity: 0.4
    })
    let polyline_now = new naver.maps.Polyline({
      map: map,
      path: test_course_now,
      strokeColor: "#0094EE",
      strokeStyle: "solid",
      strokeLineCap: "round",
      strokeWeight: 8

    })
  }, [test_course_now]);


  useEffect(() => {
    setTimeout(() => {
      // axios({
      //   url: `https://k7c207.p.ssafy.io:8000/gps-service/gps/2`,
      //   method: 'get'
      // }).then((res) => {
      //   console.log(res.data.longitude + ',' + res.data.latitude)
      //   setStart(res.data.longitude + ',' + res.data.latitude)
      // })
      setParamsTemp(params_temp + 1)
      console.log(now_loc)
      cal_course()
      setStart([parseFloat(now_loc[0]) - 0.001, now_loc[1]])
      setCenter(now_loc)
    }
      , 3000000)
  }, [params_temp])

  useEffect(() => {
    cal_course()
  }, [now_loc, params_temp])

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div className={styles.App}>
        <div className={styles.app_width}>
          <div>
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
              {/* <input
                type="text"
                onChange={(e) => {
                  setZoom(e.target.value);
                }
                }
                style={{ width: "20px" }}
                value={zoom}
              ></input> */}
            </div>
          </div>
          <div id="map" style={{ width: '100%', height: '100%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default NowLocation;
import zIndex from '@mui/material/styles/zIndex';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styles from './1RealTime.module.css'

import jnu from '../assets/images/전남대학교.png';
import gist from '../assets/images/지스트.png';
import yonsei from '../assets/images/연세대.png';

const { naver } = window;

const BASE_URL = "https://k7c207.p.ssafy.io:8000"


const RealTime = (props) => {
  const [myuniv, setMyUniv] = useState([])
  const JNU = [126.9063, 35.1767]
  const GIST = [126.8465, 35.2240]
  const GWANGJU = setTwoCenter(JNU, GIST)
  const YONSEI = [126.935, 37.5578]
  const SEOUL = [126.9701, 37.5558]
  const ssafyLatLng = [126.8116, 35.2053]
  const cloudStoneLatLng = [126.85224, 35.14228]
  const [SsafyCloudStoneCourse, setSsafyCloudStoneCourse] = useState([])
  const ssafy_cloudstone_route_temp = {
    start: make_LatLng(ssafyLatLng),
    goal: make_LatLng(cloudStoneLatLng),
    option: "trafast",
  }
  const [test_course, setTestCourse] = useState([])
  const [zoom, setZoom] = useState(12)
  // const [now_loc, setStart] = useState([126.8116, 35.2053]) // 전남대A출발지
  const [center, setCenter] = useState(setTwoCenter(ssafyLatLng, cloudStoneLatLng))
  const [temp_test, setTempTest] = useState(0)
  const [params_temp, setParamsTemp] = useState(0)

  function make_LatLng(now_loc_temp) {
    return `${now_loc_temp.join(',')}`
  }

  function setTwoCenter(a, b) {
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  }
  function make_waypoints(waypoints_temp) {
    return waypoints_temp.join('|') + ':'
  }

  async function cal_course(requestBody) {
    const course = []
    await axios({
      url: "https://k7c207.p.ssafy.io:8000/user-service/map",
      method: "post",
      data: requestBody,
    }).then((res) => {
      const path = res.data.route.trafast[0].path
      for (let i = 0; i <= path.length - 1; i++) {
        course.push(new naver.maps.LatLng(path[i][1], path[i][0]))
      }
    })
    return course
  }

  const [allTask, setAllTask] = useState([])
  async function searchRegionDate() {
    await axios({
      url: BASE_URL + '/business-service/route/navigps',
      method: "post",
      data: {
        region: props.myParams.region,
        date: new Date(props.myParams.pickDate).getMonth() + 1 > 10 ? (new Date(props.myParams.pickDate).getDate() > 10 ? `${new Date(props.myParams.pickDate).getFullYear()}-${new Date(props.myParams.pickDate).getMonth() + 1}-${new Date(props.myParams.pickDate).getDate()}` : `${new Date(props.myParams.pickDate).getFullYear()}-${new Date(props.myParams.pickDate).getMonth() + 1}-0${new Date(props.myParams.pickDate).getDate()}`) : `${new Date(props.myParams.pickDate).getFullYear()}-0${new Date(props.myParams.pickDate).getMonth() + 1}-0${new Date(props.myParams.pickDate).getDate()}`
      }
    }).then((res) => {
      // console.log(res.data)
      setAllTask(res.data.sort(function (a, b) {
        if (a.routeName < b.routeName) {
          return 1;
        }
        if (a.routeName > b.routeName) {
          return -1;
        }
        return 0;
      }))
    }).catch((err) => {
      console.log(err)
    })
  }

  async function searchRegionDateUniv() {
    await axios({
      url: BASE_URL + '/business-service/route/navigps/univ',
      method: "post",
      data: {
        region: props.myParams.region,
        routeName: props.myParams.univ,
        date: new Date(props.myParams.pickDate).getMonth() + 1 > 10 ? (new Date(props.myParams.pickDate).getDate() > 10 ? `${new Date(props.myParams.pickDate).getFullYear()}-${new Date(props.myParams.pickDate).getMonth() + 1}-${new Date(props.myParams.pickDate).getDate()}` : `${new Date(props.myParams.pickDate).getFullYear()}-${new Date(props.myParams.pickDate).getMonth() + 1}-0${new Date(props.myParams.pickDate).getDate()}`) : `${new Date(props.myParams.pickDate).getFullYear()}-0${new Date(props.myParams.pickDate).getMonth() + 1}-0${new Date(props.myParams.pickDate).getDate()}`
      }
    }).then((res) => {
      setAllTask(res.data.sort(function (a, b) {
        if (a.routeName < b.routeName) {
          return 1;
        }
        if (a.routeName > b.routeName) {
          return -1;
        }
        return 0;
      }))
    }).catch((err) => {
      console.log(err)
    })
  }

  // async function searchRegionDateUnivTime() {
  //   await axios({
  //     url: BASE_URL + '/business-service/route/navigps',
  //     method: "post",
  //     data: {
  //       region: props.myParams.region,
  //       date: new Date(props.myParams.pickDate).getMonth() + 1 > 10 ? (new Date(props.myParams.pickDate).getDate() > 10 ? `${new Date(props.myParams.pickDate).getFullYear()}-${new Date(props.myParams.pickDate).getMonth() + 1}-${new Date(props.myParams.pickDate).getDate()}` : `${new Date(props.myParams.pickDate).getFullYear()}-${new Date(props.myParams.pickDate).getMonth() + 1}-0${new Date(props.myParams.pickDate).getDate()}`) : `${new Date(props.myParams.pickDate).getFullYear()}-0${new Date(props.myParams.pickDate).getMonth() + 1}-0${new Date(props.myParams.pickDate).getDate()}`
  //     }
  //   }).then((res) => {
  //     // console.log(res.data)
  //     setallTask(res.data)
  //   }).catch((err) => {
  //     console.log(err)
  //   })
  // }

  useEffect(() => {
    console.log('hi')
    cal_course(ssafy_cloudstone_route_temp).then((appData) => {
      setSsafyCloudStoneCourse(appData)
    })
    console.log()
  }, [])


  useEffect(() => {
    let map = new naver.maps.Map('map', {
      center: center,
      zoom: zoom,
      zoomControl: true,
      zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.BOTTOM_LEFT
      },
      logoControl: false,
      scaleControl: false,
      mapTypeControl: false,
      mapDataControl: false,
    });

    let marker_default_1 = new naver.maps.Marker({
      map: map,
      position: new naver.maps.LatLng(cloudStoneLatLng),
      animation: 0,
      icon: {
        content: '<img src="https://user-images.githubusercontent.com/97590478/201602320-4ceeb1a1-d80c-40e2-97a3-56c5e87e8f58.png" alt="" ' +
          'style="margin: 0px; padding: 0px; border: 0px solid transparent; display: block; max-width: none; max-height: none; ' +
          '-webkit-user-select: none; position: absolute; width: 90px; height: 90px; left: 0px; top: 0px; transform:translate(-50%, -50%);">',
        size: new naver.maps.Size(22, 35),
        anchor: new naver.maps.Point(11, 35)
      }
    });

    let marker_default_2 = new naver.maps.Marker({
      map: map,
      position: new naver.maps.LatLng(ssafyLatLng),
      animation: 0,
      icon: {
        content: '<img src="https://user-images.githubusercontent.com/97590478/201608034-9d564762-236c-49cf-8b30-cdf3fd1787a2.png" alt="" ' +
          'style="margin: 0px; padding: 0px; border: 0px solid transparent; display: block; max-width: none; max-height: none; ' +
          '-webkit-user-select: none; position: absolute; width: 150px; height: 90px; left: 0px; top: 0px; transform:translate(-50%, -50%);">',
        size: new naver.maps.Size(22, 35),
        anchor: new naver.maps.Point(11, 35)
      }
    });

    let polyline_default = new naver.maps.Polyline({
      map: map,
      path: SsafyCloudStoneCourse,
      strokeColor: "#0094EE",
      strokeStyle: "solid",
      strokeLineCap: "round",
      strokeWeight: 15,
      strokeOpacity: 1
    })
    let markerSet_default = [marker_default_1, marker_default_2]
    if (props.myParams.region) {
      markerSet_default.map((marker, idx) => {
        marker.setMap(null);
        polyline_default.setMap(null);
      })
    }
    // 결과를 받아왔다면
    if (allTask.length) {
      // 총 개수 만큼 반복하기
      if (props.myParams.region === "GWANGJU") {
        setZoom(13)
        setCenter(GWANGJU)
        if (props.myParams.univ === "전남대학교") {
          setZoom(16)
          setCenter(JNU)
        }
        if (props.myParams.univ === "광주과학기술원") {
          setZoom(15)
          setCenter(GIST)
        }
      }
      else if (props.myParams.region === "SEOUL") {
        setZoom(14)
        setCenter(SEOUL)
        if (props.myParams.univ === "연세대학교") {
          setZoom(16)
          setCenter(YONSEI)
        }
      }

      for (let i = 0; i <= allTask.length - 1; i++) {
        myuniv.push(allTask[i].routeName)
        if (allTask[i].deliveryDtoList.length) {
          let randomBrightColor = () => {
            let color_r = Math.floor(Math.random() * 127 + 128).toString(16);
            let color_g = Math.floor(Math.random() * 127 + 128).toString(16);
            let color_b = Math.floor(Math.random() * 127 + 128).toString(16);
            return `#${color_r + color_g + color_b}`;
          }
          let color_temp = randomBrightColor()
          if (allTask[i].deliveryDtoList.length) {
            const waypoints_temp = []
            for (let j = 0; j <= allTask[i].deliveryDtoList.length - 1; j++) {
              new naver.maps.Marker({
                map: map,
                position: new naver.maps.LatLng([allTask[i].deliveryDtoList[j].longitude, allTask[i].deliveryDtoList[j].latitude]),
                // animation: 1,
                icon: {
                  content:
                    `<div class=${styles.mydiv} style="outline-style:solid; outline-width:7px; outline-color:${color_temp};">${j + 1}</div>`,
                  // content: '<div style="display:flex;justify-content:center;align-items:center;text-align:center"><img src="https://user-images.githubusercontent.com/97590478/201535636-aa05a014-2697-4016-81e6-e639593a68c5.png" alt="" ' +
                  //   'style="margin: 0px; padding: 0px; border: 0px solid transparent; display: block; max-width: none; max-height: none; ' +
                  //   '-webkit-user-select: none; position: absolute; width: 50px; height: 50px; left: -15px; top: -20px;">' +
                  //   `<div class=${styles.mydiv}>${j + 1}</div>` + '</div>',
                  // outline-color:${randomBrightColor};
                  size: new naver.maps.Size(22, 35),
                  anchor: new naver.maps.Point(11, 35)
                }
              })
              waypoints_temp.push([allTask[i].deliveryDtoList[j].longitude, allTask[i].deliveryDtoList[j].latitude])
            }
            const course_temp = {
              start: make_LatLng([allTask[i].deliveryDtoList[0].longitude, allTask[i].deliveryDtoList[0].latitude]),
              goal: make_LatLng([allTask[i].deliveryDtoList[allTask[i].deliveryDtoList.length - 1].longitude, allTask[i].deliveryDtoList[allTask[i].deliveryDtoList.length - 1].latitude]),
              option: "trafast",
              waypoints: make_waypoints(waypoints_temp)
            }
            cal_course(course_temp).then((appData) => {
              new naver.maps.Polyline({
                map: map,
                path: appData,
                strokeColor: color_temp,
                strokeStyle: "solid",
                strokeLineCap: "round",
                strokeWeight: 10,
                strokeOpacity: 1
              })
            })
          }
        }
      }
    }
    // return map.setMap(null); 
  }, [SsafyCloudStoneCourse, allTask, temp_test, zoom]);

  useEffect(() => {
    setTimeout(() => {
      setParamsTemp(params_temp + 1)
    }, 3000)
  }, [params_temp])

  useEffect(() => {
    setTempTest(temp_test + 1)
    searchRegionDate()
    setMyUniv([])

  }, [props.myParams.region])

  useEffect(() => {
    setTempTest(temp_test + 1)
    searchRegionDateUniv()
    setMyUniv([])
  }, [props.myParams.univ])

  // useEffect(() => {
  //   searchRegionDateUnivTime()
  // }, [props.myParams.Date])

  const [AllWork, setAllWork] = useState([])
  function findAllWork(Id) {

  }

  return (
    <div style={{ width: '100%', height: '100%', position: "relative" }}>
      {
        props.myParams.region === "" ?
          <div className={styles.effect}>
            <div className={styles.ment}>
              지역, 대학, 시간 순서로 선택해주세요.
            </div>
          </div>
          : <></>
      }
      <div>
        <div className={styles.profileList}>
          {
            (function () {
              if (props.myParams.region === "GWANGJU" && props.myParams.univ === "전남대학교") {
                return (
                  allTask.map((route, index) => {
                    return (
                      <div>
                        {/* <button className={styles.profileImageContent} onClick={() => { setRoute(route.routeId) }}> */}
                        <button className={styles.profileImageContent} >
                          <img className={styles.profileImage} src={jnu} alt="" />
                          <div className={styles.profileContent}>
                            {route.routeName}&nbsp;
                            {String.fromCharCode(index + 65)}
                          </div>
                        </button>
                      </div>
                    )
                  }))
              } else if (props.myParams.region === "GWANGJU" && props.myParams.univ === "광주과학기술원") {
                return (
                  allTask.map((route, index) => {
                    return (
                      <div>
                        <button className={styles.profileImageContent} onClick={() => { alert('hi') }}>
                          <img className={styles.profileImage} src={gist} alt="" />
                          <div className={styles.profileContent}>
                            {route.routeName}&nbsp;
                            {String.fromCharCode(index + 65)}
                          </div>
                        </button>
                      </div>
                    )
                  }))
              } else if (props.myParams.region === "GWANGJU") {
                return (
                  allTask.map((route, index) => {
                    if (route.routeName === "전남대학교") {
                      return (
                        <div>
                          <button className={styles.profileImageContent} onClick={() => { alert('hi') }}>
                            <img className={styles.profileImage} src={jnu} alt="" />
                            <div className={styles.profileContent}>
                              {route.routeName}&nbsp;
                              {String.fromCharCode(index + 65)}
                            </div>
                          </button>
                        </div>
                      )
                    } else if (route.routeName === "광주과학기술원") {
                      return (
                        <div>
                          <button className={styles.profileImageContent} onClick={() => { alert('hi') }}>
                            <img className={styles.profileImage} src={gist} alt="" />
                            <div className={styles.profileContent}>
                              {route.routeName}&nbsp;
                              {String.fromCharCode(index + 60)}
                            </div>
                          </button>
                        </div>
                      )
                    }
                  }))
              } else if (props.myParams.region === "SEOUL" && props.myParams.univ === "연세대학교") {
                return (
                  allTask.map((route, index) => {
                    return (
                      <div>
                        <button className={styles.profileImageContent} onClick={() => { alert('hi') }}>
                          <img className={styles.profileImage} src={yonsei} alt="" />
                          <div className={styles.profileContent}>
                            {route.routeName}&nbsp;
                            {String.fromCharCode(index + 65)}
                          </div>
                        </button>
                      </div>
                    )
                  }))
              } else if (props.myParams.region === "SEOUL") {
                return (
                  allTask.map((route, index) => {
                    return (
                      <div>
                        <button className={styles.profileImageContent} onClick={() => { alert('hi') }}>
                          <img className={styles.profileImage} src={gist} alt="" />
                          <div className={styles.profileContent}>
                            {route.routeName}&nbsp;
                            {String.fromCharCode(index + 65)}
                          </div>
                        </button>
                      </div>
                    )
                  }))
              }
            })()
          }
        </div>
      </div>
      <div id="map" style={{ width: '100%', height: '100%' }}></div>
    </div>
  )
}

export default RealTime;
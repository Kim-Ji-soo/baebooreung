import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import styles from "./1RealTime.module.css";
import jnu from "../assets/images/전남대학교.png";
import gist from "../assets/images/지스트.png";
import yonsei from "../assets/images/연세대.png";
import focus_on from "../assets/images/focus_on.png";
import focus_off from "../assets/images/focus_off.png";
import refresh_move_on from "../assets/images/refresh_move_on.gif";
import refresh_off from "../assets/images/refresh_off.png";
import refresh_move_off from "../assets/images/refresh_move_off.gif";
import logo_team from "../assets/images/logo_team.png";
import picture from "../assets/images/picture.png";
import Swal from "sweetalert2";
import arrow from "../assets/images/up-right.png";


const { naver } = window;
const BASE_URL = "https://k7c207.p.ssafy.io:8000";

const RealTime = (props) => {
  let [tempList, setTempList] = useState([])

  // 포커스는 0이다.
  const [focus, setFocus] = useState(0)
  const [checkIn, setCheckIn] = useState([])
  // 대학교 리스트
  const [myuniv, setMyUniv] = useState([]);
  const JNU = [126.9063, 35.1767];
  const GIST = [126.8465, 35.224];
  const GWANGJU = [126.88, 35.198];
  const YONSEI = [126.938, 37.5628];
  const SEOUL = [126.9901, 37.5258];

  // 초기 CS, SSAFY 위치, 센터 값
  const ssafyLatLng = [126.8116, 35.2053];
  const cloudStoneLatLng = [126.85224, 35.14228];
  const [SsafyCloudStoneCourse, setSsafyCloudStoneCourse] = useState([]);
  const zoom = 13
  const ssafy_cloudstone_route_temp = {
    start: make_LatLng(ssafyLatLng),
    goal: make_LatLng(cloudStoneLatLng),
    option: "traoptimal",
  };
  const [center, setCenter] = useState(
    [126.82222, 35.1755]
  );


  const [temp_test, setTempTest] = useState(0);
  const [params_temp, setParamsTemp] = useState(0);

  // 루트 경로 색상
  const [routeColor, setRouteColor] = useState([]);
  // 선택한 루트ID
  const [routeId, setRouteId] = useState(0);
  // 내가 선택한 음식점 좌표 설정용 
  const [positionLoc, setPositionLoc] = useState([]);
  // 드라이버 정보
  const [driverId, setDriverId] = useState(0);
  const [driverProfile, setDriverProfile] = useState('')
  const [driverInfo, setDirverInfo] = useState([]);

  // menu 컨트롤
  const [menuControl, setMenuControl] = useState(1)
  // 새로고침을 위한 자료
  const [refresh, setRefresh] = useState(0)
  const [autoRefresh, setAutoRefresh] = useState(6000000)
  // 모든 업무, 하나의 업무
  const [allTask, setAllTask] = useState([]);
  const [oneTask, setOneTask] = useState([]);


  function make_LatLng(now_loc_temp) {
    return `${now_loc_temp.join(",")}`;
  }
  function setTwoCenter(a, b) {
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  }
  function make_waypoints(waypoints_temp) {
    return waypoints_temp.join("|") + ":";
  }
  function setButtonToggle(id) {
    document.getElementById('button_pickup').className = styles.button_default
    document.getElementById('button_delivery').className = styles.button_default
    document.getElementById(id).className = styles.button_pick;
  }
  async function cal_course(requestBody) {
    const course = [];
    await axios({
      url: "https://k7c207.p.ssafy.io:8000/user-service/map",
      method: "post",
      data: requestBody,
    }).then((res) => {
      const path = res.data.route.traoptimal[0].path;
      for (let i = 0; i <= path.length - 1; i++) {
        course.push(new naver.maps.LatLng(path[i][1], path[i][0]));
      }
    });
    return course;
  }



  async function searchRegionDate() {
    await axios({
      url: BASE_URL + "/business-service/route/navigps",
      method: "post",
      data: {
        region: props.myParams.region,
        date:
          new Date(props.myParams.pickDate).getMonth() + 1 > 10
            ? new Date(props.myParams.pickDate).getDate() > 10
              ? `${new Date(props.myParams.pickDate).getFullYear()}-${new Date(props.myParams.pickDate).getMonth() + 1
              }-${new Date(props.myParams.pickDate).getDate()}`
              : `${new Date(props.myParams.pickDate).getFullYear()}-${new Date(props.myParams.pickDate).getMonth() + 1
              }-0${new Date(props.myParams.pickDate).getDate()}`
            : `${new Date(props.myParams.pickDate).getFullYear()}-0${new Date(props.myParams.pickDate).getMonth() + 1
            }-0${new Date(props.myParams.pickDate).getDate()}`,
      },
    })
      .then((res) => {
        console.log(allTask)
        setAllTask(
          res.data.sort(function (a, b) {
            if (a.routeName > b.routeName) {
              return 1;
            }
            if (a.routeName < b.routeName) {
              return -1;
            }
            return 0;
          })
        )
        console.log(allTask)

      })
  }

  async function searchRegionDateUniv() {
    if (props.myParams.univ) {
      await axios({
        url: BASE_URL + "/business-service/route/navigps/univ",
        method: "post",
        data: {
          region: props.myParams.region,
          routeName: props.myParams.univ,
          date:
            new Date(props.myParams.pickDate).getMonth() + 1 > 10
              ? new Date(props.myParams.pickDate).getDate() > 10
                ? `${new Date(props.myParams.pickDate).getFullYear()}-${new Date(props.myParams.pickDate).getMonth() + 1
                }-${new Date(props.myParams.pickDate).getDate()}`
                : `${new Date(props.myParams.pickDate).getFullYear()}-${new Date(props.myParams.pickDate).getMonth() + 1
                }-0${new Date(props.myParams.pickDate).getDate()}`
              : `${new Date(props.myParams.pickDate).getFullYear()}-0${new Date(props.myParams.pickDate).getMonth() + 1
              }-0${new Date(props.myParams.pickDate).getDate()}`,
        },
      })
        .then((res) => {
          setAllTask(
            res.data.sort(function (a, b) {
              if (a.routeName > b.routeName) {
                return 1;
              }
              if (a.routeName < b.routeName) {
                return -1;
              }
              return 0;
            })
          );
        })
    } else {
      searchRegionDate();
    }
  }
  async function searchRegionDateUnivTime() {
    if (props.myParams.taskTime) {
      await axios({
        url: BASE_URL + '/business-service/route/navigps/routetype',
        method: "post",
        data: {
          region: props.myParams.region,
          routeName: props.myParams.univ,
          date:
            new Date(props.myParams.pickDate).getMonth() + 1 > 10
              ? new Date(props.myParams.pickDate).getDate() > 10
                ? `${new Date(props.myParams.pickDate).getFullYear()}-${new Date(props.myParams.pickDate).getMonth() + 1
                }-${new Date(props.myParams.pickDate).getDate()}`
                : `${new Date(props.myParams.pickDate).getFullYear()}-${new Date(props.myParams.pickDate).getMonth() + 1
                }-0${new Date(props.myParams.pickDate).getDate()}`
              : `${new Date(props.myParams.pickDate).getFullYear()}-0${new Date(props.myParams.pickDate).getMonth() + 1
              }-0${new Date(props.myParams.pickDate).getDate()}`,
          routeType: props.myParams.taskTime
        },
      }).then((res) => {
        // console.log(res.data)
        setAllTask(
          res.data.sort(function (a, b) {
            if (a.routeName > b.routeName) {
              return 1;
            }
            if (a.routeName < b.routeName) {
              return -1;
            }
            return 0;
          })
        );
      })
    } else {
      searchRegionDateUniv();
    }
  }

  let allTaskList = []
  for (let i = 0; i <= allTask.length - 1; i++) {
    let temp_list = []
    for (let j = 0; j <= allTask[i].deliveryDtoList.length - 1; j++) {
      if (!allTask[i].deliveryDtoList[j].check) {
        temp_list.push(allTask[i].deliveryDtoList[j])
      }
    }
    allTaskList.push({
      routeId: allTask[i].routeId,
      userId: allTask[i].userId,
      routeType: allTask[i].routeType,
      routeName: allTask[i].routeName,
      done: allTask[i].done,
      deliveryDtoList: temp_list
    })
  }
  // 메인 useEffect
  useEffect(() => {
    setAllTask(allTask)
    // console.log(allTask)
    if (document.getElementById('map')) {
      let map = new naver.maps.Map("map", {
        center: center,
        zoom: zoom,
        zoomControl: true,
        zoomControlOptions: {
          style: naver.maps.ZoomControlStyle.SMALL,
          position: naver.maps.Position.BOTTOM_LEFT,
        },
        logoControl: false,
        scaleControl: false,
        mapTypeControl: false,
        mapDataControl: false,
      });
      map.destroy();
    }

    routeColor.length = 0;

    let map = new naver.maps.Map("map", {
      center: center,
      zoom: zoom,
      zoomControl: true,
      zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.BOTTOM_LEFT,
      },
      logoControl: false,
      scaleControl: false,
      mapTypeControl: false,
      mapDataControl: false,
    });

    let marker_default_1 = new naver.maps.Marker({
      map: map,
      position: new naver.maps.LatLng(cloudStoneLatLng),
      animation: 1,
      icon: {
        content:
          '<img src="https://user-images.githubusercontent.com/97590478/201602320-4ceeb1a1-d80c-40e2-97a3-56c5e87e8f58.png" alt="" ' +
          'style="margin: 0px; padding: 0px; border: 0px solid transparent; display: block; max-width: none; max-height: none; ' +
          '-webkit-user-select: none; position: absolute; width: 140px; height: 140px; left: 0px; top: 0px; transform:translate(-50%, -50%);">',
        size: new naver.maps.Size(22, 35),
        anchor: new naver.maps.Point(11, 35),
      },
    });

    let marker_default_2 = new naver.maps.Marker({
      map: map,
      position: new naver.maps.LatLng(ssafyLatLng),
      animation: 1,
      icon: {
        content:
          '<img src="https://user-images.githubusercontent.com/97590478/201608034-9d564762-236c-49cf-8b30-cdf3fd1787a2.png" alt="" ' +
          'style="margin: 0px; padding: 0px; border: 0px solid transparent; display: block; max-width: none; max-height: none; ' +
          '-webkit-user-select: none; position: absolute; width: 230px; height: 180px; left: 0px; top: 0px; transform:translate(-50%, -50%);">',
        size: new naver.maps.Size(22, 35),
        anchor: new naver.maps.Point(11, 35),
      },
    });

    let polyline_default = new naver.maps.Polyline({
      map: map,
      path: SsafyCloudStoneCourse,
      strokeColor: "#0094EE",
      strokeStyle: "solid",
      strokeLineCap: "round",
      strokeWeight: 15,
      strokeOpacity: 1,
      strokeLineJoin: "round",
    });
    let markerSet_default = [marker_default_1, marker_default_2];

    if (props.myParams.region) {
      markerSet_default.map((marker, idx) => {
        marker.setMap(null);
        polyline_default.setMap(null);
      });
    }

    // 결과를 받아왔다면
    if (allTask.length) {
      for (let i = 0; i <= allTask.length - 1; i++) {
        // 가야할 경유지가 있다면
        if (allTask[i].deliveryDtoList.length) {
          // 루트ID가 없거나, routeId가 정해져있거나(선택되었을 때)
          if (!routeId || allTask[i].routeId === routeId) {
            axios({
              url: `https://k7c207.p.ssafy.io:8000/gps-service/gps/${allTask[i].userId}`,
              method: "get",
            }).then((res) => {
              // focus 여부에 체크되어 있다면 줌, 센터
              if (focus) {
                map.setCenter([res.data.longitude, res.data.latitude])
                map.setZoom(19)
                setCenter([res.data.longitude, res.data.latitude])
              }
            })
          }
        }
      }
    }
    // 결과를 받아왔다면
    if (allTask.length) {
      // 내가 음식점을 선택하지 않았고, 루트ID도 없고, 포커스도 아닐 때
      if (positionLoc.length === 0 && routeId === 0 && focus === 0) {
        // 지역과 대학으로 분기처리 후 줌
        if (props.myParams.region === "GWANGJU") {
          if (props.myParams.univ === "전남대학교") {
            // map.morph(JNU, 13, { duration: 5000 })
            map.setCenter(JNU)
            map.setZoom(13)
            setCenter(JNU)
          } else if (props.myParams.univ === "광주과학기술원") {
            // map.morph(GIST, 13, { duration: 5000 })
            map.setCenter(GIST)
            map.setZoom(13)
            setCenter(GIST)
          } else {
            // map.morph(GWANGJU, 13, { duration: 5000 })
            map.setCenter(GWANGJU)
            map.setZoom(13)
            setCenter(GWANGJU)
          }
        } else if (props.myParams.region === "SEOUL") {
          if (props.myParams.univ === "연세대학교") {
            // map.morph(YONSEI, 15, { duration: 5000 })
            map.setCenter(YONSEI)
            map.setZoom(15)
            setCenter(YONSEI)
          } else {
            // map.morph(SEOUL, 12, { duration: 5000 })
            map.setCenter(SEOUL)
            map.setZoom(12)
            setCenter(SEOUL)
          }
        }
      }

      // 결과를 받아왔다면, 그 결과를 반복문 처리한다.
      for (let i = 0; i <= allTask.length - 1; i++) {
        // if (i <= 2) {
        //
        myuniv.push(allTask[i].routeName); // route이름을 집어넣는다.
        // 배달할 곳이 남아있다면
        if (allTask[i].deliveryDtoList.length) {
          let randomBrightColor = () => {
            let color_r = Math.floor(Math.random() * 217 + 38).toString(16);
            let color_g = Math.floor(Math.random() * 217 + 38).toString(16);
            let color_b = Math.floor(Math.random() * 217 + 38).toString(16);
            return `#${color_r + color_g + color_b}`;
          };
          let color_temp = "";

          // 루트 아이디가 정해져있지 않다.
          if (routeId === 0) {
            color_temp = randomBrightColor();
            routeColor.push(color_temp);
            // 루트 아이디가 정해져있다.
          } else {
            // 정해진 색만 노랑, 나머지는 남색으로 변환 
            if (routeId === allTask[i].routeId) {
              color_temp = "#F5CC1F";
            } else {
              color_temp = "gray";
            }
            routeColor.push(color_temp);
          }

          // 경로가 선택되어있고, 내가 선택한 경로에 한정해서 보여주기
          if (routeId && allTask[i].routeId === routeId) {
            axios({
              url: `https://k7c207.p.ssafy.io:8000/s3-service/getProfile`,
              method: "get",
              params: {
                userId: allTask[i].userId
              }
            }).then((res2) => {
              axios({
                url: `https://k7c207.p.ssafy.io:8000/gps-service/gps/${allTask[i].userId}`,
                method: "get",
              }).then((res) => {
                new naver.maps.Marker({
                  map: map,
                  position: new naver.maps.LatLng([res.data.longitude, res.data.latitude]),
                  icon: {
                    content: `<div style="border-radius:50%;"><img src="${res2.data}" alt="" ` +
                      `style="margin: 0px; padding: 0px; border: 0px solid transparent; display: block; max-width: none; max-height: none; border-radius:50%; outline-width: 10px; outline-style: solid; outline-color: ${color_temp}; object-fit:center; object-position:center;` +
                      '-webkit-user-select: none; position: absolute; width: 50px; height: 50px; left: -15px; top: -20px;"/></div>',
                    size: new naver.maps.Size(22, 35),
                    anchor: new naver.maps.Point(11, 35),
                  },
                  animation: 1,
                })
                // 기사 경로부터 다음 목적지까지 길을 표시해준다.
                if (allTaskList[i].deliveryDtoList.length) {
                  const temp_course = {
                    start: make_LatLng([res.data.longitude, res.data.latitude]),
                    goal: make_LatLng([
                      allTaskList[i].deliveryDtoList[0].longitude,
                      allTaskList[i].deliveryDtoList[0].latitude,
                    ]),
                    option: "traoptimal",
                  };
                  cal_course(temp_course).then((appData) => {
                    new naver.maps.Polyline({
                      map: map,
                      path: appData,
                      strokeColor: "#F5CC1F",
                      strokeStyle: "shortdash",
                      strokeLineCap: "round",
                      strokeWeight: 15,
                      strokeOpacity: 1,
                      strokeLineJoin: "round",
                    });
                  });
                }
              });
            })
            // 경로가 선택되어있지 않았을 때
          } else if (!routeId) {
            axios({
              url: `https://k7c207.p.ssafy.io:8000/s3-service/getProfile`,
              method: "get",
              params: {
                userId: allTask[i].userId
              }
            }).then((res2) => {
              axios({
                url: `https://k7c207.p.ssafy.io:8000/gps-service/gps/${allTask[i].userId}`,
                method: "get",
              }).then((res) => {
                new naver.maps.Marker({
                  map: map,
                  position: new naver.maps.LatLng([res.data.longitude, res.data.latitude]),
                  icon: {
                    content: `<div style="border-radius:50%;"><img src="${res2.data}" alt="" ` +
                      `style="margin: 0px; padding: 0px; border: 0px solid transparent; display: block; max-width: none; max-height: none; border-radius:50%; outline-width: 10px; outline-style: solid; outline-color: ${color_temp}; object-fit:center; object-position:center;` +
                      '-webkit-user-select: none; position: absolute; width: 50px; height: 50px; left: -15px; top: -20px;"/></div>',
                    size: new naver.maps.Size(22, 35),
                    anchor: new naver.maps.Point(11, 35),
                  },
                  animation: 1,
                })
                if (allTaskList[i].deliveryDtoList.length) {
                  const temp_course = {
                    start: make_LatLng([res.data.longitude, res.data.latitude]),
                    goal: make_LatLng([
                      allTaskList[i].deliveryDtoList[0].longitude,
                      allTaskList[i].deliveryDtoList[0].latitude,
                    ]),
                    option: "traoptimal",
                  };
                  cal_course(temp_course).then((appData) => {
                    new naver.maps.Polyline({
                      map: map,
                      path: appData,
                      strokeColor: color_temp,
                      strokeStyle: "shortdash",
                      strokeLineCap: "round",
                      strokeWeight: 15,
                      strokeOpacity: 0.8,
                      strokeLineJoin: "round",
                    });
                  });
                }
              });
            })
          }

          // 루트 선택되어있지 않거나, 
          if (!routeId || allTask[i].routeId === routeId) {
            const waypoints_temp = [];
            let temp_lat = 0
            let temp_lng = 0
            // 모든 루트 순회 경로 찍기
            for (let j = 0; j <= allTask[i].deliveryDtoList.length - 1; j++) {
              waypoints_temp.push([
                allTask[i].deliveryDtoList[j].longitude,
                allTask[i].deliveryDtoList[j].latitude,
              ]);
              // 루트 선택, 목적지 선택을 했다면
              if (allTask[i].routeId === routeId && positionLoc.length) {
                new naver.maps.Marker({
                  map: map,
                  position: new naver.maps.LatLng([
                    allTask[i].deliveryDtoList[j].longitude,
                    allTask[i].deliveryDtoList[j].latitude,
                  ]),
                  animation: 0,
                  icon: {
                    content: `
                      <div class=${styles.myIcon}>
                      <div class=${styles.myIconName} style="font-size:20px; margin-bottom:5px;">${allTask[i].deliveryDtoList[j].delName}</div>
                      <div style="font-size:18px;">${allTask[i].deliveryDtoList[j].delScheduledTime.slice(0, 5)}</div>
                      </div>
                        <div class=${styles.mydiv} style="outline-style:solid; outline-width:7px; outline-color:${routeId > 0 ? "#F5CC1F" : color_temp};">
                          ${j + 1}
                        </div>
                      `,
                    size: new naver.maps.Size(22, 35),
                    anchor: new naver.maps.Point(11, 35),
                  },
                });
                // 루트 선택, 목적지 미선택
              } else if (allTask[i].routeId === routeId) {
                new naver.maps.Marker({
                  map: map,
                  position: new naver.maps.LatLng([
                    allTask[i].deliveryDtoList[j].longitude,
                    allTask[i].deliveryDtoList[j].latitude,
                  ]),
                  animation: 0,
                  icon: {
                    content: `
                        <div class=${styles.mydiv} style="outline-style:solid; outline-width:7px; outline-color:${routeId > 0 ? "#F5CC1F" : color_temp};">
                          ${j + 1}
                        </div>
                      `,
                    size: new naver.maps.Size(22, 35),
                    anchor: new naver.maps.Point(11, 35),
                  },
                });
                // 루트 선택 없을 시
              } else {
                new naver.maps.Marker({
                  map: map,
                  position: new naver.maps.LatLng([
                    allTask[i].deliveryDtoList[j].longitude,
                    allTask[i].deliveryDtoList[j].latitude,
                  ]),
                  animation: 0,
                  icon: {
                    content: `
                        <div class=${styles.mydiv} style="outline-style:solid; outline-width:7px; outline-color:${routeId > 0 ? "#F5CC1F" : color_temp};">
                          ${j + 1}
                        </div>
                      `,
                    size: new naver.maps.Size(22, 35),
                    anchor: new naver.maps.Point(11, 35),
                  },
                });
              }
              temp_lat += allTask[i].deliveryDtoList[j].latitude
              temp_lng += allTask[i].deliveryDtoList[j].longitude
            }
            // 루트 선택
            if (allTask[i].routeId === routeId) {

              if (positionLoc.length === 0 & focus === 0) {
                map.setCenter([temp_lng / allTask[i].deliveryDtoList.length, temp_lat / allTask[i].deliveryDtoList.length])
                map.setZoom(14)
                setCenter([temp_lng / allTask[i].deliveryDtoList.length, temp_lat / allTask[i].deliveryDtoList.length])
              }
              setDriverId(allTask[i].userId)
              setOneTask(allTask[i])
              console.log(oneTask.deliveryDtoList)

              axios({
                url: `https://k7c207.p.ssafy.io:8000/user-service/user/${allTask[i].userId}`,
                method: "get"
              }).then((res) => {
                setDirverInfo(res.data)
              })
              axios({
                url: `https://k7c207.p.ssafy.io:8000/s3-service/getProfile`,
                method: "get",
                params: {
                  userId: allTask[i].userId
                }
              }).then((res) => {
                setDriverProfile(res.data)
              })
            }

            const course_temp = {
              start: make_LatLng([
                allTask[i].deliveryDtoList[0].longitude,
                allTask[i].deliveryDtoList[0].latitude,
              ]),
              goal: make_LatLng(
                [
                  allTask[i].deliveryDtoList[allTask[i].deliveryDtoList.length - 1].longitude,
                  allTask[i].deliveryDtoList[allTask[i].deliveryDtoList.length - 1].latitude,
                ]
              ),
              option: "traoptimal",
              waypoints: make_waypoints(waypoints_temp),
            };
            // 해당하는 모든 루트 경로 찍기
            cal_course(course_temp).then((appData) => {
              new naver.maps.Polyline({
                map: map,
                path: appData,
                strokeColor: routeId > 0 ? "#0F1839" : color_temp,
                strokeStyle: "solid",
                strokeLineCap: "round",
                strokeWeight: 10,
                strokeOpacity: 0.6,
                strokeLineJoin: "round",
              });
            });
          }
        }
        // } //
      }
    }
    if (positionLoc.length && focus === 0) {
      // map.morph(positionLoc, 18, { duration: 5000 })
      map.setCenter(positionLoc)
      map.setZoom(18)
      setCenter(positionLoc)
    }
  }, [SsafyCloudStoneCourse, allTask, routeId, positionLoc, params_temp, focus, refresh, oneTask]);


  // 1. 제일 처음 싸피-클라우드 스톤을 이어준다.
  useEffect(() => {
    cal_course(ssafy_cloudstone_route_temp).then((appData) => {
      setSsafyCloudStoneCourse(appData);
    });
  }, []);

  // 2. autoRefresh 후 초기화가 진행된다.
  useEffect(() => {
    setTimeout(() => {
      setParamsTemp(params_temp + 1);
      setCheckIn([])
      searchRegionDateUnivTime();
    }, autoRefresh);
  }, [params_temp, autoRefresh]);


  useEffect(() => {
    setTempTest(temp_test + 1);
  }, [center]);


  useEffect(() => {
    setTempTest(temp_test + 1);
    searchRegionDate();
    setMyUniv([]);
    setRouteColor([]);
    setRouteId(0);
    setDriverId(0);
    setOneTask([])
    setPositionLoc([])
  }, [props.myParams.region]);
  useEffect(() => {
    setTempTest(temp_test + 1);
    setRouteColor([]);
    searchRegionDateUniv();
    setMyUniv([]);
    setRouteId(0);
    setDriverId(0);
    setOneTask([])
    setPositionLoc([])
  }, [props.myParams.univ]);
  useEffect(() => {
    setTempTest(temp_test + 1);
    setRouteColor([]);
    searchRegionDateUnivTime();
    setMyUniv([]);
    setRouteId(0);
    setDriverId(0);
    setOneTask([])
    setPositionLoc([])
  }, [props.myParams.taskTime]);





  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* 토글 버튼 시작 */}
      <div className={styles.toggle} onClick={() => { focus ? setFocus(0) : setFocus(1) }}>
        {
          routeId
            ? <div>{
              focus
                ? <img className={styles.focus_on} src={focus_on} alt="" />
                : <img className={styles.focus_off} src={focus_off} alt="" />
            }</div>
            : <div></div>
        }
      </div>
      {/* 토글 버튼 끝 */}
      {/* 리프레시 버튼 시작 */}
      {/* <div className={styles.refreshToggle}>RELOAD</div> */}
      <div className={styles.toggle2} onClick={() => {
        (refresh ? setRefresh(0) : setRefresh(1))
        searchRegionDateUnivTime();
      }}>
        <img className={styles.refresh_off} src={refresh_off} alt="" />
        <div className={styles.refreshToggle}>RELOAD</div>
      </div>
      {/* 리프레시 버튼 끝 */}
      {/* 오토리프레시 버튼 시작 */}
      <div className={styles.autoRefreshMent}>AUTO</div>
      <div className={styles.toggle3} onClick={() => { autoRefresh <= 6000 ? setAutoRefresh(6000000) : setAutoRefresh(6000) }}>
        {
          autoRefresh <= 6000
            ? <img className={styles.autoRefresh} src={refresh_move_on} alt="" />
            : <img className={styles.autoRefresh} src={refresh_move_off} alt="" />
        }
        <div className={styles.autoRefreshMent}>AUTO</div>
      </div>
      {/* 오토리프레시 버튼 끝
      {/* 안내 설명 시작 */}
      {props.myParams.region === "" ? (
        <div className={styles.effect}>
          <div className={styles.ment}>
            <div style={{ marginBottom: "10px" }}> <span style={{ color: "blue" }}>실시간 업무 현황 </span>페이지 입니다.</div>
            <div style={{ marginLeft: "10px", marginRight: "10px", marginBottom: "10px", fontSize: "25px" }}><span style={{ color: "blue" }}>지역, 대학, 시간</span>을 순서대로 선택해주세요. <img style={{ width: "20px" }} src={arrow} alt="" /></div>
            <div style={{ color: "red", fontSize: "20px" }}>*날짜 선택 불가</div>
          </div>
        </div>
      ) : (
        <></>
      )}
      {/* 안내 설명 끝 */}
      {/* 대학교 리스트 시작 */}
      <div>
        <div className={styles.profileList}>
          {(function () {
            if (
              props.myParams.region === "GWANGJU" &&
              props.myParams.univ === "전남대학교"
            ) {
              return allTask.map((route, index) => {
                return (
                  <div>
                    {/* <button className={styles.profileImageContent} style="background-color:white;" onClick={() => { setRoute(route.routeId) }}> */}
                    <button
                      className={styles.profileImageContent}
                      style={{ color: routeColor[index] }}
                      onClick={() => {
                        if (routeId === route.routeId) {
                          setRouteId(0);
                          setDriverId(0);
                          setDirverInfo([]);
                          setOneTask([]);
                          setCheckIn([])
                        } else {
                          setRouteId(route.routeId);
                          setCheckIn([])
                        }
                      }}
                    >
                      {/* <button className={styles.profileImageContent} style={{ outlineColor: routeColor[index], outlineStyle: "solid", outlineWidth: "4px" }}> */}
                      <img className={styles.profileImage} src={jnu} alt="" />
                      <div className={styles.profileContent}>
                        {route.routeName}&nbsp;
                      </div>
                    </button>
                  </div>
                );
              });
            } else if (
              props.myParams.region === "GWANGJU" &&
              props.myParams.univ === "광주과학기술원"
            ) {
              return allTask.map((route, index) => {
                return (
                  <div>
                    <button
                      className={styles.profileImageContent}
                      style={{ color: routeColor[index] }}
                      onClick={() => {
                        if (routeId === route.routeId) {
                          setRouteId(0);
                          setDriverId(0);
                          setDirverInfo([]);
                          setOneTask([]);
                          setCheckIn([])
                        } else {
                          setRouteId(route.routeId);
                          setCheckIn([])
                        }
                      }}
                    >
                      <img className={styles.profileImage} src={gist} alt="" />
                      <div className={styles.profileContent}>
                        {route.routeName}&nbsp;
                      </div>
                    </button>
                  </div>
                );
              });
            } else if (props.myParams.region === "GWANGJU") {
              return allTask.map((route, index) => {
                if (route.routeName.slice(0, 5) === "전남대학교") {
                  return (
                    <div>
                      <button
                        className={styles.profileImageContent}
                        style={{ color: routeColor[index] }}
                        onClick={() => {
                          if (routeId === route.routeId) {
                            setRouteId(0);
                            setDriverId(0);
                            setDirverInfo([]);
                            setOneTask([]);
                            setCheckIn([])
                          } else {
                            setRouteId(route.routeId);
                            setCheckIn([])
                          }
                        }}
                      >
                        <img className={styles.profileImage} src={jnu} alt="" />
                        <div className={styles.profileContent}>
                          {route.routeName}&nbsp;
                        </div>
                      </button>
                    </div>
                  );
                } else if (route.routeName.slice(0, 7) === "광주과학기술원") {
                  return (
                    <div>
                      <button
                        className={styles.profileImageContent}
                        style={{ color: routeColor[index] }}
                        onClick={() => {
                          if (routeId === route.routeId) {
                            setRouteId(0);
                            setDriverId(0);
                            setDirverInfo([]);
                            setOneTask([]);
                            setCheckIn([])
                          } else {
                            setRouteId(route.routeId);
                            setCheckIn([])
                          }
                        }}
                      >
                        <img
                          className={styles.profileImage}
                          src={gist}
                          alt=""
                        />
                        <div className={styles.profileContent}>
                          {route.routeName}&nbsp;
                        </div>
                      </button>
                    </div>
                  );
                } else {
                  return (
                    <div>
                      <button
                        className={styles.profileImageContent}
                        style={{ color: routeColor[index] }}
                        onClick={() => {
                          if (routeId === route.routeId) {
                            setRouteId(0);
                            setDriverId(0);
                            setDirverInfo([]);
                            setOneTask([]);
                            setCheckIn([])
                          } else {
                            setRouteId(route.routeId);
                            setCheckIn([])
                          }
                        }}
                      >
                        <img
                          className={styles.profileImage}
                          style={{ width: "40px", height: "40px", marginLeft: "3px" }}
                          src={logo_team}
                          alt=""
                        />
                        <div className={styles.profileContent}>
                          {route.routeName}&nbsp;
                        </div>
                      </button>
                    </div>
                  );
                }
              });
            } else if (
              props.myParams.region === "SEOUL" &&
              props.myParams.univ === "연세대학교"
            ) {
              return allTask.map((route, index) => {
                return (
                  <div>
                    <button
                      className={styles.profileImageContent}
                      style={{ color: routeColor[index] }}
                      onClick={() => {
                        if (routeId === route.routeId) {
                          setRouteId(0);
                          setDriverId(0);
                          setDirverInfo([]);
                          setOneTask([]);
                          setCheckIn([])
                        } else {
                          setRouteId(route.routeId);
                          setCheckIn([])
                        }
                      }}
                    >
                      <img
                        className={styles.profileImage}
                        src={yonsei}
                        alt=""
                      />
                      <div className={styles.profileContent}>
                        {route.routeName}&nbsp;
                      </div>
                    </button>
                  </div>
                );
              });
            } else if (props.myParams.region === "SEOUL") {
              return allTask.map((route, index) => {
                return (
                  <div>
                    <button
                      className={styles.profileImageContent}
                      style={{ color: routeColor[index] }}
                      onClick={() => {
                        if (routeId === route.routeId) {
                          setRouteId(0);
                          setDriverId(0);
                          setDirverInfo([]);
                          setOneTask([]);
                          setCheckIn([])
                        } else {
                          setRouteId(route.routeId);
                          setCheckIn([])
                        }
                      }}
                    >
                      <img
                        className={styles.profileImage}
                        src={yonsei}
                        alt=""
                      />
                      <div className={styles.profileContent}>
                        {route.routeName}&nbsp;
                      </div>
                    </button>
                  </div>
                );
              });
            }
          })()}
        </div>
      </div>
      {/* 대학교 리스트 끝 */}
      {/* 업무 리스트 시작 */}
      <div className={styles.taskList}>
        {driverId > 0 ? (
          <div className={styles.taskDiv}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "start",
                width: "100%",
                height: "100%",
              }}
            >
              <div style={{ width: "100px", height: "100px", margin: "15px" }}>
                <img src={driverProfile} className={styles.taskImg} alt="" />
              </div>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <br></br>
                <div style={{ fontSize: "28px", color: "#0F1839" }}>
                  <span style={{ fontSize: "22px", color: "gray" }}>담당자 : </span>{driverInfo.name}
                </div>
                <br />
                <div style={{ fontSize: "22px", color: "#0F1839" }}>
                  {driverInfo.phone}
                </div>
              </div>
            </div>
            <br></br>
            <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
              <button id="button_pickup"
                className={menuControl === 1 ? styles.button_pick : styles.button_default}
                onClick={() => {
                  setMenuControl(1);
                  setButtonToggle("button_pickup");
                }
                }
              >
                픽업 장소
              </button>
              <button id="button_delivery"
                className={menuControl === 2 ? styles.button_pick : styles.button_default}
                onClick={() => {
                  setMenuControl(2)
                  setButtonToggle("button_delivery");
                }
                }
              >
                배달 장소
              </button>
            </div>
            <br></br>
            {/* 픽업지명 완료 미완료 변경 지점 */}
            {menuControl === 1 ? (
              <div style={{ width: "100%" }}>
                <div style={{ width: "100%", margin: "10px", marginLeft: "0px", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  <div style={{ width: "50%", textAlign: "center", fontWeight: "300", fontSize: "16px" }}>픽업지명</div>
                  <div style={{ width: "20%", marginRight: "10px", textAlign: "center", fontWeight: "300", fontSize: "16px" }}>예정 시간</div>
                  <div style={{ width: "20%", textAlign: "center", fontWeight: "300", fontSize: "16px" }}>상태</div>
                </div>
                <hr width="100%" />
                <div style={{ width: "100%", maxHeight: "300px", overflowY: "auto" }}>
                  {oneTask.deliveryDtoList
                    .filter((item) => item.type === "pickup")
                    .map((delivery, index) => {
                      checkIn.push(delivery.check)
                      return (
                        <div style={{ width: "100%" }}>
                          {
                            <div
                              className={styles.touch}
                              onClick={() => {
                                if (positionLoc.length) {
                                  if (positionLoc[0] - delivery.longitude === 0 && positionLoc[1] - delivery.latitude === 0) {
                                    setPositionLoc([])
                                  } else {
                                    setPositionLoc([delivery.longitude, delivery.latitude])
                                  }
                                } else {
                                  setPositionLoc([delivery.longitude, delivery.latitude])
                                  setFocus(0)
                                  setMenuControl(1)

                                }
                              }}
                              style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "10px",
                                marginLeft: "0px",
                                cursor: "pointer",
                                borderRadius: "10px",
                                boxSizing: "border-box",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  width: "50%",
                                }}
                              >
                                <div style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}>{delivery.delName}</div>
                                <div> {delivery.check ? <span style={{ color: "green" }}>{delivery.orderNum}&ensp;</span> : <span style={{ color: "red" }}>{delivery.orderNum}&ensp;</span>}건</div>
                              </div>
                              <div style={{ width: "20%", marginRight: "10px", textAlign: "center" }}>
                                <div>
                                  {delivery.delScheduledTime.slice(0, 5)}
                                </div>
                                {
                                  delivery.check && delivery.delActualTime && delivery.delScheduledTime
                                    ? (delivery.delActualTime >= delivery.delScheduledTime)
                                      ? <div style={{ color: "red" }}>
                                        ({delivery.delActualTime.slice(0, 5)})
                                      </div>
                                      : <div style={{ color: "green" }}>
                                        ({delivery.delActualTime.slice(0, 5)})
                                      </div>
                                    : <div></div>
                                }
                              </div>
                              {
                                delivery.check
                                  // checkIn[index]
                                  ? <div style={{ width: "20%", textAlign: "center", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <div style={{ color: "green", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "5px" }}>완료&ensp;</div>
                                    <img style={{ width: "20px" }} onClick={() => {
                                      axios({
                                        url: `https://k7c207.p.ssafy.io:8000/s3-service/getCheckIn`,
                                        method: "get",
                                        params: {
                                          delId: delivery.id
                                        }
                                      }).then((res) => {
                                        Swal.fire({
                                          imageUrl:
                                            res.data,
                                          html: `<div style="font-family:BMJUA; font-size:40px;, color:#0F1839;">${delivery.delName}</div>
                                          <div style="font-family:BMJUA; font-size:20px;, color:#0F1839;">주문 건수 : ${delivery.orderNum}건</div>
                                          <div style="font-family:BMJUA; font-size:20px;, color:#0F1839;">예상 시간 : ${delivery.delScheduledTime.slice(0, 5)}</div>
                                          <div style="font-family:BMJUA; font-size:20px;, color:#0F1839;">완료 시간 : ${delivery.delActualTime.slice(0, 5)}</div>`,
                                          confirmButtonText: "확인",
                                          confirmButtonColor: "#0F1839",
                                          timer: 5000,
                                          timerProgressBar: true,
                                          allowOutsideClick: false
                                        })
                                      })
                                    }} src={picture} alt="" />
                                  </div>
                                  : <div style={{ width: "20%", textAlign: "center", display: "flex", flexDirection: "columns", justifyContent: "center", alignItems: "center" }}>
                                    <span style={{ color: "red" }}>미완료</span></div>
                              }
                            </div>
                          }
                        </div>
                      );
                    })}
                </div>
              </div>
              /* 배달지명 완료 미완료 변경 지점 */
            ) : (
              <div style={{ width: "100%" }}>
                <div style={{ width: "100%", margin: "10px", marginLeft: "0px", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  <div style={{ width: "50%", textAlign: "center", fontWeight: "300", fontSize: "16px" }}>배달지명</div>
                  <div style={{ width: "20%", marginRight: "10px", textAlign: "center", fontWeight: "300", fontSize: "16px" }}>예정 시간</div>
                  <div style={{ width: "20%", textAlign: "center", fontWeight: "300", fontSize: "16px" }}>상태</div>
                </div>
                <hr width="100%" />
                <div style={{ width: "100%", maxHeight: "300px", overflowY: "auto" }}>
                  {oneTask.deliveryDtoList
                    .filter((item) => item.type === "delivery")
                    .map((delivery, index) => {
                      checkIn.push(delivery.check)
                      return (
                        <div style={{ width: "100%" }}>
                          {
                            <div
                              id={index}
                              className={styles.touch}
                              onClick={() => {
                                if (positionLoc.length) {
                                  if (positionLoc[0] - delivery.longitude === 0 && positionLoc[1] - delivery.latitude === 0) {
                                    setPositionLoc([])
                                    document.getElementById(index).style.backgroundColor = "transparent"
                                  } else {
                                    setPositionLoc([delivery.longitude, delivery.latitude])
                                  }
                                } else {
                                  setPositionLoc([delivery.longitude, delivery.latitude])
                                  setFocus(0)
                                  setMenuControl(2)
                                }
                              }}
                              style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "10px",
                                marginLeft: "0px",
                                cursor: "pointer",
                                borderRadius: "10px",
                                boxSizing: "border-box",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  width: "50%",
                                }}
                              >
                                <div style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}>{delivery.delName}</div>
                                <div> {delivery.check ? <span style={{ color: "green" }}>{delivery.orderNum}&ensp;</span> : <span style={{ color: "red" }}>{delivery.orderNum}&ensp;</span>}건</div>
                              </div>
                              <div style={{ width: "20%", marginRight: "10px", textAlign: "center" }}>
                                <div>
                                  {delivery.delScheduledTime.slice(0, 5)}
                                </div>
                                {
                                  delivery.check && delivery.delActualTime && delivery.delScheduledTime
                                    ? (delivery.delActualTime >= delivery.delScheduledTime)
                                      ? <div style={{ color: "red" }}>
                                        ({delivery.delActualTime.slice(0, 5)})
                                      </div>
                                      : <div style={{ color: "green" }}>
                                        ({delivery.delActualTime.slice(0, 5)})
                                      </div>
                                    : <div></div>
                                }
                              </div>
                              {
                                delivery.check
                                  // checkIn[index]
                                  ? <div style={{ width: "20%", textAlign: "center", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <div style={{ color: "green", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "5px" }}>완료&ensp;</div>
                                    <img style={{ width: "20px" }} onClick={() => {
                                      axios({
                                        url: `https://k7c207.p.ssafy.io:8000/s3-service/getCheckIn`,
                                        method: "get",
                                        params: {
                                          delId: delivery.id
                                        }
                                      }).then((res) => {
                                        Swal.fire({
                                          imageUrl:
                                            res.data,
                                          html: `<div style="font-family:BMJUA; font-size:40px;, color:#0F1839; text-overflow:ellipsis;white-space: nowrap;">${delivery.delName}</div>
                                            <div style="font-family:BMJUA; font-size:20px;, color:#0F1839;">주문 건수 : ${delivery.orderNum}건</div>
                                            <div style="font-family:BMJUA; font-size:20px;, color:#0F1839;">예상 시간 : ${delivery.delScheduledTime.slice(0, 5)}</div>
                                            <div style="font-family:BMJUA; font-size:20px;, color:#0F1839;">완료 시간 : ${delivery.delActualTime.slice(0, 5)}</div>`,
                                          confirmButtonText: "확인",
                                          confirmButtonColor: "#0F1839",
                                          timer: 5000,
                                          timerProgressBar: true,
                                          allowOutsideClick: false
                                        })
                                      })
                                    }} src={picture} alt="" />
                                  </div>
                                  : <div style={{ width: "20%", textAlign: "center", display: "flex", flexDirection: "columns", justifyContent: "center", alignItems: "center" }}>
                                    <span style={{ color: "red" }}>미완료</span></div>
                              }
                            </div>
                          }
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        ) : <></>
        }
      </div>
      {/* 업무 리스트 끝 */}
      {/* 지도 시작 */}
      <div id="map" style={{ width: "100%", height: "100%" }}></div>
      {/* 지도 끝 */}
    </div>
  );
};

export default RealTime;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import zIndex from '@mui/material/styles/zIndex';
const { naver } = window;

const BASE_URL = "https://k7c207.p.ssafy.io:8000"


const TestPage = (props) => {

  // 지역, 날짜로 모든 경로 가져오기
  async function search_route() {
    await axios({
      url: BASE_URL + '/business-service/route/navigps',
      method: "post",
      data: {
        region: props.myParams.region,
        date: new Date(props.myParams.pickDate).getMonth() + 1 > 10 ? (new Date(props.myParams.pickDate).getDate() > 10 ? `${new Date(props.myParams.pickDate).getFullYear()}-${new Date(props.myParams.pickDate).getMonth() + 1}-${new Date(props.myParams.pickDate).getDate()}` : `${new Date(props.myParams.pickDate).getFullYear()}-${new Date(props.myParams.pickDate).getMonth() + 1}-0${new Date(props.myParams.pickDate).getDate()}`) : `${new Date(props.myParams.pickDate).getFullYear()}-0${new Date(props.myParams.pickDate).getMonth() + 1}-0${new Date(props.myParams.pickDate).getDate()}`
      }
    }).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
  }

  // TO지은 -> 값을 보내기 위해서 리스트[126.8116, 35.2053]를 하나의 문자열('126.8116,35.2053')으로 바꿔야 함
  function make_LatLng(now_loc_temp) {
    return `${now_loc_temp.join(',')}`
  }
  // 네이버 지도에서 두 점의 중심을 잡기 위한 함수
  function setTwoCenter(a, b) {
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  }
  // 네이버 지도 줌
  const [zoom, setZoom] = useState(13)
  // 네이버 지도 현재 위치 -> 중심을 지속적으로 옮기기 위함
  const [now_loc, setStart] = useState([126.8116, 35.2053]) // 전남대A출발지

  // SSAFY 위도 경도
  const ssafyLatLng = [126.8116, 35.2053]
  // CloudStone 위도 경도
  const cloudStoneLatLng = [126.85224, 35.14228]
  // 중심 좌표
  const [center, setCenter] = useState(setTwoCenter(ssafyLatLng, cloudStoneLatLng))

  // 경유지가 있다고 임의로 가정
  // let waypoints = [
  //   [126.8982, 35.1786], // 킹스샌드
  //   [126.9043, 35.1777], // 알촌
  //   [126.9030, 35.1777], // 봉구스밥버거
  //   [126.9028, 35.1779], // 카츠앤맘
  //   [126.9021, 35.1774], // 덮덮밥 광주용봉점
  //   [126.9011, 35.1779], // 마라미녀
  //   [126.9012, 35.1798], // 오늘하루가
  //   [126.9029, 35.1807], // 김밥나라
  //   [126.9101, 35.1813], // 생핼관4동입구
  //   [126.9109, 35.1802], // 생핼관6동입구
  //   [126.8997, 35.1765], // 8동생활관콜라자판기옆
  //   [126.9108, 35.1804]  // 생활관5동입구
  // ]
  // 결과적으로 waypoints는 126.8982,35.1786|126.9043,35.1777|126.9030,35.1777:의 형태를 나타내게 된다.
  // 경유지 좌표를 위도, 경도 순서로 잇고, |를 구분자로 정하고, 마지막을 :로 정리한다.
  function make_waypoints(waypoints_temp) {
    return waypoints_temp.join('|') + ':'
  }


  // TO지은 -> 값을 보내는 REQUEST BODY
  const ssafy_cloudstone_route_temp = {
    start: make_LatLng(ssafyLatLng),
    goal: make_LatLng(cloudStoneLatLng),
    option: "trafast", // trafast는 traffic fast 가장 빠른 길이라는 뜻
    // waypoints: make_waypoints(waypoints) // 경유지는 임시 주석 처리, 사용가능한 상태임.
  }
  // SSAFY부터 CloudStone까지 모든 경로를 담을 리스트
  const [SsafyCloudStoneCourse, setSsafyCloudStoneCourse] = useState([])

  // 경로 구하는 API 적용, date에는 requestBody를 넣을 것임
  async function cal_course(requestBody) {
    // 빈 course 선언
    const course = []
    // TO지은 -> 해당 API URL, post 주의
    await axios({
      url: "https://k7c207.p.ssafy.io:8000/user-service/map",
      method: "post",
      data: requestBody,
    }).then((res) => {
      // requestBody를 통해 경유지가 포함된 모든 경로를 계산한 값이 저장되는 path
      const path = res.data.route.trafast[0].path
      // path의 모든 값들을 빈 배열인 course에 push 한다.
      for (let i = 0; i <= path.length - 1; i++) {
        course.push(new naver.maps.LatLng(path[i][1], path[i][0]))
      }
      // push된 값을 77줄의 모든 경로를 담을 리스트에 넣는다.
      setSsafyCloudStoneCourse(course)
    })
  }

  const [params_temp, setParamsTemp] = useState(0)

  useEffect(() => {
    let map = new naver.maps.Map('map', {
      center: center,
      zoom: zoom,
      zoomControl: true,
      zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.TOP_RIGHT
      }
    });
    let marker = new naver.maps.Marker({
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
    })
    marker = new naver.maps.Marker({
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
    })
    let polyline = new naver.maps.Polyline({
      map: map,
      path: SsafyCloudStoneCourse,
      strokeColor: "#0094EE",
      strokeStyle: "solid",
      strokeLineCap: "round",
      strokeWeight: 15,
      strokeOpacity: 1
    })
  }, [SsafyCloudStoneCourse]);


  useEffect(() => {
    setTimeout(() => {
      setParamsTemp(params_temp + 1)
    }, 300000)
  }, [params_temp])

  useEffect(() => {
    search_route()
    // cal_course(ssafy_cloudstone_route_temp)
  }, [params_temp, zoom])

  return (
    <div style={{ width: '100%', height: '100%', position: "relative" }}>
      <div style={{ width: "100%", height: "100%", position: "absolute", backgroundColor: "blue", zIndex: "3", textAlign: "center", }}>안녕하세요?</div>
      <div id="map" style={{ width: '100%', height: '100%' }}></div>
    </div>
  )
}

export default TestPage;
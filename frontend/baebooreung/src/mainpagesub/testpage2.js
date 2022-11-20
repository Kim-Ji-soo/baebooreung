import React, { useEffect } from 'react';
import axios from 'axios';

const { naver } = window;

const NowLocation = () => {



  function make_waypoints(waypoints) {
    return waypoints.join('|') + ':'
  }

  function make_LatLng(now_loc_temp) {
    return `${now_loc_temp.join(',')}`
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


  useEffect(() => {
    const i = 0
    let start1 = [126.8197, 35.2027]
    let waypoints1 = [
      [126.8262, 35.2105],
      [126.8381, 35.2177],
      [126.842, 35.2182],
      [126.8488, 35.222],
      [126.8522, 35.2281],
      [126.8442, 35.2322],
    ]
    const route1 = {
      start: make_LatLng(start1),
      goal: make_LatLng(waypoints1[waypoints1.length - i - 1]),
      option: "traoptimal",
      waypoints: make_waypoints(waypoints1.slice(0, waypoints1.length - i))
    };

    let start2 = [126.8515, 35.2067]
    let waypoints2 = [
      [126.8462, 35.2134],
      [126.8529, 35.2158],
      [126.8461, 35.2181],
      [126.8488, 35.222],
      [126.8376, 35.2261],
      [126.8382, 35.2284],
    ]
    const route2 = {
      start: make_LatLng(start2),
      goal: make_LatLng(waypoints2[waypoints2.length - i - 1]),
      option: "traoptimal",
      waypoints: make_waypoints(waypoints2.slice(0, waypoints2.length - i))
    };


    const start3 = [126.8741, 35.2115]
    let waypoints3 = [
      [126.8611, 35.2156],
      [126.8529, 35.2179],
      [126.8529, 35.2216],
      [126.8488, 35.222],
      [126.8466, 35.2285],
      [126.8383, 35.2295],
    ]
    const route3 = {
      start: make_LatLng(start3),
      goal: make_LatLng(waypoints3[waypoints3.length - i - 1]),
      option: "traoptimal",
      waypoints: make_waypoints(waypoints3.slice(0, waypoints3.length - i))
    };


    // cal_course(route1).then((res) => {
    //   let polyline = new naver.maps.Polyline({
    //     map: map,
    //     path: res,
    //     strokeColor: "blue",
    //     strokeStyle: "solid",
    //     strokeLineCap: "round",
    //     strokeWeight: 15,
    //     strokeOpacity: 0.7,
    //     strokeLineJoin: "round",
    //   });
    // })
    // cal_course(route2).then((res) => {
    //   let polyline = new naver.maps.Polyline({
    //     map: map,
    //     path: res,
    //     strokeColor: "red",
    //     strokeStyle: "solid",
    //     strokeLineCap: "round",
    //     strokeWeight: 15,
    //     strokeOpacity: 0.7,
    //     strokeLineJoin: "round",
    //   });
    // })
    // cal_course(route3).then((res) => {
    //   let polyline = new naver.maps.Polyline({
    //     map: map,
    //     path: res,
    //     strokeColor: "gray",
    //     strokeStyle: "solid",
    //     strokeLineCap: "round",
    //     strokeWeight: 15,
    //     strokeOpacity: 0.7,
    //     strokeLineJoin: "round",
    //   });
    // })

    if (document.getElementById('map')) {
      let map = new naver.maps.Map("map", {
      });
      map.destroy();
    }
    let map = new naver.maps.Map('map', {
      center: [126.844, 35.2174],
      zoom: 15,
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
    let marker_1 = new naver.maps.Marker({
      map: map,
      position: new naver.maps.LatLng(start1),
      icon: {
        content:
          '<div style="color:blue; background-color:white;width:30px;height:30px;text-align:center;border-radius:50%; border:3px solid blue; display:flex; justify-content:center; align-items:center; font-size:25px;">A</div>',
        anchor: new naver.maps.Point(11, 35),
      },
    });
    // let marker_1_1 = new naver.maps.Marker({
    //   map: map,
    //   position: new naver.maps.LatLng(waypoints1[waypoints1.length - i - 1]),
    //   icon: {
    //     content:
    //       '<div style="color:blue; background-color:white;width:30px;height:30px;text-align:center;border-radius:50%; border:3px solid blue; display:flex; justify-content:center; align-items:center; font-size:25px;">A</div>',
    //     anchor: new naver.maps.Point(11, 35),
    //   },
    // });
    let marker_2 = new naver.maps.Marker({
      map: map,
      position: new naver.maps.LatLng(start2),
      icon: {
        content:
          '<div style="color:red; background-color:white;width:30px;height:30px;text-align:center;border-radius:50%; border:3px solid red; display:flex; justify-content:center; align-items:center; font-size:25px;">B</div>',
        anchor: new naver.maps.Point(11, 35),
      },
    });
    // let marker_2_1 = new naver.maps.Marker({
    //   map: map,
    //   position: new naver.maps.LatLng(waypoints2[waypoints2.length - i - 1]),
    //   icon: {
    //     content:
    //       '<div style="color:red; background-color:white;width:30px;height:30px;text-align:center;border-radius:50%; border:3px solid red; display:flex; justify-content:center; align-items:center; font-size:25px;">B</div>',
    //     anchor: new naver.maps.Point(11, 35),
    //   },
    // });
    let marker_3 = new naver.maps.Marker({
      map: map,
      position: new naver.maps.LatLng(start3),
      icon: {
        content:
          '<div style="color:gray; background-color:white;width:30px;height:30px;text-align:center;border-radius:50%; border:3px solid gray; display:flex; justify-content:center; align-items:center; font-size:25px;">C</div>',
        anchor: new naver.maps.Point(11, 35),
      },
    });
    // let marker_3_1 = new naver.maps.Marker({
    //   map: map,
    //   position: new naver.maps.LatLng(waypoints3[waypoints3.length - i - 1]),
    //   icon: {
    //     content:
    //       '<div style="color:gray; background-color:white;width:30px;height:30px;text-align:center;border-radius:50%; border:3px solid gray; display:flex; justify-content:center; align-items:center; font-size:25px;">C</div>',
    //     anchor: new naver.maps.Point(11, 35),
    //   },
    // });
    let marker_4 = new naver.maps.Marker({
      map: map,
      position: new naver.maps.LatLng([126.8498, 35.222]),
      icon: {
        content:
          '<div style="color:green; background-color:white;width:30px;height:30px;text-align:center;border-radius:50%; border:3px solid green; display:flex; justify-content:center; align-items:center; font-size:25px;">H</div>',
        anchor: new naver.maps.Point(11, 35),
      },
    });

  }, [])
  return (
    <div id="map" style={{ width: '100%', height: '100%' }}></div>
  );
};

export default NowLocation;
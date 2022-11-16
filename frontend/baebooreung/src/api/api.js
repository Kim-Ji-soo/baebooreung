// chatting 관련 기능 api
const VOICE = "http://k7c207.p.ssafy.io:5000/";
const STT = "speechtotext-service/";
const CHAT = "https://k7c207.p.ssafy.io:8080/api/chat/";

const chat = {
  findAllRooms: () => CHAT + "rooms/", //모든 방 출력
  createRoom: () => CHAT + "room/", // 방 만들기
  findRoom: () => CHAT + "room/", // 이름으로 방 찾기
  updateSubscribeInfo: () => CHAT + "room/update/subscribe/", // 구독 정보 true로 변경
  updateEnterInfo: () => CHAT + "room/update/enter/", // 입장 정보 true로 변경
  exitRoom: () => CHAT + "room/delete/", // 방 나가기
  getInfo: () => CHAT + "room/user/info/", //해당 유저의 구독, 입장 정보 확인
  invite: () => CHAT + "room/user/add/", //다른 유저를 채팅방에 초대
};

//음성호출 관련 기능
const voice = {
  speechToText: () => VOICE + STT + "stt",
};

// user 관련 기능 api
const BASE_URL = "https://k7c207.p.ssafy.io:8000/";
const USER_SERVICE = "user-service/";
const user_service = {
  login: () => BASE_URL + USER_SERVICE + "login", // 로그인
  join: () => BASE_URL + USER_SERVICE + "join", // 회원가입
  authdriver: () => BASE_URL + USER_SERVICE + "authdriver/", // 관리자 드라이버 인증
  getUserInfo: () => BASE_URL + USER_SERVICE + "user/", // 사용자 정보 요청
  getAllUser: () => BASE_URL + USER_SERVICE + "users", // 전체 사용자 정보 출력
  // profile: () => BASE_URL + USER_SERVICE + 'save/profile/', // 프로필 사진 수정
  getProfile: () => BASE_URL + USER_SERVICE + "user/profile/", // 프로필 이미지 조회
  saveFCMToken: () => BASE_URL + USER_SERVICE + "fcm/" + "saveToken",
};

const BUSINESS_SERVICE = "business-service/";
const business_service = {
  //<---------------------------------GET------------------------------------>
  getDriverRoute: () => BASE_URL + BUSINESS_SERVICE,
  /* 
    드라이버의 루트
    path Variable: userId,
   */
  getRoute: () => BASE_URL + BUSINESS_SERVICE + "route/",
  /* 
    루트 한개의 정보,
    path Variable: routeId
  */
  getNotDone: () => BASE_URL + BUSINESS_SERVICE + "routes/",
  /* 
    당일 완료하지 못한 루트, 
    pathVariable: userId,  
    https://k7c207.p.ssafy.io:8000/business-service/routes/{userId}/today/undone, 
  */

  // POST
  workDone: () => BASE_URL + BUSINESS_SERVICE,
  /* 
    업무완료
    path Variable: userId, routeId,
    https://k7c207.p.ssafy.io:8000/business-service/${userId}/end/{routeId},
  */
  checkIn: () => BASE_URL + BUSINESS_SERVICE + "check-in/",
  /* 
    체크인
    path Variable: userId,
    requestBody : routeId, deliveryId,
  */
  takePhoto: () => BASE_URL + BUSINESS_SERVICE + "photo",
  // 사진 찍기

  getOrderCount: () => BASE_URL + BUSINESS_SERVICE + "order/cnt/",
  //routeID 의 주문건수 API
};
const GPS_SERVICE = "gps-service/";
const gps_service = {
  getRealTimeGPS: () => BASE_URL + GPS_SERVICE + "gps/",
};

const CAMERA_SERVICE = "s3-service/";
const camera_service = {
  uploadFile: () => BASE_URL + CAMERA_SERVICE + "upload/",
  getFile: () => BASE_URL + CAMERA_SERVICE + "getProfile/",
  uploadCheckIn: () => BASE_URL + CAMERA_SERVICE + "checkIn/",
  getCheckIn: () => BASE_URL + CAMERA_SERVICE + "getCheckIn/",
};
export {
  chat,
  voice,
  user_service,
  business_service,
  gps_service,
  camera_service,
};

// chatting 관련 기능 api
const HOST = 'https://k7c207.p.ssafy.io:8080/';
const CHAT = 'chat/';

const chat = {
  findAllRooms: () => HOST + CHAT + 'rooms/',
  createRoom: () => HOST + CHAT + 'room/',
  findRoom: () => HOST + CHAT + 'room/',
};

// user 관련 기능 api
const USER_BASE_URL = 'https://k7c207.p.ssafy.io:8000/';
const USER = 'user-service/';

const user = {
  login: () => USER_BASE_URL + USER + 'login', // 로그인
  join: () => USER_BASE_URL + USER + 'join', // 회원가입
  // profile: () => USER_BASE_URL + USER + 'profile', // 프로필 사진 수정
  authdriver: () => USER_BASE_URL + USER + 'authdriver/', // 관리자가 드라이버를 인증하는 api
  getUserInfo: () => USER_BASE_URL + USER, // id값 params로 전달, 사용자 정보 출력
  getAllUser: () => USER_BASE_URL + USER + 'users', // 전체 사용자 정보 출력
};

export {chat, user};

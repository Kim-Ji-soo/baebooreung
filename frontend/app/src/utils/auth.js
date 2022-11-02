// 정규식 관련 코드
// 형식에 맞으면 true, 안맞으면 false 반환
// export로 함수 내보냄

// 이메일 체크 정규식
export function isEmail(value) {
  const regExp =
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

  return regExp.test(value);
}

//비밀번호 체크 (특수문자 포함) 8 ~ 16자 영문, 숫자, 특수문자를 최소 한가지씩 조합
export function isPassword(value) {
  const regExp =
    /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;

  return regExp.test(value);
}

// 핸드폰 번호 체크
export function isPhoneNumber(value) {
  const regExp = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;

  return regExp.test(value);
}

// id 형식 체크,  영문자로 시작하는 영문자 또는 숫자 6 ~ 20자
export function isId(value) {
  const regExp = /^[a-z]+[a-z0-9]{5,19}$/g;

  return regExp.test(value);
}

// // 한글, 영문
// export function isCorrect(value) {
//   const regExp = /^[a-zA-Zㄱ-힣][a-zA-Zㄱ-힣 ]*$/;

//   return regExp.test(value);
// }

// // 영문 대문자, 소문자, 숫자, 문자 사이 공백 및 특수문자 -_/,.
// export function isCorrect(value) {
//   const regExp = /^[a-zA-Z0-9-_/,.][a-zA-Z0-9-_/,. ]*$/;

//   return regExp.test(value);
// }

// // 영문 대문자, 소문자, 문자사이 공백
// export function isCorrect(value) {
// 	const regExp = /^[a-zA-Z][a-zA-Z ]*$/;

// 	return regExp.test(value);
// }

// // 한글만 입력
// export function isCorrect(value) {
// 	const regExp = /[ㄱ-힣]/;

// 	return regExp.test(value);
// }

// ​// 한글, 특수문자만 입력
// export function isCorrect(value) {
// 	 const regExp = /^[ㄱ-힣\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\" ]*$/;

// 	return regExp.test(value);
// }

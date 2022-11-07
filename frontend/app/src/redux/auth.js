import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  id: '',
  userId: '',
  name: '',
  accessToken: '',
  // authorization: '', // 관리자, 드라이버 인가 확인 state,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.id = action.payload.id;
      state.specialkey = action.payload.specialkey;
      state.accessToken = action.payload.accessToken;
      // state.name = action.payload.name;
      // state.authorization = action.payload.authorization;
    },
    // setId: (state, action) => {
    //   state.Id = action.Id;
    // },
    // setUserId: (state, action) => {
    //   state.specialkey = action.payload;
    // },
    // setName : (state, action) => {
    //   state.name = action.payload;
    // }
    // setAccessToken : (state, action) => {
    //   state.accessToken = action.payload;
    // },
    // setAuthorization : (state, action) => {
    //   state.authorization = action.authorization;
    // },
    // deleteUserInfo : (state) => {
    //   state.Id = '';
    //   state.userId = '';
    //   state.accessToken = '';
    //   // state.authorization = '';
    // },
  },
});

// action
export const setUserInfo = authSlice.actions.setUserInfo;

// state
export const accessToken = state => state.accessToken;
export const id = state => state.id;
// export const name = state => state.name;

// reducer
export default authSlice.reducer;

import {createSlice} from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: '',
    grade: '',
    id: '',
    name: '',
    routeList: [],
    specialKey: '',
    profile: '',
  },
  reducers: {
    setUser: (state, action) => {
      state.email = action.payload.email;
      state.grade = action.payload.grade;
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.routeList = action.payload.routeList;
      state.specialKey = action.payload.specialKey;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    logoutUser: state => {
      state.email = '';
      state.grade = '';
      state.id = '';
      state.name = '';
      state.routeList = '';
      state.specialKey = '';
    },
  },
});
export const {setUser, setProfile, logoutUser} = userSlice.actions;

export default userSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    token: "",
    email: "",
    grade: "",
    id: "",
    name: "",
    phone: "",
    routeList: [],
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload.token;
    },
    setUser: (state, action) => {
      state.email = action.payload.email;
      state.grade = action.payload.grade;
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.phone = action.payload.phone;
      state.routeList = action.payload.routeList;
    },
  },
});
export const { setToken, setUser } = userSlice.actions;

export default userSlice.reducer;

import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  lunchRoute: [
    {
      address: '',
      check: false,
      delName: '',
      delScheduledTime: '',
      id: '',
      latitude: '',
      longitude: '',
      orderNum: '',
      sequence: '',
      type: '',
    },
  ],
  dinnerRoute: [
    {
      address: '',
      check: false,
      delName: '',
      delScheduledTime: '',
      id: '',
      latitude: '',
      longitude: '',
      orderNum: '',
      sequence: '',
      type: '',
    },
  ],
  lunchRouteId: -1,
  lunchRouteName: '',
  lunchRouteType: '',
  lunchDone: false,
  lunchDate: '',
  lunchScheduledStartTime: '',
  dinnerRouteId: -1,
  dinnerRouteName: '',
  dinnerRouteType: '',
  dinnerDone: false,
  dinnerDate: '',
  dinnerScheduledStartTime: '',
  lunchActualStartTime: null,
  dinnerActualStartTime: null,
  workDone: false,
};
const workSlice = createSlice({
  name: 'work',
  initialState,
  reducers: {
    setDinnerActualStartTime: (state, action) => {
      state.dinnerActualStartTime = action.payload;
    },
    setLunchActualStartTime: (state, action) => {
      state.lunchActualStartTime = action.payload;
    },
    setLunchDone: (state, action) => {
      state.lunchDone = action.payload;
    },
    setDinnerDone: (state, action) => {
      state.dinnerDone = action.payload;
    },
    setWorkDone: (state, action) => {
      state.workDone = action.payload;
    },
    setLunchIsCheckIn: (state, action) => {
      state.lunchRoute[action.payload.index].check = action.payload.check;
    }, // ({index: sequece - 1, check: true})
    setDinnerIsCheckIn: (state, action) => {
      state.DinnerRoute[action.payload.index].check = action.payload.check;
    }, // ({index: sequece - 1, check: true})
    setLunchRoute: (state, action) => {
      state.lunchRoute = action.payload;
    },
    setDinnerRoute: (state, action) => {
      state.dinnerRoute = action.payload;
    },
    setLunchRouteInfo: (state, action) => {
      state.lunchRouteId = action.payload.id;
      state.lunchRouteType = action.payload.routeType;
      state.lunchDone = action.payload.done;
      state.lunchRouteName = action.payload.routeName;
      state.lunchDate = action.payload.date;
      state.lunchScheduledStartTime = action.payload.scheduledStartTime;
    },
    setDinnerRouteInfo: (state, action) => {
      state.dinnerRouteId = action.payload.id;
      state.dinnerRouteType = action.payload.routeType;
      state.dinnerDone = action.payload.done;
      state.dinnerRouteName = action.payload.routeName;
      state.dinnerDate = action.payload.date;
      state.dinnerScheduledStartTime = action.payload.scheduledStartTime;
    },
  },
});
// actions
export const {
  setLunchRoute,
  setDinnerRoute,
  setLunchRouteInfo,
  setDinnerRouteInfo,
  setDinnerActualStartTime,
  setLunchActualStartTime,
  setDinnerDone,
  setLunchDone,
} = workSlice.actions;
// state
export const lunchRoute = state => state.lunchRoute;
export const dinnerRoute = state => state.dinnerRoute;
export const lunchRouteId = state => state.lunchRouteId;
export const lunchRouteType = state => state.lunchRouteType;
export const lunchDone = state => state.lunchDone;
export const lunchRouteName = state => state.lunchRouteName;
export const lunchDate = state => state.lunchDate;
export const lunchScheduledStartTime = state => state.lunchScheduledStartTime;
export const dinnerRouteId = state => state.dinnerRouteId;
export const dinnerRouteType = state => state.dinnerRouteType;
export const dinnerDone = state => state.dinnerDone;
export const dinnerRouteName = state => state.dinnerRouteName;
export const dinnerDate = state => state.dinnerDate;
export const dinnerScheduledStartTime = state => state.dinnerScheduledStartTime;
export const dinnerActualStartTime = state => state.dinnerActualStartTime;
export const lunchActualStartTime = state => state.lunchActualStartTime;
export default workSlice.reducer;

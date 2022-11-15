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
  lunchRouteId: '',
  lunchRouteName: '',
  lunchRouteType: '',
  lunchDone: false,
  lunchDate: '',
  lunchScheduledStartTime: '',
  dinnerRouteId: '',
  dinnerRouteName: '',
  dinnerRouteType: '',
  dinnerDone: false,
  dinnerDate: '',
  dinnerScheduledStartTime: '',
};
const workSlice = createSlice({
  name: 'work',
  initialState,
  reducers: {
    setLunchRoute: (state, action) => {
      state.lunchRoute = action.payload;
    },
    setDinnerRoute: (state, action) => {
      state.dinnerRoute = action.payload;
    },
    setLunchRouteInfo: (state, action) => {
      state.lunchRouteId = action.payload.routeId;
      state.lunchRouteType = action.payload.routeType;
      state.lunchDone = action.payload.done;
      state.lunchRouteName = action.payload.routeName;
      state.lunchDate = action.payload.date;
      state.lunchScheduledStartTime = action.payload.scheduledStartTime;
    },
    setDinnerRouteInfo: (state, action) => {
      state.dinnerRouteId = action.payload.routeId;
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
export default workSlice.reducer;

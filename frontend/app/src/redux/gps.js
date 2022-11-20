import {createSlice} from '@reduxjs/toolkit';

export const gpsSlice = createSlice({
  name: 'gps',
  initialState: {
    lat: 0,
    lng: 0,
    watchId: 0,
  },
  reducers: {
    setLat: (state, action) => {
      state.lat = action.payload;
    },
    setLng: (state, action) => {
      state.lng = action.payload;
    },
    setWatchId: (state, action) => {
      state.watchId = action.payload;
    },
  },
});

export const {setLat, setLng, setWatchId} = gpsSlice.actions;
export const lat = state => state.lat;
export const lng = state => state.lng;
export const watchId = state => state.watchId;
export default gpsSlice.reducer;

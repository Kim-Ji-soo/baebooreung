import { createSlice } from "@reduxjs/toolkit";

export const gpsSlice = createSlice({
    name : "user",
    initialState : {
        lat : "",
        lng : "",
    },
    reducers : {
        setGps : (state, action) =>{
            state.lat = action.payload.lat;
            state.lng = action.payload.lng;
        }
    }
});

export const {setGps} = gpsSlice.actions;
export default gpsSlice.reducer;
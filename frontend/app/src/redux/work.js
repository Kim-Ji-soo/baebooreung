import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  driverRouteList: '',
};
const workSlice = createSlice({
  name: 'work',
  initialState,
  reducers: {
    setDriverRouteList: (state, action) => {
      state.driverRouteList = action.payload;
    },
  },
});
// actions
export const setDriverRouteList = workSlice.actions.setDriverRouteList;
// state
export const driverRouteList = state => state.driverRouteList;

export default workSlice.reducer;

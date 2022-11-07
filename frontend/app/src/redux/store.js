import {configureStore, combineReducers} from '@reduxjs/toolkit';
import userReducer from './user';
import gpsReducer from './gps';
import authReducer from './auth';

const rootReducer = combineReducers({
  user: userReducer,
  gps: gpsReducer,
  auth: authReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;

import {configureStore, combineReducers} from '@reduxjs/toolkit';
import userReducer from './user';
import gpsReducer from './gps';
import authReducer from './auth';
import userListReducer from './userList';
import workReducer from './work';

const rootReducer = combineReducers({
  user: userReducer,
  gps: gpsReducer,
  auth: authReducer,
  userList: userListReducer,
  work: workReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;

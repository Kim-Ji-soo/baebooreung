import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user";
import userListReducer from "./userList";

const rootReducer = combineReducers({
  user: userReducer,
  userList: userListReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;

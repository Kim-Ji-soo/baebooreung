import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user";
import gpsReducer from "./gps";

const rootReducer = combineReducers({
    user : userReducer,
    gps : gpsReducer,
});

const store = configureStore({
    reducer : rootReducer,
});

export default store;
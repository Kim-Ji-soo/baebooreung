import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./mainpagesub/MainPage";
import Login from "./loginpage/login";
import TestPage2 from "./mainpagesub/testpage2"
import { useSelector } from "react-redux";

function App() {
  const userInfo = useSelector((state) => state.user);
  return (
    <div className="App" style={{ height: "100%", width: "100%" }}>
      <BrowserRouter style={{ height: "100%", width: "100%" }}>
        {userInfo.token !== "" && (
          <Routes style={{ height: "100%", width: "100%" }}>
            <Route path="/*" element={<MainPage />} />
          </Routes>
        )}
        {userInfo.token === "" && (
          <Routes style={{ height: "100%", width: "100%" }}>
            <Route path="/test" element={<TestPage2 />} />
            <Route path="*" element={<Login />} />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}
export default App;

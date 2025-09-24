import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./components/LoginModal";
import SignupPage from "../src/components/SignUp"
import FirstPage from "./components/FirstPage";
import MainPage from "./components/MainPage";
import Header from "./components/Header";
function App() {
  return (
    <Router>
    <Header/>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/Mainpage" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;

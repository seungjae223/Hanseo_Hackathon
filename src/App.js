// src/App.js
import React from "react";
import "./App.css";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Lazy, { LazyBoundary } from "./components/common/LazyLoading";

function App() {
  return (
    <Router>
      <LazyBoundary>
        {/* 공통 헤더 */}
        <Lazy.Header />

        <Routes>
          <Route path="/" element={<Lazy.FirstPage />} />
          <Route path="/login" element={<Lazy.LoginModal />} />
          <Route path="/signup" element={<Lazy.SignUpModal />} />
          <Route path="/Mainpage" element={<Lazy.MainPage />} />
          <Route path="/recruit/:id" element={<Lazy.RecruitDetail />} />

          {/* 존재하지 않는 경로 → 홈으로 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LazyBoundary>
    </Router>
  );
}

export default App;

// src/App.js
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
          {/* 보호 라우트가 필요하면 아래 참고
          <Route
            path="/protected"
            element={
              <Lazy.AuthBlurGate isAuthed={true} isVerified={true}>
                <Lazy.ProtectedPage />
              </Lazy.AuthBlurGate>
            }
          />
          */}
        </Routes>
      </LazyBoundary>
    </Router>
  );
}

export default App;

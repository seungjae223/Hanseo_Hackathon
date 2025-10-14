// src/App.js
import React from "react";
import "./App.css";
import { ToastProvider } from "./components/Toast";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Lazy, { LazyBoundary } from "./components/common/LazyLoading";
import BaseLayout from "./components/BaseLayout";
import "./components/FooterNav";

function App() {
  return (
    <Router>
      <LazyBoundary>
        {/* 공통 헤더 */}
        <Lazy.Header />

        <ToastProvider>
          <Routes>
            {/* 공통 레이아웃: BaseLayout 안에서 푸터 표시/숨김을 판단 */}
            <Route element={<BaseLayout />}>
              {/* 메인 계열 (푸터 숨김) */}
              <Route path="/" element={<Lazy.FirstPage />} />
              <Route path="/Mainpage" element={<Lazy.MainPage />} />

              {/* 푸터 표시 대상 */}
              <Route path="/TeamManage" element={<Lazy.TeamManagePanel />} />
              <Route path="/Recruit" element={<Lazy.RecruitListPanel />} />
              <Route path="/Matching" element={<Lazy.Matching />} />

              {/* 상세 페이지들 */}
              <Route path="/recruit/:id" element={<Lazy.RecruitDetail />} />
              {/* ✅ 추가: 팀원 상세 페이지 */}
              <Route path="/team/:id" element={<Lazy.TeamMemberDetail />} />
            </Route>

            {/* 레이아웃 밖: 푸터 없음 */}
            <Route path="/login" element={<Lazy.LoginModal />} />
            <Route path="/signup" element={<Lazy.SignUpModal />} />

            {/* 존재하지 않는 경로 → 홈으로 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </LazyBoundary>
    </Router>
  );
}

export default App;

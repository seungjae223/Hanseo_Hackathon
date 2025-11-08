// src/App.js
import React from "react";
import "./App.css";
import { ToastProvider } from "./components/Toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Lazy, { LazyBoundary } from "./components/common/LazyLoading";
import BaseLayout from "./components/BaseLayout";

import "./components/FooterNav";

/* 라우팅+헤더 제어를 위해 내부 컴포넌트로 분리 */
function AppRoutes() {
  const location = useLocation();

  // ✅ 마이페이지에서만 헤더/푸터 감추기
  const hideChrome = location.pathname === "/mypage";

  return (
    <LazyBoundary>
      {/* 헤더: /mypage에서는 표시하지 않음 */}
      {!hideChrome && <Lazy.Header />}

      <ToastProvider>
        <Routes>
          {/* 공통 레이아웃(푸터 포함): /mypage 제외 */}
          <Route element={<BaseLayout />}>
            {/* 메인 계열 (푸터 숨김은 BaseLayout 내부 로직에 따름) */}
            <Route path="/" element={<Lazy.FirstPage />} />
            <Route path="/Mainpage" element={<Lazy.MainPage />} />

            {/* 푸터 표시 대상 */}
            <Route path="/TeamManage" element={<Lazy.TeamManagePanel />} />
            <Route path="/Recruit" element={<Lazy.RecruitListPanel />} />
            <Route path="/Matching" element={<Lazy.Matching />} />

            {/* 상세 페이지들 */}
            <Route path="/recruit/:id" element={<Lazy.RecruitDetail />} />
            <Route path="/team/:id" element={<Lazy.TeamMemberDetail />} />
          </Route>

          {/* 레이아웃 밖: 헤더/푸터 없음 */}
          <Route path="/login" element={<Lazy.LoginModal />} />
          <Route path="/signup" element={<Lazy.SignUpModal />} />
          {/* ✅ 마이페이지: 헤더/푸터 모두 없음 */}
          <Route path="/mypage" element={<Lazy.MyPage />} />

          {/* 존재하지 않는 경로 → 홈으로 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </LazyBoundary>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

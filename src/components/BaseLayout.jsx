// src/components/BaseLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import FooterNav from "./FooterNav";

export default function BaseLayout() {
  const { pathname } = useLocation();

  // 메인(/, /Mainpage)에서는 푸터 숨김
const hideFooter = false; // ★임시: 어디서나 푸터 보이게


  // 활성 탭 계산(필요한 페이지만 지정)
  let active = "home";
  if (pathname.startsWith("/TeamManage")) active = "team";
  else if (pathname.startsWith("/Recruit")) active = "recruit";
  else if (pathname.startsWith("/Matching")) active = "matching";

  // 디버그 점: 레이아웃이 렌더되는지 확인 (보이면 BaseLayout은 정상 마운트)
  // 필요 없으면 삭제하세요.
  const DebugDot = (
    <div
      style={{
        position: "fixed",
        right: 6,
        bottom: 6,
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: hideFooter ? "lime" : "red",
        zIndex: 2147483647,
      }}
    />
  );

  return (
    <>
      <main className={hideFooter ? "" : "page-with-footer"}>
        <Outlet />
      </main>

      {!hideFooter && <FooterNav active={active} />}

      {DebugDot}
    </>
  );
}

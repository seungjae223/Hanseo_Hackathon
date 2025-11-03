// src/components/BaseLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import FooterNav from "./FooterNav";

export default function BaseLayout() {
  const { pathname } = useLocation();

  // 메인(/, /Mainpage)에서는 푸터 숨김
  const hideFooter = pathname === "/" || pathname === "/Mainpage";

  // 스크롤 보장
  React.useEffect(() => {
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
    document.body.style.overflowY = "scroll";
    document.documentElement.style.overflow = "auto";
    document.documentElement.style.height = "auto";
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.body.style.overflowY = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
    };
  }, []);


  // 활성 탭 계산(필요한 페이지만 지정)
  let active = "home";
  if (pathname.startsWith("/TeamManage") || pathname.startsWith("/team/")) active = "team";
  else if (pathname.startsWith("/Recruit")) active = "recruit";
  else if (pathname.startsWith("/Matching")) active = "matching";

  return (
    <div style={{ display: "flex", flexDirection: "column", position: "relative", minHeight: "100vh" }}>
      <main style={{ flex: 1, paddingBottom: !hideFooter ? "120px" : "0" }}>
        <Outlet />
      </main>

      {!hideFooter && <FooterNav active={active} />}
    </div>
  );
}

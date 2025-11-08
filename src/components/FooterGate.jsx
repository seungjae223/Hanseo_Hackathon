// src/components/FooterGate.jsx
import React from "react";
import { useLocation, matchPath } from "react-router-dom";
import FooterNav from "../FooterNav";

export default function FooterGate() {
  const { pathname } = useLocation();

  // 메인페이지에서는 표시 안 함
  if (matchPath("/Mainpage", pathname)) return null;

  // 어떤 탭이 활성인지 판단
  let active = "home";
  if (matchPath("/TeamManage/*", pathname) || matchPath("/TeamManage", pathname)) active = "team";
  else if (matchPath("/Recruit/*", pathname) || matchPath("/Recruit", pathname)) active = "recruit";
  else if (matchPath("/Matching/*", pathname) || matchPath("/Matching", pathname)) active = "matching";

  return <FooterNav active={active} />;
}

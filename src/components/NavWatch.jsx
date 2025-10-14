// src/components/NavWatch.jsx (새 파일)
import React from "react";
import { useLocation } from "react-router-dom";

export default function NavWatch() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    console.log("[NavWatch]", pathname);
    if (pathname === "/Mainpage") {
      console.warn("[NavWatch] Forced to /Mainpage");
      console.trace(); // ★여기에 범인(파일/줄) 표시
    }
  }, [pathname]);
  return null;
}

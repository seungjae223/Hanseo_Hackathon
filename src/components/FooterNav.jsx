// src/components/FooterNav.jsx
import React from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import styles from "../css/FooterNav.module.css";

import HomeIcon from "../assets/home.png";
import TeamIcon from "../assets/team.png";
import RecruitIcon from "../assets/Recruit.png";   // 실제 파일명 대소문자 반드시 일치
import MatchingIcon from "../assets/matching.png";

// 현재 해시 -> 경로 추출
function getPathFromHash() {
  const h = window.location.hash || "";
  const q = h.indexOf("?");
  const pure = q >= 0 ? h.slice(0, q) : h;
  return pure.replace(/^#/, "") || "/";
}

function FooterNavInner() {
  const [path, setPath] = React.useState(getPathFromHash());

  React.useEffect(() => {
    const onHash = () => setPath(getPathFromHash());
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onHash);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("popstate", onHash);
    };
  }, []);

  // 메인페이지와 첫 페이지에서만 숨김
  const hide =
    path === "/" ||
    path === "/Mainpage";

  /* ✅ 스크롤 '막힘'처럼 보이지 않도록: 푸터 표시 시 body에 하단 패딩 부여 */
  React.useEffect(() => {
    // footer 높이: CSS .footer { height: 140px; } 와 동일하게 맞춤
    const PAD = "140px";
    const prev = document.body.style.paddingBottom;
    if (!hide) {
      // 푸터가 보일 때만 패딩 추가
      document.body.style.paddingBottom = PAD;
    } else {
      // 푸터 숨김이면 원복
      document.body.style.paddingBottom = "";
    }
    return () => {
      // 컴포넌트 언마운트 시 원복
      document.body.style.paddingBottom = prev;
    };
  }, [hide]);

  /* (보조 안전장치) 다른 컴포넌트가 body overflow를 잠궜다면 풀기 */
  React.useEffect(() => {
    try {
      const cur = getComputedStyle(document.body).overflow;
      if (cur === "hidden") document.body.style.overflow = "";
    } catch {}
  }, []);

  if (hide) return null;

  let active = "home";
  if (path.startsWith("/TeamManage")) active = "team";
  else if (path.startsWith("/Recruit")) active = "recruit";
  else if (path.startsWith("/Matching")) active = "matching";

  const go = (to) => {
    const target = `#${to}`;
    if (window.location.hash !== target) window.location.hash = target;
  };

  const items = [
    { key: "home",     label: "홈",     icon: HomeIcon,     to: "/Mainpage" },
    { key: "team",     label: "팀관리", icon: TeamIcon,     to: "/TeamManage" },
    { key: "recruit",  label: "모집",   icon: RecruitIcon,  to: "/Recruit" },
    { key: "matching", label: "매칭",   icon: MatchingIcon, to: "/Matching" },
  ];

  const portalHost = document.getElementById("footer-root") || document.body;

  const view = (
    <nav className={styles.footer} aria-label="하단 네비게이션">
      <ul className={styles.grid}>
        {items.map((it) => (
          <li key={it.key} className={styles.item}>
            <button
              type="button"
              className={`${styles.bubble} ${active === it.key ? styles.active : ""}`}
              onClick={() => go(it.to)}
            >
              <img src={it.icon} alt="" className={styles.icon} />
            </button>
            <span className={`${styles.label} ${active === it.key ? (styles.labelActive || "") : ""}`}>
              {it.label}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );

  return createPortal(view, portalHost);
}

export default function FooterNav() {
  return <FooterNavInner />;
}

/* 자동 마운트: 이 파일이 import 되기만 하면 body에 독립 루트로 렌더 */
if (typeof window !== "undefined" && !window.__FOOTER_AUTO_MOUNTED__) {
  window.__FOOTER_AUTO_MOUNTED__ = true;
  const mountId = "footer-auto-root";
  let el = document.getElementById(mountId);
  if (!el) {
    el = document.createElement("div");
    el.id = mountId;
    document.body.appendChild(el);
  }
  const root = createRoot(el);
  root.render(<FooterNavInner />);
  if (typeof window !== "undefined") {
  const dot = document.createElement("div");
  Object.assign(dot.style, {position:"fixed", right:"6px", bottom:"6px", width:"6px", height:"6px", borderRadius:"50%", background:"lime", zIndex:9999999});
  document.body.appendChild(dot);
}
}
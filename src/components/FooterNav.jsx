// src/components/FooterNav.jsx
import React from "react";
import styles from "../css/FooterNav.module.css";

import HomeIcon from "../assets/home.png";
import TeamIcon from "../assets/team.png";
import RecruitIcon from "../assets/Recruit.png"; // 실제 파일명 대소문자 반드시 일치
import MatchingIcon from "../assets/matching.png";

function FooterNavInner({ active }) {
  // active prop을 사용하거나 기본값 설정
  const currentActive = active || "home";

  const go = (to) => {
    window.location.href = to;
  };

  const items = [
    { key: "home",     label: "홈",     icon: HomeIcon,     to: "/Mainpage" },
    { key: "team",     label: "팀관리", icon: TeamIcon,     to: "/TeamManage" },
    { key: "recruit",  label: "모집",   icon: RecruitIcon,  to: "/Recruit" },
    { key: "matching", label: "매칭",   icon: MatchingIcon, to: "/Matching" },
  ];

  return (
    <nav className={styles.footer} aria-label="하단 네비게이션">
      <ul className={styles.grid}>
        {items.map((it) => {
          const isActive = currentActive === it.key;
          return (
            <li
              key={it.key}
              className={`${styles.item} ${isActive ? styles.active : styles.inactive}`}
            >
              <button
                type="button"
                className={styles.itemButton}
                onClick={() => go(it.to)}
              >
                <div className={styles.bubble}>
                  <img src={it.icon} alt="" className={styles.icon} />
                </div>
                <span className={styles.label}>{it.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function FooterNav({ active }) {
  return <FooterNavInner active={active} />;
}

import React from "react";
import styles from "../css/Header.module.css";

/* 이미지 */
import Logo from "../assets/작당모의.png";
import LoginBtnImg from "../assets/로그인.png";

export default function Header({ onLoginClick }) {
  return (
    <header className={styles.header}>
      {/* 좌측 로고 */}
      <div className={styles.logoWrap}>
        <img src={Logo} alt="작당모의 로고" className={styles.logo} />
      </div>

      {/* 우측 버튼들 */}
      <div className={styles.rightMenu}>
        <button className={styles.loginBtn} onClick={onLoginClick}>
          <img src={LoginBtnImg} alt="로그인" />
        </button>
        <span className={styles.mypage}>마이페이지</span>
      </div>
    </header>
  );
}

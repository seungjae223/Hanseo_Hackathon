import React, { useState } from "react";
import styles from "../css/Header.module.css";

/* 이미지 */
import Logo from "../assets/작당모의.png";
import LoginBtnImg from "../assets/로그인.png";

/* 모달들 */
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <header className={styles.header}>
      {/* 좌측 로고 */}
      <div className={styles.logoWrap}>
        <img src={Logo} alt="작당모의 로고" className={styles.logo} />
      </div>

      {/* 우측 버튼들 */}
      <div className={styles.rightMenu}>
        <button
          className={styles.loginBtn}
          onClick={() => setShowLogin(true)}
        >
          <img src={LoginBtnImg} alt="로그인" className="Login-img" />
        </button>
        <span className={styles.mypage}>마이페이지</span>
      </div>

      {/* 로그인 모달 */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSignUpClick={() => {
            setShowLogin(false);
            setShowSignUp(true);
          }}
        />
      )}

      {/* 회원가입 모달 */}
      {showSignUp && (
        <SignUpModal
          onClose={() => setShowSignUp(false)}
        />
      )}
    </header>
  );
}

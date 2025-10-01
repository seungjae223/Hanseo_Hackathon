import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../css/Header.module.css";
import Logo from "../assets/작당모의.png";
import LoginBtnImg from "../assets/로그인.png";

/* 모달 컴포넌트 */
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import FindPasswordModal from "../components/FindpassWordModal"; 

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showFindPassword, setShowFindPassword] = useState(false); 

  return (
    <header className={styles.header}>
      {/* 좌측 로고 */}
     <div className={styles.logoWrap}>
  <Link to="/Mainpage" aria-label="메인으로 이동">
    <img src={Logo} alt="작당모의 로고" className={styles.logo} />
  </Link>
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
          onFindPasswordClick={() => {
            setShowLogin(false);
            setShowFindPassword(true);
          }}
        />
      )}

      {/* 회원가입 모달 */}
      {showSignUp && (
        <SignUpModal
          onClose={() => setShowSignUp(false)}
        />
      )}

      {/* 비밀번호 찾기 모달 */}
      {showFindPassword && (
        <FindPasswordModal
          onClose={() => setShowFindPassword(false)}
        />
      )}
    </header>
  );
}

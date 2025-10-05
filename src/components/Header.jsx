// src/components/Header.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  // 로고 클릭 애니메이션 상태
  const [logoAnimating, setLogoAnimating] = useState(false);

  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (logoAnimating) return; // 연타 방지
    setLogoAnimating(true);

    const DURATION = 320; // 아래 keyframes pop-bounce와 동일
    setTimeout(() => {
      navigate("/Mainpage", { state: { reset: Date.now() } });
      setLogoAnimating(false);
    }, DURATION);
  };

  return (
    <header className={styles.header}>
      {/* 컴포넌트 내부에 애니메이션 스타일 주입 (다른 파일 수정 없이 적용) */}
      <style>{`
        @keyframes pop-bounce {
          0%   { transform: scale(1) rotate(0deg); }
          35%  { transform: scale(0.92) rotate(-1.5deg); }
          65%  { transform: scale(1.08) rotate(0.6deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .__logoBtnReset {
          background: none; border: 0; padding: 0; cursor: pointer;
          display: inline-flex; align-items: center;
        }
        .__logoBounce {
          animation: pop-bounce .32s ease-out both;
        }
      `}</style>

      {/* 좌측 로고 */}
      <div className={styles.logoWrap}>
        <button
          type="button"
          aria-label="메인으로 이동"
          onClick={handleLogoClick}
          className="__logoBtnReset"
          disabled={logoAnimating}
          aria-busy={logoAnimating}
        >
          <img
            src={Logo}
            alt="작당모의 로고"
            className={`${styles.logo} ${logoAnimating ? "__logoBounce" : ""}`}
          />
        </button>
      </div>

      {/* 우측 버튼들 */}
      <div className={styles.rightMenu}>
        <button className={styles.loginBtn} onClick={() => setShowLogin(true)}>
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
      {showSignUp && <SignUpModal onClose={() => setShowSignUp(false)} />}

      {/* 비밀번호 찾기 모달 */}
      {showFindPassword && (
        <FindPasswordModal onClose={() => setShowFindPassword(false)} />
      )}
    </header>
  );
}

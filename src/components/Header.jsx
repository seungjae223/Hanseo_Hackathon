// src/components/Header.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ useLocation 추가
import styles from "../css/Header.module.css";
import Logo from "../assets/작당모의.png";
import LoginBtnImg from "../assets/로그인.png";

/* 모달 컴포넌트 */
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import FindPasswordModal from "../components/FindpassWordModal";

/* 아바타 기본/옵션 이미지 */
import AvtBear from "../assets/캐릭터.png";
import AvtCat from "../assets/캐릭터2.png";
import AvtBunny from "../assets/캐릭터3.png";

const AVATAR_SRC = {
  bear: AvtBear,
  cat: AvtCat,
  bunny: AvtBunny,
};

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showFindPassword, setShowFindPassword] = useState(false);

  // 로고 클릭 애니메이션 상태
  const [logoAnimating, setLogoAnimating] = useState(false);

  // 헤더 아바타 상태
  const [avatarKey, setAvatarKey] = useState(
    localStorage.getItem("profileAvatar") || ""
  );

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pathLower = pathname.toLowerCase();

  // ✅ MyPage, TeamApply 에서는 헤더 숨기기
  const hideHeader =
    pathLower.startsWith("/mypage") || pathLower.startsWith("/teamapply");

  // 마이페이지에서 선택 후 헤더 즉시 반영 (커스텀 이벤트 & storage 변화 둘 다 수신)
  useEffect(() => {
    const onAvatarChange = () =>
      setAvatarKey(localStorage.getItem("profileAvatar") || "");
    window.addEventListener("avatarChange", onAvatarChange);
    window.addEventListener("storage", onAvatarChange);
    return () => {
      window.removeEventListener("avatarChange", onAvatarChange);
      window.removeEventListener("storage", onAvatarChange);
    };
  }, []);

  const handleLogoClick = () => {
    if (logoAnimating) return; // 연타 방지
    setLogoAnimating(true);
    const DURATION = 320;
    setTimeout(() => {
      navigate("/Mainpage", { state: { reset: Date.now() } });
      setLogoAnimating(false);
    }, DURATION);
  };

  const goMyPage = () => navigate("/mypage");

  const avatarUrl = AVATAR_SRC[avatarKey];

  // ✅ Hooks 다 호출한 뒤에 헤더 숨김 처리
  if (hideHeader) {
    return null;
  }

  return (
    <header className={styles.header}>
      {/* 내부 애니메이션 스타일 */}
      <style>{`
        @keyframes pop-bounce {
          0%   { transform: scale(1) rotate(0deg); }
          35%  { transform: scale(0.92) rotate(-1.5deg); }
          65%  { transform: scale(1.08) rotate(0.6deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .__logoBtnReset{background:none;border:0;padding:0;cursor:pointer;display:inline-flex;align-items:center;}
        .__logoBounce{animation: pop-bounce .32s ease-out both;}
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
            className={`${styles.logo} ${
              logoAnimating ? "__logoBounce" : ""
            }`}
          />
        </button>
      </div>

      {/* 우측 메뉴: 로그인 버튼 + 마이페이지 아바타 원형 버튼 */}
      <div className={styles.rightMenu}>
        <button
          className={styles.loginBtn}
          onClick={() => setShowLogin(true)}
        >
          <img src={LoginBtnImg} alt="로그인" className="Login-img" />
        </button>

        <button
          type="button"
          className={styles.mypageBtn}
          aria-label="마이페이지로 이동"
          onClick={goMyPage}
          style={avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : undefined}
        />
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

      {/* 회원가입/비번 찾기 모달 */}
      {showSignUp && <SignUpModal onClose={() => setShowSignUp(false)} />}
      {showFindPassword && (
        <FindPasswordModal onClose={() => setShowFindPassword(false)} />
      )}
    </header>
  );
}

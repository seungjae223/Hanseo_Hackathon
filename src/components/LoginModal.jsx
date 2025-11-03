import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/LoginModal.module.css";
import Logo from "../assets/작당모의.png";
import { apiFetch } from "./utils/api";

export default function LoginModal({ onClose, onSignUpClick, onFindPasswordClick }) {
  const navigate = useNavigate();

  // ✅ 로그인 입력/상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOverlayClose = () => {
    if (onClose) return onClose();
    try { navigate("..", { replace: true }); } catch (e) {}
  };

  const goSignup = () => {
    if (onSignUpClick) return onSignUpClick();
    navigate("signup", { replace: true });
  };

  const goForgot = () => {
    if (onFindPasswordClick) return onFindPasswordClick();
    navigate("forgot", { replace: true });
  };

  // ✅ 폼 제출: /api/login 연동
  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setErr("");

    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return setErr("웹메일을 입력해주세요.");
    if (!password) return setErr("비밀번호를 입력해주세요.");

    // 학교 도메인 자동 보정
    const normEmail = trimmed.includes("@")
      ? trimmed
      : `${trimmed}@office.hanseo.ac.kr`;

    try {
      setLoading(true);
      const data = await apiFetch("/api/login", {
        method: "POST",
        auth: false, // ✅ 공개 엔드포인트: Authorization 헤더 제거
        body: { email: normEmail, password },
      });

      // ✅ 토큰/유저 저장 (명세서 변형 대비 다 받아줌)
      const accessToken =
        data?.accessToken || data?.token || data?.access_token;
      const refreshToken = data?.refreshToken || data?.refresh_token;
      const user = data?.user || data?.profile || null;

      if (accessToken) localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      if (user) localStorage.setItem("currentUser", JSON.stringify(user));

      // 성공 UX: 모달 닫거나 상위로 이동
      if (onClose) onClose();
      try { navigate("..", { replace: true }); } catch (e) {}
    } catch (e) {
      setErr(e?.message || "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || !email || !password;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 로고 */}
        <div className={styles.logoWrap}>
          <img src={Logo} alt="작당모의" className={styles.Modal_logo} />
        </div>

        {/* ✅ 폼으로 감싸 브라우저 경고 제거 & Enter 제출 지원 */}
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>한서대학교 웹메일</label>
            <input
              type="email"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {/* 에러 메시지 */}
          {err && <p className={styles.errorText}>{err}</p>}

          {/* 로그인 버튼 */}
          <button
            className={styles.loginBtn}
            type="submit"
            disabled={disabled}
            aria-busy={loading ? "true" : "false"}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* 회원가입 / 비밀번호 찾기 */}
        <div className={styles.links}>
          <span onClick={goSignup} style={{ cursor: "pointer" }}>
            회원가입
          </span>
          {" / "}
          <span onClick={goForgot} style={{ cursor: "pointer" }}>
            비밀번호 찾기
          </span>
        </div>
      </div>
    </div>
  );
}

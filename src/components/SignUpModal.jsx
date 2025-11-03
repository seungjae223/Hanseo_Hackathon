import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/SignUpModal.module.css";
import BackIcon from "../assets/Chevron Right Small.png"; // ← 아이콘
import EmailVerifyModal from "./EmailVerifyModal";
import { apiFetch } from "./utils/api.js"; // ← 여기 경로 수정!

export default function SignUpModal({ onClose, onOpenLogin }) {
  const navigate = useNavigate();

  // ✅ 1단계: 이메일 인증 결과 (이메일 + 인증코드 저장)
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // ✅ 2단계: 회원가입 폼
  const [form, setForm] = useState({
    name: "",
    nickname: "",
    grade: "",
    department: "",
    password: "",
    passwordConfirm: "",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ← 왼쪽 화살표: 우선 콜백이 있으면 사용, 없으면 /Mainpage의 인덱스(로그인 모달)로 이동
  const handleBackToLogin = () => {
    if (typeof onOpenLogin === "function") return onOpenLogin();
    if (typeof onClose === "function") return onClose(); // 단독 모달로 쓸 때 닫기용
    try {
      navigate("..", { replace: true }); // /Mainpage/signup → .. = /Mainpage
    } catch {}
  };

  const handleSubmit = async () => {
    setErr("");

    // 간단 유효성
    if (!verifiedEmail || !verificationCode) {
      return setErr("이메일 인증을 먼저 완료해주세요.");
    }
    if (!form.password || form.password.length < 8) {
      return setErr("비밀번호를 8자 이상 입력하세요.");
    }
    if (form.password !== form.passwordConfirm) {
      return setErr("비밀번호 확인이 일치하지 않습니다.");
    }
    if (!form.name || !form.nickname || !form.grade || !form.department) {
      return setErr("모든 필드를 입력해주세요.");
    }

    // 백엔드 명세에 맞춰 payload 구성
    const payload = {
      email: verifiedEmail,
      password: form.password,
      username: form.name, // ← 백엔드: username = 이름
      nickname: form.nickname,
      grade: form.grade,
      department: form.department,
      verificationCode, // ← 이메일 인증 단계에서 받은 코드
    };

    try {
      setLoading(true);
      await apiFetch("/api/signup", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // 가입 성공 UX: 로그인 모달로 보내기
      alert("회원가입이 완료되었습니다. 로그인 해주세요.");
      if (typeof onOpenLogin === "function") return onOpenLogin();
      if (typeof onClose === "function") onClose();
      try {
        navigate("..", { replace: true });
      } catch {}
    } catch (e) {
      setErr(e.message || "회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* 상단 헤더 */}
        <div className={styles.header}>
          <button
            onClick={handleBackToLogin}
            className={styles.backBtn}
            aria-label="로그인으로 돌아가기"
          >
            <img src={BackIcon} alt="뒤로가기" />
          </button>
          <span className={styles.title}>회원가입</span>
        </div>

        {/* ✅ 1단계: 웹메일 인증 먼저 표시, 인증되면 다음 단계 렌더 */}
        {!emailVerified ? (
          <EmailVerifyModal
            /*
              onVerified는 아래 두 형태 모두 지원:
              1) onVerified({ email, verificationCode })
              2) onVerified(email)  // 구버전 호환 — 이 경우 verificationCode는 EmailVerifyModal에서 검증완료 플래그 기반으로 서버가 허용해야 함
            */
            onVerified={(info) => {
              if (typeof info === "string") {
                // 구버전 호환: 문자열만 온 경우
                setVerifiedEmail(info);
                setVerificationCode(""); // 코드 미전달
              } else {
                setVerifiedEmail(info?.email || "");
                setVerificationCode(info?.verificationCode || "");
              }
              setEmailVerified(true);
            }}
          />
        ) : (
          <>
            {/* 로고 */}
            <h2 className={styles.logo}>작당모의</h2>

            {/* 안내 문구 */}
            <p className={styles.subText}>
              가입을 위한 정보를 입력해주세요
              {verifiedEmail ? ` (인증: ${verifiedEmail})` : ""}
            </p>

            {/* 입력 폼 */}
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="name"
                placeholder="이름"
                value={form.name}
                onChange={handleChange}
              />
              <input
                type="text"
                name="nickname"
                placeholder="닉네임"
                value={form.nickname}
                onChange={handleChange}
              />
              <input
                type="text"
                name="grade"
                placeholder="학년"
                value={form.grade}
                onChange={handleChange}
              />
              <input
                type="text"
                name="department"
                placeholder="학과"
                value={form.department}
                onChange={handleChange}
              />

              {/* 🔐 연동 최소요건: 비밀번호 입력 */}
              <input
                type="password"
                name="password"
                placeholder="비밀번호 (8자 이상)"
                value={form.password}
                onChange={handleChange}
              />
              <input
                type="password"
                name="passwordConfirm"
                placeholder="비밀번호 확인"
                value={form.passwordConfirm}
                onChange={handleChange}
              />
            </div>

            {/* 에러 메시지 */}
            {err && <p className={styles.errorText}>{err}</p>}

            {/* 버튼 */}
            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "처리 중..." : "회원가입"}
            </button>

            {/* (디버그/가시화용) 인증코드가 넘어온 경우만 표시 */}
            {verificationCode && (
              <p className={styles.helperText}>인증코드: {verificationCode}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

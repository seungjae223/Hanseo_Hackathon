// src/EmailVerifyModal.jsx  (현재 위치 그대로 사용 중이라 가정)
import React, { useState } from "react";
import shell from "../css/LoginModal.module.css";        // ✅ 로그인 모달의 쉘 재사용 (overlay, content, 로고 등)
import styles from "../css/EmailVerifyModal.module.css"; // ✅ 사진과 동일하게 보이는 전용 스타일
import Logo from "../assets/작당모의.png";
import { apiFetch } from "./utils/api.js";               // ✅ 백엔드 연동

export default function EmailVerifyModal({
  defaultEmail = "",
  onVerified,   // (info) => void  // info: { email, verificationCode }
  onClose,      // 오버레이 클릭 시 닫기
}) {
  const [email, setEmail] = useState(defaultEmail);
  const [code, setCode]   = useState("");
  const [sent, setSent]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [verified, setVerified] = useState(false); // UI용 플래그(다음 버튼 활성)
  const [err, setErr] = useState("");

  // '다음' 버튼 활성화 조건: 코드요청 완료 + 이메일 + 코드 입력
  const disabledNext = !(sent && email && code && !loading);

  // 1) 인증코드 발송: POST /api/email/verification-requests
  const handleSendCode = async () => {
    setErr("");
    if (!email) return setErr("웹메일을 입력해주세요.");

    // ✅ 이메일 자동 보정(@office.hanseo.ac.kr)
    const trimmed = email.trim().toLowerCase();
    const normEmail = trimmed.includes("@")
      ? trimmed
      : `${trimmed}@office.hanseo.ac.kr`;

    try {
      setLoading(true);
      await apiFetch("/api/email/verification-requests", {
        method: "POST",
        auth: false,                 // ✅ 공개 엔드포인트: 토큰 제거
        body: { email: normEmail },  // ✅ 서버가 기대하는 키/값
      });
      setSent(true);
      // UI상 '확인하기' 클릭 없이도 바로 다음으로 갈 수 있도록 verified 처리
      setVerified(true);
      alert("인증코드를 이메일로 발송했습니다. 메일함을 확인해주세요.");
    } catch (e) {
      setErr(e.message || "인증코드 발송 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 2) 로컬 확인 버튼(선택): 서버는 /api/signup 시 최종 검증하므로 여기선 입력 체크만
  const handleVerify = () => {
    setErr("");
    if (!sent) return setErr("먼저 인증요청을 해주세요.");
    if (!code) return setErr("인증코드를 입력해주세요.");
    setVerified(true);
    alert("코드 입력 확인되었습니다. '다음'을 눌러 진행하세요.");
  };

  // 3) 다음: 부모로 email + verificationCode 넘겨주기
  const handleNext = () => {
    setErr("");
    if (disabledNext) return;

    // ✅ 부모로 넘길 때도 동일한 이메일 보정
    const trimmed = email.trim().toLowerCase();
    const normEmail = trimmed.includes("@")
      ? trimmed
      : `${trimmed}@office.hanseo.ac.kr`;

    onVerified?.({ email: normEmail, verificationCode: code });
  };

  return (
    <div className={shell.modalOverlay} onClick={onClose}>
      <div
        className={`${shell.modalContent} ${styles.card}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 로고 영역 (로그인 모달과 동일) */}
        <div className={shell.logoWrap}>
          <img src={Logo} alt="작당모의" className={shell.Modal_logo} />
        </div>

        {/* 한서대학교 웹메일 */}
        <div className={shell.inputGroup}>
          <label className={styles.label}>한서대학교 웹메일</label>
          <div className={styles.inputRow}>
            <input
              className={styles.input}
              type="email"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <button
              className={styles.rightBtn}
              onClick={handleSendCode}
              disabled={loading || !email}
            >
              {loading ? "발송중..." : "인증요청"}
            </button>
          </div>
        </div>

        {/* 인증코드 */}
        <div className={shell.inputGroup}>
          <label className={styles.label}>인증코드</label>
          <div className={styles.inputRow}>
            <input
              className={styles.input}
              type="text"
              placeholder="인증코드 입력"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={loading}
            />
            <button
              className={styles.rightBtn}
              onClick={handleVerify}
              disabled={loading || !sent || !code}
            >
              확인하기
            </button>
          </div>
        </div>

        {/* 에러 메시지 */}
        {err && <p className={styles.errorText}>{err}</p>}

        {/* 다음 버튼 – 사진과 동일한 큰 라운드 화이트 버튼 */}
        <button
          className={`${styles.nextBtn} ${disabledNext ? styles.nextBtnDisabled : ""}`}
          disabled={disabledNext}
          onClick={handleNext}
        >
          다음
        </button>
      </div>
    </div>
  );
}

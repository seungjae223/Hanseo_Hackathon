import React, { useState } from "react";
import shell from "../css/LoginModal.module.css";        // ✅ 로그인 모달의 쉘 재사용 (overlay, content, 로고 등)
import styles from "../css/EmailVerifyModal.module.css"; // ✅ 사진과 동일하게 보이는 전용 스타일
import Logo from "../assets/작당모의.png";

export default function EmailVerifyModal({
  defaultEmail = "",
  onVerified,   // (email) => void
  onClose,      // 오버레이 클릭 시 닫기
}) {
  const [email, setEmail] = useState(defaultEmail);
  const [code, setCode]   = useState("");
  const [sent, setSent]   = useState(false);
  const [sentCode, setSentCode] = useState(""); // (목업) 발급된 코드
  const [loading, setLoading]   = useState(false);
  const [verified, setVerified] = useState(false);

  const disabledNext = !verified;

  const handleSendCode = async () => {
    if (!email) return alert("웹메일을 입력해주세요.");
    setLoading(true);
    // TODO: 실제 API 연결
    const mock = String(Math.floor(100000 + Math.random() * 900000));
    setSentCode(mock);
    setSent(true);
    setLoading(false);
    alert(`(목업) 인증코드 발송: ${mock}`);
  };

  const handleVerify = async () => {
    if (!sent) return alert("먼저 인증요청을 해주세요.");
    if (!code) return alert("인증코드를 입력해주세요.");
    setLoading(true);
    // TODO: 실제 API 연결
    const ok = code === sentCode;
    setLoading(false);
    if (!ok) return alert("인증코드가 올바르지 않습니다.");
    setVerified(true);
    onVerified?.(email);
  };

  return (
    <div className={shell.modalOverlay} onClick={onClose}>
      <div className={`${shell.modalContent} ${styles.card}`} onClick={(e) => e.stopPropagation()}>
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
              disabled={verified}
            />
            <button
              className={styles.rightBtn}
              onClick={handleSendCode}
              disabled={loading || verified}
            >
              인증요청
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
              disabled={verified}
            />
            <button
              className={styles.rightBtn}
              onClick={handleVerify}
              disabled={loading || verified}
            >
              확인하기
            </button>
          </div>
        </div>

        {/* 다음 버튼 – 사진과 동일한 큰 라운드 화이트 버튼 */}
        <button
          className={`${styles.nextBtn} ${disabledNext ? styles.nextBtnDisabled : ""}`}
          disabled={disabledNext}
          onClick={() => onVerified?.(email)}
        >
          다음
        </button>

        {/* (목업) 발급 코드 안내 */}
        {sent && !verified && (
          <div className={styles.hint}>
            (목업) 발급된 인증코드: <b>{sentCode}</b>
          </div>
        )}
      </div>
    </div>
  );
}

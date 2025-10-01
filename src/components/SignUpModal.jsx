import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/SignUpModal.module.css";
import BackIcon from "../assets/Chevron Right Small.png"; // ← 아이콘
import EmailVerifyModal from "./EmailVerifyModal";

export default function SignUpModal({ onClose, onOpenLogin }) {
  const navigate = useNavigate();

  // ✅ 1단계: 이메일 인증 여부
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");

  // ✅ 2단계: 회원가입 폼
  const [form, setForm] = useState({
    name: "",
    nickname: "",
    grade: "",
    department: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ← 왼쪽 화살표: 우선 콜백이 있으면 사용, 없으면 /Mainpage의 인덱스(로그인 모달)로 이동
  const handleBackToLogin = () => {
    if (typeof onOpenLogin === "function") return onOpenLogin();
    if (typeof onClose === "function") return onClose(); // 단독 모달로 쓸 때 닫기용
    try {
      // /Mainpage/signup → .. = /Mainpage (index 라우트=LoginModal)
      navigate("..", { replace: true });
    } catch {}
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
            onVerified={(email) => {
              setVerifiedEmail(email);
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
            </div>

            {/* 버튼 */}
            <button
              className={styles.submitBtn}
              onClick={() => {
                // 목업 동작: 실제 가입 API 연동 시 이 부분 교체
                alert(
                  `(목업) 다음 단계 진행\n이메일: ${verifiedEmail}\n폼: ${JSON.stringify(
                    form,
                    null,
                    2
                  )}`
                );
              }}
            >
              다음
            </button>
          </>
        )}
      </div>
    </div>
  );
}

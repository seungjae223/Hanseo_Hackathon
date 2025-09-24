import React from "react";
import styles from "../css/LoginModal.module.css";
import Logo from "../assets/작당모의.png";

export default function LoginModal({ onClose, onSignUpClick }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 로고 */}
        <div className={styles.logoWrap}>
          <img src={Logo} alt="작당모의" className={styles.Modal_logo} />
        </div>

        {/* 입력 폼 */}
        <div className={styles.inputGroup}>
          <label>한서대학교 웹메일</label>
          <input type="email" placeholder="이메일 입력" />
        </div>
        <div className={styles.inputGroup}>
          <label>비밀번호</label>
          <input type="password" placeholder="비밀번호 입력" />
        </div>

        {/* 로그인 버튼 */}
        <button className={styles.loginBtn}>로그인</button>

        {/* 회원가입 / 비밀번호 찾기 */}
        <p className={styles.links} onClick={onSignUpClick}>
          회원가입 / 비밀번호 찾기
        </p>
      </div>
    </div>
  );
}

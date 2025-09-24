import React from "react";
import styles from "../css/SignUpModal.module.css";
import Logo from "../assets/작당모의.png";

export default function SignUpModal({ onClose }) {
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
          <input type="email" placeholder="한서대학교 웹메일" />
        </div>
        <div className={styles.inputGroup}>
          <input type="text" placeholder="닉네임" />
        </div>
        <div className={styles.inputGroup}>
          <input type="password" placeholder="비밀번호" />
        </div>
        <div className={styles.inputGroup}>
          <input type="password" placeholder="비밀번호 확인" />
        </div>

        {/* 완료 버튼 */}
        <button className={styles.completeBtn}>완료</button>
      </div>
    </div>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/FindPasswordModal.module.css";
import Logo from "../assets/작당모의.png";

export default function FindPasswordModal({ onClose }) {
  const navigate = useNavigate();

  const handleOverlayClose = () => {
    if (onClose) return onClose();
    // /Mainpage 하위에서 열렸다면 상위로
    try { navigate("..", { replace: true }); } catch (e) {}
  };

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

        {/* 입력 폼 */}
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

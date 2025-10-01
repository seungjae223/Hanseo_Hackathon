import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import styles from "../css/AuthBlurGate.module.css";

export default function AuthBlurGate({
  isAuthenticated,
  isVerified,
  blurPx = 10,
  overlayColor = "rgba(0,0,0,0.25)",
  showNotice = false,            // ✅ 추가: 배너 보이기/숨기기
  children,
}) {
  const locked = !(isAuthenticated && isVerified);

  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [locked]);

  const styleVars = useMemo(
    () => ({ ["--blurPx"]: `${blurPx}px`, ["--overlayColor"]: overlayColor }),
    [blurPx, overlayColor]
  );

  return (
    <div className={styles.gateRoot} style={styleVars} aria-busy={locked} aria-live="polite">
      <div className={`${styles.content} ${locked ? styles.blurred : styles.clear}`}>
        {children}
      </div>

      {locked && (
        <div className={styles.overlay} role="status" aria-label="인증 필요">
          {/* ✅ 배너를 옵션으로 토글 */}
          {showNotice && (
            <div className={styles.panel}>
              <h2 className={styles.title}>접근을 위해 인증이 필요합니다</h2>
              <p className={styles.sub}>로그인 후 인증을 완료하면 화면이 해제됩니다.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

AuthBlurGate.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isVerified: PropTypes.bool.isRequired,
  blurPx: PropTypes.number,
  overlayColor: PropTypes.string,
  showNotice: PropTypes.bool,      // ✅ 추가
  children: PropTypes.node,
};

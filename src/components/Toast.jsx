// src/components/Toast.jsx
import React, {
  createContext, useContext, useMemo, useState,
  useCallback, useEffect
} from "react";
import styles from "../css/Toast.module.css";

/* 🎉 컨페티 이미지 6종 */
import ImgDiamond from "../assets/마름모.png";
import ImgDiamondSmall from "../assets/작은마름모.png";
import ImgSpring from "../assets/스프링.png";
import ImgSpringAlt from "../assets/스프링1.png";
import ImgDot from "../assets/원.png";
import ImgDotSmall from "../assets/작은원.png";

/* 🔔 제공한 벨 아이콘 이미지 */
import BellPng from "../assets/벨.png";

const ToastCtx = createContext(null);

function ConfettiBurst({ count = 18 }) {
  const sources = useMemo(
    () => [ImgDiamond, ImgDiamondSmall, ImgSpring, ImgSpringAlt, ImgDot, ImgDotSmall],
    []
  );

  const pieces = useMemo(() => {
    return new Array(count).fill(0).map((_, i) => {
      const left = Math.random() * 100;
      const delay = Math.random() * 0.25;
      const dur = 1.0 + Math.random() * 0.9;
      const scale = 0.8 + Math.random() * 0.9;
      const rot = Math.floor(Math.random() * 360);
      const src = sources[i % sources.length];
      return { id: i, left, delay, dur, scale, rot, src };
    });
  }, [sources]);

  return (
    <div className={styles.confettiBox} aria-hidden>
      {pieces.map((p) => (
        <img
          key={p.id}
          src={p.src}
          className={styles.pieceImg}
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            transform: `translateY(-8px) rotate(${p.rot}deg) scale(${p.scale})`,
          }}
          alt=""
        />
      ))}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(({ message, duration = 2200, icon = "bell", confetti = false }) => {
    const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
    setToasts((list) => [...list, { id, message, duration, icon, confetti }]);
    return id;
  }, []);

  useEffect(() => {
    const timers = toasts.map((t) => setTimeout(() => remove(t.id), t.duration));
    return () => timers.forEach(clearTimeout);
  }, [toasts, remove]);

  return (
    <ToastCtx.Provider value={{ show, remove }}>
      {children}
      <div className={styles.viewport} aria-live="polite" aria-atomic="true">
        {toasts.map((t) => (
          <div key={t.id} className={styles.toastWrap}>
            {t.confetti && <ConfettiBurst count={18} />}
            <button
              className={styles.toast}
              onClick={() => remove(t.id)}
              data-enter
              type="button"
              title="닫기"
            >
              <span className={styles.msg}>{t.message}</span>
              {/* ✅ 벨 흔들림 애니메이션 클래스 추가 */}
              <span className={`${styles.icon} ${styles.ringing}`} aria-hidden>
                {t.icon === "bell" ? (
                  <img src={BellPng} alt="" className={styles.iconImg} />
                ) : (
                  t.icon
                )}
              </span>
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

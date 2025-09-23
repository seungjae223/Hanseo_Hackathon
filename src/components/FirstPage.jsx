import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/FirstPage.module.css";
import logo from "../assets/작당모의.png";
import meeting from "../assets/작당모의logo.png";
import word from "../assets/글.png";

const FirstPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 3초 후 로그인 페이지로 이동
    const timer = setTimeout(() => {
      navigate("/login"); // 로그인 라우트 경로에 맞게 수정
    }, 10000);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 제거
  }, [navigate]);

  return (
    <main className={styles.container}>
      <div className={styles.logoWrap} aria-hidden="true">
        <svg className={styles.ring} viewBox="0 0 120 120">
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#d0d1d4" />
              <stop offset="60%" stopColor="#bfe8ff" />
              <stop offset="100%" stopColor="#7ec5eb" />
            </linearGradient>
            <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c8efff" />
              <stop offset="100%" stopColor="#5bb8eb" />
            </linearGradient>
          </defs>

          <circle
            cx="60"
            cy="60"
            r="52"
            className={styles.base}
            style={{ stroke: "url(#ringGrad)" }}
          />
          <g className={styles.spinner}>
            <circle
              cx="60"
              cy="60"
              r="52"
              className={styles.arc}
              style={{ stroke: "url(#arcGrad)" }}
            />
          </g>
        </svg>

        <img src={meeting} alt="" className={styles.illustration} />
      </div>

      <img src={logo} alt="작당모의 로고" className={styles.title} />
      <img src={word} alt ="한서대학교 똑똑하게"className={styles.subtitle}/>    </main>
  );
};

export default FirstPage;

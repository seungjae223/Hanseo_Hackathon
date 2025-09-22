import React from "react";
import styles from "../css/FirstPage.module.css";
import meeting from "../assets/작당모의logo.png";

const FirstPage = () => {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>작당모의</h1>

      <div className={styles.logoWrap} aria-hidden="true">
        {/* 링(그라데이션) + 회전 아크를 한 SVG 안에서 처리 */}
        <svg className={styles.ring} viewBox="0 0 120 120">
          <defs>
            {/* 메인 링: 좌하단 연회색 → 우상단 하늘색 */}
            <linearGradient id="ringGrad" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#d0d1d4" />
              <stop offset="60%" stopColor="#bfe8ff" />
              <stop offset="100%" stopColor="#7ec5eb" />
            </linearGradient>

            {/* 돌아가는 하이라이트 아크(조금 더 선명한 파랑) */}
            <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c8efff" />
              <stop offset="100%" stopColor="#5bb8eb" />
            </linearGradient>
          </defs>

          {/* 메인 링: stroke는 인라인 스타일로 그라데이션 강제 적용 */}
          <circle
            cx="60"
            cy="60"
            r="52"
            className={styles.base}
            style={{ stroke: "url(#ringGrad)" }}
          />

          {/* 회전하는 하이라이트 아크 */}
          <g className={styles.spinner}>
            <circle
              cx="60"
              cy="60"
              r="52"
              className={styles.arc}
              /* CSS에서 stroke-dasharray/width/linecap 제어 */
              style={{ stroke: "url(#arcGrad)" }}
            />
          </g>
        </svg>

        {/* 안쪽 일러스트 */}
        <img src={meeting} alt="" className={styles.illustration} />
      </div>

      <p className={styles.subtitle}>한서대학교 팀프로젝트, 이제는 똑똑하게!</p>
    </main>
  );
};

export default FirstPage;

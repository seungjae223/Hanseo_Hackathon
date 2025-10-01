// src/components/TeamManagePanel.jsx
import React from "react";
import styles from "../css/TeamManagePanel.module.css";

export default function TeamManagePanel() {
  // ✅ 섹션 구성만 추가해서, 카드 안에서 여러 블록이 보이고 스크롤되게 처리
  const SECTIONS = [
    { key: "design", label: "디자인", bigTitle: true },   // "요청사항" 큰 타이틀
    { key: "fe", label: "프론트엔드", bigTitle: false },  // 일반 블록
    { key: "etc1", label: "", bigTitle: false },          // 동그란 작은 배지(빈 라벨)
    { key: "etc2", label: "", bigTitle: false },          // 한 섹션 더
  ];

  return (
    <section className={styles.card}>
      {/* ✅ CSS 수정 없이 내부만 세로 스크롤되도록 */}
      <div style={{ maxHeight: "78vh", overflowY: "auto", paddingRight: 2 }}>
        {SECTIONS.map((sec, idx) => (
          <React.Fragment key={sec.key}>
            <div className={styles.row}>
              {sec.label ? (
                <span className={styles.badge}>{sec.label}</span>
              ) : (
                <span className={styles.badgeLight} />
              )}
            </div>

            {/* 섹션의 본문 한 줄 */}
            <div className={idx === SECTIONS.length - 1 ? styles.blockRowLast : styles.blockRow}>
              <div className={styles.thumb} />
              {sec.bigTitle ? (
                <div className={styles.bigBlockTitle}>요청사항</div>
              ) : (
                <div className={styles.bigBlock} />
              )}
            </div>

            {/* 마지막 섹션 전까지만 구분선 */}
            {idx !== SECTIONS.length - 1 && <hr className={styles.hr} />}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

// src/components/TeamProjectsCarousel.jsx
import React from "react";
import styles from "../css/TeamProjectsCarousel.module.css";

/** items 예시
 * { id: 1, tags: ["공모전","디자이너"], title: "AI 해커톤 같이 나갈 디자이너/개발자", period:"2025-09-27 ~ 10-4" }
 */
export default function TeamProjectsCarousel({
  items = [],
  intervalMs = 4000,
  onCardClick,               //  메인에서 넘겨줄 클릭 콜백 (예: id => navigate(`/recruit/${id}`))
}) {
  // 내부에서 3개씩 보여줌
  const [slice, setSlice] = React.useState([]);

  // 3개 랜덤 추출
  const pick3 = React.useCallback(() => {
    if (!items.length) return [];
    const pool = [...items];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, Math.min(3, pool.length));
  }, [items]);

  // 최초/아이템 변경 시 3개 선택
  React.useEffect(() => {
    setSlice(pick3());
  }, [pick3]);

  //  자동 순환(유지)
  React.useEffect(() => {
    if (!items.length) return;
    const t = setInterval(() => setSlice(pick3()), intervalMs);
    return () => clearInterval(t);
  }, [items.length, pick3, intervalMs]);

  const onPrev = () => setSlice(pick3());
  const onNext = () => setSlice(pick3());

  if (!items.length) {
    return <div className={styles.empty}>불러올 팀 프로젝트가 없습니다.</div>;
  }

  return (
    <div className={styles.wrap}>
      <ul className={styles.row}>
        {slice.map((it) => (
          <li
            key={it.id}
            className={styles.card}
            role="button"               //  접근성
            tabIndex={0}
            onClick={() => onCardClick && onCardClick(it.id)}  // ✅ 카드 클릭 → 콜백
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onCardClick && onCardClick(it.id);
              }
            }}
            style={{ cursor: onCardClick ? "pointer" : "default" }} // 커서 표시
            title="상세 보기"
          >
            <div className={styles.hash}>
              {it.tags?.map((t) => `#${t}`).join("")}
            </div>
            <h3 className={styles.title}>{it.title}</h3>
            <div className={styles.footer}>{it.period}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

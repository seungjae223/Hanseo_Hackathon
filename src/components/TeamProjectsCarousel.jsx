import React from "react";
import styles from "../css/TeamProjectsCarousel.module.css";

/** items 예시
 * { id: 1, tags: ["공모전","디자이너"], title: "AI 해커톤 같이 나갈 디자이너/개발자", period:"2025-09-27 ~ 10-4" }
 */
export default function TeamProjectsCarousel({ items = [], intervalMs = 4000 }) {
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

  // 자동 순환
  React.useEffect(() => {
    if (!items.length) return;
    const t = setInterval(() => setSlice(pick3()), intervalMs);
    return () => clearInterval(t);
  }, [items.length, pick3, intervalMs]);

  const onPrev = () => setSlice(pick3());
  const onNext = () => setSlice(pick3());

  if (!items.length) {
    return (
      <div className={styles.empty}>불러올 팀 프로젝트가 없습니다.</div>
    );
  }

  return (
    <div className={styles.wrap}>
   

      <ul className={styles.row}>
        {slice.map((it) => (
          <li key={it.id} className={styles.card}>
            <div className={styles.hash}>
              {it.tags?.map((t, i) => `#${t}`).join("")}
            </div>
            <h3 className={styles.title}>{it.title}</h3>
            <div className={styles.footer}>{it.period}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

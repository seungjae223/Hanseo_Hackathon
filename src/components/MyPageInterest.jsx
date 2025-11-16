// src/components/MyPageInterest.jsx
import React from "react";
import styles from "../css/MyPageInterest.module.css";

const GROUPS = [
  { title: "성격", key: "personality",
    items: ["친절함","활발함","유머감","배려심","사교성","인내심"] },
  { title: "능력", key: "ability",
    items: ["문제 해결","신속 처리","창의 발상","논리 정연","실행 능력","경력직","협업 능력","효율 추구","발표 능력","학습 능력"] },
  { title: "태도", key: "attitude",
    items: ["적극 참여","솔선 수범","긍정 사고","배움 열정","성실 노력","책임 완수","공감 능력","도전 의지","목표 지향"] },
];

/* label → groupKey 빠른 역매핑 */
const labelToGroup = (() => {
  const m = new Map();
  GROUPS.forEach(g => g.items.forEach(it => m.set(it, g.key)));
  return m;
})();

/** 제어형: 부모에서 value 배열을 내려줌. 그룹당 1개만 허용 */
export default function MyPageInterest({ value = [], onChange }) {
  const selected = Array.isArray(value) ? value : [];

  const toggle = (label) => {
    const key = labelToGroup.get(label);                 // 라벨이 속한 그룹
    const prevInGroup = selected.find(v => labelToGroup.get(v) === key);

    let next;
    if (prevInGroup === label) {
      // 같은 칩 다시 클릭 → 해제
      next = selected.filter(v => v !== label);
    } else {
      // 다른 칩 선택 → 해당 그룹의 이전 선택을 교체
      next = selected.filter(v => labelToGroup.get(v) !== key).concat(label);
    }
    onChange?.(next);
  };

  return (
    <section className={styles.wrap}>
      <div className={styles.panel}>
        {GROUPS.map(g => {
          const picked = selected.find(v => labelToGroup.get(v) === g.key); // 이 그룹의 현재 선택
          return (
            <div key={g.key} className={styles.column}>
              <h3 className={styles.colTitle}>{g.title}</h3>
              <ul className={styles.chipGrid}>
                {g.items.map(label => {
                  const isOn = picked === label;
                  const dim = !!picked && !isOn; // 같은 그룹 내 나머지 50% 디밍
                  return (
                    <li key={label}>
                      <button
                        type="button"
                        className={`${styles.chip} ${isOn ? styles.on : ""} ${dim ? styles.dim : ""}`}
                        aria-pressed={isOn}
                        onClick={() => toggle(label)}
                      >
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

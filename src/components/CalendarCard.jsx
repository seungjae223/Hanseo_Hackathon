import React from "react";
import styles from "../css/CalendarCard.module.css";
import ArrowDown from "../assets/아래 화살표 .png";   // (= 아래 화살표)
import ArrowUp   from "../assets/위 화살표'.png";     // (= 위 화살표)

function fmtYM(d){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  return `${y}. ${m}`;
}
function ymd(d){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${dd}`;
}

/** props.events : [{ date:'2025-10-06', title:'...', place:'...' }] */
export default function CalendarCard({ events = [] }) {
  const [pivot, setPivot] = React.useState(() => new Date());
  const [selected, setSelected] = React.useState(null);
  const [expanded, setExpanded] = React.useState(false);   // ▼ 추가: 접기/펴기

  const last = new Date(pivot.getFullYear(), pivot.getMonth()+1, 0);
  const days = Array.from({length:last.getDate()}, (_,i)=>i+1);

  // 접힘 상태면 7개(1줄), 펼침은 14개(2줄)
  const daysForUi = expanded ? days.slice(0, 14) : days.slice(0, 7);

  const byDate = React.useMemo(()=>{
    const map = new Map();
    events.forEach(ev=>{
      if(!map.has(ev.date)) map.set(ev.date, []);
      map.get(ev.date).push(ev);
    });
    return map;
  }, [events]);

  const selEvents = selected ? byDate.get(selected) || [] : [];

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <button
          className={styles.arrow}
          onClick={()=>setPivot(new Date(pivot.getFullYear(), pivot.getMonth()-1, 1))}
          aria-label="이전달"
        >‹</button>
        <h3 className={styles.title}>{fmtYM(pivot)}</h3>
        <button
          className={styles.arrow}
          onClick={()=>setPivot(new Date(pivot.getFullYear(), pivot.getMonth()+1, 1))}
          aria-label="다음달"
        >›</button>
      </div>
      <div className={styles.divider} />

      {/* 날짜 7×(1|2)줄 */}
      <div className={styles.dayWrap}>
        {daysForUi.map((d)=>{
          const dateStr = ymd(new Date(pivot.getFullYear(), pivot.getMonth(), d));
          const hasEv = byDate.has(dateStr);
          const isSel = selected === dateStr;
          return (
            <button
              key={d}
              className={[
                styles.day,
                hasEv ? styles.hasEvent : "",
                isSel ? styles.selected : "",
              ].join(" ")}
              onClick={()=> setSelected(dateStr)}
            >
              {d}
            </button>
          );
        })}
      </div>

      {/* 토글 버튼: ∨ / ∧ */}
   <button
  className={styles.toggle}
  onClick={() => setExpanded(v => !v)}
  aria-label={expanded ? "접기" : "펼치기"}
>
  <img
    src={expanded ? ArrowUp : ArrowDown}
    alt={expanded ? "접기" : "펼치기"}
    className={styles.toggleIcon}
    draggable="false"
  />
</button>

      {/* 펼쳤을 때만 상세 정보 노출 */}
      {expanded && (
        <div className={styles.detail}>
          {selected ? (
            selEvents.length ? (
              <>
                <div className={styles.detailDate}>{Number(selected.slice(-2))}</div>
                <div className={styles.detailTitle}>{selEvents[0].title}</div>
                <div className={styles.detailPlace}>{selEvents[0].place}</div>
                
              </>
            ) : (
              <>
                <div className={styles.detailDate}>{Number(selected.slice(-2))}</div>
                <div className={styles.detailTitle}>일정 없음</div>
                <div className={styles.detailPlace}></div>
                
              </>
            )
          ) : (
            <div className={styles.hint}>날짜를 선택하세요</div>
          )}
        </div>
      )}
    </section>
  );
}

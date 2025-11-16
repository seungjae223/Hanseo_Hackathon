import React from "react";
import styles from "../css/CalendarCard.module.css";
import ArrowDown from "../assets/아래 화살표 .png";
import ArrowUp   from "../assets/위 화살표.png";
import PlusIcon  from "../assets/plus.png";

/** 날짜 포맷: 2025. 11 */
function fmtYM(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}. ${m}`;
}

/** 날짜 포맷: 2025-11-03 */
function ymd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

// 초기 events에 id가 없을 수도 있으니까 여기서 붙여줌
function withIds(list) {
  return list.map((ev, idx) => ({
    id: ev.id ?? `${ev.date}-${idx}`,
    ...ev,
  }));
}

export default function CalendarCard({ events = [] }) {
  const [pivot, setPivot] = React.useState(() => new Date());
  const [selected, setSelected] = React.useState(null);

  // viewMode: 0 = 7일, 1 = 14일, 2 = 전체
  const [viewMode, setViewMode] = React.useState(0);

  // "해당 주만 보기" 토글 상태
  const [weekFocus, setWeekFocus] = React.useState(false);

  // 날짜 그리드 DOM 참조(자동 스크롤용)
  const dayWrapRef = React.useRef(null);
  // 토글 직전 주-포커스 상태 기억
  const prevWeekFocusRef = React.useRef(false);

  // 일정 목록
  const [eventList, setEventList] = React.useState(() => withIds(events));
  React.useEffect(() => {
    setEventList(withIds(events));
  }, [events]);

  // 편집 모드 여부 + 입력값
  const [editing, setEditing] = React.useState(false);
  const [form, setForm] = React.useState({ title: "", place: "" });

  // 이번 달 마지막 날짜
  const last = new Date(pivot.getFullYear(), pivot.getMonth() + 1, 0);
  const days = Array.from({ length: last.getDate() }, (_, i) => i + 1);

  /* ▼▼▼ 날짜 줄 모드 계산 ▼▼▼ */
  let daysForUi;
  if (viewMode === 0) {
    daysForUi = days.slice(0, 7);
  } else if (viewMode === 1) {
    daysForUi = days.slice(0, 14);
  } else {
    daysForUi = days;
  }

  if (viewMode > 0 && weekFocus && selected) {
    const selectedDay = Number(selected.slice(-2));
    const weekIndex = Math.floor((selectedDay - 1) / 7); // 0~4
    const start = weekIndex * 7 + 1;
    const end = Math.min(start + 6, last.getDate());
    const weekDays = [];
    for (let d = start; d <= end; d += 1) weekDays.push(d);
    daysForUi = weekDays;
  }
  /* ▲▲▲ 날짜 줄 계산 끝 ▲▲▲ */

  // 날짜별 이벤트 맵
  const byDate = React.useMemo(() => {
    const map = new Map();
    eventList.forEach((ev) => {
      if (!map.has(ev.date)) map.set(ev.date, []);
      map.get(ev.date).push(ev);
    });
    return map;
  }, [eventList]);

  const selEvents = selected ? byDate.get(selected) || [] : [];

  const handleEditClick = () => {
    if (!selected) return;
    setForm({ title: "", place: "" });
    setEditing(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!selected) return;
    const title = form.title.trim();
    const place = form.place.trim();
    if (!title && !place) { setEditing(false); return; }

    const newEv = {
      id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: selected,
      title,
      place,
    };
    setEventList((prev) => [...prev, newEv]);
    setEditing(false);
  };

  const handleDeleteEvent = (id) => {
    setEventList((prev) => prev.filter((ev) => ev.id !== id));
  };

  const handleDayClick = (dateStr) => {
    if (selected === dateStr && weekFocus) {
      setWeekFocus(false);
    } else {
      setSelected(dateStr);
      if (viewMode > 0) setWeekFocus(true);
      else setWeekFocus(false);
    }
    setEditing(false);
  };

  // 펼침 단계 변경: 0 → 1 → 2 → 다시 0
  const handleToggle = () => {
    prevWeekFocusRef.current = weekFocus;  // 직전 상태 기억
    setViewMode((prev) => (prev + 1) % 3);
    setWeekFocus(false);                   // 모드 전환 시 기본 해제
  };

  //  주(weekFocus=true) 상태에서 전체(2단계)로 바뀌면,
  // 선택한 날짜 버튼까지 자동 스크롤(첫 줄이 1일로 보이지 않게)
  React.useEffect(() => {
    if (viewMode === 2 && selected && prevWeekFocusRef.current) {
      // 다음 페인트 후 실행
      requestAnimationFrame(() => {
        const wrap = dayWrapRef.current;
        if (!wrap) return;
        const el = wrap.querySelector(`[data-date="${selected}"]`);
        if (!el) return;

        // 중앙 근처로 오도록 스크롤 보정
        const top = el.offsetTop - (wrap.clientHeight / 2) + (el.clientHeight / 2);
        wrap.scrollTop = Math.max(0, top);
      });
      // 한 번 쓰고 플래그 내림
      prevWeekFocusRef.current = false;
    }
  }, [viewMode, selected]);

  const isExpanded = viewMode > 0;
  const isFullyOpened = viewMode === 2 && !weekFocus;
  const arrowSrc = isFullyOpened ? ArrowUp : ArrowDown;
  const arrowAlt = isFullyOpened ? "접기" : "펼치기";

  return (
    <section className={styles.card}>
      {/* 상단 연/월 + 좌우 이동 */}
      <div className={styles.header}>
        <button
          className={styles.arrow}
          onClick={() =>
            setPivot(new Date(pivot.getFullYear(), pivot.getMonth() - 1, 1))
          }
          aria-label="이전달"
        >
          ‹
        </button>
        <h3 className={styles.title}>{fmtYM(pivot)}</h3>
        <button
          className={styles.arrow}
          onClick={() =>
            setPivot(new Date(pivot.getFullYear(), pivot.getMonth() + 1, 1))
          }
          aria-label="다음달"
        >
          ›
        </button>
      </div>

      <div className={styles.divider} />

      {/* 날짜 버튼들 */}
      <div className={styles.dayWrap} ref={dayWrapRef}>
        {daysForUi.map((d) => {
          const dateStr = ymd(
            new Date(pivot.getFullYear(), pivot.getMonth(), d)
          );
          const hasEv = byDate.has(dateStr);
          const isSel = selected === dateStr;

          return (
            <button
              key={d}
              data-date={dateStr}                     
              className={[
                styles.day,
                hasEv ? styles.hasEvent : "",
                isSel ? styles.selected : "",
              ].join(" ")}
              onClick={() => handleDayClick(dateStr)}
            >
              {d}
            </button>
          );
        })}
      </div>

      {/* 토글 버튼: 7일 ↓ → 14일/해당주 ↓ → 전체 ↑ → 다시 7일 ↓ */}
      <button
        className={styles.toggle}
        onClick={handleToggle}
        aria-label={arrowAlt}
      >
        <img
          src={arrowSrc}
          alt={arrowAlt}
          className={styles.toggleIcon}
          draggable="false"
        />
      </button>

      {/* 펼친 상태에서만 상세 영역 보이게 */}
      {isExpanded && (
        <div className={styles.detail}>
          {selected ? (
            editing ? (
              <>
                <div className={styles.detailDate}>
                  {Number(selected.slice(-2))}
                </div>

                <div className={styles.detailLabel}>제목</div>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  placeholder="예: 팀 프로젝트 회의"
                  className={styles.detailInput}
                />

                <div className={styles.detailLabel}>장소 / 메모</div>
                <input
                  name="place"
                  value={form.place}
                  onChange={handleFormChange}
                  placeholder="예: 스터디룸, 온라인 등"
                  className={styles.detailInput}
                />

                <div className={styles.detailActions}>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className={styles.detailBtn}
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className={`${styles.detailBtn} ${styles.detailBtnPrimary}`}
                  >
                    추가
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.detailDate}>
                  {Number(selected.slice(-2))}
                </div>

                {selEvents.length ? (
                  <ul className={styles.eventList}>
                    {selEvents.map((ev) => (
                      <li key={ev.id} className={styles.eventItem}>
                        <div className={styles.eventText}>
                          <div className={styles.detailTitle}>{ev.title}</div>
                          <div className={styles.detailPlace}>{ev.place}</div>
                        </div>
                        <button
                          type="button"
                          className={styles.eventDeleteBtn}
                          onClick={() => handleDeleteEvent(ev.id)}
                        >
                          삭제
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={styles.detailTitle}>일정 없음</div>
                )}

                <button
                  type="button"
                  className={styles.editBtn}
                  onClick={handleEditClick}
                  aria-label="일정 추가"
                >
                  <img
                    src={PlusIcon}
                    alt="일정 추가"
                    className={styles.editIcon}
                    draggable="false"
                  />
                </button>
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

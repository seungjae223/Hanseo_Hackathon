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

/**
 * props
 *  - events : [{ date:'2025-10-06', title:'...', place:'...' }]
 *    (초기 일정 목록 – 없으면 빈 배열)
 */
export default function CalendarCard({ events = [] }) {
  const [pivot, setPivot] = React.useState(() => new Date());
  const [selected, setSelected] = React.useState(null);

  // viewMode: 0 = 7일, 1 = 14일, 2 = 전체
  const [viewMode, setViewMode] = React.useState(0);

  // "해당 주만 보기" 토글 상태
  const [weekFocus, setWeekFocus] = React.useState(false);

  // 일정 목록을 이 컴포넌트 안에서 관리 (id 추가)
  const [eventList, setEventList] = React.useState(() => withIds(events));
  React.useEffect(() => {
    setEventList(withIds(events));
  }, [events]);

  // 편집 모드 여부 + 입력값 (새 일정 추가 용도)
  const [editing, setEditing] = React.useState(false);
  const [form, setForm] = React.useState({ title: "", place: "" });

  // 이번 달 마지막 날짜
  const last = new Date(pivot.getFullYear(), pivot.getMonth() + 1, 0);
  const days = Array.from({ length: last.getDate() }, (_, i) => i + 1);

  /* ▼▼▼ 날짜 줄 모드 계산 ▼▼▼ */

  // 1단계: viewMode 기준 기본 줄
  let daysForUi;
  if (viewMode === 0) {
    daysForUi = days.slice(0, 7);          // 1~7
  } else if (viewMode === 1) {
    daysForUi = days.slice(0, 14);         // 1~14
  } else {
    daysForUi = days;                      // 전체 달
  }

  // 2단계: 펼친 상태(viewMode > 0) + weekFocus 켜짐 + 날짜 선택됨
  //        → 선택된 날짜가 포함된 "그 주 7일"만 보여주기
  if (viewMode > 0 && weekFocus && selected) {
    const selectedDay = Number(selected.slice(-2));  // 예: '20' → 20
    const weekIndex = Math.floor((selectedDay - 1) / 7); // 0~4
    const start = weekIndex * 7 + 1;
    const end = Math.min(start + 6, last.getDate());

    const weekDays = [];
    for (let d = start; d <= end; d += 1) {
      weekDays.push(d);
    }
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

  // 플러스 눌렀을 때: 새 일정 추가 폼 열기
  const handleEditClick = () => {
    if (!selected) return;
    setForm({ title: "", place: "" }); // 항상 새 일정 입력
    setEditing(true);
  };

  // 입력값 변경
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 저장(추가)
  const handleSave = () => {
    if (!selected) return;

    const title = form.title.trim();
    const place = form.place.trim();

    if (!title && !place) {
      setEditing(false);
      return;
    }

    const newEv = {
      id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: selected,
      title,
      place,
    };

    setEventList((prev) => [...prev, newEv]);
    setEditing(false);
  };

  // 개별 일정 삭제
  const handleDeleteEvent = (id) => {
    setEventList((prev) => prev.filter((ev) => ev.id !== id));
  };

  // 날짜 버튼 클릭
  const handleDayClick = (dateStr) => {
    // 같은 날짜를 다시 누르면 weekFocus 끄기 → 원래 뷰로 복귀
    if (selected === dateStr && weekFocus) {
      setWeekFocus(false);
    } else {
      setSelected(dateStr);
      // 펼쳐져 있는 상태에서만 "해당 주 보기" 켜기
      if (viewMode > 0) {
        setWeekFocus(true);
      } else {
        setWeekFocus(false);
      }
    }
    setEditing(false);
  };

  // 펼침 단계 변경: 0 → 1 → 2 → 다시 0
  const handleToggle = () => {
    setViewMode((prev) => (prev + 1) % 3);
    // 뷰 모드 바꿀 땐 주 포커스 해제
    setWeekFocus(false);
  };

  // 상세 영역은 1·2에서만 보이게
  const isExpanded = viewMode > 0;

  // 화살표 모양: 0,1 = 아래 / 2 = 위
  const arrowSrc = viewMode === 2 ? ArrowUp : ArrowDown;
  const arrowAlt = viewMode === 2 ? "접기" : "펼치기";

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
      <div className={styles.dayWrap}>
        {daysForUi.map((d) => {
          const dateStr = ymd(
            new Date(pivot.getFullYear(), pivot.getMonth(), d)
          );
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
              onClick={() => handleDayClick(dateStr)}
            >
              {d}
            </button>
          );
        })}
      </div>

      {/* 토글 버튼: 7일 ↓ → 14일(혹은 해당 주) ↓ → 전체 ↑ → 다시 7일 ↓ */}
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
              /* === 편집 모드: 새 일정 추가 === */
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
              /* === 일반 모드: 해당 날짜의 일정 목록 + 플러스 === */
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

                {/* 일정 추가 버튼 (플러스) */}
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

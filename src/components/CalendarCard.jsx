import React, { useState, useEffect, useMemo } from "react";
import styles from "../css/CalendarCard.module.css";
import ArrowDown from "../assets/아래 화살표 .png";
import ArrowUp from "../assets/위 화살표.png";
import PlusIcon from "../assets/plus.png";

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

/* ✅ 더미 데이터 (백엔드 연동 전용) */
const MOCK_EVENTS_RAW = [
  {
    date: "2025-11-03",
    title: "팀 프로젝트 킥오프",
    place: "공학관 202호",
  },
  {
    date: "2025-11-07",
    title: "스터디 모임",
    place: "도서관 스터디룸 A",
  },
  {
    date: "2025-11-12",
    title: "공모전 아이디어 회의",
    place: "학생회관 카페",
  },
  {
    date: "2025-11-18",
    title: "중간 점검 발표",
    place: "온라인(Zoom)",
  },
  {
    date: "2025-11-25",
    title: "최종 발표 리허설",
    place: "디자인관 301호",
  },
];

export default function CalendarCard({ events = [] }) {
  // 기준 날짜 (월 단위 이동용)
  const [pivot, setPivot] = useState(() => new Date());

  // 선택된 날짜 (문자열 'YYYY-MM-DD')
  const [selected, setSelected] = useState(null);

  // 펼침 여부 (true: 전체 월 보기, false: 한 주 보기)
  const [isExpanded, setIsExpanded] = useState(false);

  /* ✅ 초기 일정 목록: props.events가 있으면 그걸 쓰고,
     없거나 빈 배열이면 위의 MOCK_EVENTS_RAW 사용 */
  const [eventList, setEventList] = useState(() =>
    withIds(events && events.length ? events : MOCK_EVENTS_RAW)
  );

  // 편집 모드 여부 + 입력값
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: "", place: "" });

  // props 갱신될 때도 동일 로직 적용
  useEffect(() => {
    const base = events && events.length ? events : MOCK_EVENTS_RAW;
    setEventList(withIds(base));
  }, [events]);

  // 이번 달 마지막 날짜 및 전체 날짜 배열
  const last = new Date(pivot.getFullYear(), pivot.getMonth() + 1, 0);
  const allDays = Array.from({ length: last.getDate() }, (_, i) => i + 1);

  // ✅ 화면에 보여줄 날짜 계산 (핵심 로직)
  const daysForUi = useMemo(() => {
    // 1. 펼쳐져 있으면 모든 날짜 반환
    if (isExpanded) {
      return allDays;
    }

    // 2. 접혀있을 때: 기준이 될 날짜 찾기
    let targetDay = 1;

    if (selected) {
      // 선택된 날짜가 있고, 현재 보고 있는 달(pivot)과 같다면 그 날짜 기준
      const selDateObj = new Date(selected);
      if (
        selDateObj.getFullYear() === pivot.getFullYear() &&
        selDateObj.getMonth() === pivot.getMonth()
      ) {
        targetDay = selDateObj.getDate();
      }
    } else {
      // 선택된 날짜가 없으면 '오늘'이 이번 달인지 확인 후 기준 잡기
      const today = new Date();
      if (
        today.getFullYear() === pivot.getFullYear() &&
        today.getMonth() === pivot.getMonth()
      ) {
        targetDay = today.getDate();
      }
    }

    // 3. 해당 날짜가 포함된 '주(Week)' 계산 (1~7, 8~14...)
    const rowIndex = Math.floor((targetDay - 1) / 7);
    const startDay = rowIndex * 7 + 1;
    const endDay = Math.min(startDay + 6, last.getDate());

    const weekDays = [];
    for (let d = startDay; d <= endDay; d++) {
      weekDays.push(d);
    }
    return weekDays;
  }, [isExpanded, selected, pivot, allDays]);

  // 날짜별 이벤트 맵핑
  const byDate = useMemo(() => {
    const map = new Map();
    eventList.forEach((ev) => {
      if (!map.has(ev.date)) map.set(ev.date, []);
      map.get(ev.date).push(ev);
    });
    return map;
  }, [eventList]);

  const selEvents = selected ? byDate.get(selected) || [] : [];

  // --- 핸들러 함수들 ---

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

  const handleDeleteEvent = (id) => {
    setEventList((prev) => prev.filter((ev) => ev.id !== id));
  };

  // 날짜 클릭 시: 선택 + 접기
  const handleDayClick = (dateStr) => {
    setSelected(dateStr);
    setEditing(false);
    setIsExpanded(false);
  };

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const arrowSrc = isExpanded ? ArrowUp : ArrowDown;
  const arrowAlt = isExpanded ? "접기" : "펼치기";

  return (
    <section className={styles.card}>
      {/* 상단 헤더 */}
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

      {/* 날짜 그리드 */}
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

      {/* 토글 버튼 */}
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

      {/* 상세 영역 */}
      {(selected || isExpanded) && (
        <div className={styles.detail}>
          {selected ? (
            editing ? (
              /* 편집 모드 */
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
              /* 조회 모드 */
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
            /* 선택된 날짜 없을 때(펼쳐만 놨을 때) */
            <div className={styles.hint}>날짜를 선택하세요</div>
          )}
        </div>
      )}
    </section>
  );
}

import React, { useEffect, useMemo, useRef, useState } from "react";
import refresh from "../assets/refresh_gray.gif";
import css from "../css/BookingSheet.module.css";

/* ===== date utils ===== */
function addDays(date, n) { const d = new Date(date); d.setDate(d.getDate() + n); return d; }
function startOfMonth(date) { return new Date(date.getFullYear(), date.getMonth(), 1); }
function endOfMonth(date) { return new Date(date.getFullYear(), date.getMonth() + 1, 0); }
function fmtYMD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}
function sameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/* ===== labels ===== */
const WEEK_LABEL = ["일","월","화","수","목","금","토"];

// ✅ 인원은 항상 5인 고정
const FIXED_PEOPLE = 5;

// ✅ 시간 선택용 옵션들
const HOURS = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0")
);
const MINUTES = ["00", "10", "20", "30", "40", "50"];

// HH:MM 조합 만들어 주는 함수
function buildTime(h, m) {
  const hh = h || "";
  const mm = m || "";
  // 둘 다 비었을 때만 완전 빈 값
  if (!hh && !mm) return "";
  return `${hh}:${mm}`;
}

// HH:MM을 [HH, MM]으로 쪼개기
function splitTime(t) {
  if (!t) return ["", ""];
  const [h, m] = t.split(":");
  return [h ?? "", m ?? ""];
}

export default function BookingSheet({
  open,
  onClose,
  onConfirm,
  initialStart = null,
  initialRentTime = "",
  initialReturnTime = "",
  placeLabel = "인문관 308호",
}) {
  const [visible, setVisible] = useState(open);
  const [month, setMonth] = useState(startOfMonth(initialStart || new Date()));
  const [start, setStart] = useState(initialStart);   // 단일 날짜 선택

  // 사용자가 직접 정하는 대여/반납 시간 (HH:MM 문자열)
  const [rentTime, setRentTime] = useState(initialRentTime);       // 시작 시간
  const [returnTime, setReturnTime] = useState(initialReturnTime); // 종료 시간

  const overlayRef = useRef(null);

  /* open/close scroll lock */
  useEffect(() => {
    setVisible(open);
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* esc to close */
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    if (visible) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, onClose]);

  /* days grid */
  const days = useMemo(() => {
    const s = startOfMonth(month);
    const e = endOfMonth(month);
    const startOffset = s.getDay();
    const total = startOffset + e.getDate();
    const rows = Math.ceil(total / 7);
    const cells = [];
    for (let r = 0; r < rows * 7; r++) {
      const dayNum = r - startOffset + 1;
      cells.push(dayNum >= 1 && dayNum <= e.getDate() ? dayNum : null);
    }
    return cells;
  }, [month]);

  /* 월 라벨 */
  const monthLabel = useMemo(
    () => `${month.getFullYear()}.${String(month.getMonth() + 1).padStart(2, "0")}`,
    [month]
  );

  /* ===== 단일 날짜 토글 선택 ===== */
  const selectDate = (d) => {
    if (start && sameDay(d, start)) setStart(null);
    else setStart(d);
  };

  const resetAll = () => {
    setStart(null);
    setRentTime("");
    setReturnTime("");
  };

  // 화면에 보여줄 시/분 쪼개기
  const [rentHour, rentMin] = splitTime(rentTime);
  const [returnHour, returnMin] = splitTime(returnTime);

  // 핸들러(시작 시간)
  const handleRentHourChange = (e) => {
    const newHour = e.target.value;
    setRentTime(buildTime(newHour, rentMin));
  };
  const handleRentMinChange = (e) => {
    const newMin = e.target.value;
    setRentTime(buildTime(rentHour, newMin));
  };

  // 핸들러(종료 시간)
  const handleReturnHourChange = (e) => {
    const newHour = e.target.value;
    setReturnTime(buildTime(newHour, returnMin));
  };
  const handleReturnMinChange = (e) => {
    const newMin = e.target.value;
    setReturnTime(buildTime(returnHour, newMin));
  };

  const confirm = () => {
    // 날짜 + "시/분 둘 다 선택된" 시작/종료 시간 필요
    if (!start || !rentHour || !rentMin || !returnHour || !returnMin) return;

    const startStr = `${rentHour}:${rentMin}`;
    const endStr   = `${returnHour}:${returnMin}`;
    const timeRange = `${startStr}~${endStr}`;
    const summary = `${fmtYMD(start)} ${timeRange} · ${FIXED_PEOPLE}인`;

    onConfirm?.({
      date: start,
      start,
      end: null,
      slot: timeRange,
      slots: [timeRange],
      people: FIXED_PEOPLE,
      rentTime: startStr,
      returnTime: endStr,
      summary,
    });
    onClose?.();
  };

  if (!visible) return null;

  return (
    <div
      className={css.overlay}
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose?.(); }}
    >
      <section className={css.sheet} role="dialog" aria-modal="true" aria-label="장소 예약">
        {/* drag handle */}
        <div className={css.handle} />

        {/* header */}
        <header className={css.header}>
          <div className={css.headerLeft}>
            <div className={css.place}>{placeLabel}</div>

            {/* ✅ 인원 5인 고정 표시 */}
            <div className={css.peoplePill}>최대 {FIXED_PEOPLE}인</div>
          </div>

          <button className={css.closeBtn} onClick={onClose} aria-label="닫기">×</button>
        </header>

        {/* month title + 좌우 이동 */}
        <div className={css.monthRow}>
          <button
            className={css.monthBtn}
            onClick={() => setMonth(addDays(startOfMonth(month), -1))}
            aria-label="이전 달"
          >‹</button>

          <div className={css.monthLabel}>{monthLabel}</div>

          <button
            className={css.monthBtn}
            onClick={() => setMonth(addDays(endOfMonth(month), 1))}
            aria-label="다음 달"
          >›</button>
        </div>

        {/* week header */}
        <div className={css.weekHead}>
          {WEEK_LABEL.map((w) => <div key={w} className={css.weekCell}>{w}</div>)}
        </div>

        {/* calendar grid - 단일 선택 */}
        <div className={css.grid}>
          {days.map((n, i) => {
            if (!n) return <div key={i} className={css.cell} />;
            const d = new Date(month.getFullYear(), month.getMonth(), n);
            const isSel = sameDay(d, start);

            return (
              <button
                key={i}
                className={[css.cellBtn, isSel ? css.cellActive : ""].join(" ")}
                onClick={() => selectDate(d)}
                aria-pressed={isSel}
              >
                <span className={css.dayNum}>{n}</span>
              </button>
            );
          })}
        </div>

        {/* 시간 직접 입력 영역 */}
        <div className={css.sectionTitle}>예약가능한 시간</div>

        <div className={css.timeInputRow}>
          {/* 시작 시간 */}
          <label className={css.timeLabelInline}>
            시작
            <div className={css.timeSelectRow}>
              <select
                className={css.timeInput}
                value={rentHour}
                onChange={handleRentHourChange}
              >
                <option value="">시</option>
                {HOURS.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
              <span className={css.timeColon}>:</span>
              <select
                className={css.timeInput}
                value={rentMin}
                onChange={handleRentMinChange}
              >
                <option value="">분</option>
                {MINUTES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </label>

          {/* 종료 시간 */}
          <label className={css.timeLabelInline}>
            종료
            <div className={css.timeSelectRow}>
              <select
                className={css.timeInput}
                value={returnHour}
                onChange={handleReturnHourChange}
              >
                <option value="">시</option>
                {HOURS.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
              <span className={css.timeColon}>:</span>
              <select
                className={css.timeInput}
                value={returnMin}
                onChange={handleReturnMinChange}
              >
                <option value="">분</option>
                {MINUTES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </label>
        </div>

        {/* footer */}
        <footer className={css.footer}>
          <button className={css.resetBtn} onClick={resetAll}>
            <img
              src={refresh}
              alt=""
              aria-hidden="true"
              style={{ width: 22, height: 22, borderRadius: "50%" }}
            />
            초기화
          </button>
          <button
            className={css.ctaBtn}
            onClick={confirm}
            disabled={
              !start || !rentHour || !rentMin || !returnHour || !returnMin
            }
          >
            장소 예약하기
          </button>
        </footer>
      </section>
    </div>
  );
}

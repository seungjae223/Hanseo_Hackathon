import React, { useEffect, useMemo, useRef, useState } from "react";
import css from "../css/BookingSheet.module.css";

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
function isBetween(d, s, e) {
  if (!s || !e) return false;
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const xs = new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime();
  const xe = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime();
  return x > xs && x < xe;
}

const WEEK_LABEL = ["일","월","화","수","목","금","토"];
const RENT_TIMES = ["07:30","08:00","08:30","09:00","09:30","10:00","10:30","11:00"];
const RETURN_TIMES = ["13:00","14:00","14:30","15:00","15:30","16:00","16:30","17:00"];

export default function BookingSheet({
  open,
  onClose,
  onConfirm,
  initialStart = null,
  initialEnd = null,
  initialRentTime = "",
  initialReturnTime = "",
  placeLabel = "장소"
}) {
  const [visible, setVisible] = useState(open);
  const [month, setMonth] = useState(startOfMonth(initialStart || new Date()));
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialEnd);
  const [rentTime, setRentTime] = useState(initialRentTime);
  const [returnTime, setReturnTime] = useState(initialReturnTime);

  const overlayRef = useRef(null);

  useEffect(() => {
    setVisible(open);
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    if (visible) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, onClose]);

  const days = useMemo(() => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const startOffset = start.getDay(); // 0~6
    const total = startOffset + end.getDate(); // cells
    const rows = Math.ceil(total / 7);
    const cells = [];
    for (let r = 0; r < rows * 7; r++) {
      const dayNum = r - startOffset + 1;
      cells.push(dayNum >= 1 && dayNum <= end.getDate() ? dayNum : null);
    }
    return cells;
  }, [month]);

  const titleText = useMemo(() => {
    const range =
      start && end ? `${fmtYMD(start)} ~ ${fmtYMD(end)} (${Math.round((end - start)/86400000)}일)` :
      start ? `${fmtYMD(start)} ~` : "";
    return range;
  }, [start, end]);

  const selectDate = (d) => {
    if (!start || (start && end)) { setStart(d); setEnd(null); return; }
    if (d < start) { setEnd(start); setStart(d); return; }
    setEnd(d);
  };

  const resetAll = () => {
    setStart(null); setEnd(null); setRentTime(""); setReturnTime("");
  };

  const confirm = () => {
    if (!start || !end) return;
    onConfirm?.({
      start, end, rentTime, returnTime,
      summary: `${fmtYMD(start)} ~ ${fmtYMD(end)} ${rentTime && returnTime ? `(${rentTime} - ${returnTime})` : ""}`
    });
    onClose?.();
  };

  if (!visible) return null;

  return (
    <div className={css.overlay} ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) onClose?.(); }}>
      <section className={css.sheet} role="dialog" aria-modal="true" aria-label="예약 일정 선택">
        {/* Handle */}
        <div className={css.handle} />
        {/* Header */}
        <div className={css.header}>
          <button className={css.backBtn} onClick={onClose} aria-label="닫기">×</button>
          <div className={css.place}>{placeLabel}</div>
        </div>

        <div className={css.titleRow}>
          <h3 className={css.title}>언제 갈까요?</h3>
          <div className={css.rangeText}>{titleText}</div>
        </div>

        {/* Month switch */}
        <div className={css.monthRow}>
          <button className={css.monthBtn} onClick={() => setMonth(addDays(startOfMonth(month), -1))}>‹</button>
          <div className={css.monthLabel}>
            {month.getFullYear()}.{String(month.getMonth() + 1).padStart(2, "0")}
          </div>
          <button className={css.monthBtn} onClick={() => setMonth(addDays(endOfMonth(month), 1))}>›</button>
        </div>

        {/* Week header */}
        <div className={css.weekHead}>
          {WEEK_LABEL.map((w) => <div key={w} className={css.weekCell}>{w}</div>)}
        </div>

        {/* Calendar grid */}
        <div className={css.grid}>
          {days.map((n, i) => {
            if (!n) return <div key={i} className={css.cell} />;
            const d = new Date(month.getFullYear(), month.getMonth(), n);
            const isStart = sameDay(d, start);
            const isEnd = sameDay(d, end);
            const inRange = isBetween(d, start, end);
            return (
              <button
                key={i}
                className={[
                  css.cellBtn,
                  isStart ? css.start : "",
                  isEnd ? css.end : "",
                  inRange ? css.inRange : ""
                ].join(" ")}
                onClick={() => selectDate(d)}
                aria-pressed={isStart || isEnd}
              >
                <span className={css.dayNum}>{n}</span>
                {isStart && <span className={css.badge}>대여</span>}
                {isEnd && <span className={css.badge}>반납</span>}
              </button>
            );
          })}
        </div>

        {/* Time pickers */}
        <div className={css.timeGroup}>
          <div className={css.timeTitle}>대여시간</div>
          <div className={css.chips}>
            {RENT_TIMES.map((t) => (
              <button
                key={t}
                className={`${css.chip} ${rentTime === t ? css.chipActive : ""}`}
                onClick={() => setRentTime(t)}
              >{t}</button>
            ))}
          </div>
        </div>
        <div className={css.timeGroup}>
          <div className={css.timeTitle}>반납시간</div>
          <div className={css.chips}>
            {RETURN_TIMES.map((t) => (
              <button
                key={t}
                className={`${css.chip} ${returnTime === t ? css.chipActive : ""}`}
                onClick={() => setReturnTime(t)}
              >{t}</button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={css.footer}>
          <button className={css.resetBtn} onClick={resetAll}>초기화</button>
          <button className={css.submitBtn} onClick={confirm} disabled={!start || !end}>일정선택 완료</button>
        </div>
      </section>
    </div>
  );
}

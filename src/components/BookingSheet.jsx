import React, { useEffect, useMemo, useRef, useState } from "react";
import refresh from "../assets/새로고침.png";
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
const MORNING = ["8:00~9:00","9:00~10:00","10:00~11:00","11:00~12:00"];
const AFTERNOON = ["13:00~14:00","14:00~15:00","15:00~16:00","16:00~17:00"];

export default function BookingSheet({
  open,
  onClose,
  onConfirm,
  initialStart = null,
  initialRentTime = "",
  initialReturnTime = "",
  placeLabel = "인문관 308호",
  initialPeople = 2,
  minPeople = 1,
  maxPeople = 6,
}) {
  const [visible, setVisible] = useState(open);
  const [month, setMonth] = useState(startOfMonth(initialStart || new Date()));
  const [start, setStart] = useState(initialStart);   // 단일 선택
  const [rentTime, setRentTime] = useState(initialRentTime);
  const [returnTime, setReturnTime] = useState(initialReturnTime);
  const [picked, setPicked] = useState("");
  const [people, setPeople] = useState(initialPeople);
  const [peopleOpen, setPeopleOpen] = useState(false);

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

  /* 바깥 클릭 시 인원 팝오버 닫기 */
  useEffect(() => {
    const onDoc = (e) => {
      const withinPill = e.target.closest?.(`.${css.peoplePill}`);
      const withinPop  = e.target.closest?.(`.${css.peoplePop}`);
      if (!withinPill && !withinPop) setPeopleOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  /* days grid */
  const days = useMemo(() => {
    const s = startOfMonth(month);
    const e = endOfMonth(month);
    const startOffset = s.getDay();
    const total = startOffset + e.getDate();   // ← 오타 수정
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
    setRentTime(""); setReturnTime("");
    setPicked(""); setPeople(initialPeople);
  };

  const confirm = () => {
    if (!start) return;
    const summary = `${fmtYMD(start)}${picked ? ` (${picked})` : ""} · ${people}인`;
    onConfirm?.({
      date: start,          // 하루 예약: date 한 개만 전달
      start,                // (호환용)
      end: null,
      slot: picked,
      people,
      rentTime, returnTime,
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

            <button
              type="button"
              className={css.peoplePill}
              onClick={() => setPeopleOpen((v) => !v)}
              aria-expanded={peopleOpen}
              aria-haspopup="listbox"
            >
              {people}인
            </button>

            {peopleOpen && (
              <div className={css.peoplePop} role="listbox" aria-label="인원 선택">
                <div className={css.peoplePopTitle}>인원</div>
                <div className={css.peopleChips}>
                  {Array.from({ length: maxPeople - minPeople + 1 }, (_, i) => i + minPeople).map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`${css.chip} ${people === n ? css.chipActive : ""}`}
                      onClick={() => { setPeople(n); setPeopleOpen(false); }}
                      role="option"
                      aria-selected={people === n}
                    >
                      {n}인
                    </button>
                  ))}
                </div>
              </div>
            )}
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

        {/* 시간 선택 */}
        <div className={css.sectionTitle}>예약가능한 시간</div>

        <div className={css.timeBlock}>
          <div className={css.timeLabel}>오전</div>
          <div className={css.chips}>
            {MORNING.map((t) => (
              <button
                key={t}
                className={`${css.chip} ${picked === t ? css.chipActive : ""}`}
                onClick={() => setPicked(t)}
              >{t}</button>
            ))}
          </div>
        </div>

        <div className={css.timeBlock}>
          <div className={css.timeLabel}>오후</div>
          <div className={css.chips}>
            {AFTERNOON.map((t) => (
              <button
                key={t}
                className={`${css.chip} ${picked === t ? css.chipActive : ""}`}
                onClick={() => setPicked(t)}
              >{t}</button>
            ))}
          </div>
        </div>

        {/* footer (아이콘 적용) */}
        <footer className={css.footer}>
          <button className={css.resetBtn} onClick={resetAll}>
            <img
              src={refresh}
              alt=""        /* 장식 아이콘 */
              aria-hidden="true"
              style={{ width: 22, height: 22, borderRadius: "50%" }}
            />
            초기화
          </button>
          <button
            className={css.ctaBtn}
            onClick={confirm}
            disabled={!start}
          >
            장소 예약하기
          </button>
        </footer>
      </section>
    </div>
  );
}

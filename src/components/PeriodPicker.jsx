// src/components/PeriodPicker.jsx
import React, { useState } from "react";
import DateWheelPicker from "./DateWheelPicker";
import styles from "../css/PeriodPicker.module.css";

function fmt(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

export default function PeriodPicker() {
  // 시작일, 종료일 기본값
  const [startDate, setStartDate] = useState(() => new Date());
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  });

  // 모달 열림 여부 + 지금 어떤 날짜를 고르는 중인지
  const [isOpen, setIsOpen] = useState(false);
  const [activeField, setActiveField] = useState("start"); // "start" | "end"

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const handleWheelChange = (next) => {
    if (activeField === "start") setStartDate(next);
    else setEndDate(next);
  };

  return (
    <div className={styles.wrapper}>
      {/* 👉 기한 버튼 (폼에 항상 보이는 부분) */}
      <button type="button" className={styles.field} onClick={open}>
        <span className={styles.label}>기한</span>
        <span className={styles.value}>
          {fmt(startDate)} ~ {fmt(endDate)}
        </span>
      </button>

      {/* 👉 모달 */}
      {isOpen && (
        <div className={styles.backdrop} onClick={close}>
          <div
            className={styles.panel}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 상단 타이틀 */}
            <div className={styles.headerRow}>
              <span className={styles.headerTitle}>기한 선택</span>
            </div>

            {/* 시작 / 마감 탭 */}
            <div className={styles.tabRow}>
              <button
                type="button"
                className={
                  activeField === "start"
                    ? `${styles.tabButton} ${styles.active}`
                    : styles.tabButton
                }
                onClick={() => setActiveField("start")}
              >
                시작일
              </button>
              <button
                type="button"
                className={
                  activeField === "end"
                    ? `${styles.tabButton} ${styles.active}`
                    : styles.tabButton
                }
                onClick={() => setActiveField("end")}
              >
                마감일
              </button>
            </div>

            {/* 가운데 휠 + '기한' 라벨 띄우기 */}
            <div className={styles.wheelBox}>
              <span className={styles.floatingLabel}>기한</span>
              <DateWheelPicker
                value={activeField === "start" ? startDate : endDate}
                onChange={handleWheelChange}
              />
            </div>

            {/* 하단 버튼 */}
            <div className={styles.buttonRow}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={close}
              >
                취소
              </button>
              <button
                type="button"
                className={styles.okBtn}
                onClick={close}
              >
                완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

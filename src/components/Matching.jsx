// src/pages/Matching.jsx
import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../css/Matching.module.css";

import RightIcon from "../assets/옆.png";
import LibraryImg from "../assets/Mockup.png";

import BookingSheet from "../components/BookingSheet";

/* ──────────────────────────────────────────────
   1. 날짜/시간 유틸리티 (필터링 및 목업용)
   ────────────────────────────────────────────── */
const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

// 오늘부터 count일 뒤까지 날짜 옵션 생성
function makeDayOptions(baseDate = new Date(), count = 4) {
  const result = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    result.push({
      value: `${y}-${m}-${day}`, // 데이터 매칭용 키 (예: 2024-11-28)
      label: `${m}/${day}`,      // 화면 표시용 (예: 11/28)
      weekday: DAY_LABELS[d.getDay()],
    });
  }
  return result;
}

const SLOT_OPTIONS = [
  { value: "00:00-00:30", label: "00:00 ~ 00:30" },
  { value: "00:30-01:00", label: "00:30 ~ 01:00" },
  { value: "01:00-01:30", label: "01:00 ~ 01:30" },
  { value: "01:30-02:00", label: "01:30 ~ 02:00" },
];

/* ──────────────────────────────────────────────
   2. 목업 데이터
   ────────────────────────────────────────────── */
// 필터링 테스트를 위해 날짜 옵션을 미리 생성
const todayOpts = makeDayOptions(); 

const MOCK_ROOMS = [
  {
    id: 101,
    title: "인문관 2층 208호",
    imageUrl: LibraryImg,
    desc: "조용하게 공부얘기 하기 좋아요",
    tags: ["조용한", "청결"],
  },
  {
    id: 102,
    title: "건축관 1층 스튜디오 A",
    imageUrl: LibraryImg,
    desc: "팀 스터디에 최적화된 공간",
    tags: ["화이트보드", "콘센트 多"],
  },
  {
    id: 103,
    title: "인문관 1층 라운지",
    imageUrl: LibraryImg,
    desc: "간단 회의/피드백에 좋아요",
    tags: ["라운지", "편안"],
  },
];

const LABEL = {
  WAITING: "대기중",
  BOOKED: "예약완료",
  CONFIRMED: "예약확인",
  CANCELLED: "취소됨",
};

// 🔥 [핵심] 필터링이 동작하도록 date와 time 속성을 추가했습니다.
const MOCK_RESERVATIONS = [
  {
    id: 9001,
    room: { building: "건축관", name: "504호", thumbnailUrl: LibraryImg },
    status: "WAITING",
    date: todayOpts[0].value,   // 오늘 날짜
    time: "00:00-00:30",        // 첫번째 시간대
  },
  {
    id: 9002,
    room: { building: "인문관", name: "208호", thumbnailUrl: LibraryImg },
    status: "BOOKED",
    date: todayOpts[0].value,   // 오늘 날짜
    time: "00:00-00:30",        // 같은 시간대
  },
  {
    id: 9003,
    room: { building: "창업관", name: "라운지", thumbnailUrl: LibraryImg },
    status: "WAITING",
    date: todayOpts[0].value,   // 오늘 날짜
    time: "00:30-01:00",        // 다른 시간대
  },
  {
    id: 9004,
    room: { building: "인문관", name: "세미나실 A", thumbnailUrl: LibraryImg },
    status: "CONFIRMED",
    date: todayOpts[1].value,   // 내일 날짜
    time: "00:00-00:30",
  },
];

/* 포탈 컴포넌트 */
function NextFab({ onClick }) {
  return createPortal(
    <button className={styles.nextFab} onClick={onClick} aria-label="다음 공간">
      <img src={RightIcon} alt="" />
    </button>,
    document.body
  );
}

export default function Matching() {
  const [mode, setMode] = useState("grid"); // "grid" | "status"
  const [detailIdx, setDetailIdx] = useState(0);

  const [rooms] = useState(MOCK_ROOMS);
  const [reservations, setReservations] = useState(MOCK_RESERVATIONS);

  /* 필터 상태 */
  const [dayOptions] = useState(() => makeDayOptions());
  const [selectedDay, setSelectedDay] = useState(dayOptions[0].value);
  const [selectedSlot, setSelectedSlot] = useState(SLOT_OPTIONS[0].value);

  /* 바텀시트 */
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetRoom, setSheetRoom] = useState(null);

  const threeRooms = useMemo(() => rooms.slice(0, 3), [rooms]);

  /* 🔥 [필터 로직] 선택된 날짜와 시간에 맞는 예약만 필터링 */
  const filteredList = useMemo(() => {
    // 1. 조건에 맞는 데이터 찾기
    const found = reservations.filter(
      (r) => r.date === selectedDay && r.time === selectedSlot
    );

    // 2. UI 표시용으로 변환
    return found.map((r) => ({
      id: r.id,
      title: `${r.room?.building ?? ""} ${r.room?.name ?? ""}`.trim(),
      status: LABEL[r.status] || r.status || "대기중",
      img: r.room?.thumbnailUrl || LibraryImg,
      dim: r.status === "BOOKED",
      subtitle: r.schedule?.summary || `${r.date.slice(5)} · ${r.time}`,
    }));
  }, [reservations, selectedDay, selectedSlot]);

  const nextDetail = () => setDetailIdx((p) => (p + 1) % threeRooms.length);

  const openSheetFromDetail = () => {
    setSheetRoom(threeRooms[detailIdx]);
    setSheetOpen(true);
  };

  const handleConfirmSchedule = ({ start, end, rentTime, returnTime, summary }) => {
    if (!sheetRoom) return;
    const building = sheetRoom.title.split(" ")[0] || "건물";
    const name = sheetRoom.title.replace(`${building} `, "") || "공간";

    // 예약 추가 시 현재 선택된 필터 날짜/시간 정보를 넣어서 바로 보이게 함
    const newItem = {
      id: Date.now(),
      room: { building, name, thumbnailUrl: sheetRoom.imageUrl || LibraryImg },
      status: "WAITING",
      date: selectedDay,
      time: selectedSlot,
      schedule: { start, end, rentTime, returnTime, summary },
    };
    setReservations((prev) => [newItem, ...prev]);
    setSheetOpen(false);
    setSheetRoom(null);
    setDetailIdx(0);
    setMode("status");
  };

  /* 인라인 스타일: 선택된 버튼 강조용 (CSS 파일 수정 없이 구현) */
  const getBtnStyle = (isActive) => ({
    flex: 1, // 버튼이 가로 공간을 균등하게 차지
    padding: "8px 0",
    borderRadius: "8px",
    border: "none",
    backgroundColor: isActive ? "#fde047" : "#fff", // 활성: 노랑, 비활성: 흰색
    color: isActive ? "#000" : "#666",
    fontWeight: isActive ? "bold" : "normal",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: isActive ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
  });

  return (
    <div className={styles.wrap}>
      <header className={styles.detailHeader}>
        <p className={styles.detailHeadline}>
          집중을 위한 공간, 실행을 위한 선택.
        </p>
      </header>

      <div className={styles.statusWrap}>
        <button
          className={`${styles.statusBtn} ${
            mode === "status" ? styles.statusBtnActive : ""
          }`}
          onClick={() => setMode((m) => (m === "grid" ? "status" : "grid"))}
        >
          예약현황
        </button>
      </div>

      {/* ====== 상세 화면 ====== */}
      {mode === "grid" && (
        <section className={styles.detailWrap}>
          <div className={styles.detailCard}>
            <h3 className={styles.detailTitle}>{threeRooms[detailIdx].title}</h3>
            <div className={styles.detailPhotoWrap}>
              <img
                className={styles.detailPhoto}
                src={threeRooms[detailIdx].imageUrl}
                alt=""
              />
            </div>
            <p className={styles.detailDesc}>{threeRooms[detailIdx].desc}</p>
            {threeRooms[detailIdx].tags?.length > 0 && (
              <p className={styles.detailTags}>
                {threeRooms[detailIdx].tags.map((t) => `#${t}`).join(" ")}
              </p>
            )}
          </div>
          <div className={styles.ctaRow}>
            <button className={styles.ctaBtn} onClick={openSheetFromDetail}>
              예약하기
            </button>
          </div>
        </section>
      )}

      {mode === "grid" && <NextFab onClick={nextDetail} />}

      {/* ====== 예약현황 (CSS 파일 수정 없이 인라인 스타일로 디자인 변경) ====== */}
      {mode === "status" && (
        <section className={styles.statusPanel} aria-label="예약현황 목록">
          
          {/* 필터 영역 컨테이너 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "0 16px", marginBottom: "16px" }}>
            
            {/* 1. 날짜 선택 행 (회색 박스 배경) */}
            <div style={{ backgroundColor: "#e5e7eb", borderRadius: "12px", padding: "6px", display: "flex", gap: "6px" }}>
              {/* 레이블(날짜) 삭제됨 -> 버튼만 렌더링 */}
              {dayOptions.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setSelectedDay(d.value)}
                  style={getBtnStyle(d.value === selectedDay)}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* 2. 시간대 선택 행 (회색 박스 배경) */}
            <div style={{ backgroundColor: "#e5e7eb", borderRadius: "12px", padding: "6px", display: "flex", gap: "6px", overflowX: "auto" }}>
              {SLOT_OPTIONS.map((s) => {
                 // 시간 텍스트 줄바꿈 처리 ("~" 기준)
                 const [start, end] = s.label.split(" ~ ");
                 return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setSelectedSlot(s.value)}
                    style={{
                        ...getBtnStyle(s.value === selectedSlot),
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: '1.2'
                    }}
                  >
                    <span>{start}~</span>
                    <span>{end}</span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* 예약 리스트 */}
          <ul className={styles.statusList}>
            {filteredList.length > 0 ? (
              filteredList.map((r) => (
                <li key={r.id} className={styles.statusItem}>
                  <div className={`${styles.thumb} ${r.dim ? styles.thumbDim : ""}`}>
                    <img src={r.img} alt="" />
                  </div>
                  <div className={styles.meta}>
                    <div className={styles.metaTitle}>{r.title}</div>
                    {r.subtitle && <div className={styles.metaSub}>{r.subtitle}</div>}
                  </div>
                  <div
                    className={`${styles.badge} ${
                      r.status === "예약완료"
                        ? styles.badgeDone
                        : r.status === "예약확인"
                        ? styles.badgeConfirm
                        : styles.badgeWait
                    }`}
                  >
                    {r.status}
                  </div>
                </li>
              ))
            ) : (
              // 데이터 없음 표시
              <li style={{ padding: "40px 0", textAlign: "center", color: "#999", fontSize: "14px" }}>
                해당 시간대에 예약 내역이 없습니다.
              </li>
            )}
          </ul>
        </section>
      )}

      <BookingSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onConfirm={handleConfirmSchedule}
        placeLabel={sheetRoom ? sheetRoom.title : "장소"}
      />
    </div>
  );
}
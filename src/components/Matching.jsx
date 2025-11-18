// src/pages/Matching.jsx
import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";           // ⭐ 포탈
import styles from "../css/Matching.module.css";

import RightIcon from "../assets/옆.png";
import LibraryImg from "../assets/Mockup.png";

/* 달력 바텀시트 */
import BookingSheet from "../components/BookingSheet";

/* ──────────────────────────────────────────────
   목업 데이터(상세용 필드 포함)
   ────────────────────────────────────────────── */
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

/* 🔸 예약현황 목업 데이터 (목업 화면처럼 여러 줄) */
const MOCK_RESERVATIONS = [
  {
    id: 9001,
    room: { building: "건축관", name: "504호", thumbnailUrl: LibraryImg },
    status: "WAITING",
  },
  {
    id: 9002,
    room: { building: "인문관", name: "208호", thumbnailUrl: LibraryImg },
    status: "BOOKED",
  },
  {
    id: 9003,
    room: { building: "인문관", name: "세미나실 A", thumbnailUrl: LibraryImg },
    status: "CONFIRMED",
  },
  {
    id: 9004,
    room: { building: "창업관", name: "라운지", thumbnailUrl: LibraryImg },
    status: "WAITING",
  },
];

/* (지금은 안 쓰지만 필요하면 쓸 수 있게 남겨둔 디바운스 훅) */
function useDebounced(value, delay = 300) {
  const [v, setV] = useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

/*  화살표를 body에 직접 렌더하는 포탈 컴포넌트 */
function NextFab({ onClick }) {
  return createPortal(
    <button className={styles.nextFab} onClick={onClick} aria-label="다음 공간">
      <img src={RightIcon} alt="" />
    </button>,
    document.body
  );
}

export default function Matching() {
  /* 🔸 처음 들어오면 ‘공간 상세’ 화면 보이도록 */
  const [mode, setMode] = useState("grid");      // "grid" | "status"
  const [detailIdx, setDetailIdx] = useState(0); // 상세 화면 인덱스

  const [rooms] = useState(MOCK_ROOMS);
  const [reservations, setReservations] = useState(MOCK_RESERVATIONS);

  /* 바텀시트 */
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetRoom, setSheetRoom] = useState(null);

  // 첫 화면은 3장 고정
  const threeRooms = useMemo(() => rooms.slice(0, 3), [rooms]);

  // 예약현황 변환
  const statusItems = useMemo(
    () =>
      reservations.map((r) => ({
        id: r.id,
        title: `${r.room?.building ?? ""} ${r.room?.name ?? ""}`.trim(),
        status: LABEL[r.status] || r.status || "대기중",
        img: r.room?.thumbnailUrl || LibraryImg,
        dim: r.status === "BOOKED",
        subtitle: r.schedule?.summary || "",
      })),
    [reservations]
  );

  // 아래 화살표 눌렀을 때 다음 장소로 순환
  const nextDetail = () => setDetailIdx((p) => (p + 1) % threeRooms.length);

  // 상세에서만 예약하기 → 달력
  const openSheetFromDetail = () => {
    setSheetRoom(threeRooms[detailIdx]);
    setSheetOpen(true);
  };

  const handleConfirmSchedule = ({
    start,
    end,
    rentTime,
    returnTime,
    summary,
  }) => {
    if (!sheetRoom) return;
    const building = sheetRoom.title.split(" ")[0] || "건물";
    const name = sheetRoom.title.replace(`${building} `, "") || "공간";
    const newItem = {
      id: Date.now(),
      room: { building, name, thumbnailUrl: sheetRoom.imageUrl || LibraryImg },
      status: "WAITING",
      schedule: { start, end, rentTime, returnTime, summary },
    };
    setReservations((prev) => [newItem, ...prev]);
    setSheetOpen(false);
    setSheetRoom(null);
    setDetailIdx(0);
    setMode("status");
  };

  return (
    <div className={styles.wrap}>
      {/* ───── 상단 문구 ───── */}
      <header className={styles.detailHeader}>
        <p className={styles.detailHeadline}>
          집중을 위한 공간, 실행을 위한 선택.
        </p>
      </header>

      {/* 예약현황 버튼 */}
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
            <h3 className={styles.detailTitle}>
              {threeRooms[detailIdx].title}
            </h3>
            <div className={styles.detailPhotoWrap}>
              <img
                className={styles.detailPhoto}
                src={threeRooms[detailIdx].imageUrl}
                alt=""
              />
            </div>
            <p className={styles.detailDesc}>
              {threeRooms[detailIdx].desc}
            </p>
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

      {/* 🔻 하단 화살표 — 포탈로 body에 고정 렌더 */}
      {mode === "grid" && <NextFab onClick={nextDetail} />}

      {/* ====== 예약현황 ====== */}
      {mode === "status" && (
        <section className={styles.statusPanel} aria-label="예약현황 목록">
          <ul className={styles.statusList}>
            {statusItems.map((r) => (
              <li key={r.id} className={styles.statusItem}>
                <div
                  className={`${styles.thumb} ${
                    r.dim ? styles.thumbDim : ""
                  }`}
                >
                  <img src={r.img} alt="" />
                </div>
                <div className={styles.meta}>
                  <div className={styles.metaTitle}>{r.title}</div>
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
            ))}
          </ul>
        </section>
      )}

      {/* ====== 달력 바텀시트 ====== */}
      <BookingSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onConfirm={handleConfirmSchedule}
        placeLabel={sheetRoom ? sheetRoom.title : "장소"}
      />
    </div>
  );
}

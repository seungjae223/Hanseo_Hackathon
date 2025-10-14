// src/pages/Matching.jsx
import React, { useEffect, useMemo, useState } from "react";
import styles from "../css/Matching.module.css";

import SearchIcon from "../assets/Search.png";
import RightIcon from "../assets/옆.png";
import LibraryImg from "../assets/Mockup.png";

/* 달력 바텀시트 */
import BookingSheet from "../components/BookingSheet";

/* ──────────────────────────────────────────────
   목업 데이터(상세용 필드 포함)
   ────────────────────────────────────────────── */
const MOCK_ROOMS = [
  { id: 101, title: "인문관 2층 208호", imageUrl: LibraryImg, desc: "조용하게 공부얘기 하기 좋아요", tags: ["조용한", "청결"] },
  { id: 102, title: "건축관 1층 스튜디오 A", imageUrl: LibraryImg, desc: "팀 스터디에 최적화된 공간", tags: ["화이트보드", "콘센트 多"] },
  { id: 103, title: "인문관 1층 라운지", imageUrl: LibraryImg, desc: "간단 회의/피드백에 좋아요", tags: ["라운지", "편안"] },
];

const LABEL = { WAITING: "대기중", BOOKED: "예약완료", CONFIRMED: "예약확인", CANCELLED: "취소됨" };
const MOCK_RESERVATIONS = [
  { id: 9001, room: { building: "건축관", name: "504호", thumbnailUrl: LibraryImg }, status: "WAITING" },
];

/* 디바운스 */
function useDebounced(value, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function Matching() {
  const [mode, setMode] = useState("grid");      // grid | status
  const [detailIdx, setDetailIdx] = useState(null);

  const [q, setQ] = useState("");
  const dq = useDebounced(q, 300);

  const [rooms, setRooms] = useState(MOCK_ROOMS);
  const [reservations, setReservations] = useState(MOCK_RESERVATIONS);

  /* 바텀시트 */
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetRoom, setSheetRoom] = useState(null);

  // 검색 필터
  useEffect(() => {
    if (!dq) { setRooms(MOCK_ROOMS); return; }
    const lower = dq.toLowerCase();
    setRooms(MOCK_ROOMS.filter(r => r.title.toLowerCase().includes(lower)));
    setDetailIdx(null);
  }, [dq]);

  // 첫 화면은 3장 고정
  const threeRooms = useMemo(() => rooms.slice(0, 3), [rooms]);

  // 예약현황 변환
  const statusItems = useMemo(
    () => reservations.map(r => ({
      id: r.id,
      title: `${r.room?.building ?? ""} ${r.room?.name ?? ""}`.trim(),
      status: LABEL[r.status] || r.status || "대기중",
      img: r.room?.thumbnailUrl || LibraryImg,
      dim: r.status === "BOOKED",
      subtitle: r.schedule?.summary || "",
    })),
    [reservations]
  );

  // 네비
  const openDetail = (i) => { if (threeRooms[i]) setDetailIdx(i); };
  const closeDetail = () => setDetailIdx(null);
  const nextDetail  = () => setDetailIdx((p) => (p == null ? 0 : (p + 1) % threeRooms.length));

  // 상세에서만 예약하기 → 달력
  const openSheetFromDetail = () => {
    if (detailIdx == null) return;
    setSheetRoom(threeRooms[detailIdx]);
    setSheetOpen(true);
  };

  const handleConfirmSchedule = ({ start, end, rentTime, returnTime, summary }) => {
    if (!sheetRoom) return;
    const building = sheetRoom.title.split(" ")[0] || "건물";
    const name = sheetRoom.title.replace(`${building} `, "") || "공간";
    const newItem = {
      id: Date.now(),
      room: { building, name, thumbnailUrl: sheetRoom.imageUrl || LibraryImg },
      status: "WAITING",
      schedule: { start, end, rentTime, returnTime, summary },
    };
    setReservations(prev => [newItem, ...prev]);
    setSheetOpen(false);
    setSheetRoom(null);
    setDetailIdx(null);
    setMode("status");
  };

  return (
    <div className={styles.wrap}>
      {/* 상단 검색/버튼 */}
      <div className={styles.searchBar} role="search">
        <img src={SearchIcon} alt="" aria-hidden className={styles.searchIcon}/>
        <input
          className={styles.searchInput}
          placeholder="자신과 맞는 장소를 검색해보세요!"
          aria-label="장소 검색"
          value={q}
          onChange={(e)=>setQ(e.target.value)}
        />
      </div>
      <div className={styles.statusWrap}>
        <button
          className={`${styles.statusBtn} ${mode==="status" ? styles.statusBtnActive : ""}`}
          onClick={() => { setMode(m=>m==="grid"?"status":"grid"); setDetailIdx(null); }}
        >
          예약현황
        </button>
      </div>

      {/* ====== 첫 화면(그리드) ====== */}
      {mode === "grid" && detailIdx == null && (
        <section className={styles.landingSection}>
          <div className={styles.landingGrid}>
            {threeRooms.map((room, i) => {
              const building = (room.title || "").split(" ")[0];
              const isLast = i === 2;
              return (
                <button
                  key={room.id}
                  className={`${styles.thumbCard} ${isLast ? styles.thumbCardFull : ""}`}
                  onClick={() => openDetail(i)}
                >
                  <div className={styles.thumbWrap}>
                    <img className={styles.thumbImg} src={room.imageUrl} alt="" />
                  </div>
                  <span className={styles.thumbCaption}>{building}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ====== 상세 화면 ====== */}
      {mode === "grid" && detailIdx != null && (
        <section className={styles.detailWrap}>
          <div className={styles.detailCard} onClick={(e)=>e.stopPropagation()}>
            <h3 className={styles.detailTitle}>{threeRooms[detailIdx].title}</h3>
            <div className={styles.detailPhotoWrap}>
              <img className={styles.detailPhoto} src={threeRooms[detailIdx].imageUrl} alt=""/>
            </div>
            <p className={styles.detailDesc}>{threeRooms[detailIdx].desc}</p>
            {threeRooms[detailIdx].tags?.length>0 && (
              <p className={styles.detailTags}>
                {threeRooms[detailIdx].tags.map(t=>`#${t}`).join(" ")}
              </p>
            )}
          </div>

          <div className={styles.ctaRow}>
            <button className={styles.ctaBtn} onClick={openSheetFromDetail}>
              예약하기
            </button>
          </div>

          <button className={styles.nextFab} onClick={nextDetail} aria-label="다음 공간">
            <img src={RightIcon} alt=""/>
          </button>
          <div className={styles.detailBackdrop} onClick={closeDetail}/>
        </section>
      )}

      {/* ====== 예약현황 ====== */}
      {mode==="status" && (
        <section className={styles.statusPanel} aria-label="예약현황 목록">
          <ul className={styles.statusList}>
            {statusItems.map(r=>(
              <li key={r.id} className={styles.statusItem}>
                <div className={`${styles.thumb} ${r.dim?styles.thumbDim:""}`}>
                  <img src={r.img} alt=""/>
                </div>
                <div className={styles.meta}>
                  <div className={styles.metaTitle}>{r.title}</div>
                </div>
                <div className={`${styles.badge} ${
                    r.status==="예약완료" ? styles.badgeDone :
                    r.status==="예약확인" ? styles.badgeConfirm :
                    styles.badgeWait
                  }`}>
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
        onClose={()=>setSheetOpen(false)}
        onConfirm={handleConfirmSchedule}
        placeLabel={sheetRoom ? sheetRoom.title : "장소"}
      />
    </div>
  );
}

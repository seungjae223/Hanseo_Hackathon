// src/pages/Matching.jsx
import React, { useEffect, useMemo, useState } from "react";
import styles from "../css/Matching.module.css";

import SearchIcon from "../assets/Search.png";
import RightIcon from "../assets/옆.png";
import LibraryImg from "../assets/Mockup.png";

/* ──────────────────────────────────────────────
   목업 데이터 (백엔드 연동 전용)
   ────────────────────────────────────────────── */
const MOCK_ROOMS = [
  {
    id: 101,
    title: "한서대학교 인문관 2층 208호",
    imageUrl: LibraryImg,
    tags: ["조용함", "화이트보드"],
  },
  {
    id: 102,
    title: "한서대학교 도서관 1층 스터디룸 A",
    imageUrl: LibraryImg,
    tags: ["스터디", "프로젝터", "콘센트"],
  },
  {
    id: 103,
    title: "한서대학교 공학관 4층 402호",
    imageUrl: LibraryImg,
    tags: ["회의", "빔스크린"],
  },
  {
    id: 104,
    title: "한서대학교 경상관 3층 312호",
    imageUrl: LibraryImg,
    tags: ["팀플", "칠판", "햇빛좋음"],
  },
  {
    id: 105,
    title: "한서대학교 체육관 세미나실 101",
    imageUrl: LibraryImg,
    tags: ["세미나", "넓음"],
  },
  {
    id: 106,
    title: "한서대학교 예술관 2층 215호",
    imageUrl: LibraryImg,
    tags: ["작업실", "소음주의"],
  },
  {
    id: 107,
    title: "한서대학교 항공관 1층 시뮬레이터실",
    imageUrl: LibraryImg,
    tags: ["시뮬레이터", "예약필수"],
  },
  {
    id: 108,
    title: "한서대학교 미래관 5층 503호",
    imageUrl: LibraryImg,
    tags: ["회의", "뷰좋음"],
  },
];

// 상태 라벨 매핑 (UI 용)
const LABEL = { WAITING: "대기중", BOOKED: "예약완료", CONFIRMED: "예약확인", CANCELLED: "취소됨" };

// 초기 예약현황(스크린샷 구성과 유사)
const MOCK_RESERVATIONS = [
  {
    id: 9001,
    room: { building: "건축관", name: "504호", thumbnailUrl: LibraryImg },
    status: "WAITING",
  },
  {
    id: 9002,
    room: { building: "건축관", name: "504호", thumbnailUrl: LibraryImg },
    status: "BOOKED",
  },
  {
    id: 9003,
    room: { building: "건축관", name: "504호", thumbnailUrl: LibraryImg },
    status: "CONFIRMED",
  },
  {
    id: 9004,
    room: { building: "건축관", name: "504호", thumbnailUrl: LibraryImg },
    status: "WAITING",
  },
];

/* 디바운스 훅 */
function useDebounced(value, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function Matching() {
  const [page, setPage] = useState(0);
  const [mode, setMode] = useState("grid"); // "grid" | "status"

  // 검색 상태(목업 필터용)
  const [q, setQ] = useState("");
  const dq = useDebounced(q, 300);

  // 목업 데이터 상태화
  const [rooms, setRooms] = useState(MOCK_ROOMS);
  const [reservations, setReservations] = useState(MOCK_RESERVATIONS);

  // 검색어에 맞춰 방 목록 필터링
  useEffect(() => {
    if (!dq) {
      setRooms(MOCK_ROOMS);
      return;
    }
    const lower = dq.toLowerCase();
    const filtered = MOCK_ROOMS.filter(
      (r) =>
        r.title.toLowerCase().includes(lower) ||
        (r.tags || []).some((t) => String(t).toLowerCase().includes(lower))
    );
    setRooms(filtered);
    setPage(0); // 검색 시 첫 페이지로
  }, [dq]);

  const goNext = () => setPage((p) => ((p + 1) % 2));
  const goPrev = () => setPage((p) => ((p - 1 + 2) % 2));

  // 4개씩 2페이지로 분할(목업 기준 8개)
  const pages = useMemo(() => {
    const list = rooms.slice(0, 8);
    const pad = list.length < 8 ? [...list, ...Array(8 - list.length).fill(null)] : list;
    return [pad.slice(0, 4), pad.slice(4, 8)];
  }, [rooms]);

  // 예약하기(목업): 선택한 방으로 WAITING 예약을 하나 추가
  function handleReserve(room) {
    if (!room) return;
    const building = room.title.split(" ")[0] || "건물";
    const name = room.title.replace(`${building} `, "") || "공간";
    const newItem = {
      id: Date.now(),
      room: { building, name, thumbnailUrl: room.imageUrl || LibraryImg },
      status: "WAITING",
    };
    setReservations((prev) => [newItem, ...prev]);
    alert("예약이 추가되었습니다. ");
  }

  // UI에 맞춘 예약현황 변환
  const statusItems = useMemo(
    () =>
      reservations.map((r) => ({
        id: r.id,
        title: `${r.room?.building ?? ""} ${r.room?.name ?? ""}`.trim() || "알 수 없는 공간",
        status: LABEL[r.status] || r.status || "대기중",
        img: r.room?.thumbnailUrl || LibraryImg,
        dim: r.status === "BOOKED",
        tone: r.status === "CONFIRMED" ? "confirm" : undefined,
      })),
    [reservations]
  );

  return (
    <div className={styles.wrap}>
      {/* 검색/예약현황 */}
      <div className={styles.searchBar} role="search">
        <img src={SearchIcon} alt="" aria-hidden className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder="자신과 맞는 장소를 검색해보세요!"
          aria-label="장소 검색"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className={styles.statusWrap}>
        <button
          className={`${styles.statusBtn} ${mode === "status" ? styles.statusBtnActive : ""}`}
          onClick={() => setMode((m) => (m === "grid" ? "status" : "grid"))}
        >
          예약현황
        </button>
      </div>

      {/* 본문 */}
      {mode === "grid" ? (
        <>
          {/* 슬라이더 */}
          <div className={styles.slider}>
            <div className={styles.trackX} style={{ ["--page"]: page, ["--pages"]: 2 }}>
              {pages.map((group, pageIdx) => (
                <section className={styles.slidePage} key={pageIdx}>
                  <div className={styles.grid2x2}>
                    {group.map((room, i) => {
                      const isP1 = pageIdx === 0;
                      const isCard1 = isP1 && i === 0;
                      const isCard2 = isP1 && i === 1;

                      return (
                        <article className={styles.card} key={`${pageIdx}-${i}`}>
                          <h3 className={styles.roomTitle}>{room ? room.title : "공간 준비중"}</h3>
                          <img className={styles.photo} src={room?.imageUrl || LibraryImg} alt="" />

                          {isCard1 && (
                            <>
                              <div className={`${styles.box} ${styles.bigBox}`}>
                                {room?.tags?.length
                                  ? room.tags.slice(0, 3).map((t) => (
                                      <span key={t} className={styles.tag}>#{t}</span>
                                    ))
                                  : "해시태그나 글"}
                              </div>
                              <button
                                className={styles.reserveBtn}
                                disabled={!room}
                                onClick={() => room && handleReserve(room)}
                              >
                                예약
                              </button>
                            </>
                          )}

                          {isCard2 && (
                            <>
                              <div className={`${styles.box} ${styles.hashBox}`}>
                                <div className={styles.hashRow}>
                                  <span className={styles.tag}>#조용함</span>
                                  <span className={styles.tag}>#청결</span>
                                </div>
                              </div>
                              <button
                                className={styles.reserveBtn}
                                disabled={!room}
                                onClick={() => room && handleReserve(room)}
                              >
                                예약
                              </button>
                            </>
                          )}

                          {!isCard1 && !isCard2 && (
                            <>
                              <div className={`${styles.box} ${styles.medBox}`} />
                              <button
                                className={styles.reserveBtn}
                                disabled={!room}
                                onClick={() => room && handleReserve(room)}
                              >
                                예약
                              </button>
                            </>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>

          {/* 네비게이션 */}
          <div className={styles.pager}>
            <button className={styles.prevBtn} onClick={goPrev} aria-label="이전 페이지">
              <img src={RightIcon} alt="" className={styles.rotate180} />
            </button>
            <button className={styles.nextBtn} onClick={goNext} aria-label="다음 페이지">
              <img src={RightIcon} alt="" />
            </button>
          </div>
        </>
      ) : (
        // 예약현황 리스트 화면
        <section className={styles.statusPanel} aria-label="예약현황 목록">
          <ul className={styles.statusList}>
            {statusItems.map((r) => (
              <li key={r.id} className={styles.statusItem}>
                <div className={`${styles.thumb} ${r.dim ? styles.thumbDim : ""}`}>
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
    </div>
  );
}

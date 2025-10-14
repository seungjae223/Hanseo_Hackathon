// src/pages/Contest.jsx
import React, { useEffect, useState } from "react";
import styles from "../css/Contest.module.css";
import SearchIcon from "../assets/Search.png";

export default function Contest() {
  // ▲ 배너 데이터(연동)
  const [banner, setBanner] = useState(null); // { id, title, bannerUrl }
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr("");

    fetch("/api/contests/featured", { headers: { Accept: "application/json" } })
      .then(async (r) => {
        if (!r.ok) {
          // 오류 메시지 파싱 시도
          let msg = r.statusText;
          try {
            const j = await r.json();
            msg = j?.error?.message || msg;
          } catch (_) {}
          throw new Error(msg);
        }
        return r.json();
      })
      .then((j) => {
        if (alive) setBanner(j);
      })
      .catch((e) => alive && setErr(e.message))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, []);

  // 배너 스타일(이미지 연동 시 배경으로)
  const bannerStyle = banner?.bannerUrl
    ? {
        backgroundImage: `url(${banner.bannerUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {};

  return (
    <div className={styles.wrap}>
      {/* 검색바 (얇은 테두리, 작은 아이콘) */}
      <div className={styles.searchBar} role="search">
        <img src={SearchIcon} alt="" aria-hidden="true" className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder="자신과 맞는 공모전을 검색해보세요!"
          aria-label="공모전 검색"
        />
      </div>

      {/* 상단 큰 카드 — 백엔드 연동 */}
      <div className={styles.cardXL} style={bannerStyle}>
        {/* 로딩/에러/정상 타이틀 오버레이 */}
        {loading ? (
          <span className={styles.centerText}>불러오는 중…</span>
        ) : err ? (
          <span className={styles.centerText}>공모전 사진</span>
        ) : (
          <span
            className={styles.centerText}
            style={{
              color: "#fff",
              textShadow: "0 2px 12px rgba(0,0,0,.35)",
              background:
                "linear-gradient(to top, rgba(0,0,0,.35), rgba(0,0,0,0))",
              padding: "18px 22px",
              borderRadius: "0 0 20px 20px",
              alignSelf: "flex-end",
              width: "100%",
              textAlign: "center",
            }}
          >
            {banner?.title || "공모전 사진"}
          </span>
        )}
      </div>

      {/* 칩 3개 (폭이 살짝 다름) */}
      <div className={styles.chipsRow}>
        <div className={`${styles.chip} ${styles.chipSm}`} />
        <div className={`${styles.chip} ${styles.chipMd}`} />
        <div className={`${styles.chip} ${styles.chipSm}`} />
      </div>

      {/* 중간 큰 카드 */}
      <div className={styles.cardLG} />

      {/* 칩 2개 */}
      <div className={styles.chipsRow}>
        <div className={`${styles.chip} ${styles.chipSm}`} />
        <div className={`${styles.chip} ${styles.chipMd}`} />
      </div>

      {/* 하단 큰 카드 */}
      <div className={styles.cardLG} />
    </div>
  );
}

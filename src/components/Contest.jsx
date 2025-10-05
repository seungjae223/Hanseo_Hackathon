import React from "react";
import styles from "../css/Contest.module.css";
import SearchIcon from "../assets/Search.png";

export default function Contest() {
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

      {/* 상단 큰 카드 */}
      <div className={styles.cardXL}>
        <span className={styles.centerText}>공모전 사진</span>
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

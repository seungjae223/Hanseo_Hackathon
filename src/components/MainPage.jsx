import React from "react";
import styles from "../css/MainPage.module.css";

/* ===== 아이콘 ===== */
import RightArrow from "../assets/VectorRight.png";
import LeftArrow from "../assets/left.png";
import SearchIcon from "../assets/Search.png";
import PopularIcon from "../assets/인기글.png";

export default function MainPage() {
  return (
    <div className={styles.container}>
      {/* 배너 */}
      <section className={styles.banner}>
          <p className={styles.bannerText}>
    당신의 아이디어, 지금 함께 실행할 팀을 만나보세요!
  </p>
      </section>

      {/* 네비 아이콘 */}
      <nav className={styles.nav}>
        <div className={styles.circle}>내 팀관리</div>
        <div className={styles.circle}>모집</div>
        <div className={styles.circle}>공모전</div>
        <div className={styles.circle}>스터디</div>
      </nav>

      {/* 검색 */}
      <div className={styles.searchBox}>
        <img src={SearchIcon} alt="검색" className={styles.searchIcon} />
        <input type="text" placeholder="팀 프로젝트를 검색해보세요!" />
      </div>

      {/* 팀 프로젝트 */}
      <section className={styles.projectSection}>
        <button className={styles.arrowBtn}>
          <img src={LeftArrow} alt="왼쪽" />
        </button>
        <div className={styles.projectList}>
          <div className={styles.projectCard}>팀 프로젝트</div>
          <div className={styles.projectCard}></div>
          <div className={styles.projectCard}></div>
        </div>
        <button className={styles.arrowBtn}>
          <img src={RightArrow} alt="오른쪽" />
        </button>
      </section>

      {/* 공모전 관련 사진 */}
      <section className={styles.gallery}>
        <div className={styles.galleryItem}>공모전 관련 사진</div>
        <div className={styles.galleryItem}></div>
        <div className={styles.galleryItem}></div>
        <div className={styles.galleryItem}>...</div>
      </section>

      {/* 실시간 인기글 */}
      <div className={styles.popularHeader}>
        <img src={PopularIcon} alt="실시간 인기글" />
      </div>
      <div className={styles.popularList}>
        <div className={styles.popularItem}></div>
        <div className={styles.popularItem}></div>
        <div className={styles.popularItem}></div>
        <div className={styles.popularItem}></div>
      </div>
    </div>
  );
}

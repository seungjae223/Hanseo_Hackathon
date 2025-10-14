// src/pages/MainPage.jsx
import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../css/MainPage.module.css";

import SearchIcon from "../assets/Search.png";
import LeftIcon from "../assets/left.png";
import RightIcon from "../assets/VectorRight.png";

import TeamManagePanel from "./TeamManagePanel";
import RecruitListPanel from "./RecruitListPanel";
import Contest from "./Contest";
import Matching from "./Matching";

/* 아이콘(팀관리/모집/매칭) */
import TeamIcon from "../assets/team.png";
import RecruitIcon from "../assets/Recruit.png";
import MatchingIcon from "../assets/matching.png";

export default function MainPage() {
  const railRef = useRef(null);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("default");

  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.state?.reset) {
      setTab("default");
      setQuery("");
      window.scrollTo({ top: 0, behavior: "instant" });
      navigate(".", { replace: true, state: null });
    }
  }, [location.state, navigate]);

  const scrollByStep = (dx) => railRef.current?.scrollBy({ left: dx, behavior: "smooth" });

  return (
    <main className={styles.frame}>
      {/* 히어로 배너 (노랑) */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          <span className={styles.heroEm}>당신의 아이디어</span>, 지금 함께
          <br />
          실행할 팀을 만나보세요!
        </h1>
      </section>

      {/* 아이콘 3개: 팀관리 / 모집 / 매칭 (스샷과 동일 톤) */}
      {tab === "default" && (
        <section className={styles.surface}>
          <ul className={styles.featureRow}>
            <li>
              <button className={styles.feature} onClick={() => setTab("team")}>
                <span className={styles.featureCircle}>
                  <img src={TeamIcon} alt="" />
                </span>
                <span className={styles.featureLabel}>팀관리</span>
              </button>
            </li>
            <li>
              <button className={styles.feature} onClick={() => setTab("recruit")}>
                <span className={styles.featureCircle}>
                  <img src={RecruitIcon} alt="" />
                </span>
                <span className={styles.featureLabel}>모집</span>
              </button>
            </li>
            <li>
              <button className={styles.feature} onClick={() => setTab("matching")}>
                <span className={styles.featureCircle}>
                  <img src={MatchingIcon} alt="" />
                </span>
                <span className={styles.featureLabel}>매칭</span>
              </button>
            </li>
          </ul>
        </section>
      )}

      {/* ▼ 탭별 화면 */}
      {tab === "team" ? (
        <section className={styles.teamPanelArea}>
          <TeamManagePanel />
        </section>
      ) : tab === "recruit" ? (
        <section className={styles.teamPanelArea}>
          <RecruitListPanel />
        </section>
      ) : tab === "contest" ? (
        <section className={styles.teamPanelArea}>
          <Contest />
        </section>
      ) : tab === "matching" ? (
        <section className={styles.teamPanelArea}>
          <Matching />
        </section>
      ) : (
        <>
          {/* 시그널 실시간 박스 */}
          <section className={styles.signalBox}>
            <div className={styles.signalTopBar}>
              <span className={styles.signalTitle}>시그널 실시간 검색어</span>
              <span className={styles.signalGuide}>가이드</span>
            </div>

            <div className={styles.signalMeta}>
              <span className={styles.signalDate}>2025년 9월 24일 수요일 오후 11:43</span>
              <span className={styles.signalHelp}>현재 기준 사용자가 가장 많이 검색 하는 키워드입니다.</span>
            </div>

            <div className={styles.signalContent}>
              <div className={styles.signalGrid}>
                <div>1&nbsp; KT 위약금 면제 검토</div><div className={styles.mid}>–</div><div>6&nbsp; 박찬욱</div>
                <div>2&nbsp; 통일교 합환자 구속 후 조사</div><div className={styles.mid}>+</div><div>7&nbsp; 배그</div>
                <div>3&nbsp; 강경화와 이재명 악수</div><div className={styles.mid}>–</div><div>8&nbsp; 신라호텔 예약 취소</div>
                <div>4&nbsp; 합덕주</div><div className={styles.mid}>—</div><div>9&nbsp; 배틀그라운드</div>
                <div>5&nbsp; 이진호 음주운전 여자친구 신고</div>
                <div className={styles.mid} style={{ color: "#de2a2a" }}>▲</div>
                <div>10&nbsp; 디아즈 최다 타점 타이</div>
              </div>
            </div>
          </section>

          {/* 검색창 */}
          <section className={styles.searchWrap}>
            <div className={styles.searchBox}>
              <img className={styles.searchIcon} src={SearchIcon} alt="검색" />
              <input
                className={styles.searchInput}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="팀 프로젝트 검색"
              />
            </div>
          </section>

          {/* 캐러셀 */}
          <section className={styles.carousel}>
            <h2 className={styles.carouselTitle}>팀 프로젝트</h2>
            <div className={styles.carouselViewport}>
              <button className={`${styles.navBtn} ${styles.navLeft}`} onClick={() => scrollByStep(-140)} aria-label="이전">
                <img src={LeftIcon} alt="" />
              </button>
              <div className={styles.rail} ref={railRef}>
                <div className={styles.card} /><div className={styles.card} /><div className={styles.card} />
                <div className={styles.card} /><div className={styles.card} />
              </div>
              <button className={`${styles.navBtn} ${styles.navRight}`} onClick={() => scrollByStep(140)} aria-label="다음">
                <img src={RightIcon} alt="" />
              </button>
            </div>
          </section>

          {/* 하단 갤러리 */}
          <section className={styles.galleryWrap}>
            <div className={styles.gallery}>
              <div className={styles.gGrid}>
                <div className={styles.gCell} /><div className={styles.gCell} />
                <div className={styles.gCell} /><div className={styles.gCell} />
              </div>
              <div className={styles.gCaption}>공모전 관련 사진</div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

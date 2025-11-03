// src/pages/MainPage.jsx
import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../css/MainPage.module.css";

import SearchIcon from "../assets/Search.png";

import TeamManagePanel from "./TeamManagePanel";
import RecruitListPanel from "./RecruitListPanel";
import Contest from "./Contest";
import Matching from "./Matching";

/* 아이콘(팀관리/모집/매칭) */
import TeamIcon from "../assets/team.png";
import RecruitIcon from "../assets/Recruit.png";
import MatchingIcon from "../assets/matching.png";

/* 달력 카드 */
import CalendarCard from "../components/CalendarCard";

/* 팀 프로젝트 카드 캐러셀(랜덤 3개 자동 순환) */
import TeamProjectsCarousel from "../components/TeamProjectsCarousel";

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

  // 달력 일정 (API 연동 전 목업)
  const calendarEvents = [
    { date: "2025-10-06", title: "사자팀 디자이너 회의", place: "인문관 213호" },
    { date: "2025-10-02", title: "공모전 킥오프", place: "도서관 세미나실" },
    { date: "2025-10-12", title: "기획 리뷰", place: "창업보육센터" },
  ];

  // 팀 프로젝트(공모전 모집) 카드 데이터 — API 연동 전 목업
  const mockContestRecruit = [
    { id: 1, tags: ["공모전", "디자이너"], title: "AI 해커톤 같이 나갈 디자이너/개발자", period: "2025-09-27 ~ 10-4" },
    { id: 2, tags: ["공모전", "기획"], title: "캡스톤 포스터 제작 팀원 모집", period: "2025-10-02 ~ 10-10" },
    { id: 3, tags: ["스터디", "한서대"], title: "웹접근성 리뉴얼 스터디", period: "2025-10-05 ~ 12-20" },
    { id: 4, tags: ["공모전", "콘텐츠"], title: "숏폼 공모전 촬영·편집 팀", period: "2025-10-07 ~ 10-30" },
    { id: 5, tags: ["공모전", "개발자"], title: "대학생 앱개발 공모전 팀업", period: "2025-10-12 ~ 11-1" },
  ];

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

      {/* 아이콘 3개: 팀관리 / 모집 / 매칭 */}
      {tab === "default" && (
        <section className={styles.surface}>
          <ul className={styles.featureRow}>
            <li>
              <button
                className={styles.feature}
                onClick={() => setTimeout(() => navigate("/TeamManage"), 160)}
              >
                <span className={styles.featureCircle}>
                  <img src={TeamIcon} alt="" />
                </span>
                <span className={styles.featureLabel}>팀관리</span>
              </button>
            </li>
            <li>
              <button
                className={styles.feature}
                onClick={() => setTimeout(() => navigate("/Recruit"), 160)}
              >
                <span className={styles.featureCircle}>
                  <img src={RecruitIcon} alt="" />
                </span>
                <span className={styles.featureLabel}>모집</span>
              </button>
            </li>
            <li>
              <button
                className={styles.feature}
                onClick={() => setTimeout(() => navigate("/Matching"), 160)}
              >
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
          {/* 팀 프로젝트: 오른쪽 카드 UI + 랜덤 3개 자동 순환 */}
          <section className={styles.carousel}>
            <TeamProjectsCarousel items={mockContestRecruit} intervalMs={4000} />
          </section>

          {/* ▼ 하단: 달력 카드 단독 표시 */}
          <section className={styles.calendarWrap}>
            <div className={styles.calendarBox}>
              <CalendarCard events={calendarEvents} />
            </div>
          </section>
        </>
      )}
    </main>
  );  
}

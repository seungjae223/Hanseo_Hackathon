// src/pages/MainPage.jsx
import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../css/MainPage.module.css";
import { RECRUIT_POSTS } from "./data/recruitMock";
import SearchIcon from "../assets/Search.png";
import newIcon from "../assets/new.png";
import TeamManagePanel from "./TeamManagePanel";
import RecruitListPanel from "./RecruitListPanel";
import Contest from "./Contest";
import Matching from "./Matching";

import TeamIcon from "../assets/팀관리.png";
import RecruitIcon from "../assets/Recruit.png";
import MatchingIcon from "../assets/장소.png";

import CalendarCard from "../components/CalendarCard";
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

  const calendarEvents = [
    { date: "2025-10-06", title: "사자팀 디자이너 회의", place: "인문관 213호" },
    { date: "2025-10-02", title: "공모전 킥오프", place: "도서관 세미나실" },
    { date: "2025-10-12", title: "기획 리뷰", place: "창업보육센터" },
  ];

  const mockContestRecruit = RECRUIT_POSTS.map(
    ({ id, tags, title, period }) => ({
      id,
      tags,
      title,
      period,
    })
  );

  // ✅ 마감기한 임박글 New 목업용 리스트 (디자인 확인용)
  const deadlineList = [
    {
      rank: 1,
      id: 101,
      title: "AI 해커톤 같이 나갈 디자이너/개발자",
      dday: 1,
      isNew: false, // New 표시
    },
    {
      rank: 2,
      id: 102,
      title: "캡스톤 공모전 팀원 모집",
      dday: 2,
      isNew: false, // New 표시
    },
    {
      rank: 3,
      id: 103,
      title: "알고리즘 스터디 3기 모집",
      dday: 3,
      isNew: false, // New 표시
    },
    {
      rank: 4,
      id: 104,
      title: "UX 동아리 신입 디자이너 모집",
      dday: 5,
      isNew: true,
    },
    {
      rank: 5,
      id: 105,
      title: "교내 서비스 백엔드 개발자 모집",
      dday: 7,
      isNew: true,
    },
    {
      rank: 6,
      id: 106,
      title: "스타트업 프론트엔드 인턴 모집",
      dday: 10,
      isNew: true,
    },
  ];

  return (
    <main className={styles.frame}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          <span className={styles.heroEm}>당신의 아이디어</span>, 지금 함께
          <br />
          실행할 팀을 만나보세요!
        </h1>
      </section>

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
          {/* ▽ 마감기한 임박글 영역 (New 목업용) */}
          <section className={styles.signalBox}>
            <div className={styles.deadlineCard}>
              <h2 className={styles.deadlineTitle}>마감기한 임박글</h2>

              <ul className={styles.deadlineList}>
                {deadlineList.map(({ id, rank, title, dday, isNew }) => (
                  <li key={id} className={styles.deadlineItem}>
                    {/* 왼쪽 번호 */}
                    <div className={styles.deadlineLeft}>
                      <span className={styles.deadlineRank}>{rank}</span>
                    </div>

                    {/* 가운데 제목 + New 뱃지 */}
                    <div className={styles.deadlineCenter}>
                      <button
                        type="button"
                        className={styles.deadlineTitleBtn}
                        onClick={() => navigate(`/recruit/${id}`)}
                      >
                        {title}
                      </button>

                     
                     {isNew && (
                        <img 
                          src={newIcon} 
                          alt="New" 
                          className={styles.newIcon} 
                        />
                      )}
                  
                    </div>

                    {/* 오른쪽 D-day */}
                    <div className={styles.deadlineRight}>
                      <span className={styles.deadlineDday}>{`D-${dday}`}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 캐러셀 */}
          <section className={styles.carousel}>
            <div className={styles.carouselInner}>
              <TeamProjectsCarousel
                items={mockContestRecruit}
                intervalMs={4000}
                onCardClick={(id) => navigate(`/recruit/${id}`)}
              />
            </div>
          </section>

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

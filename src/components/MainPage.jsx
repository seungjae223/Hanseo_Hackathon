// src/pages/MainPage.jsx
import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../css/MainPage.module.css";
import { RECRUIT_POSTS } from "./data/recruitMock";
import SearchIcon from "../assets/Search.png";

import TeamManagePanel from "./TeamManagePanel";
import RecruitListPanel from "./RecruitListPanel";
import Contest from "./Contest";
import Matching from "./Matching";

import TeamIcon from "../assets/team.png";
import RecruitIcon from "../assets/Recruit.png";
import MatchingIcon from "../assets/matching.png";

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

  const mockContestRecruit = RECRUIT_POSTS.map(({ id, tags, title, period }) => ({
    id,
    tags,
    title,
    period,
  }));

  // 🔸 마감기한 임박글 리스트 (D-day 오름차순 상위 6개 + New 플래그)
  const deadlineList = RECRUIT_POSTS
    .filter((p) => typeof p.dday === "number")
    .slice()
    .sort((a, b) => a.dday - b.dday)
    .slice(0, 6)
    .map((p, idx) => ({
      rank: idx + 1,
      id: p.id,
      title: p.title,
      dday: p.dday,
      isNew: typeof p.isNew === "boolean" ? p.isNew : p.dday <= 3,
    }));

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
          {/* ▽ 마감기한 임박글 영역 */}
          <section className={styles.signalBox}>
            <div className={styles.deadlineCard}>
              <h2 className={styles.deadlineTitle}>마감기한 임박글</h2>

              <ul className={styles.deadlineList}>
                {deadlineList.map(({ id, rank, title, dday, isNew }) => (
                  <li key={id} className={styles.deadlineItem}>
                    {/* 1. 번호 */}
                    <div className={styles.deadlineRank}>{rank}</div>

                    {/* 2. 제목(한 줄, 길면 …) */}
                    <button
                      type="button"
                      className={styles.deadlineTitleBtn}
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      onClick={() => navigate(`/recruit/${id}`)}
                    >
                      {title}
                    </button>

                    {/* 3. New 뱃지 */}
                    <div className={styles.deadlineNewWrap}>
                      {isNew && (
                        <span className={styles.deadlineNew}>New</span>
                      )}
                    </div>

                    {/* 4. D-day */}
                    <div className={styles.deadlineDday}>{`D-${dday}`}</div>
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

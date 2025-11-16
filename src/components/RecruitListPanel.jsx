// src/components/RecruitListPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/RecruitListPanel.module.css";

import HeartIcon from "../assets/Heart.png";
import SearchIcon from "../assets/Search.png";
import PencilIcon from "../assets/pencil.png";

/** ✅ 메인 캐러셀(mockContestRecruit)과 id/제목/기간을 완전히 동일하게 맞춘 목업 */
export const RECRUIT_MOCKS = [
  {
    id: 1,
    tags: ["공모전", "디자이너"],
    period: "2025-09-27 ~ 10-4",
    title: "AI 해커톤 같이 나갈 디자이너/개발자",
    summary:
      "AI 해커톤 참가 팀원 모집. 기획 완료, 함께 서비스를 완성할 백엔드 1 · UX/UI 1 찾습니다. 포트폴리오 환영!",
    highlight: "",
    dday: 6,
  },
  {
    id: 2,
    tags: ["공모전", "기획"],
    period: "2025-10-02 ~ 10-10",
    title: "캡스톤 포스터 제작 팀원 모집",
    summary:
      "캡스톤 전시 포스터/브랜딩 제작 프로젝트. 협업 툴 기반으로 진행하며 일정·산출물 템플릿 제공.",
    highlight: "디자인 협업 경험자 우대",
    dday: 8,
  },
  {
    id: 3,
    tags: ["스터디", "한서대"],
    period: "2025-10-05 ~ 12-20",
    title: "웹접근성 리뉴얼 스터디",
    summary:
      "매주 WCAG 가이드 따라 실습하며 실제 페이지 리뉴얼까지 목표로 하는 스터디. 초보도 환영!",
    highlight: "초보도 환영!",
    dday: 12,
  },
  {
    id: 4,
    tags: ["공모전", "콘텐츠"],
    period: "2025-10-07 ~ 10-30",
    title: "숏폼 공모전 촬영·편집 팀",
    summary:
      "릴스/쇼츠 공모전 참가. 촬영/편집/아이디어 기획 파트 함께할 팀원 모집. 촬영장비 보유자 우대.",
    highlight: "촬영장비 보유자 우대",
    dday: 10,
  },
  {
    id: 5,
    tags: ["공모전", "개발자"],
    period: "2025-10-12 ~ 11-1",
    title: "대학생 앱개발 공모전 팀업",
    summary:
      "React + Spring 기반 앱 공모전 팀 빌딩. 프론트·백엔드·디자인 전 포지션 구합니다.",
    highlight: "클릭시 상세히 볼 수 있어요",
    dday: 4,
  },
];

/** 리스트에서 쓰기 편하도록 표시용 태그 문자열 생성 */
const displayTag = (tags = []) => tags.map((t) => `#${t}`).join(" ");

const LABELS = {
  heartList: "찜 목록 보기",
  searchPlaceholder: "자신과 맞는 장소를 검색해보세요!",
  searchAria: "모집글 검색",
  share: "글쓰기",
  save: "찜하기",
  unSave: "찜 해제",
};

const HIGHLIGHT_PLACEHOLDER = "찜한 게시물을 추가하면 여기 제목이 표시돼요!";

export default function RecruitListPanel() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  // 어떤 글이 찜됐는지
  const [saved, setSaved] = useState(() => new Set([1]));

  // 헤더 카드 접힘/펼침
  const [heroCompact, setHeroCompact] = useState(true);

  // 찜한 글들
  const savedPosts = useMemo(
    () => RECRUIT_MOCKS.filter((post) => saved.has(post.id)),
    [saved]
  );

  // (펼친 상태에서) 보여줄 리스트 – 최대 3개
  const heroList = (savedPosts.length
    ? savedPosts
    : [{ id: "placeholder", title: HIGHLIGHT_PLACEHOLDER }]
  ).slice(0, 3);

  // 예전 회전 로직은 지금은 안 써도 되지만, 필요하면 다시 쓸 수 있게만 남겨둠
  const [highlightIndex, setHighlightIndex] = useState(0);
  useEffect(() => setHighlightIndex(0), [heroList.length]);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return RECRUIT_MOCKS;
    return RECRUIT_MOCKS.filter((post) =>
      [displayTag(post.tags), post.title, post.summary, post.period]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query]);

  const toggleSave = (id) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleHeroToggle = () => {
    setHeroCompact((v) => !v);
  };

  return (
    <section className={styles.page}>
      {/* ===== 상단 노란 영역 (Hero) ===== */}
      <div className={styles.hero}>
        <div
          className={`${styles.heroGraphic} ${
            heroCompact ? styles.heroCompact : styles.heroExpandedMode
          }`}
          onClick={handleHeroToggle}
        >
          {heroCompact ? (
            <>
              {/* ✅ 2번째 그림 같은 접힌 상태: 앞/뒤 카드 + 노란 하트만 */}
              <div className={styles.heroCap} />
              <div className={styles.heroBody} />
              <button
                type="button"
                className={`${styles.heroHeart} ${styles.heroHeartActive}`}
                aria-label={LABELS.heartList}
                title="찜 목록"
              >
                <img src={HeartIcon} alt="" />
              </button>
            </>
          ) : (
            // ✅ 3번째 그림 같은 펼쳐진 상태: 회색 카드 3줄
            <div className={styles.heroListWrap}>
              {heroList.map((post) => (
                <div key={post.id} className={styles.heroListItem}>
                  <span className={styles.heroListTitle}>{post.title}</span>
                  <span className={styles.heroListHeart}>
                    <img src={HeartIcon} alt="" />
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== 흰 패널 영역 (검색 + 리스트) ===== */}
      <div className={styles.body}>
        {/* Search */}
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <img src={SearchIcon} alt="" className={styles.searchIcon} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.searchInput}
              type="search"
              placeholder={LABELS.searchPlaceholder}
              aria-label={LABELS.searchAria}
            />
            {/* 글쓰기(연필) 버튼 */}
            <button
              type="button"
              className={styles.shareBtn}
              aria-label={LABELS.share}
              onClick={() => navigate("/recruit/write")}
              title="글쓰기"
            >
              <img src={PencilIcon} alt="" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className={styles.list}>
          {filteredPosts.map((post) => {
            const isSaved = saved.has(post.id);
            const highlight = post.highlight || "\u00a0";

            return (
              <article
                key={post.id}
                className={styles.card}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/recruit/${post.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/recruit/${post.id}`);
                  }
                }}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.cardTag}>{displayTag(post.tags)}</span>
                  <button
                    type="button"
                    className={`${styles.cardHeart} ${
                      isSaved ? styles.cardHeartActive : ""
                    }`}
                    aria-label={isSaved ? LABELS.unSave : LABELS.save}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(post.id);
                    }}
                  >
                    <img src={HeartIcon} alt="" />
                  </button>
                </div>

                <h3 className={styles.cardTitle}>{post.title}</h3>
                <p className={styles.cardSummary}>{post.summary}</p>

                <footer className={styles.cardFooter}>
                  <span className={styles.cardHighlight}>
                    {post.period} {highlight && "· "}
                    {highlight}
                  </span>
                  <span className={styles.cardDday}>{`D-${post.dday}`}</span>
                </footer>
              </article>
            );
          })}

          {filteredPosts.length === 0 && (
            <div className={styles.empty}>검색 결과가 없습니다.</div>
          )}
        </div>
      </div>
    </section>
  );
}

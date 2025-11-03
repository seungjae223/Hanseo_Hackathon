// src/components/RecruitListPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/RecruitListPanel.module.css";

import HeartIcon from "../assets/Heart.png";
import SearchIcon from "../assets/Search.png";
import PencilIcon from "../assets/pencil.png";

const POSTS = [
  {
    id: 1,
    tag: "#디자이너",
    title: "AI 해커톤 같이 나갈 디자이너/개발자",
    summary:
      "이번에 열리는 Dacon AI 해커톤에 참가할 팀원을 구합니다. 기획은 완료되었고, 함께 서비스를 완성해줄 백엔드 개발자 1명, UX/UI 디자이너 1명을 찾습니다. 포트폴리오가 있으면 환영입니다.",
    highlight: "",
    dday: 6,
  },
  {
    id: 2,
    tag: "#스터디",
    title: "AI 해커톤 같이 나갈 디자이너/개발자",
    summary:
      "이번에 열리는 Dacon AI 해커톤에 참여할 팀원을 구합니다. 기획은 완료되었고, 함께 서비스를 완성해줄 백엔드 개발자 1명, UX/UI 디자이너 1명을 찾습니다. 포트폴리오가 있으면 환영입니다.",
    highlight: "클릭시 상세히 볼 수 있어요",
    dday: 4,
  },
];

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
  const [saved, setSaved] = useState(() => new Set([1]));
  const [highlightIndex, setHighlightIndex] = useState(0);

  const savedPosts = useMemo(
    () => POSTS.filter((post) => saved.has(post.id)),
    [saved]
  );

  const highlightItems = useMemo(() => {
    return savedPosts.length > 0
      ? savedPosts.map((post) => post.title)
      : [HIGHLIGHT_PLACEHOLDER];
  }, [savedPosts]);

  useEffect(() => setHighlightIndex(0), [highlightItems.length]);

  useEffect(() => {
    if (highlightItems.length <= 1) return;
    const id = setInterval(
      () => setHighlightIndex((p) => (p + 1) % highlightItems.length),
      3200
    );
    return () => clearInterval(id);
  }, [highlightItems]);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return POSTS;
    return POSTS.filter((post) =>
      [post.tag, post.title, post.summary].join(" ").toLowerCase().includes(q)
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

  return (
    <section className={styles.page}>
      {/* ===== Hero (피그마의 가운데 장식) ===== */}
      <div className={styles.hero}>
        <div className={styles.heroGraphic} aria-hidden="true">
          <span className={styles.heroCap} />
          <span className={styles.heroBody} />
          <span className={styles.heroShadow} />
          <span className={styles.heroHeart}>
            <img src={HeartIcon} alt="" />
          </span>
        </div>
      </div>

      {/* ===== Search ===== */}
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
          <button type="button" className={styles.shareBtn} aria-label={LABELS.share}>
            <img src={PencilIcon} alt="" />
          </button>
        </div>
      </div>

      {/* ===== List (기존 유지) ===== */}
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
                <span className={styles.cardTag}>{post.tag}</span>
                <button
                  type="button"
                  className={`${styles.cardHeart} ${isSaved ? styles.cardHeartActive : ""}`}
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
                <span className={styles.cardHighlight}>{highlight}</span>
                <span className={styles.cardDday}>{`D-${post.dday}`}</span>
              </footer>
            </article>
          );
        })}

        {filteredPosts.length === 0 && (
          <div className={styles.empty}>검색 결과가 없습니다.</div>
        )}
      </div>
    </section>
  );
}

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "../css/RecruitListPanel.module.css";

import PencilIcon from "../assets/pencil.png";
import SearchIcon from "../assets/Search.png";
import ShareIcon from "../assets/Share Box.png";
import HeartIcon from "../assets/Heart.png";

const MOCK = [
  {
    id: 1,
    type: "공모전",
    title: "AI 해커톤 같이 나갈 디자이너/개발자",
    desc:
      "이번에 열리는 Dacon AI 해커톤에 참여할 팀원을 구합니다. 기획은 완료되었고, 함께 서비스할 수준의 백엔드 1명, UX/UI 디자이너 1명 모집.",
    chips: ["공모전", "프로젝트"],
    owner: "닉네임",
    saved: true,
  },
  {
    id: 2,
    type: "프로젝트",
    title: "캠퍼스 라이프 앱 팀원 모집",
    desc:
      "캠퍼스 일정/맛집/동아리 소식을 모아보는 앱 사이드 프로젝트. RN/Flutter 가능자, 디자인/브랜딩 관심 환영!",
    chips: ["프로젝트"],
    owner: "닉네임",
    saved: true,
  },
  {
    id: 3,
    type: "스터디",
    title: "프론트엔드 CS 스터디",
    desc:
      "면접 대비 프론트엔드 CS 정리 스터디. 주 1회 오프라인, 주 1회 온라인, 총 5~7명.",
    chips: ["스터디"],
    owner: "닉네임",
    saved: false,
  },
];

export default function RecruitListPanel({ savedItems }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("전체");

  // 티커/패널에 표시할 제목들
  const savedTitles = useMemo(() => {
    const fromProp =
      Array.isArray(savedItems) && savedItems.length > 0
        ? savedItems.map((v) => v?.title).filter(Boolean).map(String)
        : [];
    const fallback =
      fromProp.length === 0
        ? MOCK.filter((m) => m.saved).map((m) => m.title)
        : [];
    return [...fromProp, ...fallback];
  }, [savedItems]);
  const placeholder = "찜한 게시물을 추가하면 여기 제목이 표시됩니다.";
  const hasSaved = savedTitles.length > 0;
  const highlightItems = hasSaved ? savedTitles : [placeholder];

  // 접힘/펼침
  const [expanded, setExpanded] = useState(false);

  // ── 접힘 상태에서만 자동 슬라이드(티커)
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const itemHeightRef = useRef(0);

  // 뷰포트 높이 측정 & 위치 반영
  useEffect(() => {
    if (expanded) return; // 펼친 상태에선 티커 안씀
    const measure = () => {
      if (!viewportRef.current) return;
      const h = viewportRef.current.getBoundingClientRect().height;
      itemHeightRef.current = h;
      if (trackRef.current) {
        trackRef.current.style.transform = `translateY(-${index * h}px)`;
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [index, expanded]);

  // 자동 순환
  useEffect(() => {
    if (expanded || paused || highlightItems.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % highlightItems.length);
    }, 3000);
    return () => clearInterval(id);
  }, [expanded, paused, highlightItems.length]);

  // 인덱스 변경 시 이동
  useEffect(() => {
    if (expanded) return;
    const h = itemHeightRef.current;
    if (trackRef.current) {
      trackRef.current.style.transform = `translateY(-${index * h}px)`;
    }
  }, [index, expanded]);

  // 리스트 필터 (기존)
  const list = useMemo(() => {
    return MOCK.filter((it) => {
      const okType = selected === "전체" || it.type === selected;
      const q = query.trim().toLowerCase();
      const okText =
        q === "" ||
        it.title.toLowerCase().includes(q) ||
        it.desc.toLowerCase().includes(q);
      return okType && okText;
    });
  }, [selected, query]);

  return (
    <section className={styles.wrap}>
      {/* 검색창 */}
      <div className={styles.searchBox}>
        <img className={styles.searchIcon} src={SearchIcon} alt="" />
        <input
          className={styles.searchInput}
          type="text"
          placeholder="자신과 맞는 모집글을 검색해보세요!"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="모집글 검색"
        />
      </div>

      {/* ───────────────── 상단 하이라이트 ───────────────── */}
      {!expanded ? (
        /* 접힌 상태: 좌측 하트 + 우측 티커(자동 스크롤) */
        <div className={styles.highlightRow}>
          <div className={styles.leftHeartCol} aria-hidden="true">
            <img src={HeartIcon} alt="" />
          </div>

          <div
            className={styles.highlightViewport}
            ref={viewportRef}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
            aria-live="polite"
          >
            <div className={styles.tickerTrack} ref={trackRef}>
              {highlightItems.map((t, i) => (
                <button
                  key={`${t}-${i}`}
                  type="button"
                  className={styles.highlightCard}
                  onClick={() => setExpanded(true)} // ← 클릭 시 펼침
                >
                  <div className={styles.highlightBottom} />
                  <div className={styles.highlightBar}>
                    <div className={styles.highlightText} title={t}>
                      {t}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* 펼친 상태: 패널로 확장되고 내부는 스크롤 */
        <div className={styles.highlightPanel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>찜한 게시글</span>
            <button
              type="button"
              className={styles.panelHeartBtn}
              onClick={() => setExpanded(false)} /* 다시 접기 */
              aria-label="접기"
              title="접기"
            >
              <img src={HeartIcon} alt="" />
            </button>
          </div>

          <div className={styles.panelList} role="list">
            {highlightItems.map((t, i) => (
              <div key={`${t}-${i}`} role="listitem" className={styles.panelItem}>
                {t}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* ───────────────── 끝 ───────────────── */}

      {/* 필터 & 글쓰기 */}
      <div className={styles.filterRow}>
        <div className={styles.filterChips}>
          {["전체", "공모전", "프로젝트", "스터디"].map((t) => (
            <button
              key={t}
              className={`${styles.chip} ${styles.chipTile} ${
                selected === t ? styles.chipActiveTile : ""
              }`}
              aria-pressed={selected === t}
              onClick={() => setSelected(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <button className={styles.writeBtn} aria-label="글쓰기">
          <img src={PencilIcon} alt="" />
        </button>
      </div>

      {/* 리스트 */}
      <div className={styles.list}>
        {list.map((it) => (
          <article key={it.id} className={styles.card}>
            <button className={styles.shareBtn} aria-label="공유">
              <img src={ShareIcon} alt="" />
            </button>

            <div className={styles.cardBadge}>{it.type}</div>
            <h3 className={styles.cardTitle}>{it.title}</h3>
            <p className={styles.cardDesc}>{it.desc}</p>

            <div className={styles.cardMeta}>
              <div className={styles.leftProfile}>
                <div className={styles.avatar} />
                <div className={styles.nick}>{it.owner}</div>
              </div>
              <div className={styles.rightChips}>
                {it.chips.map((c, i) => (
                  <span key={i} className={styles.smallChip}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
        {list.length === 0 && (
          <div className={styles.empty}>조건에 맞는 모집글이 없어요.</div>
        )}
      </div>
    </section>
  );
}

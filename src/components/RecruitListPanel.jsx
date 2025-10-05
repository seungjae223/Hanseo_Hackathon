// src/components/RecruitListPanel.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "../css/RecruitListPanel.module.css";

import PencilIcon from "../assets/pencil.png";
import SearchIcon from "../assets/Search.png";
import ShareIcon from "../assets/Share Box.png";
import HeartIcon from "../assets/Heart.png";
import VIcon from "../assets/아래.png";

/* ✅ 캐릭터 3종 */
import Bunny from "../assets/캐릭터.png";
import Cat from "../assets/캐릭터2.png";
import Bear from "../assets/캐릭터3.png";

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
    type: "스터디",
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
    saved: true,
  },
];

export default function RecruitListPanel({ savedItems }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("전체");

  /* ✅ 같은 화면 전환들 */
  const [detailItem, setDetailItem] = useState(null);
  const [isCompose, setIsCompose] = useState(false); // ← 글쓰기 모드
  const openDetail = (it) => setDetailItem(it);
  const closeDetail = () => setDetailItem(null);

  /* 하이라이트 티커 텍스트 */
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
  const highlightItems =
    (savedTitles.length > 0 ? savedTitles : [placeholder]);

  /* 상단 하이라이트(접힘/펼침) */
  const [expanded, setExpanded] = useState(false);

  /* 티커 슬라이드 */
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const itemHeightRef = useRef(0);

  useEffect(() => {
    if (expanded) return;
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

  useEffect(() => {
    if (expanded || paused || highlightItems.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % highlightItems.length);
    }, 3000);
    return () => clearInterval(id);
  }, [expanded, paused, highlightItems.length]);

  useEffect(() => {
    if (expanded) return;
    const h = itemHeightRef.current;
    if (trackRef.current) {
      trackRef.current.style.transform = `translateY(-${index * h}px)`;
    }
  }, [index, expanded]);

  /* 리스트 필터 */
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

  /* 카테고리 패널 */
  const [openCats, setOpenCats] = useState(false);
  const catRef = useRef(null);
  useEffect(() => {
    const onDoc = (e) => {
      if (!catRef.current) return;
      if (!catRef.current.contains(e.target)) setOpenCats(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("touchstart", onDoc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("touchstart", onDoc);
    };
  }, []);

  /* ======================= 렌더 ======================= */

  /* ✏️ 글쓰기 모드일 때 — 오른쪽 시안과 동일한 작성 UI */
  if (isCompose) {
    return (
      <section className={styles.wrap}>
        {/* 상단 검색 그대로 */}
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

        {/* 흐릿한 캡션 바 */}
        <div className={styles.composeCaption} />

        {/* 글쓰기 카드 */}
        <div className={styles.composeCard}>
          {/* 우상단 동그란 연필 버튼(아이콘만) */}
          <button className={styles.composeEditBtn} type="button" title="편집">
            <img src={PencilIcon} alt="" />
          </button>

          {/* 제목 입력 */}
          <div className={styles.composeTitleRow}>
            <input
              className={styles.composeTitleInput}
              placeholder="제목을 입력해주세요."
              aria-label="제목 입력"
            />
          </div>

          {/* 본문 */}
          <textarea
            className={styles.composeBody}
            placeholder={
              "본문  모집 내용, 일정, 팀원에게 바라는 점 등을 자세히 작성해주세요."
            }
            rows={6}
            aria-label="본문 입력"
          />

          {/* 이미지/링크 업로드 박스 */}
          <div className={styles.composeMedia}>사진이나 링크 첨부</div>

          {/* 포트폴리오 업로드 버튼 */}
          <button type="button" className={styles.composePortfolioBtn}>
            포트폴리오 업로드
          </button>

          {/* 구하는 팀원 */}
          <div className={styles.composeRoleTitle}>구하는 팀원</div>
          <div className={styles.composeRoles}>
            {["개발자", "개발자", "개발자", "디자인"].map((label, i) => (
              <div key={i} className={styles.composeRoleItem}>
                <div className={styles.composeRoleIcon} />
                <div className={styles.composeRoleLabel}>{label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button className={styles.composeSubmit}>참여하기</button>
        </div>

        {/* 뒤로가기(리스트로) 필요하면 주석 해제 */}
        {/* <div style={{display:'flex', justifyContent:'flex-end', marginTop:8}}>
          <button className={styles.smallPill} onClick={()=>setIsCompose(false)}>← 목록으로</button>
        </div> */}
      </section>
    );
  }

  /* 리스트 / 상세 보기 모드 */
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

      {/* === 리스트 화면 === */}
      {!detailItem && (
        <>
          {/* 상단 하이라이트 */}
          {!expanded ? (
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
                      onClick={() => setExpanded(true)}
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
            <div className={styles.highlightPanel}>
              <div className={styles.panelHeader}>
                <span className={styles.panelTitle}>찜한 게시글</span>
                <button
                  type="button"
                  className={styles.panelHeartBtn}
                  onClick={() => setExpanded(false)}
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

          {/* 필터 & 글쓰기 */}
          <div className={styles.filterRow}>
            <div className={styles.catWrap} ref={catRef}>
              <button
                type="button"
                className={styles.emojiBtn}
                aria-haspopup="listbox"
                aria-expanded={openCats}
                title="카테고리 열기"
                onClick={() => setOpenCats((v) => !v)}
              >
                <img src={VIcon} alt="카테고리 열기" />
              </button>

              {openCats && (
                <div className={styles.catPanel} role="listbox" aria-label="카테고리 선택">
                  {["전체", "공모전", "스터디"].map((t) => (
                    <button
                      key={t}
                      role="option"
                      aria-selected={selected === t}
                      className={`${styles.catItem} ${
                        selected === t ? styles.catItemActive : ""
                      }`}
                      onClick={() => {
                        setSelected(t);
                        setOpenCats(false);
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ✏️ 글쓰기 버튼 → 글쓰기 화면으로 전환 */}
            <button
              className={styles.writeBtn}
              aria-label="글쓰기"
              onClick={() => setIsCompose(true)}
              title="글쓰기"
            >
              <img src={PencilIcon} alt="" />
            </button>
          </div>

          {/* 카드 리스트 */}
          <div className={styles.list}>
            {list.map((it) => (
              <article
                key={it.id}
                className={styles.card}
                role="button"
                tabIndex={0}
                style={{ cursor: "pointer" }}
                onClick={() => openDetail(it)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openDetail(it);
                  }
                }}
              >
                <button
                  className={styles.shareBtn}
                  aria-label="상세 보기"
                  title="상세 보기"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDetail(it);
                  }}
                >
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
                      <button
                        key={i}
                        type="button"
                        className={styles.smallChip}
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail(it);
                        }}
                        title="상세 보기"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            ))}
            {list.length === 0 && (
              <div className={styles.empty}>조건에 맞는 모집글이 없어요.</div>
            )}
          </div>
        </>
      )}

      {/* === 상세 화면 (세 캐릭터 사용) === */}
      {detailItem && (
        <div className={styles.detailWrap}>
          {/* 상단 라벨 */}
          <div className={styles.topPills}>
            <span className={styles.pill}>{detailItem.type}</span>
            <span className={styles.pill}>{detailItem.owner}</span>
            <span className={styles.pillMuted}>해시태그</span>
          </div>

          {/* 상세 카드 */}
          <section className={styles.postCard}>
            <div className={styles.postHeader}>
              <span className={styles.period}>2025-09-25 ~ 09-30</span>
              <button className={styles.iconBtn} aria-label="공유">
                <img src={ShareIcon} alt="" />
              </button>
            </div>
            <h1 className={styles.title}>{detailItem.title}</h1>
            <p className={styles.desc}>{detailItem.desc}</p>

            <div className={styles.mediaBox}>사진이나 링크 첨부</div>

            <div className={styles.postFooter}>
              <button className={styles.heartBtn} aria-label="찜">
                <img src={HeartIcon} alt="" />
              </button>
              <button className={styles.uploadBtn} aria-label="업로드">
                <span className={styles.uploadMark}>↥</span>
              </button>
            </div>
          </section>

          {/* 팀장 소개 */}
          <div className={styles.sectionHeader}>
            <h2>팀장 소개</h2>
            <span className={styles.scrollHint}>스크롤</span>
          </div>
          <section className={styles.leadCard}>
            <div className={styles.leadAvatar}>
              <img src={Bunny} alt="팀장 아바타(토끼)" loading="lazy" />
            </div>
            <p className={styles.leadIntro}>
              안녕하세요, UX/UI 디자이너 겸 팀장입니다. 포트폴리오 확인 부탁드립니다.
            </p>
            <div className={styles.tagRow}>
              <button type="button" className={styles.smallPill}>인스타그램</button>
              <button type="button" className={styles.smallPill}>해시태그</button>
            </div>
            <div className={styles.kvRow}>
              <span className={styles.kvKey}>경력</span>
              <button type="button" className={styles.portfolioBtn}>포트폴리오</button>
            </div>
          </section>

          {/* 현재 구하는 팀원 */}
          <h2 className={styles.subTitle}>현재 구하는 팀원</h2>
          <section className={styles.rolesCapsule}>
            {[
              { label: "개발자", icon: Bunny, ok: false },
              { label: "개발자", icon: Cat,   ok: true  },
              { label: "기획자", icon: Bear,  ok: false },
              { label: "디자인", icon: Cat,   ok: true  },
            ].map((r, i) => (
              <div
                key={i}
                className={`${styles.roleItem} ${r.ok ? styles.ok : styles.no}`}
              >
                <div className={styles.roleIconWrap}>
                  <img src={r.icon} alt={`${r.label} 아이콘`} loading="lazy" />
                </div>
                <span className={styles.roleLabel}>{r.label}</span>
              </div>
            ))}
          </section>

          <button className={styles.ctaBtn}>참여하기</button>

          {/* 뒤로가기(리스트로 복귀) */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
            <button onClick={closeDetail} className={styles.smallPill}>← 목록으로</button>
          </div>
        </div>
      )}
    </section>
  );
}

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

/* ✅ 토스트 */
import { useToast } from "./Toast";

const MOCK = [
  { id: 1, type: "공모전", title: "AI 해커톤 같이 나갈 디자이너/개발자",
    desc: "이번에 열리는 Dacon AI 해커톤에 참여할 팀원을 구합니다. 기획은 완료되었고, 함께 서비스할 수준의 백엔드 1명, UX/UI 디자이너 1명 모집.",
    chips: ["공모전", "프로젝트"], owner: "닉네임", saved: true, joined: false, participants: 0 },
  { id: 2, type: "스터디", title: "캠퍼스 라이프 앱 팀원 모집",
    desc: "캠퍼스 일정/맛집/동아리 소식을 모아보는 앱 사이드 프로젝트. RN/Flutter 가능자, 디자인/브랜딩 관심 환영!",
    chips: ["프로젝트"], owner: "닉네임", saved: true, joined: false, participants: 0 },
  { id: 3, type: "스터디", title: "프론트엔드 CS 스터디",
    desc: "면접 대비 프론트엔드 CS 정리 스터디. 주 1회 오프라인, 주 1회 온라인, 총 5~7명.",
    chips: ["스터디"], owner: "닉네임", saved: true, joined: false, participants: 0 },
];

export default function RecruitListPanel({ savedItems }) {
  const toast = useToast();

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("전체");
  const [items, setItems] = useState(MOCK);

  /* 화면 전환 */
  const [detailItem, setDetailItem] = useState(null);
  const [isCompose, setIsCompose] = useState(false);

  /* 글쓰기 폼 */
  const [composeTitle, setComposeTitle] = useState("");
  const [composeBody, setComposeBody] = useState("");

  /* ✅ 글쓰기: 구하는 팀원 (+ 버튼 선택형) */
  const ROLE_OPTIONS = ["디자이너", "개발자", "기획자"];
  const [composeRoles, setComposeRoles] = useState([]);        // ["개발자", ...]
  const [showRolePicker, setShowRolePicker] = useState(false);
  const rolePickerRef = useRef(null);

  const addRole = (role) => {
    setComposeRoles((prev) => (prev.includes(role) ? prev : [...prev, role]));
    setShowRolePicker(false);
  };
  const removeRole = (role) => {
    setComposeRoles((prev) => prev.filter((r) => r !== role));
  };
  useEffect(() => {
    const onDoc = (e) => {
      if (!rolePickerRef.current) return;
      if (!rolePickerRef.current.contains(e.target)) setShowRolePicker(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("touchstart", onDoc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("touchstart", onDoc);
    };
  }, []);

  const openDetail = (it) => {
    const fresh = items.find((x) => x.id === it.id) || it;
    setDetailItem(fresh);
  };
  const closeDetail = () => setDetailItem(null);

  /* 하이라이트 텍스트 */
  const savedTitles = useMemo(() => {
    const fromProp =
      Array.isArray(savedItems) && savedItems.length > 0
        ? savedItems.map((v) => v?.title).filter(Boolean).map(String)
        : [];
    const fallback =
      fromProp.length === 0
        ? items.filter((m) => m.saved).map((m) => m.title)
        : [];
    return [...fromProp, ...fallback];
  }, [savedItems, items]);

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
    return items.filter((it) => {
      const okType = selected === "전체" || it.type === selected;
      const q = query.trim().toLowerCase();
      const okText =
        q === "" ||
        it.title.toLowerCase().includes(q) ||
        it.desc.toLowerCase().includes(q);
      return okType && okText;
    });
  }, [items, selected, query]);

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

  /* 참여 토글 */
  const toggleJoin = (id) => {
    const current = items.find((x) => x.id === id);
    const nextJoined = !current?.joined;

    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              joined: !it.joined,
              participants: (it.participants || 0) + (it.joined ? -1 : 1),
            }
          : it
      )
    );
    setDetailItem((cur) => {
      if (!cur || cur.id !== id) return cur;
      const joined = !cur.joined;
      const participants = (cur.participants || 0) + (cur.joined ? -1 : 1);
      return { ...cur, joined, participants };
    });

    toast.show({
      message: nextJoined ? "참여되었습니다" : "참여가 취소되었습니다",
      icon: "bell",
      duration: 2200,
    });
  };

  /* 글 등록 */
  const submitCompose = () => {
    const title = composeTitle.trim();
    const desc = composeBody.trim();
    if (!title) return alert("제목을 입력해 주세요.");
    if (!desc) return alert("내용을 입력해 주세요.");

    const computedType = selected !== "전체" ? selected : "스터디";

    const newItem = {
      id: Date.now(),
      type: computedType,
      title,
      desc,
      chips: [],              // 필요하면 composeRoles를 chips로도 넣을 수 있음
      roles: composeRoles,    // ✅ 선택한 역할 저장
      owner: "나",
      saved: false,
      joined: true,
      participants: 1,
    };

    setItems((prev) => [newItem, ...prev]);
    setIsCompose(false);
    setDetailItem(newItem);

    setComposeTitle("");
    setComposeBody("");
    setComposeRoles([]);

    toast.show({
      message: "게시물이 작성되었습니다",
      icon: "bell",
      duration: 2400,
      confetti: true,
    });
  };

  /* ======================= 렌더 ======================= */

  /* 글쓰기 모드 */
  if (isCompose) {
    return (
      <section className={styles.wrap}>
        {/* 검색 */}
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
          <button className={styles.composeEditBtn} type="button" title="편집">
            <img src={PencilIcon} alt="" />
          </button>

          <div className={styles.composeTitleRow}>
            <input
              className={styles.composeTitleInput}
              placeholder="제목을 입력해주세요."
              aria-label="제목 입력"
              value={composeTitle}
              onChange={(e) => setComposeTitle(e.target.value)}
            />
          </div>

          <textarea
            className={styles.composeBody}
            placeholder={"본문  모집 내용, 일정, 팀원에게 바라는 점 등을 자세히 작성해주세요."}
            rows={6}
            aria-label="본문 입력"
            value={composeBody}
            onChange={(e) => setComposeBody(e.target.value)}
          />

          <div className={styles.composeMedia}>사진이나 링크 첨부</div>

          <button type="button" className={styles.composePortfolioBtn}>
            포트폴리오 업로드
          </button>

          {/* ✅ 구하는 팀원 ( + 버튼만 ) */}
          <div className={styles.composeRoleTitle}>구하는 팀원</div>
          <div className={styles.roleSelectRow} ref={rolePickerRef}>
            {/* 선택된 역할 태그 */}
            <div className={styles.roleTags}>
              {composeRoles.length === 0 && (
                <span className={styles.rolesHint}>+ 버튼으로 역할을 추가하세요</span>
              )}
              {composeRoles.map((r) => (
                <span key={r} className={styles.roleTag}>
                  {r}
                  <button
                    type="button"
                    className={styles.roleTagRemove}
                    onClick={() => removeRole(r)}
                    aria-label={`${r} 삭제`}
                    title="삭제"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* + 버튼 & 팝오버 */}
            <div className={styles.roleAddWrap}>
              <button
                type="button"
                className={styles.roleAddBtn}
                onClick={() => setShowRolePicker((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={showRolePicker}
                title="역할 추가"
              >
                +
              </button>

              {showRolePicker && (
                <div className={styles.rolePicker} role="menu">
                  {ROLE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={styles.roleOption}
                      role="menuitem"
                      onClick={() => addRole(opt)}
                      disabled={composeRoles.includes(opt)}
                      aria-disabled={composeRoles.includes(opt)}
                      title={composeRoles.includes(opt) ? "이미 추가됨" : `${opt} 추가`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button className={styles.composeSubmit} onClick={submitCompose}>
            등록하기
          </button>
        </div>
      </section>
    );
  }

  /* 리스트 / 상세 보기 */
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
                      className={`${styles.catItem} ${selected === t ? styles.catItemActive : ""}`}
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
                    <div className={styles.nick}>
                      {it.owner}
                      {typeof it.participants === "number" ? ` · 인원 ${it.participants}` : ""}
                    </div>
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
            {list.length === 0 && <div className={styles.empty}>조건에 맞는 모집글이 없어요.</div>}
          </div>
        </>
      )}

      {/* === 상세 화면 === */}
      {detailItem && (
        <div className={styles.detailWrap}>
          <div className={styles.topPills}>
            <span className={styles.pill}>{detailItem.type}</span>
            <span className={styles.pill}>{detailItem.owner}</span>
            <span className={styles.pillMuted}>해시태그</span>
          </div>

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

          <div className={styles.sectionHeader}><h2>팀장 소개</h2></div>
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

          <h2 className={styles.subTitle}>현재 구하는 팀원</h2>
          <section className={styles.rolesCapsule}>
            {[
              { label: "개발자", icon: Bunny, ok: false },
              { label: "개발자", icon: Cat,   ok: true  },
              { label: "기획자", icon: Bear,  ok: false },
              { label: "디자인", icon: Cat,   ok: true  },
            ].map((r, i) => (
              <div key={i} className={`${styles.roleItem} ${r.ok ? styles.ok : styles.no}`}>
                <div className={styles.roleIconWrap}>
                  <img src={r.icon} alt={`${r.label} 아이콘`} loading="lazy" />
                </div>
                <span className={styles.roleLabel}>{r.label}</span>
              </div>
            ))}
          </section>

          <button className={styles.ctaBtn} onClick={() => toggleJoin(detailItem.id)}>
            {detailItem.joined ? "참여중" : "참여하기"}
          </button>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
            <button onClick={closeDetail} className={styles.smallPill}>← 목록으로</button>
          </div>
        </div>
      )}
    </section>
  );
}

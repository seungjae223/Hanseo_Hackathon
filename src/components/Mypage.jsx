// src/components/MyPage.jsx
import React from "react";
import styles from "../css/MyPage.module.css";
import MyPageInterest from "./MyPageInterest";
import BackIcon from "../assets/Chevron Right Small.png";
import Avatar1 from "../assets/캐릭터.png";
import Avatar2 from "../assets/캐릭터2.png";
import Avatar3 from "../assets/캐릭터3.png";

export default function Mypage() {
  const user = {
    name: "주노",
    nickname: "Juno",
    year: "3학년",
    dept: "컴퓨터공학과",
    email: "juno@hanseo.ac.kr",
  };

  /* ▼ 닉네임 — 클릭 시에만 입력 가능 */
  const [nickname, setNickname] = React.useState(() => {
    try {
      return localStorage.getItem("mypage.nickname") || user.nickname;
    } catch {
      return user.nickname;
    }
  });
  const [editingNickname, setEditingNickname] = React.useState(false);
  const nicknameInputRef = React.useRef(null);

  React.useEffect(() => {
    try {
      localStorage.setItem("mypage.nickname", nickname);
    } catch {}
  }, [nickname]);

  // 편집 모드로 바뀌면 자동 포커스
  React.useEffect(() => {
    if (editingNickname && nicknameInputRef.current) {
      nicknameInputRef.current.focus();
      nicknameInputRef.current.select();
    }
  }, [editingNickname]);

  /* ▼ 관심태그 저장/불러오기 */
  const [tags, setTags] = React.useState(() => {
    try {
      const raw = localStorage.getItem("mypage.selectedTags");
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [draftTags, setDraftTags] = React.useState([]);
  const [openInterest, setOpenInterest] = React.useState(false);

  /* ▼ 프로필 선택 모달 on/off */
  const [openPicker, setOpenPicker] = React.useState(false);

  /* ▼ 아바타 */
  const AVATARS = [
    { id: "bear", src: Avatar1, label: "곰" },
    { id: "cat", src: Avatar2, label: "고양이" },
    { id: "bunny", src: Avatar3, label: "토끼" },
  ];
  const [avatarId, setAvatarId] = React.useState(
    () => localStorage.getItem("mypage.avatarId") || "bunny"
  );
  const currentAvatar = AVATARS.find((a) => a.id === avatarId)?.src || Avatar3;
  React.useEffect(() => {
    localStorage.setItem("mypage.avatarId", avatarId);
  }, [avatarId]);

  /* ▼ 관심태그 패널 */
  const openInterestPanel = () => {
    setDraftTags(tags);
    setOpenInterest(true);
  };
  const applyInterest = () => {
    setTags(draftTags);
    try {
      localStorage.setItem("mypage.selectedTags", JSON.stringify(draftTags));
    } catch {}
    setOpenInterest(false);
  };

  /* ===== 순서 고정 로직 ===== */
  const ORDER = [
    // 성격(Personality)
    "친절함",
    "활발함",
    "유머감",
    "배려심",
    "사교성",
    "인내심",
    // 능력(Ability)
    "문제 해결",
    "신속 처리",
    "창의 발상",
    "논리 정연",
    "실행 능력",
    "경력직",
    "협업 능력",
    "효율 추구",
    // 태도(Attitude)
    "적극 참여",
    "솔선 수범",
    "긍정 사고",
    "배움 열정",
    "성실 노력",
    "책임 완수",
    "공감 능력",
    "도전 의지",
  ];
  const orderIndex = (t) => {
    const i = ORDER.indexOf((t ?? "").trim());
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };

  const visibleTags = React.useMemo(
    () => tags.filter((t) => (t ?? "").trim().length > 0),
    [tags]
  );

  const top3 = React.useMemo(
    () => [...visibleTags].sort((a, b) => orderIndex(a) - orderIndex(b)).slice(0, 3),
    [visibleTags]
  );

  return (
    <main className={styles.page}>
      <style>{`
        .mp_overlay{ position:fixed; inset:0; background:rgba(0,0,0,.35); display:grid; place-items:center; z-index:60; }
        .mp_modal{ width:min(420px, 92vw); background:#fff; border-radius:16px; padding:18px; box-shadow:0 20px 40px rgba(0,0,0,.18); animation:mp_pop .16s ease-out both; }
        @keyframes mp_pop{ from{ transform:scale(.96); opacity:.6 } to{ transform:scale(1); opacity:1 } }
        .mp_grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-top:12px; }
        .mp_opt{ border:2px solid transparent; border-radius:14px; background:#f6f6f6; padding:10px; cursor:pointer; transition:border-color .15s ease, transform .08s ease; }
        .mp_opt:hover{ transform:translateY(-1px) }
        .mp_opt img{ width:100%; height:110px; object-fit:contain; display:block; }
        .mp_opt span{ display:block; text-align:center; margin-top:6px; font-size:12px; color:#555; }
        .mp_opt.__selected{ border-color:#222 }
        .mp_actions{ display:flex; gap:8px; justify-content:flex-end; margin-top:16px; }
        .mp_btn{ padding:10px 14px; border-radius:10px; border:1px solid #e5e5e5; background:#fff; cursor:pointer }
        .mp_btn--primary{ background:#ffd400; border-color:#ffd400; font-weight:700 }
      `}</style>

      <header className={styles.topbar}>
        <button
          className={styles.back}
          onClick={() => window.history.back()}
          aria-label="뒤로"
        >
          <img src={BackIcon} alt="뒤로가기" />
        </button>
        <h1 className={styles.title}>프로필 설정</h1>
        <span className={styles.rightSpace} />
      </header>

      <section className={styles.avatarBox}>
        <div className={styles.avatar}>
          <img
            src={currentAvatar}
            alt="프로필 아바타"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
        <button className={styles.editBtn} onClick={() => setOpenPicker(true)}>
          프로필 수정
        </button>
      </section>

      <section className={styles.form}>
        <div className={styles.row}>
          <div className={styles.label}>이름</div>
          <div className={styles.value}>{user.name}</div>
        </div>

        {/* ▼ 닉네임 — 평소엔 텍스트, 클릭하면 입력창 */}
        <div className={styles.row}>
          <div className={styles.label}>닉네임</div>
          {editingNickname ? (
            <input
              ref={nicknameInputRef}
              className={styles.value}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onBlur={() => setEditingNickname(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape") {
                  e.preventDefault();
                  setEditingNickname(false);
                }
              }}
            />
          ) : (
            <div
              className={styles.value}
              onClick={() => setEditingNickname(true)}
              style={{ cursor: "text" }}
              title="클릭해서 닉네임 수정"
            >
              {nickname}
            </div>
          )}
        </div>

        <div className={styles.row}>
          <div className={styles.label}>학년</div>
          <div className={styles.value}>{user.year}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>학과</div>
          <div className={styles.value}>{user.dept}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>이메일</div>
          <div className={styles.value}>{user.email}</div>
        </div>

        {/* ▼ 관심태그 — 요약칩(클릭 시 패널 오픈) */}
        <div className={styles.rowCol}>
          <div className={styles.label}>관심태그</div>
          <div className={styles.itSum}>
            {top3.map((tag, i) => (
              <button
                key={`${tag}-${i}`}
                type="button"
                className={styles.itChip}
                onClick={openInterestPanel}
                aria-label={`${tag} 수정`}
                title="관심태그 편집"
              >
                {tag}
              </button>
            ))}

            {Array.from({ length: Math.max(0, 3 - top3.length) }).map((_, i) => (
              <button
                key={`empty-${i}`}
                type="button"
                className={`${styles.itChip} ${styles.itEmpty}`}
                onClick={openInterestPanel}
                aria-label="관심태그 추가"
                title="관심태그 추가"
              />
            ))}
          </div>
        </div>
      <button className={styles.applyStatusButton}>신청 현황</button>
      </section>

      <div className={styles.bottomSpace} />
      <button className={styles.logout}>로그아웃</button>

      {/* ▼ 관심태그 선택 패널 */}
      {openInterest && (
        <div
          className={styles.intOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="관심태그 선택"
        >
          <div className={styles.intCard}>
            <div className={styles.intBody}>
              <MyPageInterest value={draftTags} onChange={setDraftTags} />
            </div>
           <div className={styles.intFooter}>
  <button
    className={`${styles.intBtn} ${styles.intBtnPrimary}`}
    onClick={applyInterest}   // 적용 + 닫기 둘 다 수행
  >
    닫기
  </button>
</div>
          </div>
        </div>
      )}

      {/* ▼ 프로필 선택 모달 */}
      {openPicker && (
        <div
          className="mp_overlay"
          role="dialog"
          aria-modal="true"
          aria-label="프로필 선택"
        >
          <div className="mp_modal">
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>
              프로필 선택
            </h3>
            <p
              style={{
                margin: "6px 0 0",
                color: "#6b6b6b",
                fontSize: 13,
              }}
            >
              원하는 아바타를 고르세요.
            </p>
            <div className="mp_grid">
              {AVATARS.map((a) => (
                <button
                  key={a.id}
                  className={`mp_opt ${avatarId === a.id ? "__selected" : ""}`}
                  onClick={() => setAvatarId(a.id)}
                  aria-pressed={avatarId === a.id}
                >
                  <img src={a.src} alt={`${a.label} 아바타`} />
                  <span>{a.label}</span>
                </button>
              ))}
            </div>
            <div className="mp_actions">
              <button className="mp_btn" onClick={() => setOpenPicker(false)}>
                취소
              </button>
              <button
                className="mp_btn mp_btn--primary"
                onClick={() => setOpenPicker(false)}
              >
                적용
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

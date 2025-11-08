// src/components/MyPage.jsx
import React from "react";
import styles from "../css/MyPage.module.css";

/* ▼ 프로필 아바타 이미지(파일명 고정) */
import Avatar1 from "../assets/캐릭터.png";   // 곰
import Avatar2 from "../assets/캐릭터2.png";  // 고양이
import Avatar3 from "../assets/캐릭터3.png";  // 토끼

export default function MyPage() {
  // TODO: 실제 데이터는 로그인 정보로 교체
  const user = {
    name: "주노",
    nickname: "Juno",
    year: "3학년",
    dept: "컴퓨터공학과",
    email: "juno@hanseo.ac.kr",
    tags: ["", "", ""], // 빈 칩 3개 표현용
  };

  /* ▼ 프로필(아바타) 상태 + 로컬스토리지 유지 */
  const AVATARS = [
    { id: "bear", src: Avatar1, label: "곰" },
    { id: "cat", src: Avatar2, label: "고양이" },
    { id: "bunny", src: Avatar3, label: "토끼" },
  ];
  const [avatarId, setAvatarId] = React.useState(() => {
    return localStorage.getItem("mypage.avatarId") || "bunny";
  });
  const currentAvatar = AVATARS.find(a => a.id === avatarId)?.src || Avatar3;

  React.useEffect(() => {
    localStorage.setItem("mypage.avatarId", avatarId);
  }, [avatarId]);

  /* ▼ 프로필 선택 모달 on/off */
  const [openPicker, setOpenPicker] = React.useState(false);

  return (
    <main className={styles.page}>
      {/* 모달·오버레이 전용 스타일(이 파일에서만 적용) */}
      <style>{`
        .mp_overlay{
          position:fixed; inset:0; background:rgba(0,0,0,.35);
          display:grid; place-items:center; z-index:60;
        }
        .mp_modal{
          width:min(420px, 92vw); background:#fff; border-radius:16px;
          padding:18px; box-shadow:0 20px 40px rgba(0,0,0,.18);
          animation:mp_pop .16s ease-out both;
        }
        @keyframes mp_pop{ from{ transform:scale(.96); opacity:.6 } to{ transform:scale(1); opacity:1 } }
        .mp_grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-top:12px; }
        .mp_opt{
          border:2px solid transparent; border-radius:14px; background:#f6f6f6;
          padding:10px; cursor:pointer; transition:border-color .15s ease, transform .08s ease;
        }
        .mp_opt:hover{ transform:translateY(-1px) }
        .mp_opt img{ width:100%; height:110px; object-fit:contain; display:block; }
        .mp_opt span{ display:block; text-align:center; margin-top:6px; font-size:12px; color:#555; }
        .mp_opt.__selected{ border-color:#222 }
        .mp_actions{ display:flex; gap:8px; justify-content:flex-end; margin-top:16px; }
        .mp_btn{ padding:10px 14px; border-radius:10px; border:1px solid #e5e5e5; background:#fff; cursor:pointer }
        .mp_btn--primary{ background:#ffd400; border-color:#ffd400; font-weight:700 }
      `}</style>

      <header className={styles.topbar}>
        <button className={styles.back} onClick={() => window.history.back()} aria-label="뒤로">❮</button>
        <h1 className={styles.title}>프로필 설정</h1>
        <span className={styles.rightSpace} />
      </header>

      <section className={styles.avatarBox}>
        <div className={styles.avatar}>
          {/* 기존 토끼 div 대신 선택한 이미지 표시 */}
          <img
            src={currentAvatar}
            alt="프로필 아바타"
            style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
          />
        </div>
        <button className={styles.editBtn} onClick={() => setOpenPicker(true)}>프로필 수정</button>
      </section>

      <section className={styles.form}>
        <div className={styles.row}>
          <div className={styles.label}>이름</div>
          <div className={styles.value}>{user.name}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>닉네임</div>
          <div className={styles.value}>{user.nickname}</div>
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

        <div className={styles.rowCol}>
          <div className={styles.label}>관심태그</div>
          <div className={styles.tagWrap}>
            {user.tags.map((_, i) => <span key={i} className={styles.tagChip} />)}
          </div>
        </div>
      </section>

      <div className={styles.bottomSpace} />
      <button className={styles.logout}>로그아웃</button>

      {/* ▼ 프로필 선택 모달 */}
      {openPicker && (
        <div className="mp_overlay" role="dialog" aria-modal="true" aria-label="프로필 선택">
          <div className="mp_modal">
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>프로필 선택</h3>
            <p style={{ margin: "6px 0 0", color: "#6b6b6b", fontSize: 13 }}>원하는 아바타를 고르세요.</p>

            <div className="mp_grid">
              {AVATARS.map(a => (
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
              <button className="mp_btn" onClick={() => setOpenPicker(false)}>취소</button>
              <button className="mp_btn mp_btn--primary" onClick={() => setOpenPicker(false)}>적용</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

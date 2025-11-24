// src/components/RecruitPanelWrite.jsx
import React, { useRef, useState, useEffect } from "react";
import "../css/RecruitPanelWrite.css";

/* 역할별 아바타 (경로는 실제 프로젝트에 맞게 확인 필요) */
import Bear from "../assets/캐릭터.png"; 
import Cat from "../assets/캐릭터2.png"; 
import UploadIcon from "../assets/share box.png";

const HASHTAG_OPTIONS = [
  "포스터/웹툰/콘텐츠", "사진/영상/UCC", "아이디어/기획", "IT/학술/논문",
  "네이밍/슬로건", "에세이/수필/문학", "스포츠/음악", "미술/디자인/건축",
];

const getFileExt = (name = "") => {
  const dot = name.lastIndexOf(".");
  if (dot === -1) return "";
  return name.slice(dot + 1).toUpperCase(); 
};

export default function RecruitPanelWrite() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    period: "",
    members: [], 
    hashtags: [], 
  });

  const [openCalendar, setOpenCalendar] = useState(false);
  const [rolePickerOpen, setRolePickerOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("bear");
  const [newRoleText, setNewRoleText] = useState("");
  const [tagPanelOpen, setTagPanelOpen] = useState(false);

  const [startDate, setStartDate] = useState(() => new Date());
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  });
  const [activeField, setActiveField] = useState("start");

  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const yearScrollRef = useRef(null);
  const monthScrollRef = useRef(null);
  const dayScrollRef = useRef(null);

  const fmt = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}/${m}/${dd}`;
  };

  const fmtForServer = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  const handleSubmit = () => {
    const formattedStart = fmtForServer(startDate);
    const formattedEnd = fmtForServer(endDate);
    const payload = {
      title: form.title,
      content: form.content,
      hashtags: form.hashtags,
      members: form.members,
      startDate: formattedStart,
      endDate: formattedEnd,
    };
    console.log("📤 백엔드 전송 데이터:", payload);
    alert("작성 완료! 콘솔을 확인하세요.");
  };

  // --- 휠 UI 상수 ---
  const itemHeight = 40; 
  const wheelHeight = 200; 
  const paddingY = (wheelHeight - itemHeight) / 2;

  const handleDateChange = (type, value) => {
    const current = activeField === "start" ? startDate : endDate;
    let newDate = new Date(current);

    if (type === "year") newDate.setFullYear(value);
    if (type === "month") newDate.setMonth(value - 1);
    if (type === "day") newDate.setDate(value);

    if (activeField === "start") setStartDate(newDate);
    else setEndDate(newDate);
  };

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      period: `${fmt(startDate)} ~ ${fmt(endDate)}`,
    }));
  }, [startDate, endDate]);

  useEffect(() => {
    if (!openCalendar) return;
    const activeDate = activeField === "start" ? startDate : endDate;
    const year = activeDate.getFullYear();
    const month = activeDate.getMonth() + 1;
    const day = activeDate.getDate();

    const scrollToValue = (ref, value) => {
      if (ref.current) {
        const children = Array.from(ref.current.children);
        const selectedBtn = children.find(
          (child) => parseInt(child.getAttribute("data-value")) === value
        );
        if (selectedBtn) {
          const parent = ref.current;
          const targetTop =
            selectedBtn.offsetTop -
            parent.clientHeight / 2 +
            selectedBtn.clientHeight / 2;
          parent.scrollTo({ top: targetTop, behavior: "smooth" });
        }
      }
    };

    setTimeout(() => {
      scrollToValue(yearScrollRef, year);
      scrollToValue(monthScrollRef, month);
      scrollToValue(dayScrollRef, day);
    }, 100);
  }, [openCalendar, activeField, startDate, endDate]);

  const YEAR_OPTIONS = Array.from({ length: 8 }, (_, i) => 2022 + i);
  const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);
  const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => i + 1);

  const toggleHashtag = (tag) => {
    setForm((prev) => {
      if (prev.hashtags[0] === tag) return { ...prev, hashtags: [] };
      return { ...prev, hashtags: [tag] };
    });
  };

  const getAvatarSrc = (type) => {
    switch (type) {
      case "cat": return Cat;
      default: return Bear;
    }
  };

  const closeRolePicker = () => {
    setRolePickerOpen(false);
    setNewRoleText("");
    setSelectedAvatar("bear");
  };

  const saveNewMember = () => {
    if (!newRoleText.trim()) return;
    setForm((p) => ({
      ...p,
      members: [...p.members, { id: Date.now(), role: newRoleText.trim(), src: getAvatarSrc(selectedAvatar) }],
    }));
    closeRolePicker();
  };

  const removeMember = (id) => {
    setForm((p) => ({ ...p, members: p.members.filter((m) => m.id !== id) }));
  };

  const openPicker = () => fileInputRef.current?.click();

  const onFilesSelected = (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    const mapped = selected.map((f) => ({
      id: crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${f.name}`,
      name: f.name,
      url: URL.createObjectURL(f),
      file: f,
    }));
    setFiles((prev) => [...prev, ...mapped]);
    e.target.value = "";
  };

  const removeFile = (id) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((f) => f.id !== id);
    });
  };

  useEffect(() => {
    return () => { files.forEach((f) => URL.revokeObjectURL(f.url)); };
  }, []);

  // 아바타 옵션
  const avatarOptions = [
    { key: "bear" },
    { key: "cat" },
    { key: "bear2" },
  ];

  const activeDate = activeField === "start" ? startDate : endDate;

  // 🌟 3D 회전 스타일 계산
  const get3DStyle = (index, selectedIndex) => {
    const offset = index - selectedIndex;
    const absOffset = Math.abs(offset);
    
    if (offset === 0) {
      return {
        opacity: 1,
        transform: `rotateX(0deg) translateZ(0px) scale(1.1)`,
        color: "#000",
        fontWeight: "700",
        fontSize: "1.25rem",
        filter: "none",
      };
    }

    const rotateX = offset * 25; 
    return {
      opacity: Math.max(0.2, 1 - absOffset * 0.3),
      transform: `rotateX(${rotateX * -1}deg) translateZ(${-absOffset * 5}px) scale(0.95)`,
      color: "#9ca3af",
      fontWeight: "500",
      fontSize: "1.125rem",
      filter: `blur(${absOffset * 0.5}px)`,
    };
  };

  return (
    <main className="rpw">
      <section className="rpw-panel">
        {/* 해시태그 */}
        <div className="rpw-row">
          <label className="rpw-label">해시태그</label>
          <div className="rpw-hashArea">
            <button
              type="button"
              className={`rpw-hashPill ${form.hashtags.length ? "__filled" : ""}`}
              onClick={() => setTagPanelOpen((v) => !v)}
            >
              {form.hashtags.length === 0 ? (
                <span className="rpw-hashPlus">+</span>
              ) : (
                <span className="rpw-hashText">{form.hashtags[0]}</span>
              )}
            </button>
            {tagPanelOpen && (
              <div className="rpw-hashPanel">
                <div className="rpw-hashGrid">
                  {HASHTAG_OPTIONS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={`rpw-hashBtn ${form.hashtags[0] === tag ? "__active" : ""}`}
                      onClick={() => toggleHashtag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 제목 */}
        <div className="rpw-row">
          <label className="rpw-label">제목</label>
          <div className="rpw-underlineField">
            <input
              className="rpw-input"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              aria-label="제목"
            />
            <div className="rpw-underline" />
          </div>
        </div>

        {/* 내용 */}
        <div className="rpw-row">
          <label className="rpw-label">내용</label>
          <div className="rpw-bottomWrite">
            <textarea
              className="rpw-bottomTA"
              placeholder="내용을 입력하세요"
              value={form.content}
              onChange={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.currentTarget.scrollHeight}px`;
                setForm((p) => ({ ...p, content: e.target.value }));
              }}
            />
          </div>
        </div>

        {/* 사진/포트폴리오 첨부 */}
        <div className="rpw-row">
          <label className="rpw-label">사진/포트폴리오 첨부</label>
          <div className="rpw-fileBox">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.zip,.ppt,.pptx,.doc,.docx"
              multiple
              onChange={onFilesSelected}
              style={{ display: "none" }}
            />
            {files.length === 0 ? (
              <button
                type="button"
                onClick={openPicker}
                style={{ position: "absolute", inset: 0, margin: "auto", width: 64, height: 64, borderRadius: "50%", display: "grid", placeItems: "center", background: "transparent", border: 0, cursor: "pointer" }}
              >
                <img 
                  src={UploadIcon} 
                  alt="첨부" 
                  className="rpw-upload-icon-static" 
                />
              </button>
            ) : (
              <>
                <div style={{ padding: 12, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))", gap: 12 }}>
                  {files.map((f) => {
                    const isImage = f.file?.type?.startsWith("image/");
                    const ext = getFileExt(f.name);
                    return (
                      <div key={f.id} style={{ position: "relative", background: "#f7f7f7", borderRadius: 10, overflow: "hidden", height: 88 }}>
                        {isImage ? (
                          <img src={f.url} alt={f.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                            <span style={{ fontSize: 18, fontWeight: 700 }}>{ext || "FILE"}</span>
                            <span style={{ fontSize: 11, opacity: 0.6 }}>{f.name}</span>
                          </div>
                        )}
                        <button onClick={() => removeFile(f.id)} style={{ position: "absolute", top: 6, right: 6, width: 22, height: 22, borderRadius: "50%", background: "#fff", border: "1px solid #ddd", cursor: "pointer" }}>×</button>
                      </div>
                    );
                  })}
                </div>
                <button onClick={openPicker} style={{ position: "absolute", right: 12, bottom: 12, width: 44, height: 44, borderRadius: "50%", border: "1px solid #e0e0e0", background: "#fff", display: "grid", placeItems: "center", cursor: "pointer" }}>
                  <img src={UploadIcon} alt="" style={{ width: 22, height: 22, opacity: 0.65 }} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* 구하는 팀원 */}
        <div className="rpw-row">
          <label className="rpw-label">구하는 팀원</label>
          {form.members.length === 0 ? (
            <div className="rpw-teamEmpty">
              <button type="button" className="rpw-teamAddCircle" onClick={() => setRolePickerOpen(true)}>+</button>
            </div>
          ) : (
            <div className="rpw-teamWrap">
              <div className="rpw-teamRow">
                {form.members.map((m) => (
                  <div key={m.id} className="rpw-chip">
                    <button type="button" className="rpw-chipAvatar" onClick={() => removeMember(m.id)}>
                      <img src={m.src} alt={m.role} />
                    </button>
                    <span className="rpw-chipLabel">{m.role}</span>
                  </div>
                ))}
                <div className="rpw-chipAdd">
                  <button type="button" className="rpw-teamAddCircle" onClick={() => setRolePickerOpen(true)}>+</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ✨ 팀원 추가 모달 (업데이트됨) */}
        {rolePickerOpen && (
          <div className="rpw-roleOverlay" onClick={closeRolePicker}>
            <div 
              className="rpw-roleCard" 
              onClick={(e) => e.stopPropagation()}
              style={{ 
                width: 320, 
                background: "#f7f7f7", 
                borderRadius: 24, 
                padding: 24 
              }}
            >
              <h4 style={{ margin: "0 0 18px", fontSize: 20, fontWeight: 700 }}>
                구하는 팀원 추가
              </h4>

              {/* ✅ 아바타 선택 UI */}
              <div className="rpw-avatar-container">
                {avatarOptions.map((opt) => {
                  const isSelected = selectedAvatar === opt.key;
                  return (
                    <div 
                      key={opt.key} 
                      className="rpw-avatar-group"
                      onClick={() => setSelectedAvatar(opt.key)}
                    >
                      {/* 아바타 버튼 */}
                      <button 
                        type="button"
                        className={`rpw-avatar-btn ${isSelected ? "selected" : ""}`}
                      >
                        <img 
                          src={getAvatarSrc(opt.key)} 
                          alt="역할 아바타" 
                          className="rpw-avatar-img" 
                        />
                      </button>

                      {/* 하단 인디케이터 (V 체크 / 빈 박스) */}
                      <div className="rpw-avatar-indicator">
                        {isSelected ? (
                          <span className="rpw-indicator-check">∨</span>
                        ) : (
                          <div className="rpw-indicator-box" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 13, marginBottom: 6, color: "#4b5563" }}>구하는 직책</label>
                <input className="rpw-roleInput" placeholder="구하는 역할을 입력하세요." value={newRoleText} onChange={(e) => setNewRoleText(e.target.value)} />
              </div>
              <button onClick={saveNewMember} style={{ display: "block", width: "70%", margin: "0 auto", padding: "12px 0", borderRadius: 16, border: "none", background: "#dcdcdc", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>추가하기</button>
            </div>
          </div>
        )}

        {/* 기한 (3D 휠 피커) */}
        <div className="rpw-row">
          <label className="rpw-label">기한</label>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div className="rpw-period">
              <button type="button" className={`rpw-periodBtn ${form.period ? "__filled" : ""}`} onClick={() => setOpenCalendar((v) => !v)}>
                {form.period || `${fmt(startDate)} ~ ${fmt(endDate)}`}
              </button>
            </div>

            {openCalendar && (
              <div className="rpw-calendar-popup">
                <div className="rpw-tab-buttons">
                  <button type="button" onClick={() => setActiveField("start")} className={`rpw-tab-btn ${activeField === "start" ? "active" : ""}`}>시작일</button>
                  <button type="button" onClick={() => setActiveField("end")} className={`rpw-tab-btn ${activeField === "end" ? "active" : ""}`}>마감일</button>
                </div>

                <div className="rpw-wheel-wrapper" style={{ height: `${wheelHeight}px` }}>
                  <div className="rpw-wheel-highlight" style={{ height: `${itemHeight}px`, marginTop: `-${itemHeight / 2}px` }} />
                  <div className="rpw-wheel-label">기한</div>
                  <div className="rpw-wheel-cols">
                    
                    <div ref={yearScrollRef} className="rpw-wheel-col align-right">
                      <div style={{ height: `${paddingY}px` }} />
                      {YEAR_OPTIONS.map((y, idx) => {
                        const isSelected = y === activeDate.getFullYear();
                        const selectedIndex = YEAR_OPTIONS.findIndex(opt => opt === activeDate.getFullYear());
                        const style3D = get3DStyle(idx, selectedIndex);
                        return (
                          <div key={y} data-value={y} onClick={() => handleDateChange("year", y)} className="rpw-wheel-item justify-end" style={{ height: `${itemHeight}px`, scrollSnapAlign: "center", ...style3D }}>
                            <span>{y}</span>{isSelected && <span className="rpw-wheel-unit">년</span>}
                          </div>
                        );
                      })}
                      <div style={{ height: `${paddingY}px` }} />
                    </div>

                    <div ref={monthScrollRef} className="rpw-wheel-col align-center">
                      <div style={{ height: `${paddingY}px` }} />
                      {MONTH_OPTIONS.map((m, idx) => {
                        const isSelected = m === activeDate.getMonth() + 1;
                        const selectedIndex = MONTH_OPTIONS.findIndex(opt => opt === activeDate.getMonth() + 1);
                        const style3D = get3DStyle(idx, selectedIndex);
                        return (
                          <div key={m} data-value={m} onClick={() => handleDateChange("month", m)} className="rpw-wheel-item justify-center" style={{ height: `${itemHeight}px`, scrollSnapAlign: "center", ...style3D }}>
                            <span>{m}</span>{isSelected && <span className="rpw-wheel-unit">월</span>}
                          </div>
                        );
                      })}
                      <div style={{ height: `${paddingY}px` }} />
                    </div>

                    <div ref={dayScrollRef} className="rpw-wheel-col align-left">
                      <div style={{ height: `${paddingY}px` }} />
                      {DAY_OPTIONS.map((d, idx) => {
                        const isSelected = d === activeDate.getDate();
                        const selectedIndex = DAY_OPTIONS.findIndex(opt => opt === activeDate.getDate());
                        const style3D = get3DStyle(idx, selectedIndex);
                        return (
                          <div key={d} data-value={d} onClick={() => handleDateChange("day", d)} className="rpw-wheel-item justify-start" style={{ height: `${itemHeight}px`, scrollSnapAlign: "center", ...style3D }}>
                            <span>{d}</span>{isSelected && <span className="rpw-wheel-unit">일</span>}
                          </div>
                        );
                      })}
                      <div style={{ height: `${paddingY}px` }} />
                    </div>
                  </div>
                </div>

                <div className="rpw-complete-btn-wrap">
                  <button type="button" onClick={() => setOpenCalendar(false)} className="rpw-complete-btn">완료</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rpw-bottom">
          <button type="button" className="rpw-submit" onClick={handleSubmit}>
            작성완료
          </button>
        </div>
      </section>
    </main>
  );
}
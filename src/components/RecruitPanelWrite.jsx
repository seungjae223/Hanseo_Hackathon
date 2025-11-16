// src/components/RecruitPanelWrite.jsx
import React, { useRef, useState, useEffect } from "react";
import "../css/RecruitPanelWrite.css";

/* 역할별 아바타 */
import Bear from "../assets/캐릭터.png"; // 개발자
import Cat from "../assets/캐릭터2.png"; // 디자이너
/* 업로드 아이콘 */
import UploadIcon from "../assets/Share Box.png";

/* 날짜 휠 피커 */
import DateWheelPicker from "./DateWheelPicker";

/* ✅ 해시태그 옵션 목록 */
const HASHTAG_OPTIONS = [
  "포스터/웹툰/콘텐츠",
  "사진/영상/UCC",
  "아이디어/기획",
  "IT/학술/논문",
  "네이밍/슬로건",
  "에세이/수필/문학",
  "스포츠/음악",
  "미술/디자인/건축",
];

export default function RecruitPanelWrite() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    period: "",
    members: [], // [{id, role, src}]
    hashtags: [], // ✅ 선택된 해시태그들
  });

  const [openCalendar, setOpenCalendar] = useState(false);

  // ✅ 팀원 추가용 팝업 on/off
  const [rolePickerOpen, setRolePickerOpen] = useState(false);
  // ✅ 팝업 안에서 선택된 캐릭터 / 직책 텍스트
  const [selectedAvatar, setSelectedAvatar] = useState("bear"); // "bear" | "cat"
  const [newRoleText, setNewRoleText] = useState("");

  // ✅ 해시태그 패널 on/off
  const [tagPanelOpen, setTagPanelOpen] = useState(false);

  // 🔔 시작일 / 마감일 상태
  const [startDate, setStartDate] = useState(() => new Date());
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7); // 기본값: 일주일 뒤
    return d;
  });
  const [activeField, setActiveField] = useState("start"); // "start" | "end"

  // ⬇ 파일 업로드 상태
  const [files, setFiles] = useState([]); // [{id,name,url,file}]
  const fileInputRef = useRef(null);

  const fmt = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}/${m}/${dd}`;
  };

  // 휠에서 날짜가 바뀔 때(시작/마감 전환해서 사용)
  const handleWheelChange = (nextDate) => {
    if (activeField === "start") {
      setStartDate(nextDate);
    } else {
      setEndDate(nextDate);
    }
  };

  // 시작/마감 날짜가 바뀔 때마다 form.period 문자열 동기화
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      period: `${fmt(startDate)}  ~  ${fmt(endDate)}`,
    }));
  }, [startDate, endDate]);

  /* ===== 해시태그 토글 (항상 한 개만 선택) ===== */
  const toggleHashtag = (tag) => {
    setForm((prev) => {
      // 이미 선택된 걸 한 번 더 누르면 해제
      if (prev.hashtags[0] === tag) {
        return { ...prev, hashtags: [] };
      }
      // 그 외에는 항상 이 태그 하나만 유지
      return { ...prev, hashtags: [tag] };
    });
  };

  /* ===== 구하는 팀원(+) ===== */

  // ✅ 새 팀원 저장
  const saveNewMember = () => {
    if (!newRoleText.trim()) return;

    const src = selectedAvatar === "bear" ? Bear : Cat;

    setForm((p) => ({
      ...p,
      members: [
        ...p.members,
        {
          id: Date.now(),
          role: newRoleText.trim(),
          src,
        },
      ],
    }));

    // 입력값 초기화
    setNewRoleText("");
    setSelectedAvatar("bear");
    setRolePickerOpen(false);
  };

  const removeMember = (id) => {
    setForm((p) => ({ ...p, members: p.members.filter((m) => m.id !== id) }));
  };

  /* ===== 파일 업로드 핸들러 ===== */
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

    // 같은 파일을 다시 선택할 수 있도록 초기화
    e.target.value = "";
  };

  const removeFile = (id) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((f) => f.id !== id);
    });
  };

  // 언마운트 시 blob URL 정리
  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.url));
    };
    // 의도적으로 deps 비움(언마운트 시 한 번만)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="rpw">
      <section className="rpw-panel">
        {/* 해시태그 */}
        <div className="rpw-row">
          <label className="rpw-label">해시태그</label>

          <div className="rpw-hashArea">
            {/* ▶ 첫 번째 화면: 작은 캡슐 버튼 (해시태그 바로 밑) */}
            <button
              type="button"
              className={`rpw-hashPill ${
                form.hashtags.length ? "__filled" : ""
              }`}
              onClick={() => setTagPanelOpen((v) => !v)}
            >
              {form.hashtags.length === 0 ? (
                <span className="rpw-hashPlus">+</span>
              ) : (
                <span className="rpw-hashText">
                  {form.hashtags[0]} {/* 선택된 태그 한 개만 표시 */}
                </span>
              )}
            </button>

            {/* ▶ 두 번째 화면: 태그 선택 패널 (안쪽은 그리드만) */}
            {tagPanelOpen && (
              <div className="rpw-hashPanel">
                <div className="rpw-hashGrid">
                  {HASHTAG_OPTIONS.map((tag) => {
                    const active = form.hashtags[0] === tag;
                    return (
                      <button
                        key={tag}
                        type="button"
                        className={`rpw-hashBtn ${
                          active ? "__active" : ""
                        }`}
                        onClick={() => toggleHashtag(tag)}
                      >
                        {tag}
                      </button>
                    );
                  })}
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
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              aria-label="제목"
            />
            <div className="rpw-underline" />
          </div>
        </div>

        {/* 내용 */}
        <div className="rpw-row">
          <label className="rpw-label">내용</label>

          {/* 아래 정렬 래퍼 */}
          <div className="rpw-bottomWrite">
            <textarea
              className="rpw-bottomTA"
              placeholder="내용을 입력하세요"
              value={form.content}
              onChange={(e) => {
                e.currentTarget.style.height = "auto";
                e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                setForm((p) => ({ ...p, content: e.target.value }));
              }}
              ref={(el) => {
                if (el) {
                  el.style.height = "auto";
                  el.style.height = `${el.scrollHeight}px`;
                }
              }}
            />
          </div>

          {/* 노란 밑줄은 그대로 */}
          <div className="rpw-underline" />
        </div>

        {/* 사진/포트폴리오 첨부 */}
        <div className="rpw-row">
          <label className="rpw-label">사진/포트폴리오 첨부</label>

          <div
            className="rpw-fileBox"
            aria-label="파일 업로드 영역"
            style={{ position: "relative" }}
          >
            {/* 숨겨진 input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.zip,.ppt,.pptx,.doc,.docx"
              multiple
              onChange={onFilesSelected}
              style={{ display: "none" }}
            />

            {files.length === 0 ? (
              // ▶ 비어있을 때: 가운데 업로드 아이콘 버튼
              <button
                type="button"
                onClick={openPicker}
                title="파일 첨부"
                style={{
                  position: "absolute",
                  inset: 0,
                  margin: "auto",
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background: "transparent",
                  border: 0,
                  cursor: "pointer",
                }}
              >
                <img
                  src={UploadIcon}
                  alt="파일 첨부"
                  style={{ width: 48, height: 48, opacity: 0.6 }}
                />
              </button>
            ) : (
              // ▶ 파일이 있을 때: 미리보기 그리드 + 오른쪽 아래 추가 버튼
              <>
                <div
                  style={{
                    padding: 12,
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(88px, 1fr))",
                    gap: 12,
                  }}
                >
                  {files.map((f) => (
                    <div
                      key={f.id}
                      style={{
                        position: "relative",
                        background: "#f7f7f7",
                        borderRadius: 10,
                        overflow: "hidden",
                        boxShadow: "inset 0 1px 0 rgba(0,0,0,.04)",
                        height: 88,
                      }}
                      title={f.name}
                    >
                      {/* 이미지/파일 미리보기(이미지 외 형식은 아이콘 대체 가능) */}
                      <img
                        src={f.url}
                        alt={f.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          // 이미지가 아닐 때는 기본 업로드 아이콘을 보여줌
                          e.currentTarget.style.objectFit = "contain";
                          e.currentTarget.src = UploadIcon;
                        }}
                      />
                      {/* 삭제 버튼 */}
                      <button
                        type="button"
                        onClick={() => removeFile(f.id)}
                        aria-label="첨부 삭제"
                        style={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: "#fff",
                          border: "1px solid #ddd",
                          fontSize: 14,
                          lineHeight: "20px",
                          cursor: "pointer",
                        }}
                        title="삭제"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* 추가 업로드(우하단 원형 버튼) */}
                <button
                  type="button"
                  onClick={openPicker}
                  aria-label="파일 추가"
                  title="파일 추가"
                  style={{
                    position: "absolute",
                    right: 12,
                    bottom: 12,
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    border: "1px solid #e0e0e0",
                    background: "#fff",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={UploadIcon}
                    alt=""
                    style={{ width: 22, height: 22, opacity: 0.65 }}
                  />
                </button>
              </>
            )}
          </div>
        </div>

        {/* ===== 구하는 팀원 ===== */}
        <div className="rpw-row">
          <label className="rpw-label">구하는 팀원</label>

          {form.members.length === 0 ? (
            /* 처음 상태: 가운데 +만 있는 캡슐 */
            <div className="rpw-teamEmpty">
              <button
                type="button"
                className="rpw-teamAddCircle"
                aria-label="팀원 추가"
                onClick={() => setRolePickerOpen(true)}
              >
                +
              </button>
            </div>
          ) : (
            /* 선택 후: 칩들 + 맨 오른쪽 + 버튼 */
            <div className="rpw-teamWrap">
              <div className="rpw-teamRow">
                {form.members.map((m) => (
                  <div key={m.id} className="rpw-chip">
                    <button
                      type="button"
                      className="rpw-chipAvatar"
                      onClick={() => removeMember(m.id)}
                      title="클릭하여 삭제"
                    >
                      <img src={m.src} alt={m.role} />
                    </button>
                    <span className="rpw-chipLabel">{m.role}</span>
                  </div>
                ))}

                <div className="rpw-chipAdd">
                  <button
                    type="button"
                    className="rpw-teamAddCircle"
                    aria-label="팀원 추가"
                    onClick={() => setRolePickerOpen(true)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ✅ 캐릭터 + 직책 입력 모달 */}
        {rolePickerOpen && (
          <div className="rpw-roleOverlay" role="dialog" aria-modal="true">
            <div className="rpw-roleCard">
              <h4 style={{ marginBottom: 12 }}>구하는 팀원 추가</h4>

              {/* 캐릭터 선택 */}
              <div className="rpw-roleBtns" style={{ marginBottom: 12 }}>
                <button
                  type="button"
                  onClick={() => setSelectedAvatar("bear")}
                  className={
                    selectedAvatar === "bear"
                      ? "rpw-avatarBtn __active"
                      : "rpw-avatarBtn"
                  }
                >
                  <img src={Bear} alt="곰 캐릭터" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAvatar("cat")}
                  className={
                    selectedAvatar === "cat"
                      ? "rpw-avatarBtn __active"
                      : "rpw-avatarBtn"
                  }
                >
                  <img src={Cat} alt="고양이 캐릭터" />
                </button>
              </div>

              {/* 캐릭터 아래 직책 입력 */}
              <div style={{ width: "100%", marginBottom: 12 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    marginBottom: 4,
                    color: "#6b7280",
                  }}
                >
                  구하는 직책
                </label>
                <input
                  className="rpw-roleInput"
                  placeholder="구하는 역할을 입력하세요"
                  value={newRoleText}
                  onChange={(e) => setNewRoleText(e.target.value)}
                />
              </div>

              {/* 버튼들 */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                <button
                  type="button"
                  className="rpw-roleClose"
                  onClick={() => {
                    setRolePickerOpen(false);
                    setNewRoleText("");
                    setSelectedAvatar("bear");
                  }}
                >
                  취소
                </button>
                <button
                  type="button"
                  className="rpw-roleSave"
                  onClick={saveNewMember}
                >
                  추가하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 기한 */}
        <div className="rpw-row">
          <label className="rpw-label">기한</label>
          <div className="rpw-period">
            <button
              type="button"
              className={`rpw-periodBtn ${form.period ? "__filled" : ""}`}
              onClick={() => setOpenCalendar((v) => !v)}
              aria-label="마감일 선택"
            >
              {form.period || `${fmt(startDate)}  ~  ${fmt(endDate)}`}
            </button>

            {openCalendar && (
              <div
                style={{
                  marginTop: 8,
                  background: "#f7f7f7",
                  borderRadius: 18,
                  padding: 12,
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
                }}
              >
                {/* 시작일 / 마감일 탭 */}
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    marginBottom: 8,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveField("start")}
                    style={{
                      flex: 1,
                      borderRadius: 999,
                      border: "none",
                      padding: "6px 0",
                      fontSize: 12,
                      cursor: "pointer",
                      background:
                        activeField === "start" ? "#111827" : "#e5e7eb",
                      color: activeField === "start" ? "#fff" : "#4b5563",
                    }}
                  >
                    시작일
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveField("end")}
                    style={{
                      flex: 1,
                      borderRadius: 999,
                      border: "none",
                      padding: "6px 0",
                      fontSize: 12,
                      cursor: "pointer",
                      background:
                        activeField === "end" ? "#111827" : "#e5e7eb",
                      color: activeField === "end" ? "#fff" : "#4b5563",
                    }}
                  >
                    마감일
                  </button>
                </div>

                {/* 가운데 줄 위에 '기한'이 같이 보이는 휠 */}
                <DateWheelPicker
                  label="기한"
                  value={activeField === "start" ? startDate : endDate}
                  onChange={handleWheelChange}
                />

                <div style={{ marginTop: 8, textAlign: "right" }}>
                  <button
                    type="button"
                    onClick={() => setOpenCalendar(false)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 999,
                      border: "none",
                      background: "#111827",
                      color: "#fff",
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    완료
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="rpw-bottom">
          <button type="button" className="rpw-submit">
            작성완료
          </button>
        </div>
      </section>
    </main>
  );
}

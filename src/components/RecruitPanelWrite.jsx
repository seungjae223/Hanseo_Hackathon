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

/* ✅ 파일 이름에서 확장자(PDF, PNG 등)만 추출 */
const getFileExt = (name = "") => {
  const dot = name.lastIndexOf(".");
  if (dot === -1) return "";
  return name.slice(dot + 1).toUpperCase(); // pdf -> PDF
};

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
  const [selectedAvatar, setSelectedAvatar] = useState("bear"); // "bear" | "cat" | "bear2"
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

  // 아바타 타입에 맞는 이미지 반환
  const getAvatarSrc = (type) => {
    switch (type) {
      case "cat":
        return Cat;
      default:
        // "bear", "bear2" 등은 전부 곰 이미지
        return Bear;
    }
  };

  // 모달 닫을 때 공통 처리
  const closeRolePicker = () => {
    setRolePickerOpen(false);
    setNewRoleText("");
    setSelectedAvatar("bear");
  };

  // ✅ 새 팀원 저장
  const saveNewMember = () => {
    if (!newRoleText.trim()) return;

    const src = getAvatarSrc(selectedAvatar);

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

    closeRolePicker();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 모달에서 사용할 아바타 카드 3개 정보
  const avatarOptions = [
    { key: "bear", bg: "#C4F59A" }, // 연초록
    { key: "cat", bg: "#FFCBCB" },  // 연분홍
    { key: "bear2", bg: "#FFCBCB" } // 세 번째 카드도 연분홍
  ];

  return (
    <main className="rpw">
      <section className="rpw-panel">
        {/* 해시태그 */}
        <div className="rpw-row">
          <label className="rpw-label">해시태그</label>

          <div className="rpw-hashArea">
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
                <span className="rpw-hashText">{form.hashtags[0]}</span>
              )}
            </button>

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
                title="파일 첨부"
                className="rpw-fileEmptyBtn"
              >
                <img
                  src={UploadIcon}
                  alt="파일 첨부"
                  className="rpw-fileEmptyIcon"
                />
              </button>
            ) : (
              <>
                <div className="rpw-fileGrid">
                  {files.map((f) => {
                    const isImage = f.file?.type?.startsWith("image/");
                    const ext = getFileExt(f.name);

                    return (
                      <div
                        key={f.id}
                        className="rpw-fileItem"
                        title={f.name}
                      >
                        {isImage ? (
                          <img
                            src={f.url}
                            alt={f.name}
                            className="rpw-fileThumb"
                          />
                        ) : (
                          <div className="rpw-fileNonImg">
                            <span className="rpw-fileExt">
                              {ext || "FILE"}
                            </span>
                            <span className="rpw-fileName">{f.name}</span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => removeFile(f.id)}
                          aria-label="첨부 삭제"
                          className="rpw-fileDelete"
                          title="삭제"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={openPicker}
                  aria-label="파일 추가"
                  title="파일 추가"
                  className="rpw-fileAddBtn"
                >
                  <img
                    src={UploadIcon}
                    alt=""
                    className="rpw-fileAddIcon"
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

        {/* ✅ 캐릭터 + 직책 입력 모달 (목업 스타일) */}
        {rolePickerOpen && (
          <div
            className="rpw-roleOverlay"
            role="dialog"
            aria-modal="true"
            onClick={closeRolePicker}
          >
            <div
              className="rpw-roleModal"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="rpw-roleTitle">구하는 팀원 추가</h4>

              {/* 아바타 카드 3개 */}
              <div className="rpw-avatarRow">
                {avatarOptions.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setSelectedAvatar(opt.key)}
                    className={`rpw-avatarCard rpw-avatarCard--${opt.key} ${
                      selectedAvatar === opt.key ? "is-active" : ""
                    }`}
                  >
                    <img
                      src={getAvatarSrc(opt.key)}
                      alt="역할 아바타"
                      className="rpw-avatarImg"
                    />
                  </button>
                ))}
              </div>

              {/* 카드 밑 체크박스 줄 */}
              <div className="rpw-avatarChecks">
                {avatarOptions.map((opt) => (
                  <label key={opt.key} className="rpw-checkWrap">
                    <input
                      type="checkbox"
                      checked={selectedAvatar === opt.key}
                      onChange={() => setSelectedAvatar(opt.key)}
                      className="rpw-avatarCheck"
                    />
                  </label>
                ))}
              </div>

              {/* 구하는 직책 입력 */}
              <div className="rpw-roleField">
                <label className="rpw-roleFieldLabel">구하는 직책</label>
                <div className="rpw-roleFieldBox">
                  <input
                    className="rpw-roleInput"
                    placeholder="구하는 역할을 입력하세요."
                    value={newRoleText}
                    onChange={(e) => setNewRoleText(e.target.value)}
                  />
                </div>
              </div>

              {/* 큰 추가하기 버튼 */}
              <button
                type="button"
                onClick={saveNewMember}
                className="rpw-roleSubmit"
              >
                추가하기
              </button>
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
              <div className="rpw-dateSheet">
                <div className="rpw-dateTabs">
                  <button
                    type="button"
                    onClick={() => setActiveField("start")}
                    className={`rpw-dateTab ${
                      activeField === "start" ? "__active" : ""
                    }`}
                  >
                    시작일
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveField("end")}
                    className={`rpw-dateTab ${
                      activeField === "end" ? "__active" : ""
                    }`}
                  >
                    마감일
                  </button>
                </div>

                <DateWheelPicker
                  label="기한"
                  value={activeField === "start" ? startDate : endDate}
                  onChange={handleWheelChange}
                />

                <div className="rpw-dateDoneRow">
                  <button
                    type="button"
                    onClick={() => setOpenCalendar(false)}
                    className="rpw-dateDoneBtn"
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

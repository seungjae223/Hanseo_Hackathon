import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import '../css/Writepage.css';
import title from '../image/title.png';
import team from '../image/team.png';
import mozib from '../image/mozib.png';
import matching from '../image/matching.png';
import home from '../image/home.png';

export default function Writepage() {
  const navigate = useNavigate();

  const handlemyClick = () => navigate("/my");
  const handlehomeClick = () => navigate("/main");

  const today = new Date();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    deadline: "",
    hashtag: ""
  });

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef(null);

  const hashtags = [
    "포스터/웹툰/콘텐츠",
    "사진/영상/UCC",
    "아이디어/기획",
    "IT/학술논문",
    "네임/문구/슬로건",
    "에세이/스토리텔링",
    "스포츠/체육",
    "미술/디자인/건축"
  ];

  const handleHashtagSelect = (tag) => {
    setFormData((prev) => ({ ...prev, hashtag: tag }));
    setModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateSelect = (e) => {
    const chosen = new Date(e.target.value);
    const formattedToday = today.toISOString().split("T")[0];
    const formattedChosen = chosen.toISOString().split("T")[0];
    setFormData((prev) => ({
      ...prev,
      deadline: `${formattedToday} ~ ${formattedChosen}`
    }));
    setCalendarOpen(false);
  };

  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + 1);
  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 1);

  const formatDate = (date) => date.toISOString().split("T")[0];

  return (
    <div className="container2">
      <div className="wpwp">
        <div className="my" onClick={handlemyClick}></div>
        <img src={title} alt="작당모의" className="title4" />

        <div className="wpwp2">
          <h1>해시태그</h1>

          <div className="hashtag" onClick={() => setModalOpen(true)}>
            <span className="hashtag-text">
              {formData.hashtag || "사진/영상/UCC"}
            </span>
          </div>

          {modalOpen && (
            <div className="hashtag-modal" ref={modalRef}>
              {hashtags.map((tag, idx) => (
                <div
                  key={idx}
                  className={`tag-btn2 ${formData.hashtag === tag ? "selected" : ""}`}
                  onClick={() => handleHashtagSelect(tag)}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}

          {/* 제목: 글자 수 제한 (약 40자 = 2줄 정도) */}
          <h2>제목</h2>
          <textarea
            name="title"
            value={formData.title}
            onChange={(e) => {
              if (e.target.value.length <= 38) { // 글자 수 제한
                setFormData({ ...formData, title: e.target.value });
              }
            }}
            className="input-title"
            placeholder="제목을 입력하세요"
            rows={2}
          />

          <div className="line1"></div>

          {/* 내용: 무제한 */}
          <h3>내용</h3>
          <textarea
            name="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="input-content"
            placeholder="내용을 입력하세요"
            rows={5}
          />

          <div className="line2"></div>

          <h4>사진/포토폴리오 첨부</h4>
          <div className="file"></div>

          <h5>구하는 팀원</h5>
          <div className="teamone"></div>

          <h6>기한</h6>

          <input
            type="text"
            name="deadline"
            value={formData.deadline}
            onClick={() => setCalendarOpen(!calendarOpen)}
            readOnly
            className="input-deadline"
            placeholder="예: 2025-11-10 ~ 최대 한달"
          />

          <div className="line3"></div>

          {calendarOpen && (
            <input
              type="date"
              className="calendar-popup"
              onChange={handleDateSelect}
              min={formatDate(minDate)}
              max={formatDate(maxDate)}
            />
          )}

          <div className="end">
            <h1>작성완료</h1>
          </div>

          <div className="bar2">
            <div className="s1">
              <img src={home} alt="홈" className="home2" onClick={handlehomeClick} />
            </div>
            <div className="s2"><img src={team} alt="팀원" className="team2" /></div>
            <div className="s3"><img src={mozib} alt="모집" className="mozib2" /></div>
            <div className="s4"><img src={matching} alt="매칭" className="matching2" /></div>
            <h1>홈</h1>
            <h2>팀관리</h2>
            <h3>모집</h3>
            <h4>매칭</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

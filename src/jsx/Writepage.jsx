import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
    deadline: ""
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeadlineClick = () => {
    setCalendarOpen((prev) => !prev);
  };

  const handleDateSelect = (e) => {
    const chosen = new Date(e.target.value);
    const formattedToday = today.toISOString().split("T")[0];
    const formattedChosen = chosen.toISOString().split("T")[0];
    setSelectedDate(formattedChosen);
    setFormData((prev) => ({
      ...prev,
      deadline: `${formattedToday} ~ ${formattedChosen}`
    }));
    setCalendarOpen(false);
  };

  // 오늘 날짜(선택 불가) 및 한달 뒤 날짜 제한 계산
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
          <h1>해시테그</h1>
          <div className="hashtag"></div>

          <h2>제목</h2>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input-title"
            placeholder="제목을 입력하세요"
          />
          <div className="line1"></div>

          <h3>내용</h3>
          <input
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="input-content"
            placeholder="내용을 입력하세요"
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
            onChange={handleChange}
            onClick={handleDeadlineClick}
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

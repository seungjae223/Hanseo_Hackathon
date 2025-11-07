import { useState } from "react";
import "../css/Mainpage.css";
import title from '../image/title.png';
import team from '../image/team.png';
import mozib from '../image/mozib.png';
import matching from '../image/matching.png';
import { useNavigate } from "react-router-dom";

export default function Mainpage() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/my"); // ✅ 마이페이지로 이동
  };

  const handleMozibClick = () => {
    navigate("/recruit"); // ✅ 모집하기 페이지로 이동 (원하는 경로로 수정 가능)
  };

  return (
    <div className="container">
      <div className="wallpaper1">
        <img src={title} alt="작당모의" className="title2" />
        <div className="my" onClick={handleStartClick}></div>
        <h1>당신의 아이디어,</h1>
        <h2>지금 함께</h2>
        <h3>실행할 팀을 만나보세요!</h3>

        <div className="wallpaper2">
          <h1>팀관리</h1>
          <h2>모집</h2>
          <h3>매칭</h3>

          <div className="circle1">
            <img src={team} alt="팀원" className="team" />
          </div>

          <div className="circle2" onClick={handleMozibClick}> {/* ✅ 클릭 시 이동 */}
            <img src={mozib} alt="모집하기" className="mozib" />
          </div>

          <div className="circle3">
            <img src={matching} alt="매칭하기" className="matching" />
          </div>

          <div className="magam"></div>
          <div className="random1"></div>
          <div className="random2"></div>
          <div className="random3"></div>
          <div className="calendar"></div>
        </div>
      </div>
    </div>
  );
}

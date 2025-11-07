import { useNavigate } from "react-router-dom";
import '../css/Recruit.css';
import { useState } from "react";
import title from '../image/title.png';
import heart from '../image/heart.png';
import write from '../image/write.png';
import search from '../image/search.png';
import team from '../image/team.png';
import mozib from '../image/mozib.png';
import matching from '../image/matching.png';
import home from '../image/home.png';

export default function Recruit() {
    const navigate = useNavigate();

      const handlemyClick = () => {
    navigate("/my"); // ✅ 마이페이지로 이동
  };

  const handlehomeClick = () => {
    navigate("/main"); // ✅ 이동 경로
  };

    const handlewriteClick = () => {
    navigate("/write"); // ✅ 이동 경로
  };
      return (
        <div className="container">
          <div className="wp">
            <img src={title} alt="작당모의" className="title3" />
            <div className="my" onClick={handlemyClick}></div>
            <div className="zzim">
              <img src={heart} alt="하트" className="heart" />
              <div className="zzim2"></div>
              <div className="zzim3"></div>
            </div>
            <div className="wp2">
              <img src={write} alt="글작성" className="write" onClick={handlewriteClick} />
              <div className="sb">
                <h1>자신과 맞는 장소를 검색해보세요!</h1>
                <img src={search} alt="검색" className="search" />
              </div>
              <div className="post"></div>
              <div className="post2"></div>
              <div className="bar">
                <div className="s1"><img src={home} alt="홈" className="home2" onClick={handlehomeClick}  /></div>
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
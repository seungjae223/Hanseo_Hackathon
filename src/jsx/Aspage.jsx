import { useState } from "react";
import "../css/Aspage.css";
import back2 from '../image/back.png';
import { useNavigate } from "react-router-dom";
import note from '../image/note.png';

export default function Aspage() {
  const navigate = useNavigate();
  const handleStartClick = () => navigate("/main");
    const handlewriteClick = () => {navigate("/write");};
  const handleMozibClick = () => {navigate("/recruit");};
  const [activeTab, setActiveTab] = useState("teamjang"); // 기본 탭

  return (
    <div className="container">
      <div className="wp10">
        <img src={back2} alt="뒤로가기" className="back2" onClick={handleStartClick}/>
        <h1>팀 신청 내역</h1>
      </div>

      <div className="wpwp10">

        {/* 팀장 버튼 */}
        <div 
          className={`teamjang ${activeTab === "teamjang" ? "active" : ""}`}
          onClick={() => setActiveTab("teamjang")}
        >
          <p>팀장</p>
        </div>

        {/* 신청내역 버튼 */}
        <div 
          className={`ad ${activeTab === "ad" ? "active" : ""}`}
          onClick={() => setActiveTab("ad")}
        >
          <p>신청 내역</p>
        </div>

        {/* 아래 화면 전환되는 부분 */}
        <div className="content-area">
          {activeTab === "teamjang" && (
            <div className="teamjang-content">
              <div className="loading1"></div>
              <div className="loading2"></div>
              <div className="loading3"></div>
              <div className="sc"><img src={note} alt="노트" className="note"/></div>
              <h1>현재 팀장으로 맡은 팀이 없습니다.</h1>
              <h2>팀원 모집을 하시겠습니까?</h2>
              <div className="mozib-btn" onClick={handlewriteClick}><p>모집하기</p></div>
            </div>
          )}

          {activeTab === "ad" && (
            <div className="ad-content">
              <div className="loading1"></div>
              <div className="loading2"></div>
              <div className="loading3"></div>
              <div className="sc"><img src={note} alt="노트" className="note"/></div>
              <h1>현재 신청한 내역이 없습니다.</h1>
              <h2>팀원 신청을 하시겠습니까?</h2>
              <div className="mozib-btn" onClick={handleMozibClick}><p>신청하기</p></div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

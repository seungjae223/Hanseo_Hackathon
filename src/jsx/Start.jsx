import { useNavigate } from "react-router-dom";
import "../css/Start.css";
import hanseo from '../image/hanseo.png';
import title from '../image/title.png';
import sircle2 from '../image/sircle2.png';
import sircle1 from '../image/sircle1.png';
import character from '../image/character.png';

export default function Start() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/main"); // ✅ 이동 경로
  };

  return (
    <div className="container">
      <div className="wallpaper">
        <img src={hanseo} alt="한서로고" className="hanseo" />
        <img src={title} alt="작당모의" className="title" />
        <div className="line"></div>
        <h1>한서대학교 팀프로젝트, 이제는 똑똑하게!</h1>
        <img src={sircle1} alt="작은원" className="sircle1" />
        <img src={sircle2} alt="큰원" className="sircle2" />

        <div className="start-btn" onClick={handleStartClick}>
          <h1>시작하기</h1>
        </div>

        <img src={character} alt="캐릭터" className="character" />
      </div>
    </div>
  );
}

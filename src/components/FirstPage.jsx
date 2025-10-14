import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/FirstPage.module.css";

/* 1~4 이미지 */
import Meeting from "../assets/작당모의logo.png";     // 하단 캐릭터+테이블
import Uni from "../assets/한서대학교 로고.png";       // 우상단 배지
import Lamp from "../assets/전등.png";                 // 전등(사진)
                
/* ▼ 2번째(타이틀) 이미지 */
import TitleImg from "../assets/작당모의.png";

export default function FirstPage() {
  const nav = useNavigate();
  return (
    <main className={styles.container}>
      <div className={styles.uni}><img src={Uni} alt="한서대학교" /></div>

      {/* ▼ 전등: 마스크 래퍼 안에 이미지 배치 */}
      <div className={styles.lampBox}>
        <div className={styles.lampMask}>
          <img src={Lamp} alt="" className={styles.lamp} />
        </div>
      </div>

      <img src={TitleImg} alt="작당모의" className={styles.titleImg} />
      <p className={styles.subtitle}>한서대학교 팀프로젝트, 이제는 똑똑하게!</p>

      <button className={styles.cta} onClick={() => nav("/Mainpage")}>시작하기</button>
      <img src={Meeting} alt="" className={styles.meeting} />
    </main>
  );
}
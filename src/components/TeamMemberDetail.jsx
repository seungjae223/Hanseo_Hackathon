import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../css/TeamMemberDetail.module.css";

// 캐릭터 이미지들
import Bunny from "../assets/캐릭터.png";
import Cat from "../assets/캐릭터2.png";

export default function TeamMemberDetail(){
  const { id } = useParams();
  const nav = useNavigate();

  return (
    <main className={styles.frame}>
      {/* 상단 텍스트 */}
      <div className={styles.heroText}>
        <h1>당신의 아이디어, 지금 함께 실행할 팀을 만나보세요!</h1>
      </div>

      {/* 카드들 */}
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardInfo}>
              <h3 className={styles.cardTitle}>가나다</h3>
              <p className={styles.cardSubtitle}>가나다</p>
            </div>
            <div className={styles.cardAvatar}>
              <img src={Bunny} alt="토끼 캐릭터" className={styles.characterIcon} />
            </div>
          </div>
          <div className={styles.cardDivider}></div>
          <div className={styles.cardTags}>
            <div className={styles.tag}></div>
            <div className={styles.tag}></div>
            <div className={styles.tag}></div>
          </div>
        </div>
        
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardInfo}>
              <h3 className={styles.cardTitle}>가나다</h3>
              <p className={styles.cardSubtitle}>가나다</p>
            </div>
            <div className={styles.cardAvatar}>
              <img src={Cat} alt="고양이 캐릭터" className={styles.characterIcon} />
            </div>
          </div>
          <div className={styles.cardDivider}></div>
          <div className={styles.cardTags}>
            <div className={styles.tag}></div>
            <div className={styles.tag}></div>
            <div className={styles.tag}></div>
          </div>
        </div>
      </div>
    </main>
  );
}

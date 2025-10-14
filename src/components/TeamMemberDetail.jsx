import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../css/TeamMemberDetail.module.css";
import FooterNav from "./FooterNav";

export default function TeamMemberDetail(){
  const { id } = useParams();
  const nav = useNavigate();

  return (
    <main className={styles.frame}>
      {/* 히어로 배너 (노랑) */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          당신의 아이디어, 지금 함께
          <br />
          실행할 팀을 만나보세요!
        </h1>
      </section>

      {/* 메인 콘텐츠 영역 */}
      <section className={styles.mainContent}>
        {/* 카드들 */}
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardInfo}>
                <h3 className={styles.cardTitle}>가나다</h3>
                <p className={styles.cardSubtitle}>가나다</p>
              </div>
              <div className={styles.cardAvatar}>
                <div className={styles.avatarIcon}></div>
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
                <div className={styles.avatarIcon}></div>
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
      </section>

      {/* 푸터 */}
      <FooterNav />
    </main>
  );
}

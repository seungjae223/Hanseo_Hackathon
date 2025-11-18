import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../css/TeamMemberDetail.module.css";

// 캐릭터 이미지들
import Bunny from "../assets/캐릭터.png";
import Cat from "../assets/캐릭터2.png";

export default function TeamMemberDetail() {
  const { id } = useParams();
  const nav = useNavigate();

  return (
    <main className={styles.frame}>
      {/* 상단 텍스트 */}
          {/* ⬇ 전체 내용을 가운데 정렬할 래퍼 */}
      <div className={styles.inner}>
        {/* 상단 텍스트 */}
        <div className={styles.heroText}>
          <h1>
            지금 내가 몸 담고 있는 팀들의
            <br />
            정보를 한눈에 확인해보세요.
          </h1>
        </div>
      </div>

      {/* 카드들 */}
      <div className={styles.cardContainer}>
        {/* 1번째 카드 */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardInfo}>
              <h3 className={styles.cardTitle}>가나다</h3>
              <p className={styles.cardSubtitle}>시각디자인학과</p>
            </div>
            <div className={styles.cardAvatar}>
              <img
                src={Bunny}
                alt="토끼 캐릭터"
                className={styles.characterIcon}
              />
            </div>
          </div>

          <div className={styles.cardDivider}></div>

          <div className={styles.cardTags}>
            <div className={styles.tag}>사교성</div>
            <div className={styles.tag}>신속 처리</div>
            <div className={styles.tag}>배움 열정</div>
          </div>
        </div>

        {/* 2번째 카드 */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardInfo}>
              <h3 className={styles.cardTitle}>다나가</h3>
              <p className={styles.cardSubtitle}>공간디자인학과</p>
            </div>
            <div className={styles.cardAvatar}>
              <img
                src={Cat}
                alt="고양이 캐릭터"
                className={styles.characterIcon}
              />
            </div>
          </div>

          <div className={styles.cardDivider}></div>

          <div className={styles.cardTags}>
            <div className={styles.tag}>유머감</div>
            <div className={styles.tag}>실행 능력</div>
            <div className={styles.tag}>배움 열정</div>
          </div>
        </div>
      </div>
    </main>
  );
}

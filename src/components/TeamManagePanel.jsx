import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/TeamManagePanel.module.css";

// 포스터 목업 이미지(원하는 파일로 교체)
import Poster from "../assets/contest_poster.png";

const MOCK = [
  { id: 1, tag: "스터디", title: "코스튬 재질 관련 공부", dday: 21, img: Poster },
  { id: 2, tag: "공모전", title: "코스튬 재질 관련 공부", dday: 21, img: Poster },
  { id: 3, tag: "스터디", title: "코스튬 재질 관련 공부", dday: 21, img: Poster },
  { id: 4, tag: "공모전", title: "코스튬 재질 관련 공부", dday: 21, img: Poster },
  { id: 5, tag: "공모전", title: "코스튬 재질 관련 공부", dday: 21, img: Poster },
  { id: 6, tag: "공모전", title: "코스튬 재질 관련 공부", dday: 21, img: Poster },
  { id: 7, tag: "공모전", title: "코스튬 재질 관련 공부", dday: 21, img: Poster },
];

export default function TeamManagePanel() {
  const navigate = useNavigate();

  return (
    <section className={styles.wrap} aria-label="상단 포스터 그리드">
            {/* 상단 텍스트 */}
            <div className={styles.heroText}>
              <h1>
                지금 내가 몸 담고 있는 팀들의
                <br />
                정보를 한눈에 확인해보세요.
              </h1>
            </div>
      <div className={styles.grid}>
        
        {MOCK.map((it) => (
          <article
            key={it.id}
            className={styles.item}
            role="button"
            tabIndex={0}
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/team/${it.id}`)}
            onKeyDown={(e) => e.key === "Enter" && navigate(`/team/${it.id}`)}
          >
            <div className={styles.thumbWrap}>
              <img src={it.img} alt="" className={styles.thumb} />
            </div>

            <div className={styles.meta}>
              <span className={styles.chip}>{it.tag}</span>
              <h3 className={styles.title}>{it.title}</h3>
              <p className={styles.dday}>D-{it.dday}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

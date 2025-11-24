// src/components/RecruitDetail.jsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import css from "../css/RecruitDetail.module.css";

import BackArrow from "../assets/노랑 왼쪽 화살표 .png";
import Share from "../assets/share box.png";
import Heart from "../assets/하트.png";

import Char1 from "../assets/캐릭터.png";
import Char2 from "../assets/캐릭터2.png";
import Char3 from "../assets/캐릭터3.png";

// ✅ 공모전 카테고리 이미지
import ContestTagImg from "../assets/공모전.png";

// 리스트에서 쓰는 목업 데이터 불러오기
import { RECRUIT_MOCKS } from "./RecruitListPanel";

export default function RecruitDetail({ onBack, onJoin = () => {} }) {
  const navigate = useNavigate();
  const { id } = useParams();          // /recruit/:id 에서 id 가져오기
  const numericId = Number(id);
  const post =
    RECRUIT_MOCKS.find((p) => p.id === numericId) || RECRUIT_MOCKS[0];

  const handleBack = onBack || (() => navigate("/recruit"));
  const [liked, setLiked] = useState(false);

  // ✅ 첫 번째 태그
  const mainTag = post.tags?.[0] || "공모전";

  return (
    <div className={css.page}>
      {/* 헤더 */}
      <header className={css.header}>
        <button className={css.backBtn} onClick={handleBack} aria-label="뒤로">
          <img src={BackArrow} alt="" />
        </button>
      </header>

      {/* 메인 카드 */}
      <section className={css.card}>
        <div className={css.cardHead}>
          {/* 날짜 */}
          <span className={css.datePill}>{post.period}</span>

          {/* ✅ 오른쪽 태그를 이미지로 사용 */}
          {mainTag === "공모전" ? (
            <img
              src={ContestTagImg}
              alt="공모전"
              className={css.kindPillImg}  // 👉 CSS에서 크기만 잡아줄 클래스
            />
          ) : (
            // 혹시 다른 태그(예: 스터디 등)일 때는 기존 텍스트 칩 유지
            <span className={css.kindPill}>{mainTag}</span>
          )}
        </div>

        {/* 제목 */}
        <h1 className={css.title}>{post.title}</h1>

        {/* 내용 (지금은 summary 사용) */}
        <p className={css.body}>{post.summary}</p>

        {/* 위쪽 회색 큰 박스 */}
        <div className={css.mediaBox}>
          <span className={css.mediaHint}>사진이나 링크 첨부됨</span>
        </div>

        {/* 하트 + 공유 */}
        <div className={css.mediaActions}>
          <button
            className={css.heartBtn}
            aria-label={liked ? "관심 해제" : "관심 추가"}
            aria-pressed={liked}
            onClick={() => setLiked((v) => !v)}
          >
            <img
              className={`${css.heartIcon} ${liked ? css.on : css.off}`}
              src={Heart}
              alt=""
            />
          </button>

          <button className={css.shareBtn} aria-label="공유">
            <img src={Share} alt="" />
          </button>
        </div>
      </section>

      {/* 팀장 소개 */}
      <section className={css.block}>
        <h2 className={css.blockTitle}>팀장 소개</h2>

        <div className={css.leadCard}>
          <div className={css.leadTop}>
            <div className={css.avatarRing}>
              <img src={Char2} alt="" />
            </div>
          </div>

          <p className={css.leadText}>
            안녕하세요, UX/UI 디자인 경험 많습니다. 포트폴리오 첨부합니다
          </p>

          <div className={css.hashRow}>
            <span className={css.hash}>해시태그</span>
            <span className={css.hash}>포트폴리오</span>
          </div>

          <button className={css.portBtn}>포트폴리오</button>
        </div>
      </section>

      {/* 현재 구하는 팀원 */}
      <section className={css.block}>
        <h2 className={css.blockTitle}>현재 구하는 팀원</h2>

        <div className={css.rolesWrap}>
          <div className={css.role}>
            <img src={Char3} alt="" />
            <span>개발자</span>
          </div>
          <div className={css.role}>
            <img src={Char3} alt="" />
            <span>개발자</span>
          </div>
          <div className={css.role}>
            <img src={Char3} alt="" />
            <span>개발자</span>
          </div>
          <div className={css.role}>
            <img src={Char1} alt="" />
            <span>디자인</span>
          </div>
        </div>
      </section>

      <div className={css.bottomSpace} />
      <footer className={css.footer}>
        <button className={css.cta} onClick={onJoin}>
          참여하기
        </button>
      </footer>
    </div>
  );
}

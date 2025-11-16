import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import css from "../css/RecruitDetail.module.css";

import BackArrow from "../assets/노랑 왼쪽 화살표 .png";
import Share from "../assets/Share Box.png";
import Heart from "../assets/노랑색 하트.png";

import Char1 from "../assets/캐릭터.png";
import Char2 from "../assets/캐릭터2.png";
import Char3 from "../assets/캐릭터3.png";

export default function RecruitDetail({ onBack, onJoin = () => {} }) {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate("/recruit"));
  const [liked, setLiked] = useState(false); // 샘플 이미지처럼 기본 노랑 하트

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
          <span className={css.datePill}>2025-09-25~09-30</span>
          <span className={css.kindPill}>공모전</span>
        </div>

        <h1 className={css.title}>AI 해커톤 같이 나갈 디자이너/개발자</h1>

        <p className={css.body}>
          이번에 열리는 Dacon AI 해커톤에 참가할 팀원을 구합니다. 기획은 완료되었고, 함께
          서비스를 구현할 백엔드 개발자 1명, UX/UI 디자이너 1명을 찾습니다! 포트폴리오가
          있으신 분 환영합니다.
        </p>

        <div className={css.media}>
          <span className={css.mediaHint}>사진이나 링크 첨부됨</span>

          <button className={css.heartBtn}
                  aria-label={liked ? "관심 해제" : "관심 추가"}
                  aria-pressed={liked}
                  onClick={() => setLiked(v=>!v)}>
            <img className={`${css.heartIcon} ${liked ? css.on : css.off}`} src={Heart} alt="" />
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
        <button className={css.cta} onClick={onJoin}>참여하기</button>
      </footer>
    </div>
  );
}

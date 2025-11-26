import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import css from "../css/RecruitDetail.module.css";
import { useToast } from "./Toast";
import { RECRUIT_MOCKS } from "./RecruitListPanel";

import BackArrow from "../assets/노랑 왼쪽 화살표 .png";
import Share from "../assets/share box.png";
import Heart from "../assets/하트.png";
import Char1 from "../assets/캐릭터.png";
import Char2 from "../assets/캐릭터2.png";
import Char3 from "../assets/캐릭터3.png";
import ContestTagImg from "../assets/공모전.png";

export default function RecruitDetail({ onBack, onJoin }) {
  const navigate = useNavigate();
  const { show } = useToast(); // 🔔 Toast 훅 사용
  const { id } = useParams();
  
  const numericId = Number(id);
  const post = RECRUIT_MOCKS.find((p) => p.id === numericId) || RECRUIT_MOCKS[0];

  const handleBack = onBack || (() => navigate("/recruit"));
  const [liked, setLiked] = useState(false);

  const mainTag = post.tags?.[0] || "공모전";

  // 🟢 참여하기 버튼 핸들러
  const handleJoinClick = () => {
    show({
      message: "참여 신청이 완료되었습니다!",
      icon: "bell",
      confetti: true, 
      duration: 2500,
    });

    if (onJoin) onJoin();

    setTimeout(() => {
      navigate("/recruit");
    }, 1500);
  };

  //  하트(찜) 버튼 핸들러 추가
  const handleLikeClick = () => {
    const nextState = !liked;
    setLiked(nextState);

    // 토스트 띄우기
    show({
      message: nextState ? "관심 목록에 추가되었습니다!" : "관심 목록에서 삭제되었습니다.",
      icon: "bell", // 상태에 따라 다른 아이콘
      duration: 1500,
      confetti: nextState, // 찜할 때만 폭죽 터트리기
    });
  };

  return (
    <div className={css.page}>
      {/* 헤더 */}
      <header className={css.header}>
        <button className={css.backBtn} onClick={handleBack} aria-label="뒤로">
          <img src={BackArrow} alt="back" className={css.backIcon} />
        </button>
      </header>

      {/* 메인 카드 */}
      <section className={css.card}>
        <div className={css.cardHead}>
          <span className={css.datePill}>{post.period}</span>

          {mainTag === "공모전" ? (
            <img
              src={ContestTagImg}
              alt="공모전"
              className={css.kindPillImg}
            />
          ) : (
            <span className={css.kindPill}>{mainTag}</span>
          )}
        </div>

        <h1 className={css.title}>{post.title}</h1>
        <p className={css.bodyText}>{post.summary}</p>

        <div className={css.mediaBox}>
          <span className={css.mediaHint}>사진이나 링크 첨부됨</span>
        </div>

        <div className={css.mediaActions}>
          <button
            className={css.heartBtn}
            aria-label={liked ? "관심 해제" : "관심 추가"}
            aria-pressed={liked}
            onClick={handleLikeClick} /* 👈 여기서 핸들러 연결 */
          >
            <img
              className={`${css.heartIcon} ${liked ? css.on : css.off}`}
              src={Heart}
              alt=""
            />
          </button>

          <button className={css.shareBtn} aria-label="공유">
            <img src={Share} alt="" className={css.shareIcon} />
          </button>
        </div>
      </section>

      {/* 팀장 소개 */}
      <section className={css.block}>
        <h2 className={css.blockTitle}>팀장 소개</h2>
        <div className={css.leadCard}>
          <div className={css.leadTop}>
            <div className={css.avatarRing}>
              <img src={Char2} alt="팀장" />
            </div>
          </div>
          <p className={css.leadText}>
            안녕하세요, UX/UI 디자인 경험 많습니다. 포트폴리오 첨부합니다.
          </p>
          <div className={css.hashRow}>
            <span className={css.hash}>#포트폴리오</span>
            <span className={css.hash}>#경력</span>
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
            <span>백엔드</span>
          </div>
          <div className={css.role}>
            <img src={Char1} alt="" />
            <span>디자인</span>
          </div>
            <div className={css.role}>
            <img src={Char2} alt="" />
            <span>프론트</span>
          </div>
        </div>
      </section>

      <div className={css.bottomSpace} />
      
      {/* 하단 버튼 */}
      <footer className={css.footer}>
        <button className={css.cta} onClick={handleJoinClick}>
          참여하기
        </button>
      </footer>
    </div>
  );
}
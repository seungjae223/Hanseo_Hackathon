// src/components/TeamApply.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/TeamApply.css";

import BackIcon from "../assets/Chevron Right Small.png";
import Bunny from "../assets/토끼.png";
import NoteImg from "../assets/note.png";  // 빈 상태 일러스트

/* ───────── 팀장 탭 목업 데이터 ───────── */
const LEADER_LIST = [
  
  // {
  //   id: 1,
  //   role: "디자인",
  //   date: "2025-09-25~09-30",
  //   email: "a64122639@gmail.com",
  // },
  // {
  //   id: 2,
  //   role: "개발자",
  //   date: "2025-09-25~09-30",
  //   email: "a64122639@gmail.com",
  // },
  // {
  //   id: 3,
  //   role: "개발자",
  //   date: "2025-11-13",
  //   email: "a64122639@gmail.com",
  // },
  // {
  //   id: 4,
  //   role: "개발자",
  //   date: "2025-11-13",
  //   email: "a64122639@gmail.com",
  // },
  // {
  //   id: 5,
  //   role: "디자인",
  //   date: "2025-11-13",
  //   email: "a64122639@gmail.com",
  // },
];

/* ───────── 신청 내역 탭 목업 데이터 ───────── */
const APPLY_LIST = [
  {
    id: 1,
    tag: "#디자이너",
    desc: "AI 해커톤 같이 나갈 디자이너/개발자",
    role: "공모전",
    date: "2025-09-25~09-30",
    status: "approved", // 승인
  },
  {
    id: 2,
    tag: "#스터디",
    desc: "AI 해커톤 같이 나갈 디자이너/개발자",
    role: "개발자",
    date: "2025-09-25~09-30",
    status: "rejected", // 거절
  },
  {
    id: 3,
    tag: "#스터디",
    desc: "AI 해커톤 같이 나갈 디자이너/개발자",
    role: "개발자",
    date: "2025-11-13",
    status: "rejected",
  },
  {
    id: 4,
    tag: "#스터디",
    desc: "AI 해커톤 같이 나갈 디자이너/개발자",
    role: "개발자",
    date: "2025-11-13",
    status: "pending", // 보류
  },
  {
    id: 5,
    tag: "#디자이너",
    desc: "AI 해커톤 같이 나갈 디자이너/개발자",
    role: "디자인",
    date: "2025-11-13",
    status: "approved",
  },
];

function statusLabel(status) {
  if (status === "approved") return "승인";
  if (status === "rejected") return "거절";
  return "보류";
}

export default function TeamApply() {
  const nav = useNavigate();
  const [tab, setTab] = useState("leader"); // 'leader' | 'apply'

  const hasLeader = LEADER_LIST.length > 0;

  const handleGoRecruit = () => {
    //  글쓰기 페이지로 가고 싶으면 여기 경로만 네 프로젝트에 맞게 바꿔줘!
    nav("/Recruit");
  };

  return (
    <div className="ta-root">
      <div className="ta-phone">
        {/* 상단 헤더 */}
        <header className="ta-header">
          <button
            type="button"
            className="ta-back"
            onClick={() => nav(-1)}
            aria-label="뒤로가기"
          >
            <img src={BackIcon} alt="뒤로가기" />
          </button>
          <h1 className="ta-header-title">팀 신청 내역</h1>
        </header>

        {/* 탭 */}
        <div className="ta-tabs">
          <button
            type="button"
            className={`ta-tab ${tab === "leader" ? "is-active" : ""}`}
            onClick={() => setTab("leader")}
          >
            팀장
          </button>
          <button
            type="button"
            className={`ta-tab ${tab === "apply" ? "is-active" : ""}`}
            onClick={() => setTab("apply")}
          >
            신청 내역
          </button>
        </div>

        {/* 내용 */}
        <main className="ta-content">
          {tab === "leader" ? (
            hasLeader ? (
              /* ── 팀장 탭: 리스트 있을 때 ── */
              <ul className="ta-list">
                {LEADER_LIST.map((it) => (
                  <li key={it.id} className="ta-item">
                    <div className="ta-avatar-box">
                      <div className="ta-avatar-inner">
                        <img src={Bunny} alt="프로필" />
                      </div>
                    </div>

                    <div className="ta-info">
                      <div className="ta-role">{it.role}</div>
                      <div className="ta-meta">{it.date}</div>
                      <div className="ta-meta ta-email">{it.email}</div>
                    </div>

                    <div className="ta-actions">
                      <button type="button" className="ta-btn ta-btn-reject">
                        ✕
                      </button>
                      <button type="button" className="ta-btn ta-btn-accept">
                        ✓
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              /* ── 팀장 탭: 데이터 없을 때(네가 보낸 이미지 상태) ── */
              <section className="ta-empty">
                <div className="ta-empty-dots">
                  <span className="ta-empty-dot" />
                  <span className="ta-empty-dot" />
                  <span className="ta-empty-dot" />
                </div>
                <div className="ta-empty-illustration">
                  <img src={NoteImg} alt="노트 일러스트" />
                </div>
                <p className="ta-empty-title">
                  현재 팀장으로 맡은 팀이 없습니다.
                </p>
                <p className="ta-empty-sub">
                  팀원 모집을 하시겠습니까?
                </p>
                <button
                  type="button"
                  className="ta-empty-button"
                  onClick={handleGoRecruit}
                >
                  모집하기
                </button>
              </section>
            )
          ) : (
            /* ── 신청 내역 탭 ── */
            <ul className="ta-list">
              {APPLY_LIST.map((it) => (
                <li key={it.id} className="ta-apply-item">
                  <div className="ta-apply-card">
                    <div className="ta-apply-tag">{it.tag}</div>
                    <div className="ta-apply-desc">{it.desc}</div>
                  </div>

                  <div className="ta-apply-info">
                    <div className="ta-apply-role">{it.role}</div>
                    <div className="ta-apply-date">{it.date}</div>
                  </div>

                  <div
                    className={
                      "ta-apply-status " +
                      (it.status === "approved"
                        ? "ta-apply-status--approved"
                        : it.status === "rejected"
                        ? "ta-apply-status--rejected"
                        : "ta-apply-status--pending")
                    }
                  >
                    {statusLabel(it.status)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
}

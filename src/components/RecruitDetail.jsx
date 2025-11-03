// src/components/RecruitDetail.jsx
import React from "react";

export default function RecruitDetail() {
  return (
    <main
      style={{
        minHeight: "60vh",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        padding: "48px 24px",
        color: "#333",
        background: "#f7f7f7",
      }}
    >
      <div>
        <h1 style={{ fontSize: "1.8rem", marginBottom: 12 }}>모집 상세 페이지</h1>
        <p style={{ fontSize: "1rem", opacity: 0.8 }}>
          아직 콘텐츠가 준비되지 않았습니다. 곧 업데이트될 예정이에요.
        </p>
      </div>
    </main>
  );
}

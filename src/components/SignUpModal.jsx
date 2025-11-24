// src/components/SignUpModal.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/SignUpModal.module.css";
import BackIcon from "../assets/Chevron Right Small.png";
import EmailVerifyModal from "./EmailVerifyModal";
import FindPasswordModal from "./FindpassWordModal";   // 비밀번호 설정 모달
import Lightlogo from "../assets/연한 로고 .png";
import Word from "../assets/회원가입.png";
import { apiFetch } from "./utils/api.js";

// 학과 목록 (학부별 그룹)
const DEPARTMENT_GROUPS = [
  {
    label: "항공학부",
    options: [
      "항공교통물류학과",
      "항공운항학과",
      "헬리콥터조종학과",
      "항공정비학과",
      "항공보안학과",
      "공항행정학과",
    ],
  },
  {
    label: "항공우주공학부",
    options: [
      "항공기계공학과",
      "항공전자공학과",
      "무인항공기학과",
      "항공산업공학과",
      "신소재화학공학과",
      "환경·토목·건축학과",
    ],
  },
  {
    label: "AI,SW학부",
    options: ["항공AI소프트웨어학과", "AI로보틱스학과", "AI모빌리티학과"],
  },
  {
    label: "항공관광학부",
    options: ["항공관광학과", "항공외국어학과", "호텔카지노관광학과"],
  },
  {
    label: "문화콘텐츠학부",
    options: [
      "문화재보존학과",
      "미디어문예창작학과",
      "실용음악과",
      "영화영상학과",
    ],
  },
  {
    label: "보건학부",
    options: [
      "사회복지학과",
      "간호학과",
      "물리치료학과",
      "작업치료학과",
      "방사선학과",
      "치위생학과",
      "의료재활학과",
      "수산생명의학과",
    ],
  },
  {
    label: "디자인융합학부",
    options: [
      "영상애니메이션학과",
      "공간디자인학과",
      "산업디자인학과",
      "시각디자인학과",
    ],
  },
  {
    label: "해양·스포츠학부",
    options: ["해양경찰학과", "경호비서학과", "레저해양스포츠학과"],
  },
  {
    label: "자유전공학부",
    options: [
      "자유전공학과",
      "인문사회전공자율학과",
      "공학전공자율학과",
      "자연과학전공자율학과",
      "예체능전공자율학과",
    ],
  },
  {
    label: "충남RISE융합학부(계약학과)",
    options: [
      "첨단항공학과",
      "항공서비스경영학과",
      "모빌리티융합디자인학과",
      "디지털융합학과(성인학습자)",
    ],
  },
  {
    label: "2024년 학과",
    options: [
      "항공소프트웨어공학과",
      "항공융합학부",
      "항공컴퓨터학과",
      "전기전자공학과",
      "식품공학과",
      "국제관계학과",
      "안전보건학과",
      "뷰티바이오산업학과",
      "디자인엔터미디어학부",
      "패션디자인학과",
    ],
  },
];

export default function SignUpModal({ onClose, onOpenLogin }) {
  const navigate = useNavigate();

  // 1단계: 이메일 인증 상태 (지금은 화면에서 안 씀)
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // 2단계: 회원정보(비밀번호 제외)
  const [form, setForm] = useState({
    name: "",
    nickname: "",
    grade: "",
    department: "",
    password: "",
    passwordConfirm: "",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // 3단계: 비밀번호 설정 모달 열림 여부
  const [showPwModal, setShowPwModal] = useState(false);

  // ✅ 학과 드롭다운 열림 여부
  const [isDeptOpen, setIsDeptOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBackToLogin = () => {
    if (typeof onOpenLogin === "function") return onOpenLogin();
    if (typeof onClose === "function") return onClose();
    try {
      navigate("..", { replace: true });
    } catch {}
  };

  // 학과 선택 처리
  const handleDeptSelect = (dept) => {
    setForm((prev) => ({ ...prev, department: dept }));
    setIsDeptOpen(false);
  };

  // 실제 회원가입 API 호출 (비밀번호는 FindPasswordModal에서 받아서 전달)
  const handleSubmit = async (password, passwordConfirm) => {
    setErr("");

    const finalPassword = password ?? form.password;
    const finalPasswordConfirm = passwordConfirm ?? form.passwordConfirm;

    if (!verifiedEmail || !verificationCode) {
      return setErr("이메일 인증을 먼저 완료해주세요.");
    }
    if (!finalPassword || finalPassword.length < 8) {
      return setErr("비밀번호를 8자 이상 입력하세요.");
    }
    if (finalPassword !== finalPasswordConfirm) {
      return setErr("비밀번호 확인이 일치하지 않습니다.");
    }
    if (!form.name || !form.nickname || !form.grade || !form.department) {
      return setErr("모든 필드를 입력해주세요.");
    }

    const payload = {
      email: verifiedEmail,
      password: finalPassword,
      username: form.name,
      nickname: form.nickname,
      grade: form.grade,
      department: form.department,
      verificationCode,
    };

    try {
      setLoading(true);
      await apiFetch("/api/signup", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      alert("회원가입이 완료되었습니다. 로그인 해주세요.");
      if (typeof onOpenLogin === "function") return onOpenLogin();
      if (typeof onClose === "function") onClose();
      try {
        navigate("..", { replace: true });
      } catch {}
    } catch (e) {
      setErr(e.message || "회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 지금 화면에서 "다음" 눌렀을 때: 기본 정보 확인 후 비밀번호 모달 열기
  const handleNext = () => {
    setErr("");

    // ✏️ 이메일 인증 나중에 다시 연결할 거면 이 부분 복구
    // if (!verifiedEmail || !verificationCode) {
    //   return setErr("이메일 인증을 먼저 완료해주세요.");
    // }

    if (!form.name || !form.nickname || !form.grade || !form.department) {
      return setErr("모든 필드를 입력해주세요.");
    }

    setShowPwModal(true);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* 상단 헤더 */}
        <header className={styles.header}>
          <button
            onClick={handleBackToLogin}
            className={styles.backBtn}
            aria-label="로그인으로 돌아가기"
          >
            <img src={BackIcon} alt="뒤로가기" />
          </button>
          <span className={styles.title}>회원가입</span>
        </header>

        {/* 이메일 인증 단계 JSX는 일단 주석 처리
        {!emailVerified ? (
          <EmailVerifyModal
            onVerified={(info) => {
              if (typeof info === "string") {
                setVerifiedEmail(info);
                setVerificationCode("");
              } else {
                setVerifiedEmail(info?.email || "");
                setVerificationCode(info?.verificationCode || "");
              }
              setEmailVerified(true);
            }}
          />
        ) : (
        */}
        <>
          {/* 지금 보고 있는 2단계: 이름/닉네임/학년/학과 화면 */}
          <main className={styles.body}>
           <img src={Lightlogo} className={styles.Lightlogo} alt="로고"/>
            <img src={Word} className={styles.subText} alt="회원가입"/>
              {verifiedEmail ? ` (인증: ${verifiedEmail})` : ""}

            <div className={styles.field}>
              <label className={styles.label}>이름</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={styles.inputAccent}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>닉네임</label>
              <input
                type="text"
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                className={styles.inputAccent}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>학년</label>
              <input
                type="text"
                name="grade"
                value={form.grade}
                onChange={handleChange}
                className={styles.inputAccent}
              />
            </div>

            {/* ✅ 커스텀 학과 드롭다운 */}
            <div className={styles.field}>
              <label className={styles.label}>학과</label>

              <div className={styles.deptWrapper}>
                <button
                  type="button"
                  className={styles.deptControl}
                  onClick={() => setIsDeptOpen((prev) => !prev)}
                >
                  <span>
                    {form.department && form.department.trim() !== ""
                      ? form.department
                      : "학과 선택"}
                  </span>
                  <span className={styles.deptArrow}>▾</span>
                </button>

                {isDeptOpen && (
                  <div className={styles.deptDropdown}>
                    {DEPARTMENT_GROUPS.map((group) => (
                      <div key={group.label}>
                        <div className={styles.deptGroupLabel}>
                          {group.label}
                        </div>
                        {group.options.map((dept) => (
                          <button
                            key={dept}
                            type="button"
                            className={styles.deptOption}
                            onClick={() => handleDeptSelect(dept)}
                          >
                            {dept}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {err && <p className={styles.errorText}>{err}</p>}
          </main>

          {/* 하단 "다음" 버튼 */}
          <footer className={styles.footer}>
            <button
              className={styles.submitBtn}
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? "처리 중..." : "다음"}
            </button>
          </footer>
        </>
        {/* )}  // 이메일 인증 분기 닫는 괄호 (현재는 사용 X) */}

        {/* 3단계: 비밀번호 설정 모달 (다음 눌렀을 때 뜸) */}
        {showPwModal && (
          <FindPasswordModal
            onClose={() => setShowPwModal(false)}
            onPasswordSet={(pw, pwConfirm) => {
              setForm((prev) => ({
                ...prev,
                password: pw,
                passwordConfirm: pwConfirm,
              }));
              handleSubmit(pw, pwConfirm);
              setShowPwModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

# 🎓 한서대 온캠퍼스 커뮤니티 플랫폼
> 한서대 학생들을 위한 **공모전 · 스터디 · 대외활동 · 공간 예약 통합 웹서비스**

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-blue?logo=react" />
  <img src="https://img.shields.io/badge/State-Zustand-593D88?logo=zustand" />
  <img src="https://img.shields.io/badge/Language-JSX-orange" />
  <img src="https://img.shields.io/badge/Features-LazyLoading-yellow" />
  <img src="https://img.shields.io/badge/Responsive-Mobile%20CSS-green" />
</p>

---

## 📌 서비스 개요
- **목표**: 한서대 학생들이 공모전·스터디·대외활동에 쉽게 참여하고, 교내 공간 예약까지 원스톱으로 해결  
- **대상**: 한서대 재학생 (학교 이메일 `@hanseo.ac.kr` 인증 필수)  
- **특징**: 커뮤니티 + 모임 매칭 + 장소 예약 + 학과 네트워킹  

---

## 🚀 주요 기능

### 📝 커뮤니티 & 게시판
- 익명/실명 게시판 분리 (자유게시판 / 학과·전공 게시판 / 공모전 / 스터디 / 중고장터)
- 좋아요 👍, 댓글 💬, 대댓글 ↩, 멘션 알림 🔔
- 주간 인기 글/모임 TOP 5 자동 집계
- 욕설·스팸 자동 필터링, 신고/블라인드 처리

### 🤝 모임 생성 & 참여
- 모집글 작성 시 **인원/기간/주제/역량** 설정
- 참여 버튼 클릭 한 번으로 신청  
- 신청자 목록 공개/비공개 설정
- **신뢰도 제도**: 성실 참여자 상위 노출 / 불참 시 제재

### 💬 실시간 소통
- 그룹 채팅 자동 생성 (공지, 파일, 투표 기능 지원)
- **자동 리마인드 알림** (모임 하루 전 & 당일 오전)
- 장소 예약 정보와 연동

### 🏫 공간 예약 시스템
- 빈 강의실·스터디룸·동아리방 예약 현황 대시보드
- 모집 시 공간 예약 연동
- 예약자 관리 기능 (출석 체크, 일정 변경)
- 학번 기준 예약 횟수 제한 & 불참 시 신뢰도 차감

---

## 📱 프론트엔드 특징
- **React (JSX 기반 컴포넌트 구조)**  
- **Zustand**: 전역 상태 관리 (간단하고 가벼운 Store)  
- **Lazy Loading**: 필요한 화면만 로드해 속도 최적화  
- **Responsive Design (모바일 CSS 대응)**  
- **재사용 가능한 컴포넌트 구조화**  

---

## 🔐 접근 & 인증
- 한서대 이메일(`@hanseo.ac.kr`) 인증 → 재학생 전용 보장  
- 학생증 인증 → 공모전/학과 게시판 등 신뢰성 강화  
- 자유게시판(익명 허용) vs 공식 게시판(실명 필수)  

---

## 🌟 기대 효과
✅ 학생 생활 편의성 향상: 모임+참여+예약 통합  
✅ 교내 활동 활성화: 공모전·스터디·대외활동 참여율 ↑  
✅ 건전한 커뮤니티 문화: 필터링 & 신뢰도 시스템  
✅ 학과/전공 네트워킹 강화  

---

## ⚡ 기술 스택

### Frontend
- React (JSX)
- Zustand (상태관리)
- Lazy Loading
- Responsive CSS (모바일 최적화)

### Backend (예상)
- Node.js (Express) + Flask API
- DB: PostgreSQL / MongoDB
- Firebase Hosting / AWS 배포

---

## 📂 프로젝트 구조 (예시)
```bash
frontend/
 ├── src/
 │   ├── components/   # 재사용 가능한 컴포넌트
 │   ├── pages/        # 주요 페이지
 │   ├── store/        # Zustand 전역 상태
 │   ├── styles/       # 모바일 대응 CSS
 │   └── api/          # 백엔드 연동


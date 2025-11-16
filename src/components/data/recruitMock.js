// src/data/recruitMock.js
export const RECRUIT_POSTS = [
  {
    id: 1,
    tags: ["공모전", "디자이너"],
    tagText: "#공모전 #디자이너",
    title: "AI 해커톤 같이 나갈 디자이너/개발자",
    period: "2025-09-27 ~ 10-4",
    dday: 6,
    summary:
      "AI 해커톤 참가 팀원 모집. 기획 완료, 백엔드 1 · UX/UI 1 찾습니다. 포트폴리오 환영!",
    content:
      "이번에 열리는 Dacon AI 해커톤에 참가할 팀원을 구합니다. 기획은 완료되었고, 함께 서비스를 구현할 백엔드 개발자 1명, UX/UI 디자이너 1명을 찾습니다! 포트폴리오가 있으신 분 환영합니다.",
    highlight: "",
  },
  {
    id: 2,
    tags: ["공모전", "기획"],
    tagText: "#공모전 #기획",
    title: "캡스톤 포스터 제작 팀원 모집",
    period: "2025-10-02 ~ 10-10",
    dday: 8,
    summary: "캡스톤 전시 포스터/브랜딩 작업 참여자 모집. 협업 툴로 진행 예정.",
    content:
      "캡스톤 전시를 위한 포스터/브랜딩 작업을 진행합니다. 기획 · 카피라이팅 · 디자이너 역할을 모집합니다.",
    highlight: "디자인 협업 경험자 우대",
  },
  {
    id: 3,
    tags: ["스터디", "한서대"],
    tagText: "#스터디 #한서대",
    title: "웹접근성 리뉴얼 스터디",
    period: "2025-10-05 ~ 12-20",
    dday: 12,
    summary:
      "매주 모여 웹 접근성 가이드 WCAG 따라 리뉴얼 실습하는 스터디입니다.",
    content:
      "WCAG 가이드를 바탕으로 실제 사이트 한 페이지씩 리뉴얼 실습합니다. 초보도 환영!",
    highlight: "초보도 환영!",
  },
  {
    id: 4,
    tags: ["공모전", "콘텐츠"],
    tagText: "#공모전 #콘텐츠",
    title: "숏폼 공모전 촬영·편집 팀",
    period: "2025-10-07 ~ 10-30",
    dday: 10,
    summary:
      "숏폼(릴스/쇼츠) 공모전 참가. 촬영/편집과 기획 파트 함께할 팀원 구함.",
    content:
      "릴스/쇼츠 포맷의 숏폼 공모전에 참가합니다. 촬영/편집 능숙자, 기획자 모두 환영!",
    highlight: "촬영장비 보유자 우대",
  },
  {
    id: 5,
    tags: ["공모전", "개발자"],
    tagText: "#공모전 #개발자",
    title: "대학생 앱개발 공모전 팀업",
    period: "2025-10-12 ~ 11-1",
    dday: 4,
    summary:
      "React/스프링 기반 앱 공모전 팀 빌딩. 프론트·백엔드·디자인 모집.",
    content:
      "React + Spring 기반 앱 공모전 팀입니다. 프론트/백엔드/디자인 전 파트 모집 중!",
    highlight: "클릭시 상세히 볼 수 있어요",
  },
];

export const getRecruitById = (id) =>
  RECRUIT_POSTS.find((p) => String(p.id) === String(id));

// src/components/common/LazyLoading.jsx
import React, { lazy, Suspense } from "react";

export function DefaultFallback() {
  return (
    <div
      style={{
        minHeight: "50vh",
        display: "grid",
        placeItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          border: "4px solid rgba(246, 228, 41, 1)",
          borderTopColor: "currentColor",
          animation: "spin 1s linear infinite",
        }}
      />
      <p style={{ opacity: 0.7 }}>화면을 불러오는 중…</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/** Suspense 경계 */
export function LazyBoundary({ children, fallback }) {
  return (
    <Suspense fallback={fallback ?? <DefaultFallback />}>
      {children}
    </Suspense>
  );
}

/** 모듈에서 컴포넌트를 안전하게 꺼내기 (default 없을 때 named도 지원) */
function pickDefault(mod, ...namedKeys) {
  if (mod && mod.default) return { default: mod.default };
  for (const k of namedKeys) {
    if (mod && mod[k]) return { default: mod[k] };
  }
  // 마지막 안전장치: 모듈 자체를 리턴(대부분 default가 없을 땐 여기 걸림)
  return { default: mod };
}

/** 동적 import 실패 시 재시도(옵션) */
function lazyRetry(factory, retries = 2, interval = 500) {
  return lazy(async () => {
    for (let i = 0; i <= retries; i++) {
      try {
        return await factory();
      } catch (err) {
        if (i === retries) throw err;
        await new Promise((r) => setTimeout(r, interval));
      }
    }
    return factory();
  });
}

/** 여기서는 전부 components 폴더(../) 기준입니다 */
export const Lazy = {
  /* 라우트/페이지 */
  FirstPage:        lazyRetry(() => import("../FirstPage.jsx").then(m => pickDefault(m, "FirstPage"))),
  MainPage:         lazyRetry(() => import("../MainPage.jsx").then(m => pickDefault(m, "MainPage"))),
  RecruitListPanel: lazyRetry(() => import("../RecruitListPanel.jsx").then(m => pickDefault(m, "RecruitListPanel"))),
  TeamManagePanel:  lazyRetry(() => import("../TeamManagePanel.jsx").then(m => pickDefault(m, "TeamManagePanel"))),
  ProtectedPage:    lazyRetry(() => import("../ProtectedPage.jsx").then(m => pickDefault(m, "ProtectedPage"))),
  Matching:         lazyRetry(() => import("../Matching.jsx").then(m => pickDefault(m, "Matching"))),
  RecruitDetail:    lazyRetry(() => import("../RecruitDetail.jsx").then(m => pickDefault(m, "RecruitDetail"))),
  TeamMemberDetail: lazyRetry(() => import("../TeamMemberDetail.jsx").then(m => pickDefault(m, "TeamMemberDetail"))),

  /* 마이페이지 — 실제 파일명: MyPage.jsx */
  MyPage:           lazyRetry(() =>
    import("../MyPage.jsx").then(m => pickDefault(m, "MyPage", "Mypage"))
  ),

  /* 글쓰기 — 실제 파일명에 맞춰서 사용 (여기서는 RecruitPanelWrite.jsx 기준) */
  RecruitpanelWrite: lazyRetry(() =>
    import("../RecruitPanelWrite.jsx").then(m => pickDefault(m, "RecruitPanelWrite", "RecruitpanelWrite"))
  ),

  /* 공통 컴포넌트 */
  Header:           lazyRetry(() => import("../Header.jsx").then(m => pickDefault(m, "Header"))),
  LoginModal:       lazyRetry(() => import("../LoginModal.jsx").then(m => pickDefault(m, "LoginModal"))),
  SignUpModal:      lazyRetry(() => import("../SignUpModal.jsx").then(m => pickDefault(m, "SignUpModal"))),
  EmailVerifyModal: lazyRetry(() => import("../EmailVerifyModal.jsx").then(m => pickDefault(m, "EmailVerifyModal"))),
  FindpassWordModal:lazyRetry(() => import("../FindpassWordModal.jsx").then(m => pickDefault(m, "FindpassWordModal"))),
  AuthBlurGate:     lazyRetry(() => import("../AuthBlurGate.jsx").then(m => pickDefault(m, "AuthBlurGate"))),
  LoadingSpinner:   lazyRetry(() => import("../Loadingspinner.jsx").then(m => pickDefault(m, "LoadingSpinner"))),
};

/** 프리패치 */
export const prefetch = {
  first:            () => import(/* webpackPrefetch: true */ "../FirstPage.jsx"),
  main:             () => import(/* webpackPrefetch: true */ "../MainPage.jsx"),
  recruit:          () => import(/* webpackPrefetch: true */ "../RecruitListPanel.jsx"),
  team:             () => import(/* webpackPrefetch: true */ "../TeamManagePanel.jsx"),
  protected:        () => import(/* webpackPrefetch: true */ "../ProtectedPage.jsx"),
  matching:         () => import(/* webpackPrefetch: true */ "../Matching.jsx"),
  recruitDetail:    () => import(/* webpackPrefetch: true */ "../RecruitDetail.jsx"),
  teamMemberDetail: () => import(/* webpackPrefetch: true */ "../TeamMemberDetail.jsx"),

  /* 마이페이지 프리패치 — 실제 파일명: MyPage.jsx */
  mypage:           () => import(/* webpackPrefetch: true */ "../MyPage.jsx"),

  /* 글쓰기 프리패치 — 실제 파일명에 맞춰서 */
  recruitWrite:     () => import(/* webpackPrefetch: true */ "../RecruitPanelWrite.jsx"),
};

export default Lazy;

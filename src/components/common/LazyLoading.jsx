// src/components/common/LazyLoading.jsx
import React, { lazy, Suspense } from "react";

export function DefaultFallback() {
  return (
    <div
      style={{
        minHeight: "50vh",
        display: "grid",
        placeItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "4px solid rgba(0, 0, 0, 0.1)",
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
  return <Suspense fallback={fallback ?? <DefaultFallback />}>{children}</Suspense>;
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
  FirstPage:        lazyRetry(() => import(/* webpackChunkName: "first-page" */       "../FirstPage.jsx")),
  MainPage:         lazyRetry(() => import(/* webpackChunkName: "main-page" */        "../MainPage.jsx")),
  RecruitListPanel: lazyRetry(() => import(/* webpackChunkName: "recruit-list" */     "../RecruitListPanel.jsx")),
  TeamManagePanel:  lazyRetry(() => import(/* webpackChunkName: "team-manage" */      "../TeamManagePanel.jsx")),
  ProtectedPage:    lazyRetry(() => import(/* webpackChunkName: "protected" */        "../ProtectedPage.jsx")),

  /* 추가 라우트 */
  Matching:         lazyRetry(() => import(/* webpackChunkName: "matching" */         "../Matching.jsx")),
  // RecruitDetail:    lazyRetry(() => import(/* webpackChunkName: "recruit-detail" */   "../RecruitDetail.jsx")),
  TeamMemberDetail: lazyRetry(() => import(/* webpackChunkName: "team-member-detail" */"../TeamMemberDetail.jsx")),

  /* 공통 컴포넌트 */
  Header:           lazyRetry(() => import(/* webpackChunkName: "header" */           "../Header.jsx")),
  LoginModal:       lazyRetry(() => import(/* webpackChunkName: "login-modal" */      "../LoginModal.jsx")),
  SignUpModal:      lazyRetry(() => import(/* webpackChunkName: "signup-modal" */     "../SignUpModal.jsx")),
  EmailVerifyModal: lazyRetry(() => import(/* webpackChunkName: "email-verify-modal" */"../EmailVerifyModal.jsx")),
  FindpassWordModal:lazyRetry(() => import(/* webpackChunkName: "findpass-modal" */   "../FindpassWordModal.jsx")),
  AuthBlurGate:     lazyRetry(() => import(/* webpackChunkName: "auth-blur-gate" */   "../AuthBlurGate.jsx")),
  LoadingSpinner:   lazyRetry(() => import(/* webpackChunkName: "loading-spinner" */  "../Loadingspinner.jsx")),
};

/** 프리패치 */
export const prefetch = {
  first:            () => import(/* webpackPrefetch: true */ "../FirstPage.jsx"),
  main:             () => import(/* webpackPrefetch: true */ "../MainPage.jsx"),
  recruit:          () => import(/* webpackPrefetch: true */ "../RecruitListPanel.jsx"),
  team:             () => import(/* webpackPrefetch: true */ "../TeamManagePanel.jsx"),
  protected:        () => import(/* webpackPrefetch: true */ "../ProtectedPage.jsx"),
  matching:         () => import(/* webpackPrefetch: true */ "../Matching.jsx"),
  // recruitDetail:    () => import(/* webpackPrefetch: true */ "../RecruitDetail.jsx"),
  teamMemberDetail: () => import(/* webpackPrefetch: true */ "../TeamMemberDetail.jsx"),
};

export default Lazy;

import { create } from "zustand";
import { persist } from "zustand/middleware";

// JWT 기반 로그인 상태 관리
const useAuthStore = create(
  persist(
    (set) => ({
      user: null,           // 사용자 정보
      token: null,          // JWT 토큰
      isLoggedIn: false,    // 로그인 여부

      // 로그인 (API 요청 → JWT 토큰 저장)
      login: async (username, password) => {
        try {
          const response = await fetch("https://your-api.com/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
          });

          if (!response.ok) {
            throw new Error("로그인 실패");
          }

          const data = await response.json();

          // JWT 토큰 + 유저 정보 저장
          set({
            token: data.token,
            user: data.user,
            isLoggedIn: true,
          });

          return { success: true };
        } catch (error) {
          console.error("로그인 에러:", error);
          return { success: false, message: error.message };
        }
      },

      // 로그아웃 (스토어 초기화)
      logout: () =>
        set({
          token: null,
          user: null,
          isLoggedIn: false,
        }),
    }),
    {
      name: "auth-storage", // localStorage에 자동 저장
    }
  )
);

export default useAuthStore;

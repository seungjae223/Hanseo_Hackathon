// src/store/AuthStore.jsx
import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,

  // 임시 로그인 (API 대신 하드코딩)
  login: (username, password) => {
    if (username === "test" && password === "1234") {
      set({
        user: { name: "테스트유저" },
        token: "fake-jwt-token",
        isLoggedIn: true,
      });
      return { success: true };
    } else {
      return { success: false, message: "아이디/비밀번호가 틀립니다." };
    }
  },

  logout: () => set({ user: null, token: null, isLoggedIn: false }),
}));

export default useAuthStore;

import React, { useState } from "react";
import useAuthStore from "../store/AuthStore";

function LoginPage() {
  const { login, logout, isLoggedIn, user } = useAuthStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 로그인 요청
  const handleLogin = async () => {
    const result = await login(username, password);
    if (!result.success) {
      alert("로그인 실패: " + result.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {isLoggedIn ? (
        <div>
          <h2>{user?.name} 님 환영합니다 🎉</h2>
          <button onClick={logout}>로그아웃</button>
        </div>
      ) : (
        <div>
          <h2>로그인</h2>
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button onClick={handleLogin}>로그인</button>
        </div>
      )}
    </div>
  );
}

export default LoginPage;

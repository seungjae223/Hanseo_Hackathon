import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/AuthStore";
import "../css/LoginPage.css";

function LoginPage() {
  const { login, logout, isLoggedIn, user } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const result = login(username, password);
    if (!result.success) {
      alert(result.message);
    }
  };

  return (
    <div className="login-container">
      {isLoggedIn ? (
        <div className="welcome-box">
          <h2>{user?.name} 님 환영합니다 🎉</h2>
          <button className="logout-btn" onClick={logout}>
            로그아웃
          </button>
        </div>
      ) : (
        <div className="login-box">
          <h2 className="login-title">로그인</h2>
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button className="login-btn" onClick={handleLogin}>
            로그인
          </button>

          {/* 회원가입으로 이동하는 링크 */}
          <p className="signup-link">
            아직 계정이 없으신가요? 👉 <Link to="/signup">회원가입</Link>
          </p>
        </div>
      )}
    </div>
  );
}

export default LoginPage;

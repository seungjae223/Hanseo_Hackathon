import React, { useState } from "react";
import "../css/SignupPage.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = () => {
    if (!username || !password || !email) {
      setMessage("모든 입력값을 채워주세요.");
      return;
    }
    if (password !== confirmPw) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 👉 여기서 실제 API 요청이 들어가면 됨
    // fetch("/api/auth/register", { ... })

    setMessage(`🎉 ${username} 님, 회원가입이 완료되었습니다!`);
    setUsername("");
    setPassword("");
    setConfirmPw("");
    setEmail("");
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">회원가입</h2>
        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="signup-input"
        />
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="signup-input"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="signup-input"
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPw}
          onChange={(e) => setConfirmPw(e.target.value)}
          className="signup-input"
        />
        <button className="signup-btn" onClick={handleSignup}>
          회원가입
        </button>
        {message && <p className="signup-message">{message}</p>}
      </div>
    </div>
  );
}

export default Signup;

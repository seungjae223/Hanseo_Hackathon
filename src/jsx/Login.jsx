import '../css/Login.css';

export default function Login() {
      return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-title">작당모의</h1>

        <label className="login-label" htmlFor="email">
          한서대학교 웹메일
        </label>
        <input
          type="email"
          id="email"
          className="login-input"
          placeholder=""
        />

        <label className="login-label" htmlFor="password">
          비밀번호
        </label>
        <input
          type="password"
          id="password"
          className="login-input"
          placeholder=""
        />

        <div className="login-links">
          회원가입 / 비밀번호 찾기
        </div>
      </div>
    </div>
  );
}
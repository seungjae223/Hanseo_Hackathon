import React from "react";
import styles from "../css/LoginPage.module.css";

const LoginPage = () => {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        {/* 로고 텍스트 */}
        <h1 className={styles.title}>작당모의</h1>

        {/* 이메일 입력 */}
        <label className={styles.label} htmlFor="email">
          한서대학교 웹메일
        </label>
        <input
          id="email"
          type="email"
          placeholder="이메일 입력"
          className={styles.input}
        />

        {/* 비밀번호 입력 */}
        <label className={styles.label} htmlFor="password">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          placeholder="비밀번호 입력"
          className={styles.input}
        />

        {/* 하단 링크 */}
        <p className={styles.link}>회원가입 / 비밀번호 찾기</p>
      </div>
    </main>
  );
};

export default LoginPage;

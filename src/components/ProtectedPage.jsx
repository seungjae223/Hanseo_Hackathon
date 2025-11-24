import React from "react";
import useAuthStore from "../store/AuthStore";

function ProtectedPage() {
  const { isLoggedIn, token } = useAuthStore();

  if (!isLoggedIn) {
    return <h2>접근 불가! 로그인이 필요합니다.</h2>;
  }

  return (
    <div>
      <h2> 보호된 페이지 (JWT 토큰 확인 완료)</h2>
      <p>현재 토큰: {token}</p>
    </div>
  );
}

export default ProtectedPage;

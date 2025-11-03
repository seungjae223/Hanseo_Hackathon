// src/utils/api.js
export const API_BASE_URL = ""; // CRA 프록시 사용 시 빈 문자열 권장

export async function apiFetch(path, options = {}) {
  const {
    timeout = 15000,
    headers: userHeaders = {},
    body: userBody,
    auth = true, // 공개 API는 false로 호출
    ...rest
  } = options;

  const isAbsolute = /^https?:\/\//i.test(path);
  const url = isAbsolute ? path : `${API_BASE_URL}${path}`;

  // 기본 헤더
  const headers = { "Content-Type": "application/json", ...userHeaders };

  // auth 처리
  if (auth) {
    const token = localStorage.getItem("accessToken");
    if (token) headers.Authorization = `Bearer ${token}`;
  } else {
    // ✅ auth:false면 어떤 경우든 Authorization 강제 제거
    delete headers.Authorization;
    delete headers.authorization;
  }

  // 바디 처리
  let body = userBody;
  const isFormData = (typeof FormData !== "undefined") && body instanceof FormData;

  // ✅ FormData면 Content-Type 제거(브라우저가 boundary 포함해서 자동으로 설정)
  if (isFormData) {
    delete headers["Content-Type"];
    delete headers["content-type"];
  } else {
    const isJson =
      headers["Content-Type"]?.includes("application/json") ||
      headers["content-type"]?.includes("application/json");
    if (body != null && isJson && typeof body !== "string") {
      body = JSON.stringify(body);
    }
  }

  // 타임아웃/요청
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  let res;
  try {
    res = await fetch(url, {
      method: rest.method || "GET",
      headers,
      body,
      signal: controller.signal,
      ...rest,
    });
  } finally {
    clearTimeout(timer);
  }

  // 내용 없는 성공
  if (res.status === 204 || res.status === 205) return null;

  // 응답 파싱
  const ctype = res.headers.get("content-type") || "";
  const data = ctype.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  // 에러 처리
  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && (data.message || data.error || data.detail)) ||
      (typeof data === "string" && data) ||
      `API 요청 실패 (${res.status})`;

    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

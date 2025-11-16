// src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // REST
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:8080",
      changeOrigin: true,
      onProxyRes: (proxyRes) => {
        // 백엔드가 401에 WWW-Authenticate 보내면 브라우저 기본팝업이 떠서 제거
        if (proxyRes.headers["www-authenticate"]) {
          delete proxyRes.headers["www-authenticate"];
        }
      },
    })
  );

  // WebSocket → 백엔드의 실제 ws 엔드포인트가 /ws 라면 /socket 으로 터널링
  app.use(
    "/socket",
    createProxyMiddleware({
      target: "http://localhost:8080",
      changeOrigin: true,
      ws: true,                        // ★ ws 프록시 활성화
      pathRewrite: { "^/socket": "/ws" } // 프론트 /socket → 백엔드 /ws
    })
  );
};

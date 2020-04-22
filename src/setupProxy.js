// eslint-disable-next-line  @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // target: 'http://192.168.39.47:32074',
      target: 'http://127.0.0.1:8081',
      changeOrigin: true,
    }),
  );
};

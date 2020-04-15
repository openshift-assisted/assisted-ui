// eslint-disable-next-line  @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: '192.168.39.118:30326',
      changeOrigin: true,
    }),
  );
};

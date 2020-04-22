// eslint-disable-next-line  @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // HINT: export BM_INVENTORY=`minikube service bm-inventory --url`
      target: process.env['BM_INVENTORY'] || 'http://unknown.bm-inventory.service.url:port',
      changeOrigin: true,
    }),
  );
};

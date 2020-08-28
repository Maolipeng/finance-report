module.exports = {
  '/df': {
    target: ' http://10.1.10.244',
    changeOrigin: true,
  },
  '/mock': {
    target: 'http://rap2.taobao.org:38080/app/mock/248309',
    changeOrigin: true,
    pathRewrite: {
      '/mock': '/',
    },
  },
}

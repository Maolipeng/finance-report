const {
  override,
  addPostcssPlugins,
  overrideDevServer,
  addLessLoader,
  fixBabelImports,
  addWebpackAlias,
} = require('customize-cra')

const path = require('path')
const { proxyConfig } = require('./configs')

const resolve = (cusPath) => {
  return path.resolve(__dirname, cusPath)
}
const devServerConfig = () => (config) => {
  return {
    ...config,
    proxy: proxyConfig,
  }
}
const pathBuildConfig = (pathBuild) => (paths) =>
  pathBuild ? { ...paths, appBuild: path.resolve(__dirname, pathBuild) } : paths

module.exports = {
  webpack: override(
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true, // 自动打包相关的样式
    }),
    addLessLoader({
      lessOptions: { javascriptEnabled: true },
    }),
    addPostcssPlugins([require('autoprefixer')]),
    addWebpackAlias({
      '@': resolve('src'),
    })
  ),
  devServer: overrideDevServer(devServerConfig()),
  paths: pathBuildConfig(process.env.BUILD_PATH),
}

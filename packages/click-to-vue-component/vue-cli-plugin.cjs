module.exports = function (webpackConfig) {
  webpackConfig.module
    .rule('click-to-vue-component')
    .test(/\.vue$/)
    .pre()
    .use('@kerry/click-to-vue-component/loader.cjs')
    .loader('@kerry/click-to-vue-component/loader.cjs')
    .end()
}

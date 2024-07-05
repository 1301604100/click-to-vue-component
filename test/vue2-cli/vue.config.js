const { defineConfig } = require('@vue/cli-service')
const clickToVueComponent = require('@kerry/click-to-vue-component/vue-cli-plugin.cjs')

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    clickToVueComponent(config)
  },
})

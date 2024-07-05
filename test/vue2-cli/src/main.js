import Vue from 'vue'
import App from './App.vue'
import '@kerry/click-to-vue-component/client.esm'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

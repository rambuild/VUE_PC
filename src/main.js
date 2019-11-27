import Vue from 'vue'
import App from './App'
import router from './router'
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
Vue.config.productionTip = false

Vue.use(elementUI)
Vue.use(axios)
/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

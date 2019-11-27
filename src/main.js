import Vue from 'vue'
import App from './App'
import router from './router'
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
Vue.config.productionTip = false

/*全局样式 */
import '@/assets/css/global.css'
import '@/assets/css/iconfont.css'

Vue.use(axios)
Vue.use(elementUI)
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
Vue.prototype.$http = axios
/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

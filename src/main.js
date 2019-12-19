import Vue from 'vue'
import App from './App'
import router from './router'
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import treeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
Vue.config.productionTip = false

/*全局样式 */
import '@/assets/css/global.css'
import '@/assets/css/iconfont.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// Vue.use(axios)
Vue.use(elementUI)
Vue.use(VueQuillEditor)

Vue.component('tree-table',treeTable)
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
Vue.prototype.$http = axios
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.filter('dateFormat',function(dataStr){
  const dt = new Date(dataStr)
  var y = dt.getFullYear()
  var m = (dt.getMonth() + 1 + '').padStart(2,'0')
  var d = (dt.getDate() + '').padStart(2,'0')
  var hh = (dt.getHours() + '').padStart(2,'0')
  var mm = (dt.getMinutes() + '').padStart(2,'0')
  var ss = (dt.getSeconds() + '').padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
// axios.interceptors.respose.use(res => {
//   const data = res.data
//   return res
// })
/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

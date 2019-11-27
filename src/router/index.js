import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import login from '@/components/login'
import home from '@/views/home'
const router = new Router({
  routes: [{
      path: '/login',
      component: login
    },
    {
      path: '/home',
      component: home
    }
  ]
})

/*路由守卫*/
router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next();
  const mytoken = window.sessionStorage.getItem('token');
  if (!mytoken) return next('/login')
  next()
})

export default router;

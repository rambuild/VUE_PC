import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import login from '@/components/login'
import home from '@/views/home'
import welcome from '@/components/welcome'
import userlist from '@/components/user/userlist'
const router = new Router({
  routes: [{
      path: '/login',
      component: login
    },
    {
      path: '/home',
      component: home,
      redirect: '/welcome',
      children: [{
          path: '/welcome',
          component: welcome
        },
        {
          path: '/users',
          component: userlist
        }
      ]
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

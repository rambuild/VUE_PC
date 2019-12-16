import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const router = new Router({
  routes: [{
      path: '/login',
      component: () => import('@/components/login')
    },
    {
      path: '/home',
      component: () => import('@/views/home'),
      redirect: '/welcome',
      children: [{
          path: '/welcome',
          component: () => import('@/components/welcome')
        },
        {
          path: '/users',
          component: () => import('@/components/user/userlist')
        },{
          path:'/rights',
          component:() => import('@/components/rights/rightlist')
        },{
          path:'/roles',
          component:() => import('@/components/rights/roleslist')
        },{
          path:'/categories',
          component:() => import('@/components/goods/categories')
        },{
          path:'/params',
          component:() => import('@/components/goods/goodsParams')
        },{
          path:'/goods',
          component:() => import('@/components/goods/goods')
        },{
          path:'/goods/addgoods',
          component:() => import('@/components/goods/addgoods')
        },{
          path:'/orders',
          component:() => import('@/components/orders/orders')
        },{
          path:'/reports',
          component:() => import('@/components/reports/reports')
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

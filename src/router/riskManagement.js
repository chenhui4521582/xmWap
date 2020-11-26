export default [
  {
    path:"/riskManagement",
    component: () => import(/* webpackChunkName: "baseRouterView" */ '@/views/baseRouterView/baseRouterView.vue'),    
    children: [
      {
        path: '/',
        name: 'riskManagement',
        component: () => import(/* webpackChunkName: "riskManagement" */ '@/views/riskManagement/riskManagement'),
      },
      {
        path: '/riskManagement/complaint',
        name: 'complaint',
        component: () => import(/* webpackChunkName: "complaint" */ '@/views/riskManagement/complaint')
      },
      {
        path: '/riskManagement/plantRule',
        name: 'plantRule',
        component: () => import(/* webpackChunkName: "complaint" */ '@/views/riskManagement/plantRule')
      }
    ]
  }
]

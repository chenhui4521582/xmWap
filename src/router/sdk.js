export default [
  {
    path: '/sdk',
    component: () => import(/* webpackChunkName: "sdk" */ '@/views/SDK/SDK'),
    redirect: '/sdk/task',
    children: [
      {
        path: '/sdk/task',
        name: 'sdkTask',
        component: () => import(/* webpackChunkName: "sdkTask" */ '@/views/SDK/children/task/task')
      },
      {
        path: '/sdk/gift',
        name: 'sdkGift',
        component: () => import(/* webpackChunkName: "sdkGift" */ '@/views/SDK/children/gift/gift')
      },
      {
        path: '/sdk/privilege',
        name: 'sdkPrivilege',
        component: () => import(/* webpackChunkName: "sdkPrivilege" */ '@/views/SDK/children/privilege/privilege')
      },
      {
        path: '/sdk/activity',
        name: 'sdkActivity',
        component: () => import(/* webpackChunkName: "sdkActivity" */ '@/views/SDK/children/activity/activity')
      }
    ]
  }
]

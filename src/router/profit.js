export default [
  {
    path: '/profitlist',
    component: () => import(/* webpackChunkName: "profit" */ '@/views/profitList'),
    children: [
      {
        path: '/',
        name: 'profitRanking',
        component: () => import(/* webpackChunkName: "profitRanking" */ '@/views/profitList/children/profitRanking'),
        meta: {
          index: 1,
          title: '排行榜'
        }
      },
      {
        path: '/profitlist/catranking',
        name: 'catRanking',
        component: () => import(/* webpackChunkName: "catranking" */ '@/views/profitList/children/catRanking')
      },
      {
        path: '/profitlist/richList',
        name: 'richList',
        component: () => import(/* webpackChunkName: "richList" */ '@/views/profitList/children/richList')
      },
      {
        path: '/profitlist/newUserRanking',
        name: 'newUserRanking',
        component: () => import(/* webpackChunkName: "newUserRanking" */ '@/views/profitList/children/newUserRanking')
      },
    ]
  },
  {
    path: '/profitlist/provranking',
    name: 'provRanking',
    component: () => import(/* webpackChunkName: "proveRanking" */ '@/views/profitList/children/provRanking'),
    meta: {
      index: 2
    }
  }
]

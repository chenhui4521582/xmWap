export default [
    {
        path: '/mall',
        name: 'mall',
        component: () => import(/* webpackChunkName: "mall" */ '@/views/mall/mall.vue'),
        meta: {
            index: 1,
            keepAlive: false,
            title: '领奖'
        }
    },
    {
        path: '/mall/details',
        name: 'productDetails',
        component: () => import(/* webpackChunkName: "productDetails" */ '@/views/mall/productDetails.vue'),
        meta: {
            index: 2,
            keepAlive: false,
            title: '商品详情'
        }
    },
    {
      path: '/mall/onePay',
      name: 'onePay',
      component: () => import(/* webpackChunkName: "productDetails" */ '@/views/mall/onePay'),
      meta: {
          index: 3,
          keepAlive: false,
          title: '首冲特惠'
      }
  }
]

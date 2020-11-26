export default [
  {
    path: '/payment',
    component: () => import(/* webpackChunkName: "payment" */ '@/views/baseRouterView/baseRouterView'),
    children: [
      {
        path: '/',
        name: 'payment',
        component: () => import(/* webpackChunkName: "paymentMall" */ '@/views/payment/'),
        meta: {
          index: 1,
          title: '充值'
        }
      },
      {
        path: '/payment/paymentlist',
        name: 'paymentList',
        component: () => import(/* webpackChunkName: "paymentList" */ '@/views/payment/children/paymentList'),
        meta: {
          index: 2,
          title: localStorage['APP_CHANNEL']=='100100'?'确认下单':'收银台'
        }
      },
      {
        path: '/payment/paymentcallback',
        name: 'paymentCallback',
        component: () => import(/* webpackChunkName: "paymentCallback" */ '@/views/payment/children/paymentCallback'),
        meta: {
          index: 2,
          title: '支付'
        }
      },
      {
        path: '/payment/transferMiddle',
        name: 'transferMiddle',
        component: () => import(/* webpackChunkName: "transferMiddle" */ '@/views/payment/children/transferMiddle'),
        meta: {
          index: 3,
          title: '支付'
        }
      },
      {
        path: '/payment/zfbmiddle',
        name: 'zfbMiddle',
        component: () => import(/* webpackChunkName: "zfbMiddle" */ '@/views/payment/children/zfbMiddle'),
        meta: {
          index: 2
        }
      },
      {
        path: '/payment/wechatmiddle',
        name: 'wechatMiddle',
        component: () => import(/* webpackChunkName: "wechatMiddle" */ '@/views/payment/children/wechatMiddle'),
        meta: {
          index: 2
        }
      },
      {
        path: '/payment/jdpay',
        name: 'jdPay',
        component: () => import(/* webpackChunkName: "jdPay" */ '@/views/payment/children/jdPay'),
        meta: {
          index: 2
        }
      },
      {
        path: '/payment/toSupportBankPage',
        name: 'toSupportBankPage',
        component: () => import(/* webpackChunkName: "jdPay" */ '@/views/payment/children/toSupportBankPage'),
        meta: {
          index: 2,
          title:'支持银行与限额'
        }
      }
    ]
  }
]

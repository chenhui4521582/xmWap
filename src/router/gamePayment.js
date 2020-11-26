let redirect = '/gamepayment/portrait'
let useLandscape = false
try {
  useLandscape = parent && parent.SDK && parent.SDK.getUseLandscape && parent.SDK.getUseLandscape()
}
catch (e) {
  if (window.SDK && window.SDK.getUseLandscape) {
    useLandscape = window.SDK.getUseLandscape()
  }
}
redirect = useLandscape ? '/gamepayment/landscape' : '/gamepayment/portrait'

export default [
  {
    path: '/gamepayment',
    component: () => import(/* webpackChunkName: "gamePayment" */ '@/views/gamePayment/index'),
    redirect: redirect,
    children: [
      {
        path: '/gamepayment/landscape',
        name: 'landscape',
        component: () => import(/* webpackChunkName: "landScape" */ '@/views/gamePayment/children/landScape/landScape'),
        meta: {
          index: 1,
          title: '充值'
        }
      },
      {
        path: '/gamepayment/portrait',
        name: 'portrait',
        component: () => import(/* webpackChunkName: "portrait" */ '@/views/gamePayment/children/portrait/portrait'),
        meta: {
          index: 1,
          title: '充值'
        }
      },
      {
        path: '/gamepayment/list',
        name: 'GPList',
        component: () => import(/* webpackChunkName: "gamePaymentList" */ '@/views/gamePayment/children/paymentList/index'),
        meta: {
          index: 1,
          title: '收银台'
        }
      },
      {
        path: '/gamepayment/callback',
        name: 'GPCallback',
        component: () => import(/* webpackChunkName: "gamePaymentCallback" */ '@/views/gamePayment/children/paymentCallback/index'),
        meta: {
          index: 1,
          title: '支付'
        }
      },
      {
        path: '/gamepayment/scanpay',
        name: 'scanpay',
        component: () => import(/* webpackChunkName: "sanpay" */ '@/views/gamePayment/children/scanpay/scanpay'),
        meta: {
          index: 1,
          title: '支付'
        }
      },
      {
        path: '/gamepayment/pcscanpay',
        name: 'pcscanpay',
        component: () => import(/* webpackChunkName: "pcscanpay" */ '@/views/gamePayment/children/scanpay/pcScanpay'),
        meta: {
          index: 2,
          title: '扫码支付'
        }
      }
    ]
  }
]

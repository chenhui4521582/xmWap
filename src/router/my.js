export default [
  {
    path: '/my',
    component: () => import(/* webpackChunkName: "baseRouterView" */ '@/views/baseRouterView/baseRouterView.vue'),
    redirect: {
      'my': 'my'
    },
    children: [
      {
        path: '/my',
        name: 'my',
        component: () => import(/* webpackChunkName: "my" */ '@/views/my/my.vue'),
        meta: {
          index: 1,
          keepAlive: false,
          title: '我的'
        },
      },
      {
        path: 'schedule',
        name: 'mySchedule',
        component: () => import(/* webpackChunkName: "mySchedule" */ '@/views/my/children/schedule/schedule.vue'),
        meta: {
          index: 2,
          keepAlive: false,
          title: '我的幸运礼盒'
        }
      },
      {
        path: 'prize',
        name: 'myPrize',
        component: () => import(/* webpackChunkName: "myPrize" */ '@/views/my/children/prize/prize.vue'),
        meta: {
          index: 2,
          keepAlive: false,
          title: '奖品领取'
        },
      },
      {
        path: 'customerService',
        name: 'customerService',
        component: () => import(/* webpackChunkName: "customerService" */ '@/views/my/children/customerService/customerService.vue'),
        meta: {
          index: 1,
          keepAlive: false,
          title: '联系客服'
        },
      },
      {
        path: 'coupon',
        name: 'myCoupon',
        component: () => import(/* webpackChunkName: "coupon" */ '@/views/my/children/coupon/coupon.vue'),
        meta: {
          index: 2,
          keepAlive: false,
          title: '优惠券列表'
        },
      },
      {
        path: 'issues',
        name: 'issues',
        component: () => import(/* webpackChunkName: "issues" */ '@/views/my/children/issues/issues.vue'),
        meta: {
          index: 2,
          keepAlive: true,
          title: '问题反馈'
        },
      },
      {
        path: 'issuesDetails',
        name: 'issuesDetails',
        component: () => import(/* webpackChunkName: "issuesDetails" */ '@/views/my/children/issues/issuesDetails.vue'),
        meta: {
          index: 2,
          keepAlive: false,
          title: '问题详情'
        },
      },
      {
        path: 'feedback',
        name: 'feedback',
        component: () => import(/* webpackChunkName: "feedback" */ '@/views/my/children/issues/feedback.vue'),
        meta: {
          index: 2,
          keepAlive: false,
          title: '意见反馈'
        },
      },
      {
        path: 'message',
        name: 'message',
        component: () => import(/* webpackChunkName: "message" */ '@/views/my/children/message/message.vue'),
        meta: {
          index: 2,
          keepAlive: false,
          title: '消息中心'
        },
      },
      {
        path: 'messageDetails',
        name: 'messageDetails',
        component: () => import(/* webpackChunkName: "messageDetails" */ '@/views/my/children/message/messageDetails.vue'),
        meta: {
          index: 3,
          keepAlive: false,
          title: '消息中心'
        },
      },
      {
        path: 'userAgreement',
        name: 'userAgreement',
        component: () => import(/* webpackChunkName: "userAgreement" */ '@/views/my/children/userAgreement/userAgreement.vue'),
        meta: {
          index: 3,
          keepAlive: false,
          title: '用户协议'
        },
      },
      {
        path: 'userPrivacy',
        name: 'userPrivacy',
        component: () => import(/* webpackChunkName: "userPrivacy" */ '@/views/my/children/userPrivacy/userPrivacy.vue'),
        meta: {
          index: 3,
          keepAlive: false,
          title: '隐私协议'
        },
      },
      {
        path: 'privacyProtocol',
        name: 'privacyProtocol',
        component: () => import(/* webpackChunkName: "privacyProtocol" */ '@/views/my/children/privacyProtocol/index.vue'),
        meta: {
          index: 3,
          keepAlive: false,
          title: '隐私协议'
        },
      },
      {
        path: 'sfeedback',
        name: 'sfeedback',
        component: () => import(/* webpackChunkName: "customerService" */ '@/views/my/children/sfeedback/sfeedback.vue'),
        meta: {
          index: 2,
          keepAlive: false,
          title: '游戏中心'
        },
      },
      {
        path: 'catright',
        name: 'catright',
        component: () => import(/* webpackChunkName: "message" */ '@/views/my/children/catright/catright.vue'),
        meta: {
          index: 2,
          keepAlive: false,
          title: '我的特权'
        },
      },
      {
        path: '/billcomment',
        name: 'billcomment',
        component: () => import(/* webpackChunkName: "mySchedule" */ '@/views/my/children/billcomment'),
        meta: {
          index: 2,
          keepAlive: false,
          title: '晒单专区'
        }
      },
      {
        path: 'cdkey',
        name: 'cdkey',
        component: () => import(/* webpackChunkName: "mySchedule" */ '@/views/my/children/cdkey/cdkey.vue'),
        meta: {
          index: 2,
          keepAlive: false,
          title: '游戏礼包兑换'
        }
      }
    ]
  }
]

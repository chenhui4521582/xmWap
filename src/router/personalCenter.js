export default [
  {
    path: '/personalCenter',
    component: () => import(/* webpackChunkName: "baseRouterView" */ '@/views/baseRouterView/baseRouterView.vue'),
    redirect: {
      'personalCenter': 'personalCenter'
    },
    children: [
      // 个人中心首页
      {
        path: '/personalCenter',
        name: 'personalCenter',
        component: () => import(/* webpackChunkName: "costLog" */ '@/views/personalCenter/index'),
        meta: {
          index: 1,
          keepAlive: false,
          title: '个人中心'
        },
        children: [{
          path: 'survey',
          name: 'survey',
          component: () => import(/* webpackChunkName: "baseRouterView" */ '@/views/personalCenter/components/fake/fake.vue')
        }]
      },
      // 资产明细
      {
        path: 'costLog',
        name: 'costLog',
        component: () => import(/* webpackChunkName: "costLog" */ '@/views/personalCenter/children/costLog/costLog.vue'),
        meta: {
          index: 2,
          keepAlive: false,
          title: '资产明细'
        }
      },
      // 手机号码绑定
      {
        path: 'phoneBinding',
        name: 'phoneBinding',
        component: () => import(/* webpackChunkName: "phoneBinding" */ '@/views/personalCenter/children/phoneBinding/phoneBinding.vue'),
        meta: {
          index: 2,
          title: '手机绑定',
          keepAlive: false
        }

      },
      // 修改绑定的手机号码
      {
        path: 'editPhone',
        name: 'editPhone',
        component: () => import(/* webpackChunkName: "editPhone" */ '@/views/personalCenter/children/editPhone/editPhone.vue'),
        meta: {
          index: 2,
          title: '手机绑定',
          keepAlive: false
        }
      },
      // 绑定新手机号码
      {
        path: 'bindPhoneView',
        name: 'bindPhoneView',
        component: () => import(/* webpackChunkName: "bindPhoneView" */ '@/views/personalCenter/children/bindPhoneView/bindPhoneView.vue'),
        meta: {
          index: 2,
          title: '手机绑定',
          keepAlive: false
        }
      },
      // 修改昵称
      {
        path: 'nickname',
        name: 'nickname',
        component: () => import(/* webpackChunkName: "bindPhoneView" */ '@/views/personalCenter/children/nickname/index.vue'),
        meta: {
          index: 2,
          title: '修改昵称',
          keepAlive: false
        }
      },
      // 头像挂件
      {
        path: 'headFrame',
        name: 'headFrame',
        component: () => import(/* webpackChunkName: "headFrame" */ '@/views/personalCenter/children/headFrame/index.vue'),
        meta: {
          index: 2,
          title: '头像挂件',
          keepAlive: false
        },
      },
      // 实名认证
      {
        path: 'authentication',
        name: 'authentication',
        component: () => import(/* webpackChunkName: "authentication" */ '@/views/personalCenter/children/authentication/authentication.vue'),
        meta: {
          index: 2,
          title: '实名认证',
          keepAlive: false
        },
      },
      // 充值限额
      {
        path: 'setLimit',
        name: 'setLimit',
        component: () => import(/* webpackChunkName: "setLimit" */ '@/views/personalCenter/children/setLimit/setLimit.vue'),
        meta: {
          index: 3,
          title: '充值额度设置',
          keepAlive: false
        },
      },
      // 收货地址
      {
        path: '/address',
        name: 'address',
        component: () => import(/* webpackChunkName: "addredd" */ '@/views/personalCenter/children/address/'),
        redirect: '/address/list',
        children: [
          {
            path: '/address/list',
            name: 'addressList',
            component: () => import(/* webpackChunkName: "addressList" */ '@/views/personalCenter/children/address/list'),
            meta: {
              index: 2,
              keepAlive: false,
              title: '我的收货地址'
            }
          },
          {
            path: '/address/set',
            name: 'setAddress',
            component: () => import(/* webpackChunkName: "addressAdd" */ '@/views/personalCenter/children/address/set'),
            meta: {
              index: 3,
              keepAlive: false,
              title: '编辑收货地址'
            }
          },
          {
            path: '/address/add',
            name: 'addAddress',
            component: () => import(/* webpackChunkName: "addressAdd" */ '@/views/personalCenter/children/address/set'),
            meta: {
              index: 3,
              keepAlive: false,
              title: '添加收货地址'
            }
          }

        ]
      }
    ]
  }

]

/**
 * @description 页面路由
 * @param meta{index} >1表示切换有动画
 * @param meta{keepAlive} 为true表示使用缓存
 */

import Vue from 'vue'
import Router from 'vue-router'
import my from './my' //我的页面和我的子页面
import mall from './mall' // 商城我产品详情
import profit from './profit' // 排行榜
import payment from './payment' // 支付
import gamePayment from './gamePayment' // 支付
import personalCenter from './personalCenter' // 个人中心
import SDK from './sdk' // SDK
import riskManagement from './riskManagement'
import { getChannel } from '@/utils/utils'
Vue.use(Router)

const router = new Router({
  routes: [
    ...my,
    ...mall,
    ...profit,
    ...personalCenter,
    ...payment,
    ...gamePayment,
    ...SDK,
    ...riskManagement,
    {
      path: '/',
      name: 'index',
      component: () => import(/* webpackChunkName: "Index" */ '@/views/index/'),
      meta: {
        index: 1,
        title: '游戏大厅'
      }
    },
    {
      path: '/index/select',
      name: 'select',
      component: () => import(/* webpackChunkName: "select" */ '@/views/index/children/select'),
      meta: {
        index: 2,
        title: '搜索'
      }
    },
    {
      path: '/index/pooljackpot',
      name: 'poolJackpot',
      component: () => import(/* webpackChunkName: "poolJackpot" */ '@/views/index/children/poolJackpot/poolJackpot.vue'),
      meta: {
        index: 2,
        title: '奖池汇总'
      }
    },
    {
      path: '/taskview',
      name: 'taskview',
      component: () => import(/* webpackChunkName: "taskview" */ '@/views/task/task'),
      meta: {
        title: '任务'
      }
    },
    {
      path: '/task',
      name: 'task',
      component: () => import(/* webpackChunkName: "task" */ '@/views/task/task'),
      meta: {
        title: '任务'
      }
    },
    {
      path: '/achievement',
      name: 'achievement',
      component: () => import(/* webpackChunkName: "task" */ '@/views/achievement'),
      meta: {
        title: '成就大厅'
      }
    },
    {
      path: '/activity',
      name: 'activity',
      component: () => import(/* webpackChunkName: "activity" */ '@/views/activity/activity'),
      meta: {
        title: '活动中心'
      }
    },
    {
      path: '/newerstrategy',
      name: 'newerstrategy',
      component: () => import(/* webpackChunkName: "activity" */ '@/views/newerStrategy'),
      meta: {
        title: '赚钱攻略'
      }
    },
    {
      path: '/loginTip',
      name: 'loginTip',
      component: () => import(/* webpackChunkName: "loginTip" */ '@/views/loginTip'),
      meta: {
        title: '登录提示'
      }
    },
    {
      path: '/find',
      name: 'find',
      component: () => import(/* webpackChunkName: "find" */ '@/views/find'),
      meta: {
        title: '发现'
      }
    },
    {
      path: '/hotRanking',
      name: 'hotRanking',
      component: () => import(/* webpackChunkName: "find" */ '@/views/find/children/hotRanking'),
      meta: {
        title: '发现'
      }
    },
    {
      path: '/find/giftPack',
      name: 'giftPack',
      component: () => import(/* webpackChunkName: "find" */ '@/views/find/children/giftPack'),
      meta: {
        title: '发现'
      }
    },
    {
      path: '/receiveDetail/:id/:name',
      name: 'receiveDetail',
      component: () => import(/* webpackChunkName: "find" */ '@/views/find/children/receiveDetail'),
      meta: {
        title: '福袋手气'
      },
      props: true
    }
  ]
})

export default router

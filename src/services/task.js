import $axios from './http/http'
import API from './API/API'
import utils from '@/utils/utils'

const services = {
  getTaskBannerList: function (params) {
    return $axios.get(API.getTaskBannerList, params)
  },
  getDayTask: function (params) {
    return $axios.post(API.platDayTask, params)
  },
  getNewUserTask: function (params) {
    return $axios.post(API.platNewUserStairTask, params)
  },
  taskFinish: function (params) {
    return $axios.post(API.taskFinish, params)
  },
  getSignList: function (params) {
    return $axios.post(API.getSignList, params)
  },
  getReward: function (params) {
    return $axios.post(API.getReward, params)
  },
  getTaskProcess: function (params) {
    return $axios.post(API.adTaskProcess, params)
  },
  recordAdLog: function (params) {
    return $axios.post(API.recordAdLog, params)
  },
  readAdStatus: function (params) {
    return $axios.post(API.readAdStatus, params)
  },
  getWeekBettingInfo: function () {
    return $axios.post(API.getWeekBettingInfo)
  },
  firstLoad: function () {
    return $axios.post(API.firstLoad)
  },
  getAchievementRedDot: function () {
    return $axios.post(API.achievementRedDot)
  },
  receivePointsAward: function (sort) {
    return $axios.post(API.receivePointsAward + sort)
  },
  weekLoopRemark: function () {
    return $axios.post(API.weekLoopRemark)
  },
  newUserAllFinish: function () {
    return $axios.post(API.newUserAllFinish)
  },
  //淘金令入口
  gettjlInlet: function () {
    return $axios.post(API.tjlInlet)
  },
  //任务面板
  gettjlTaskPanel: function () {
    return $axios.post(API.tjlTaskPanel)
  },
}

export default services

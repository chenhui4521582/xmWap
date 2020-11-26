import $axios from './http/http'
import API from './API/API'

const services = {
  getBannerList: function () {
    return $axios.post(API.BannerList)
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
  getMasterTask: function (params) {
    return $axios.post(API.getMasterTask, params)
  },
  getActivityList: function (params) {
    return $axios.post(API.getActivityList, params)
  },
  getMasterTasks: function (params) {
    return $axios.post(API.getUserTasks, params)
  },
  finishMasterTask: function (params) {
    return $axios.post(API.userTaskFinish, params)
  },
  saveActivityRead: function (params) {
    return $axios.post(API.saveActivityRead, params)
  },
  getCatSupplyReceiveStatus: function () {
    return $axios.post(API.getCatSupplyReceiveStatus)
  },
  getCatSupplyReceive: function (params) {
    return $axios.post(API.getCatSupplyReceive, params)
  },
  getBankStatus: function (params) {
    return $axios.post(API.getBankStatus, params)
  },
  updateBankNumber: function (params) {
    return $axios.post(API.updateBankNumber, params)
  },
  getRing2DayTask: function () {
    return $axios.post(API.ring2platTaskByBatch)
  },
  ring2exchange: function (params) {
    return $axios.post(API.ring2exchange, params)
  },
  getWeekBettingInfo: function () {
    return $axios.post(API.getWeekBettingInfo)
  },
  platWelfareTask: function (params) {
    return $axios.post(API.platWelfareTask, params)
  },
  sdkPrivilegeList: function () {
    return $axios.post(API.sdkPrivilegeList)
  },
  receivePointsAward: function (sort) {
    return $axios.post(API.receivePointsAward + sort)
  },
  returnBagTask: function () {
    return $axios.post(API.returnBagTask)
  },
  cdkeyStatus: function (params) {
    return $axios.post(API.cdkeyStatus, params)
  },
  platTaskByBatch: function (params) {
    return $axios.post(API.platTaskByBatch, params)
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
  }
}

export default services

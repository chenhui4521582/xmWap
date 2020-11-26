import $axios from './http/http'
import API from './API/API'
import utils from '@/utils/utils'

const services = {
  getRankList: function (params) {
    return $axios.post(API.getRankList, params)
  },
  getMyProfit: function (params) {
    return $axios.post(API.getMyProfit, params)
  },
  ProfitRules: function (params) {
    return $axios.post(API.ProfitRules, params)
  },
  getCatRankList: function (params) {
    return $axios.post(API.getCatRankList, params)
  },
  getLastRankList: function (params) {
    return $axios.post(API.getLastRankList, params)
  },
  getRemoveData: function (params) {
    return $axios.post(API.getRemoveData, params)
  },
  clear: function (params) {
    return $axios.post(API.clear + params)
  },
  getProfitShow: function (params) {
    return $axios.post(API.getProfitShow, params)
  },
  getRichList: function (params) {
    return $axios.post(API.getRichList, params)
  },
  getUserProfitInfo: function (params) {
    return $axios.post(API.profitUserInfo, params)
  },
  getNewUserRankingInfo: function () {
    return utils.cacheInGlobal($axios, 'getNewUserRankingInfo')
  },
  getNewUserRankingList: function (params) {
    return $axios.post(API.getNewUserRankingList, params)
  }
}

export default services

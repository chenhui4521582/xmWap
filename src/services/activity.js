import $axios from './http/http'
import API from './API/API'
import utils from '@/utils/utils'

const services = {
  getActivity: function () {
    return utils.cacheRequest('post',$axios,'getActivity');
  },
  getOneLottery: function (params) {
    return $axios.post(API.getOneLottery, params)
  },
  getOneLotteryHornData: function (params) {
    return $axios.post(API.getOneLotteryHornData, params)
  },
  getPreference: function (params) {
    return $axios.post(API.getPreferenceList, params)
  },
  getCardLottery: function (params) {
    return $axios.post(API.getCardLottery+params)
  },
  getTurntable: function (params) {
    return $axios.post(API.getTurntable, params)
  },
  feeWheelBanner: function () {
    return $axios.get(API.feeWheelBanner)
  },
  payedBetting: function (params) {
    return $axios.post(API.payedBetting, params)
  },
  getTurnTableAward: function (callback) {
    return $axios.all([this.payedBetting(), this.feeWheelBanner()]).then($axios.spread(callback))
  },
  getRankingAwards: function (params) {
    return $axios.post(API.getRankingAwards, params)
  },
  getCardLotteryResult: function (params) {
    return $axios.post(API.getCardLotteryResult, params)
  },
  getOneLotteryList: function (params) {
    return $axios.post(API.getOneLotteryList, params)
  },
  getOneLotteryAwards: function (params) {
    return $axios.post(API.getOneLotteryAwards, params)
  },
  getDynamicRank: function (params) {
    return $axios.post(API.getDynamicRank ,params)
  },
  getweekPackageInfo: function () {
    return $axios.post(API.getweekPackageInfo)
  },
  getGratis: function (params) {
    return $axios.post(API.getGratis ,params)
  },
  getshufflingGameInfo: function (params) {
    return $axios.post(API.getshufflingGameInfo ,params)
  },
  getbonusOpenInfo:function () {
    return $axios.post(API.getbonusOpenInfo)
  },
  getExtraInfo:function () {
    return $axios.post(API.getExtraInfo)
  },
  getBagNotice:function (params) {
    return $axios.post(API.getBagNotice,params)
  },
  getFirstPayment: function(params) {
    return $axios.post(API.getFirstPayment, params)
  },
  //奇遇任务
  loseWarningPopUp:function() {
    return $axios.post(API.loseWarningPopUp)
  },
  loseWarningReceive:function() {
    return $axios.post(API.loseWarningReceive)
  },
  getReturnBagGameInfo:function() {
    return $axios.post(API.getReturnBagGameInfo)
  },
  getKoiWishInfo:function() {
    return $axios.post(API.getKoiWishInfo)
  },
  getThreeHoursInfo:function() {
    return $axios.post(API.getThreeHoursInfo)
  }
}

export default services

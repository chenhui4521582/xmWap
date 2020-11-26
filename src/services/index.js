import $axios from './http/http'
import API from './API/API'
import utils from '@/utils/utils'

const services = {
  getHomePopupList () {
    return utils.cacheRequest('post', $axios, 'getHomePopupList')
  },
  getShowOpenEggIcon () {
    return utils.cacheRequest('post', $axios, 'getShowOpenEggIcon')
  },
  getNoticeList: function () {
    return $axios.post(API.NoticeList)
  },
  payedTurntable: function () {
    return $axios.post(API.payedTurntable)
  },
  getRecentlyPlayData: function () {
    return utils.cacheInGlobal($axios, 'xmRecently')
  },
  getRecentlyPlayDataV2: function () {
    return utils.cacheInGlobal($axios, 'xmRecentlyV2')
  },
  getRecommendPlayData: function () {
    return utils.cacheRequest('post', $axios, 'xmRecommend')
  },
  getDetailPlayData: function () {
    return utils.cacheRequest('post', $axios, 'xmDetail')
  },
  getAcenterData: function () {
    return $axios.post(API.xmAcenter)
  },
  getFeedBackData: function () {
    return $axios.post(API.feedBackList)
  },
  getNewUserCard: function (params) {
    return $axios.post(API.getnewUserCard, params)
  },
  getNewUserCardAwards: function () {
    return $axios.post(API.getNewUserCardAwards)
  },
  getTaskGuide: function () {
    return $axios.post(API.taskGuideStatus)
  },
  getPayedBetting: function () {
    return $axios.post(API.payedBetting)
  },
  getBettingListNew: function (params) {
    return $axios.post(API.bettingListNew, params)
  },
  getActivityCenterRead: function (params) {
    return $axios.post(API.activityCenterRead, params)
  },
  getAwards: function (params) {
    return $axios.post(API.getAwards, params)
  },
  getNewuserawardlog: function (params) {
    return $axios.post(API.getAwards, params)
  },
  getActivityCenterDetails: function (params) {
    return $axios.post(API.activityCenterDetails, params)
  },
  confirmCoupon: function (params) {
    return $axios.post(API.confirmCoupon, params)
  },
  getCard: function (params) {
    return $axios.post(API.getCard, params)
  },
  getRecommendGames: function (params) {
    return $axios.post(API.getRecommendGames, params)
  },
  getActivityRecommend: function (params) {
    return $axios.get(API.getActivityRecommend, params)
  },
  getLimitCard: function (params) {
    return $axios.get(API.getLimitCard, params)
  },
  getBannerList: function () {
    //首页banner的图片没区分深色和浅色（深色版的短链接不一致，所以指定获取100070的配置）
    //  let channel = localStorage['APP_CHANNEL'];
    //  if(channel == '100039001'){
    //    channel = '100070'
    //  }
    //  return $axios.post(API.BannerList,{},{
    //   headers:{
    //     'App-Channel':channel
    //   }
    // })
    return utils.cacheRequest('post', $axios, 'BannerList')
  },
  newUserEggGuide: function () {
    return $axios.post(API.newUserEggGuide)
  },
  getNewUserWheelInfo: function () {
    return $axios.post(API.getNewUserWheelInfo)
  },
  getCouponList: function () {
    return $axios.post(API.getCouponList)
  },
  getCoupon: function (id) {
    let url = API.getCoupon.replace('{couponId}', id)
    return $axios.post(url)
  },
  getExchangeEnter: function () {
    //return $axios.get(API.getExchangeEnter)
    return utils.cacheRequest('get', $axios, 'getExchangeEnter')
  },
  getCatSickState: function () {
    return $axios.post(API.getCatSickState)
  },
  getAcenterAwards: function (params) {//活动中心type4 奖励领取
    return $axios.post(API.getAcenterAwards, params)
  },
  getAcenterIconData: function () {
    return $axios.get(API.acenterIconData)
  },
  getUserAwards: function () {
    return $axios.post(API.getUserAwards)
  },
  submitProblem: function (params) {
    return $axios.post(API.submitProblem, params)
  },
  picUpload: function (params) {
    return $axios.post(API.picUpload, params)
  },
  getSFTipsState: function () {//春节气泡提醒
    return $axios.post(API.sfTipsState)
  },
  getActivityEntry: function () {
    return $axios.get(API.getActivityEntry)
  },
  getBigUserInfo () {
    return $axios.post(API.getBigUserInfo)
  },
  getSmallUserInfo () {
    return $axios.post(API.getSmallUserInfo)
  },
  getUserIsAdult () {
    return utils.cacheRequest('post', $axios, 'getUserIsAdult')
  },
  checkUserOnlineTime (time) {
    return $axios.post(API.checkUserOnlineTime + time)
  },
  getSelectRecommen: function (params) {
    return $axios.post(API.getSelectRecommen)
  },
  getSelect: function (params) {
    return $axios.post(API.getSelect, params)
  },
  getState: function (params) {
    return $axios.post(API.getState, params)
  },
  getOpenToken: function () {
    return $axios.post(API.getOpenToken)
  },
  getCatVipEntranceState: function () {//猫VIP入口开关
    return utils.cacheRequest('post', $axios, 'getCatVipEntranceState')
  },
  tokenVerify: function () { //验证token
    return utils.cacheRequest('post', $axios, 'tokenVerify')
  },
  upgradeWheelActivityIcon: function () { // 拉新活动入口
    return $axios.post(API.upgradeWheelActivityIcon)
  },
  btcGetTurntable: function () {
    return $axios.post(API.btcGetTurntable)
  },
  btcGetLotteryAward: function () {
    return $axios.post(API.btcGetLotteryAward)
  },
  btcGetReceive: function () {
    return $axios.post(API.btcGetReceive)
  },
  btcWheelEntrance: function () {
    return $axios.post(API.btcWheelEntrance)
  },
  btcDownLoad: function () {
    return $axios.post(API.btcDownLoad)
  },
  newUserMenu: async function () {
    return $axios.post(API.newUserMenu)
  },
  newUserPopup: function () {
    return $axios.post(API.newUserPopup)
  },
  getCouponBtcInfo: function () {
    return $axios.post(API.getCouponBtcInfo)
  },
  CToService: function () {
    return $axios.post(API.CToService)
  },
  CToServiceReceive: function () {
    return $axios.post(API.CToServiceReceive)
  },
  getAdvertisePosition: function () {
    return utils.cacheRequest('get', $axios, 'getAdvertisePosition')
  },
  getAwardPoolCenterHome: function () {
    return $axios.post(API.getAwardPoolCenterHome)
  },
  subscribeOrUnsubscribe: function (params) {
    return $axios.post(API.subscribeOrUnsubscribe, params)
  },
  getAllCard: function (params) {
    return $axios.post(API.getAllCard, params)
  },
  getInexpensiveCard: function () {
    return $axios.post(API.getInexpensiveCard)
  },
  getBtcPopup: function () {
    return $axios.post(API.getBtcPopup)
  },
  getSevenDaysSignEntry: function () {
    return $axios.post(API.getSevenDaysSignEntry)
  }
}
export default services

import $axios from './http/http'
import API from './API/API'
import utils from '@/utils/utils'

const Services = {
  getAB: function () {
    let Mall_Version = ''
    if (sessionStorage.getItem('Mall_Version')) {
      Mall_Version = sessionStorage.getItem('Mall_Version')
      return Mall_Version
    }
    let _token = localStorage.getItem('ACCESS_TOKEN') || getUrlParams('token') || ''
    let xhr = new XMLHttpRequest()
    return new Promise((resolve, reject) => {
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          if (xhr.getResponseHeader('version') === 'v2') {
            Mall_Version = '2.0.0'
          } else {
            Mall_Version = '1.0.0'
          }
          sessionStorage.setItem('Mall_Version', Mall_Version)
          resolve(Mall_Version)
        }
      }
      xhr.open('get', API.mallCommonListAB)
      xhr.setRequestHeader('Authorization', _token)
      xhr.send()
    })
  },
  getMallList: async function () {
    try {
      const res = await this.getAB()
      return utils.cacheInGlobal($axios, 'getMallList', null, { headers: { 'App-Version': res } })
    } catch (e) {
      console.log(e)
      return utils.cacheInGlobal($axios, 'getMallList')
    }
  },
  getInitPay: function (params, otherParams) {
    let channelVersion = ''
    try {
      let UA = window.navigator.userAgent.toLowerCase()
      if (UA.includes('chebada')) {
        if (UA.includes('android') || UA.includes('adr')) {
          let version = UA.split('chebada/')[1].split(' ')[0]
          if (version.includes('/')) {
            version = version.split('/')[0].split('.')
          } else {
            version = version.split('.')
          }
          channelVersion = `${version[0] && version[0].length ? (version[0].length === 1 ? `0${version[0]}` : version[0]) : '00'}${version[1] && version[1].length ? (version[1].length === 1 ? `0${version[1]}` : version[1]) : '00'}${version[2] && version[2].length ? (version[2].length === 1 ? `0${version[2]}` : version[2]) : '00'}`
        } else {
          channelVersion = '999999'
        }
      } else {
        channelVersion = window.android && window.android.getVersionCode && window.android.getVersionCode()
      }
    } catch (error) {
      channelVersion = ''
    }
    let url = `${API.getInitPay}?money=${params}${channelVersion ? `&channelVersion=${channelVersion}` : ''}${otherParams ? otherParams : ''}`
    return $axios.post(url)
  },
  submitPay: function (params) {
    return $axios.post(API.submitPay, params)
  },
  newSdkOrder: function (params) {
    return $axios.post(API.newSdkOrder, params)
  },
  getScratchCard: function (params) {
    return $axios.post(API.getScratchCard, params)
  },
  getHotCards: function (params) {
    return $axios.post(API.getHotCards, params)
  },
  getPreferenceList: function (params) {
    return $axios.post(API.getPreferenceList, params)
  },
  getUserPayStatus: function (params) {
    return $axios.post(API.getUserPayStatus, params)
  },
  getBalance: function (params) {
    return $axios.post(API.getBalance.replace('{payType}', params), null, { timeout: 4000 })
  },
  getLimitLeayInfo: function (params) {
    return $axios.post(API.getLimitleayInfo, params)
  },
  getLimitLeayAward: function (params) {
    return $axios.post(API.getLimitLeayAward, params)
  },
  getPaymentBannerList: function (params) {
    return $axios.get(API.getPaymentBannerList, params)
  },
  getProductInfo: function (id) {
    return $axios.get(API.getProductInfo + id)
  },
  isAuthentication: function (params) {
    return $axios.post(API.isAuthentication.replace('{type}', 'pay'))
  },
  newUserFirstRechargeStatus: function () {
    return $axios.post(API.newUserFirstRechargeStatus)
  },
  getMallProductListByType: function (type) {
    return $axios.post(API.getMallProductListByType + type)
  },
  newUserFirstRechargeReturnResult: function (params) {
    return $axios.post(API.newUserFirstRechargeReturnResult, params)
  },
  getGratis: function (params) {
    return $axios.post(API.getGratis, params)
  },
  getJackpotState: function () {
    return $axios.post(API.getJackpotState)
  },
  getUserInfo: function (params) {
    return $axios.post(API.userCenter, params)
  },
  getHot: function (params) {
    return $axios.post(API.getHot, params)
  },
  getActivites: function (params) {
    return $axios.get(API.getActivites, params)
  },
  getSlider: function (params) {
    return $axios.post(API.getSlider, params)
  },
  getSlider1: function (params) {
    return $axios.post(API.getSlider1, params)
  },
  getGift: function (params) {
    return $axios.post(API.getGift, params)
  },
  getfirstPaymentSend: function (params) {
    return $axios.post(API.getfirstPaymentSend, params)
  },
  getUserBankCard (params) {
    return $axios.post(API.getUserBankCard, params)
  },
  aboutToExpire () {
    return $axios.post(API.aboutToExpire)
  },
  async getShowCoupons () {
    try {
      const res = await this.getAB()
      return $axios.post(API.getShowCoupons, null, { headers: { 'App-Version': res } })
    } catch (e) {
      console.log(e)
      return $axios.post(API.getShowCoupons)
    }
  },
  checkUserPayError () {
    return $axios.post(API.checkUserPayError)
  },
  getGoodsMsg (bizid) {
    return $axios.post(API.getGoodsMsg.replace('{bizid}', bizid))
  },
  isShowScratchCard (orderSn) {
    return $axios.post(API.isShowScratchCard.replace('{orderSn}', orderSn))
  },
  getResetPay (orderSn) {
    return $axios.post(API.getResetPay.replace('{orderSn}', orderSn))
  },
  getCatPropList () {
    return $axios.post(API.catPropList)
  },
  getFrequentPurchaseList () {
    return $axios.post(API.frequentPurchaseList)
  },
  getGreatPackageList () {
    return $axios.post(API.greatPackageList)
  },
  getRechargeGift (orderSn) {
    return $axios.post(API.getRechargeGift, { orderSn })
  },
  getPaySlider () {
    return $axios.get(API.getPaySlider)
  },
  getBtcActive () {
    return $axios.post(API.getBtcActive)
  },
  getRecommendPackageList () {
    return $axios.post(API.recommendPackageList, null, { headers: { 'App-Version': '2.0.0' } })
  },
  paypreCheck () {
    return $axios.post(API.paypreCheck)
  },
  getNewUserCoupon () {
    return $axios.post(API.getNewUserCoupon)
  },
  couponStayWindow (params) {
    return $axios.post(API.couponStayWindow, params)
  },
  wechatSendCdkOpen(params) {
    return $axios.post(API.wechatSendCdkOpen, params)
  }
}
export default Services

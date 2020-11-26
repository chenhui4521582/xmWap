import Vue from 'vue'
import axios from 'axios'
import { getUrlParams,goLogin } from '@/utils/utils'
import AppCall from '@/utils/native/index.js'

let NODE_ENV = process.env.NODE_ENV
let APP_CHANNEL = getUrlParams('channel') || localStorage.getItem('APP_CHANNEL')
let ACCESS_TOKEN = getUrlParams('token') || localStorage.getItem('ACCESS_TOKEN')
let OPEN_ACCESS_TOKEN = getUrlParams('openToken') || localStorage.getItem('OPEN_ACCESS_TOKEN')
if (APP_CHANNEL) {
  localStorage.setItem('APP_CHANNEL', APP_CHANNEL)
} else {
  //如果是保存到ios屏幕的打开时默认是100000渠道号
  if (window.navigator.standalone) {
    localStorage.setItem('APP_CHANNEL', 100000)
  }
  else {
    localStorage.setItem('APP_CHANNEL', 100070)
  }
}
if (ACCESS_TOKEN) {
  localStorage.setItem('ACCESS_TOKEN', ACCESS_TOKEN)
}
if (OPEN_ACCESS_TOKEN) {
  localStorage.setItem('OPEN_ACCESS_TOKEN', OPEN_ACCESS_TOKEN)
}
/** 平台跳转配置请勿删除!!!!! **/
localStorage.setItem('PLANT_VERSION', 'xmWap')
/** axios 请求连接等待时间 **/
axios.defaults.timeout = 10000
/** axios Request 配置 **/
axios.interceptors.request.use(
  config => {
    let ACCESS_TOKEN = getUrlParams('token') || localStorage.getItem('ACCESS_TOKEN')
    let APP_CHANNEL = getUrlParams('channel') || localStorage.getItem('APP_CHANNEL')
    ACCESS_TOKEN && (config.headers['Authorization'] = ACCESS_TOKEN)
    if (!config.headers['App-Channel']) {
      APP_CHANNEL && (config.headers['App-Channel'] = APP_CHANNEL)
    }
    if (!config.headers['App-Version']) {
      config.headers['App-Version'] = '1.0.0'
    }
    return config
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
/** axios Response 配置 **/
axios.interceptors.response.use(
  response => {
    if (response.config.url.includes('/wap/api/notice/discovery')) {
      return response
    }
    let errorList = {
      404: '请求地址出错!',
      408: '请求超时',
      501: '服务未实现',
      502: '网关错误',
      503: '服务不可用',
      504: '网关超时'
    }
    let { code } = JSON.parse(response.request.response)
    /** 实名认证页面, 风控页面不需要监控token **/

    if (code && code != 200) {
      if (code == 401) {
        /** 本地缓存没有找到user_Info 删除本地 user_info 字段 **/
        localStorage.getItem('user_Info') && localStorage.removeItem('user_Info')
        localStorage.removeItem('ACCESS_TOKEN')
        /** 开发环境跳转登录页, 生产环境跳转断开连接 **/
        if (NODE_ENV === 'production') {
          /** 实名认证页面, 风控页面不需要监控token **/
          let noCheckTokenArr = ['riskManagement', 'authentication', 'zfbmiddle', 'wechatmiddle', 'feedback', 'loginTip', 'userAgreement', 'userPrivacy']
          let noCheckToken = noCheckTokenArr.find(item => {
            return window.location.href.indexOf(item) != -1
          })
          if (noCheckToken) return
          
          goLogin();
        }
      } else {
        let message = errorList[code]
        if (message) {
          Vue.prototype.$Toast(message)
        }
      }
    }
    return response
  },
  error => {
    return Promise.reject(error)
  }
)
export default axios

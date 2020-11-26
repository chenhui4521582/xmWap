import axios from 'axios'
import base64url from 'base64-url'
import _get from 'lodash.get'
import API from '@/services/API/API'
import state from '@/store/state'
import Vue from 'vue'
class utils {
  constructor() {
    this.jumpUrl = this.jumpUrl.bind(this)
    this.gameActivityJump = this.gameActivityJump.bind(this)
    this.marchSetsPoint = this.marchSetsPoint.bind(this)
    this.bottomBarJump = this.bottomBarJump.bind(this)
    this.bdAdsInit = this.bdAdsInit.bind(this)
    this.setRecordAdLog = this.setRecordAdLog.bind(this)
    this.getChannel = this.getChannel.bind(this)
  }
  getPhoneInfo () {
    var _phoneData = {}
    var app = navigator.appVersion
    var left = app.indexOf('(')
    var right = app.indexOf(')')
    var str = app.substring(left + 1, right)
    var Str = str.split(';')
    // 手机型号--苹果 iPhone
    var Mobile_Iphone = Str[0]
    // 手机型号--安卓
    var Mobile_Android = Str[2]
    var res = /Android/
    var reslut = res.test(Mobile_Android)

    // 根据设备型号判断设备系统
    var phoneVersion = Str[0]
    if (phoneVersion == 'iPhone') {
      _phoneData.client = Mobile_Iphone
      _phoneData.os = Str[1].substring(4, 19)
    }
    else if (phoneVersion == 'Linux') {
      if (reslut) {
        _phoneData.client = Str[4].substring(0, 9)
        _phoneData.os = Str[2]
      } else {
        _phoneData.client = Mobile_Android.substring(0, 9)
        _phoneData.os = Str[1]
      }
    }
    else if (phoneVersion == 'iPad') {
      _phoneData.client = Str[0]
      _phoneData.os = Str[1].substring(4, 12)
    }
    return _phoneData
  }
  isIOS () {
    let U = window.navigator.userAgent
    return !(U.indexOf('Android') > -1 || U.indexOf('Adr') > -1)
  }
  isAndroid () {
    let U = window.navigator.userAgent
    return !U.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  }
  isWechat () {
    var U = window.navigator.userAgent.toLowerCase()
    return !!(U.match(/MicroMessenger/i) == 'micromessenger')
  }
  isAlipay () {
    var U = window.navigator.userAgent.toLowerCase()
    return !!(U.match(/Alipay/i) == 'alipay')
  }
  trimStr (str) {
    return str.replace(/(^\s*)|(\s*$)/g, '')
  }
  isEmptyArray (array) {
    if (array instanceof Array) {
      return !array.length
    } else {
      console.error('传入的值非数组')
    }
  }
  isEmptyObject (object) {
    if (object instanceof Object) {
      return !Object.keys(object).length
    } else {
      console.error('传入的值非对象')
    }
  }
  cacheInGlobal (axios, urlFlag, data, headers) {
    window._global_cache = window._global_cache || {}
    var cache = window._global_cache['cache_' + urlFlag]
    if (cache) {
      return new Promise(function (resolve, reject) {
        resolve(JSON.parse(cache))
      })
    }
    else {
      return axios.post(API[urlFlag], data, headers).then(data => {
        if (_get(data, 'data.code', '') == 200) {
          window._global_cache['cache_' + urlFlag] = JSON.stringify(data)
        }
        return data
      })
    }
  }
  cacheRequest (type, axios, urlFlag) {
    var cache = sessionStorage['cache_' + urlFlag]
    if (cache) {
      return new Promise(function (resolve, reject) {
        resolve(JSON.parse(cache))
      })
    }
    else {
      return axios[type](API[urlFlag]).then(data => {
        if (urlFlag == 'getFindEntrance' || _get(data, 'data.code', '') == 200) {
          sessionStorage['cache_' + urlFlag] = JSON.stringify(data)
        }
        return data
      })
    }
  }
  localStorage () {
    return {
      getString: key => {
        let store = window.localStorage
        let data = store.getItem(key)
        if (!data) {
          return false
        }
        return data
      },
      get: key => {
        let store = window.localStorage
        let data = store.getItem(key)
        if (!data) {
          return false
        }
        return JSON.parse(data)
      },
      set: (key, value) => {
        let store = window.localStorage
        if (typeof value === 'string') {
          store.setItem(key, value)
          return false
        }
        let stringData = JSON.stringify(value)
        store.setItem(key, stringData)
      },
      remove: function (key) {
        let store = window.localStorage
        store.removeItem(key)
      }
    }
  }
  getUrlParams (ename, defaultUrl) {
    let url = defaultUrl || window.location.href
    let Request = {}
    if (url.indexOf('?') != -1) {
      let str = url.split('?')[1]
      let strs = str.split('&')
      for (let i = 0; i < strs.length; i++) {
        Request[strs[i].split('=')[0]] = strs[i].split('=')[1] && decodeURIComponent(strs[i].split('=')[1])
      }
    }
    return ename
      ? Request[ename]
        ? Request[ename].split('#')[0]
        : ''
      : Request
  }
  openGame (url, SDK, params) {
    let APP_CHANNEL = this.localStorage().getString('APP_CHANNEL')
    let baseUrl = `https:${state.HOST_PLATFORM}/${url}${url.includes('?') ? '&' : '?'}channel=${APP_CHANNEL}&time=${new Date().getTime()}${params || ''}`
    if (SDK) {
      parent.location.href = baseUrl
    } else {
      this.bottomBarJump(baseUrl)
    }
  }
  move (e) {
    e.preventDefault()
  }
  ScrollNoMove () {
    document.body.style.overflow = 'hidden'
    document.addEventListener('touchmove', this.move, { passive: false })
  }
  ScrollMove () {
    document.body.style.overflow = null
    document.removeEventListener('touchmove', this.move, { passive: false })
  }
  ScrollToTop () {
    window.scrollTo(0, 0)
  }
  async jumpUrl (item, SDK, params) {
    /** 没有传入任何值 **/
    let URL = _get(item, 'url', false)
    if (!URL || URL == null) {
      return false
    }
    /** 跳转外接游戏 **/
    URL = this.trimStr(URL)
    let APP_CHANNEL = this.localStorage().getString('APP_CHANNEL')
    let OPEN_TOKEN = this.localStorage().getString('OPEN_ACCESS_TOKEN')
    let WJ_GAMETYPE = item.gameType || item.type || this.getUrlParams('wfGameType', URL) || ''
    let g_url = URL.includes('&wfGameType=') ? URL.replace('?external=1', '').replace('&external=1', '').split('&wfGameType=')[0] : URL.replace('?external=1', '').replace('&external=1', '')
    if (URL.indexOf('external=1') != -1) {
      let url = `${URL}&channel=${APP_CHANNEL}&token=${OPEN_TOKEN}&gurl=${base64url.encode(g_url)}&pf=xmWap&gameType=${WJ_GAMETYPE}`
      if (WJ_GAMETYPE) {
        window.localStorage.setItem('wj_gameType', WJ_GAMETYPE)
        axios.post(
          '//platform-api.beeplaying.com/wap/api/game/firstLoad/' + WJ_GAMETYPE
        )
        axios.post(
          '//ops-api.beeplaying.com/ops/api/h5game/saveBehavior'
        )
      }
      if (SDK) {
        parent.location.href = url
      } else {
        this.bottomBarJump(url)
      }
      return false
    }
    /** 跳转绝对路劲**/
    if (URL.indexOf('//') != -1) {
      if (SDK) {
        parent.location.href = URL
      } else {
        this.bottomBarJump(URL)
      }
      return
    }
    /** 跳转竞猜游戏 **/
    URL = URL.replace('/', '')
    this.openGame(URL, SDK, params)
  }
  /** 百度底bar 跳转方法 **/
  bottomBarJump (url, router_name, router, query) {
    if (!url) return false
    let APP_CHANNEL = this.getUrlParams('channel') || this.localStorage().get('APP_CHANNEL') || 10000
    if (APP_CHANNEL == 100039001) {
      if (!url.includes('http')) {
        let code = encodeURIComponent(`https:${state.HOST_PLATFORM}/xmWap/${url}`)
        url = `baiduhaokan://webview/?url_key=${code}`
      } else {
        url = `baiduhaokan://webview/?url_key=${encodeURIComponent(url)}`
      }
      window.location.href = url
    } else {
      if (router_name && router) {
        router.push({
          name: router_name,
          query
        })
      }
      else if (!url.includes('http')) {
        url = `https:${state.HOST_PLATFORM}/xmWap/${url}`
      }
      else {
        window.location.href = url
      }
    }
  }
  async marchSetsPoint (_pointId, _pointObject) {
    try {
      /** 获取用户信息 **/
      let userInfo = this.localStorage().get('user_Info')
      if (!userInfo) {
        let r = await axios.post(API.getTransInfo)
        userInfo = r.data.data
        this.localStorage().set('user_Info', userInfo)
      }
      /** 平台数据 **/
      let _beginTime = Date.now()
      let _channel = this.localStorage().getString('APP_CHANNEL') || 100051003
      let _plateform = this.isIOS() ? 'ios' : 'android'
      /** 合并参数 **/
      let _eventContent = Object.assign(
        {
          residual_gold: userInfo.amount,
          position_id: null,
          target_project_id: null,
          task_id: null,
          task_name: null,
          marketing_id: null,
          residual_jingdong: null,
          residual_phone: null,
          app_version: window.android && window.android.getVersionName(),
          entrance: this.localStorage().getString('platSource') || 'plat',
          from_project_id: this.getUrlParams('gametype')
        },
        _pointObject
      )

      let clientInfo = this.getPhoneInfo()
      /** 要发送的数据 **/
      let sendMessage = {
        plateform: 'h5',
        version: '1.0.0',
        channel: _channel,
        subplateform: _plateform,
        useragent: window.navigator.userAgent,
        os: clientInfo.os,
        client: clientInfo.client,
        logs: [
          {
            uid: userInfo.userId,
            begintime: _beginTime,
            eventid: _pointId,
            eventcontent: _eventContent
          }
        ]
      }
      /** 创建formDate 对象 并把数据插入formDate **/
      let formData = new FormData()
      formData.append('appName', 'wf_game')
      formData.append('json', JSON.stringify(sendMessage))
      /** 发送formDate 数据 **/
      axios.post(API.marchBuriedPoint, formData, { timeout: 500 })
      return
    } catch (error) {
      return
    }
  }
  isShowAdver (pos) {
    let data = JSON.parse(sessionStorage.getItem('advertData'))
    let item = data.filter(item => item.position == pos)
    return item.length && item[0].url && (item[0].url.includes('baidu') || item[0].url.includes('google'))
  }
  /** 游戏内活动点击跳转 **/
  gameActivityJump (url) {
    if (!url) {
      return false
    }
    if (url.includes('http')) {
      this.jumpUrl({ url }, 'SDK')
    } else {
      let ACCESS_TOKEN = this.localStorage().getString('ACCESS_TOKEN')
      let APP_CHANNEL = this.localStorage().getString('APP_CHANNEL')
      let popupList = {
        /** 一元夺宝 **/
        popup_oneLottery: 'https://wap.beeplaying.com/payment/#/yiyuanchou',
        /** 充值特惠 **/
        popup_getPreference: 'https://wap.beeplaying.com/payment/#/miniFeedBack',
        /** 夺宝礼包 **/
        popup_getCardLottery: 'https://wap.beeplaying.com/payment/#/treasure/gift',
        /** 转盘夺宝 **/
        popup_getTurntable: 'https://wap.beeplaying.com/payment/#/payTurntable',
        /** 底Bar 兼容打开弹框,统一版本后删除 **/
        openOneLottery: 'https://wap.beeplaying.com/payment/#/yiyuanchou',
        /** 充值特惠 **/
        feedback: 'https://wap.beeplaying.com/payment/#/miniFeedBack',
        /** 夺宝礼包 **/
        openGameTreasureGift: 'https://wap.beeplaying.com/payment/#/treasure/gift',
        /** 夺宝礼包1908 **/
        treasureCeremony1908: 'https://wap.beeplaying.com/payment/#/treasure/gift1908',
        /** 转盘夺宝 **/
        open_payTurntable: 'https://wap.beeplaying.com/payment/#/payTurntable'
      }
      if (popupList[url] && parent && parent.GameEval) {
        // 一元夺宝跳落地页
        if (url === 'popup_oneLottery') parent.location.href = `https://wap.beeplaying.com/xmWap/#/mall/onePay?channel=${APP_CHANNEL}&token=${ACCESS_TOKEN}`
        parent.GameEval('openweb', `${popupList[url]}?channel=${APP_CHANNEL}&token=${ACCESS_TOKEN}`)
      }
    }
  }
  loadScripts (urls, callback) {
    callback = callback || function () { }
    // 添加script属性，并添加到head中
    let loader = function (src, handler) {
      let script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = src
      // 重点！！！！script加载成功
      script.onload = function () {
        script.onload = null
        script.onerror = null
        handler()
      }
      script.onerror = function () {
        script.onload = null
        script.onerror = null
        callback({
          message: src + '依赖未加载成功！'
        })
      }
      let head = document.getElementsByTagName('head')[0];
      (head || document.body).appendChild(script)
    };
    // 自执行函数，用于循环loader
    (function run () {
      if (urls.length > 0) {
        loader(urls.shift(), run)
      } else {
        callback()
      }
    })()
  }
  async setRecordAdLog (readADsLogDate, status) {
    console.log(this.localStorage().get('adsData'))
    axios.post(API.recordAdLog, { logId: readADsLogDate, status: status, type: this.localStorage().get('adsData').sourceType, source: 1 })
  }
  async setReadAdStatus () {
    await axios.post(API.readAdStatus) // 视频转盘接口用 浅色版未接入
  }
  bdAdsInit () {

    let adWrp = document.querySelector('#ad-wrp')
    if (adWrp) {
      adWrp.parentNode.removeChild(adWrp)
    }
    try {
      if (rewardVideo) {
        try {
          rewardVideo.destroy()
        } catch (error) {

        }
      }
    } catch (error) {
      relies = ['https://na0.bdstatic.com/static/cover/static/rewardVideo/index-1.1.0.js?time=2015']
      this.loadScripts(relies, function cb (err) {
        if (err) {
          console.log(err.message)
          return
        }
      })
    }
    let APP_CHANNEL = this.localStorage().getString('APP_CHANNEL')
    this.localStorage().remove('ADS_ERROR')
    let sendBeaconCount = 0
    window.navigator.sendBeacon = (e) => {
      if (!sendBeaconCount) {
        // 广告开始播放
        this.marchSetsPoint('A_H5PT0140001404', { entrance: this.localStorage().get('adsData').entrance })
      } else if (sendBeaconCount == 3) {
        // 广告结束播放
        this.marchSetsPoint('A_H5PT0140001405', { entrance: this.localStorage().get('adsData').entrance })
      }
      let t = new Image()
      t.onload = t.onerror = () => { }
      t.src = e
      sendBeaconCount++
    }
    let readADsLogDate = null
    let adsObj = {
      isAdverStatus: false,
      scr_id: 1725,
      product_id: 25,
      hasAdStatus: false
    }
    if (APP_CHANNEL.indexOf('100039') > -1) {
      adsObj.scr_id = 1725
      adsObj.product_id = 25
    } else if (APP_CHANNEL.indexOf('100042') > -1) {
      adsObj.scr_id = 1726
      adsObj.product_id = 30
    }
    this.marchSetsPoint('A_H5PT0140001406')
    try {
      rewardVideo.init({
        pageColor: '#24B46A',
        isMuted: true,
        productId: adsObj.product_id,
        srcid: adsObj.scr_id,
        onStartPlay: () => {
          adsObj.isAdverStatus = false
          readADsLogDate = new Date().getTime()
          this.setRecordAdLog(readADsLogDate, 1)
          this.marchSetsPoint('A_H5PT0140001417', { entrance: this.localStorage().get('adsData').entrance })
          let HASE_CLOSE_SELF = document.querySelector('.AD-close-self')
          let CLOSE = document.querySelector('.ad-video-page .close')
          if (HASE_CLOSE_SELF) {
            CLOSE.removeChild(HASE_CLOSE_SELF)
          }
          let CLOSE_SELF = document.createElement('DIV')
          CLOSE_SELF.className = 'AD-close-self'
          CLOSE_SELF.style.position = 'absolute'
          CLOSE_SELF.style.top = 0
          CLOSE_SELF.style.right = 0
          CLOSE_SELF.style.width = '8rem'
          CLOSE_SELF.style.height = '2rem'
          CLOSE_SELF.style.opacity = 0
          CLOSE_SELF.style['pointer-events'] = 'auto'
          CLOSE.appendChild(CLOSE_SELF)
          window.confirm = (message) => {
            let iframe = document.createElement('IFRAME')
            iframe.style.display = 'none'
            iframe.setAttribute('src', 'data:text/plain,')
            document.documentElement.appendChild(iframe)
            let alertFrame = window.frames[0]
            let result = alertFrame.window.confirm(message)
            iframe.parentNode.removeChild(iframe)
            return result
          }
          document.querySelector('.AD-close-self').onclick = (e) => {
            if (!confirm('看完广告将获得游戏奖励，是否关闭广告')) {
              e.stopPropagation()
            } else {
              sendBeaconCount = 4
            }
            sendBeaconCount = 4
          }
        },
        onEndPlay: () => {
          adsObj.isAdverStatus = true
          window.localStorage['cache_lastWatchAds'] = Date.now()
          if (this.localStorage().get('adsData').sourceType === 3) {
            this.setReadAdStatus()
          }
          if (readADsLogDate) {
            this.setRecordAdLog(readADsLogDate, 3)
            this.marchSetsPoint('A_H5PT0140001418', { entrance: this.localStorage().get('adsData').entrance })
            readADsLogDate = null
          }
        },
        onAdClose: (data) => {
          // type:
          // NAVIDEO: 表示是视频页面
          // NAVIDEO_TAIL: 表示是尾帧页面
          try {
            if (readADsLogDate) {
              this.setRecordAdLog(readADsLogDate, 2)
            }
            if (adsObj.isAdverStatus) {
              try {
                rewardVideo.destroy()
              } catch (error) {
              }
              window.closeAdver()
              try {
                bdAdsInit()
              } catch (error) {
                this.localStorage().set('ADS_ERROR', true)
              }
            } else {
              this.$Toast('广告播放未完成，奖励领取失败')
            }
            readADsLogDate = null
          } catch (e) {
          }
        },
        onAdClick: (data) => {
          // type:
          // NAVIDEO: 表示是视频页面
          // NAVIDEO_TAIL: 表示是尾帧页面
          console.log('this is ad click', data)
        }
      }).then((res) => {
        if (res.errno) {
          this.localStorage().set('ADS_ERROR', true)
          adsObj.hasAdStatus = false
          console.log('error:', res.errmsg)
          return
        }
        this.marchSetsPoint('A_H5PT0140001407')
        adsObj.hasAdStatus = true
      })
    } catch (error) {

    }
  }
  /** 解决键盘唤起不能点击按钮 **/
  clearInput () {
    let keyTimer = null
    document.body.addEventListener('focusin', () => {
      //软键盘弹起事件
      clearTimeout(keyTimer)
    })
    document.body.addEventListener('focusout', () => {
      // 软键盘关闭事件
      window.scrollTo(0, 0)
      keyTimer = setTimeout(() => {
        if (window.pageYOffset > 0) {
          window.scrollTo(0, 0)
        }
      }, 200)
    })
  }
  logError ({
    err,
    vm,
    info
  }) {
    try {
      if (location.href.indexOf('wap.beeplaying.com') == -1) {
        return
      }
      var logUrl = 'https://data-api.beeplaying.com/log/collection'
      var timespan_error_upload = 10 * 1000 //错误日志上传时间间隔(防止死循环), 10秒
      let logInfo = {
        gameType: 'wf_game_plat',
        get channel () {
          return window.localStorage['APP_CHANNEL'] || ''
        },
        get extend () {
          let userId = -1
          if (window.localStorage['userInfo']) {
            userId = _get(JSON.parse(window.localStorage['userInfo']), 'userId', -1)
          }
          return 'userAgent:' + navigator.userAgent + '\n' + 'UserId:' + userId + '\n'
        },
        get detail () {
          return JSON.stringify({
            get message () {
              return err.toString()
            },
            url: location.href,
            stack: err.stack,
            info: info
          })
        },
        lastErrorUploadTime: 0,
      }

      var timeNow = Date.now()
      if (timeNow - logInfo.lastErrorUploadTime >= timespan_error_upload) {
        var xhr = new XMLHttpRequest()
        xhr.open('POST', logUrl, true)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.timeout = 15 * 1000
        xhr.send(JSON.stringify({
          logCentent: logInfo.detail,
          type: 0,
          date: timeNow,
          extend: logInfo.extend,
          appName: logInfo.gameType,
          channel: logInfo.channel
        }))
      }
    } catch (e) { }
  }
  specialChannelJump (url, isReplace = true) {
    let channel = window.localStorage.getItem('APP_CHANNEL')
    let specialChannel = ['100083']
    if (specialChannel.includes(channel)) {
      isReplace ? location.replace(url) : location.href = url
    } else {
      isReplace ? parent.location.replace(url) : parent.location.href = url
    }
    // if (parent.location.host.includes('wap.beeplaying.com')) {
    //   isReplace ? parent.location.replace(url) : parent.location.href = url
    // } else {
    //   isReplace ? location.replace(url) : location.href = url
    // }
  }
  getChannel () {
    return this.getUrlParams('channel') || window.localStorage['APP_CHANNEL'] || ''
  }
  goLogin(needBind){
    let APP_CHANNEL = getUrlParams('channel') || window.localStorage['APP_CHANNEL']
    if (['100000', '100061', '100086','100102','100108','100107','100086001','100086002'].indexOf(APP_CHANNEL) > -1) {
      AppCall.switchAccount()
      if(needBind){
        window.location.replace('https://wap.beeplaying.com/publicWap/loginPage.html?channel=' + APP_CHANNEL + '&from=plat&needbind=1&time=' + new Date().getTime() + '#/')
      }
      else
      {
        window.location.replace('https://wap.beeplaying.com/publicWap/loginPage.html?channel=' + APP_CHANNEL + '&from=plat&time=' + new Date().getTime() + '#/')
      }
    }
    else if (APP_CHANNEL == '100030') {
      AppCall.switchAccount()
      window.location.href = 'https://wap.beeplaying.com/loginPages/newDDWlogin.html?channel=100030&time=' + new Date().getTime() + '#/'
    }
    else if (APP_CHANNEL == '100031') {
      window.location.href = 'https://wap.beeplaying.com/publicWap/loginPage.html?channel=' + APP_CHANNEL + '&from=plat&time=' + new Date().getTime() + '#/'
    }
    else {
      Vue.prototype.$Toast('登录失效')
      setTimeout(() => {
        AppCall.switchAccount()
        window.location.href = 'https://wap.beeplaying.com/loginPages/failureLogon.html'
      }, 1500)
    }
  }
}

let newUtils = new utils(),
  getUrlParams = newUtils.getUrlParams,
  localStorage = newUtils.localStorage(),
  marchSetsPoint = newUtils.marchSetsPoint,
  jumpUrl = newUtils.jumpUrl,
  gameActivityJump = newUtils.gameActivityJump,
  bottomBarJump = newUtils.bottomBarJump,
  bdAdsInit = newUtils.bdAdsInit,
  loadScripts = newUtils.loadScripts,
  logError = newUtils.logError,
  specialChannelJump = newUtils.specialChannelJump,
  getChannel = newUtils.getChannel,
  goLogin = newUtils.goLogin

export default newUtils
export { localStorage, getUrlParams, marchSetsPoint, logError, jumpUrl, gameActivityJump, newUtils, bottomBarJump, bdAdsInit, loadScripts, specialChannelJump, getChannel,goLogin }

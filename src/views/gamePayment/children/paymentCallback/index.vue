<template>
  <section class="g-p-callback">
    <g-p-header :isSetBack="showSuccess" @back="headBack" @close="headClose"></g-p-header>
    <!-- 支付成功 -->
    <g-p-success v-if="showSuccess" :successData="successData" ref="paySuccess"></g-p-success>
    <!-- 支付失败 -->
    <g-p-error v-if="showError"></g-p-error>
    <loading :mask="true" v-if="showLoading"></loading>
  </section>
</template>

<script>
import { mapActions } from 'vuex'
import GPSuccess from './components/success'
import GPError from './components/error'
import GPHeader from '../../components/header'
import { localStorage, newUtils } from '@/utils/utils'
import Services from '@/services/payment'
import _get from 'lodash.get'
export default {
  name: 'GPCallback',
  components: {
    GPHeader,
    GPSuccess,
    GPError
  },
  data () {
    return {
      timer: null,
      showSuccess: false,
      showError: false,
      showLoading: false,
      showbackAppCheck: false,
      successData: {}
    }
  },
  methods: {
    ...mapActions({
      _getFirstPayment: 'GET_FIRSTPAYMENT'
    }),
    bindVisilityChange () {
      const handleFn = () => {
        if (document.visibilityState === 'visible') {
          if (parent.loadPage) {
            parent.loadPage()
          } else {
            location.reload()
          }
        }
      }
      document.addEventListener('visibilitychange', handleFn)
      document.addEventListener('webkitvisibilitychange', handleFn)
    },
    pageShow () {
      window.onpageshow = function() {
        if(newUtils.isIOS && event.persisted) {
          if (parent.loadPage) {
            parent.loadPage()
          }
          else {
            location.reload()
          }
        }
      }
    },
    /** 查询用户支付状态 **/
    _getUserPayStatus () {
      /** 循环拉3次接口，其中有一次成功显示成功 **/
      this.ORDER_NUMBER = localStorage.getString('ORDER_NUMBER')
      this.showLoading = true
      this.index = 0
      /** 轮循 **/
      this.timer = setInterval(() => {
        Services.getUserPayStatus({ value: this.ORDER_NUMBER })
          .then(res => {
            localStorage.remove('checkPlatOrderStatus')
            localStorage.remove('checkOrderStatus') // 游戏修改后删除
            let { code, data, payInfo } = res.data
            if (code === 200) {
              /** 支付成功取消轮循，显示成功状态 **/
              clearInterval(this.timer)
              this.timer = null
              this.showLoading = false
              this.successData = Object.assign(payInfo,{
                cardMsg:data.cardMsg||''
              })
              this.showSuccess = true
            } else {
              if (this.index === 2) {
                this.showLoading = false
                /** 3次接口全是错误,取消轮循显示错误状态**/
                clearInterval(this.timer)
                this.timer = null
                this.showError = true
              }
              this.index++
            }
          })
          .catch(error => {
            this.showLoading = false
            clearInterval(this.timer)
            this.timer = null
            this.showError = true
          })
      }, 1000)
    },
    /** 拉起原生微信支付 **/
    onBridgeReady (data) {
      let that = this
      this.showToast = true
      this.showLoading = false
      let attach = data.attach
      if (typeof (attach) === 'string') {
        attach = JSON.parse(attach)
      }
      localStorage.set('ORDER_NUMBER', data.orderNum)
      window.parent.WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        {
          appId: attach.appId, //公众号名称
          timeStamp: attach.timeStamp, //时间戳
          nonceStr: attach.nonceStr, //随机串
          package: attach.package,
          signType: attach.signType, //微信签名方式：
          paySign: attach.sign || attach.paySign //微信签名
        },
        function (res) {
          if (res.err_msg == 'get_brand_wcpay_request:ok') {
            that.$Toast('支付成功')
          } else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
            localStorage.set('isPlatform', true)
            that.$Toast('支付已取消!!')
          } else if (res.err_msg == 'get_brand_wcpay_request:fail') {
            that.$Toast('支付失败!!')
          } else {
            that.$Toast('缺少参数!!')
          }
          parent.location.reload()
        }
      )
    },
    /** 京东支付 **/
    jdPay (data, orderNum) {
      localStorage.set('ORDER_NUMBER', orderNum)
      parent.location.href =
        'https://wap.beeplaying.com/xmWap/#/payment/jdpay?parmas=' +
        encodeURIComponent(JSON.stringify(data))
    },
    /** 支付宝H5支付 **/
    H5AliPay (alias, orderNum, url, attach) {
      localStorage.remove('aliPayStatus')

      let agentCode = _get(attach, 'agentCode', '')

      if (agentCode == 'cibtnbnewzfbh5pay' || agentCode == 'pufazfbh5pay') {
        localStorage.set('ORDER_NUMBER', attach.mechartNo)
        parent.location.href = this.$router.resolve({
          name: 'zfbMiddle',
          query: { url: data.token.code_url, alias }
        }).href
      } else {
        localStorage.set('ORDER_NUMBER', orderNum)
        parent.location.href = this.$router.resolve({
          name: 'zfbMiddle',
          query: { url, alias, attach }
        }).href
      }
    },
    /** 微信H5支付 **/
    H5WechatPay (orderNum, url) {
      localStorage.remove('wechatPayStatus')
      localStorage.set('ORDER_NUMBER', orderNum)
      parent.location.href = this.$router.resolve({
        name: 'wechatMiddle',
        query: { url }
      }).href
    },
    /** 微信App支付,并且是魅族渠道,吊起魅族原生支付 **/
    AppWechatPay (attach, orderNum) {
      if (window.android && window.android.wxPay) {
        localStorage.set('ORDER_NUMBER', orderNum)
        /** 转换参数变成字符串 **/
        let params = JSON.stringify(attach)
        /** 回调方法 **/
        window.wechatAppCallback = code => {
          this._getUserPayStatus()
        }
        window.android.wxPay(params, 'wechatAppCallback')
      } else {
        this.$Toast('android.wxPay undefined')
      }
    },
    /** 支付宝App支付,并且是魅族渠道,吊起魅族原生支付 **/
    APPAliPay (attach, orderNum) {
      localStorage.set('ORDER_NUMBER', orderNum)
      if (window.android && window.android.aliPay) {
        /** 转换参数变成字符串 **/
        let params = JSON.stringify(attach)
          .replace(/:/g, '=')
          .replace(/,/g, '&')
        /** 回调方法 **/
        window.aliAppCallback = code => {
          this._getUserPayStatus()
        }
        window.android.aliPay(params, 'aliAppCallback')
      } else {
        this.$Toast('android.aliPay undefined')
      }
    },
    /** 云闪付 **/
    Unionpay (attach, orderNum) {
      window.localStorage.setItem('ORDER_NUMBER', orderNum)
      let unionpay = document.getElementById('unionpay')
      if (unionpay) {
        unionpay.parentNode.removeNode(unionpay)
      }
      let oDiv = document.createElement('div')
      oDiv.id = 'unionpay'
      oDiv.innerHTML = attach
      parent.document.body.appendChild(oDiv)
      parent.document.all.pay_form.submit()
    },
    /** 扫码支付 **/
    ScanPay (orderNum, url) {
      window.localStorage.setItem('ORDER_NUMBER', orderNum)
      if (url) {
        url = encodeURIComponent(url)
        const token = window.localStorage.getItem('ACCESS_TOKEN')
        // alert(token)
        parent.location.href = `https://wap.beeplaying.com/xmWap/#/gamepayment/scanpay?img=${url}`
      }
    },
    /** wifi万能钥匙支付 **/
    wifiPay (tpOrderId, orderNum) {
      window.localStorage.setItem('ORDER_NUMBER', orderNum)
      parent.SDK.charge100081(tpOrderId)
    },
    /** 破晓斗地主支付 **/
    wfsdkpay(attach, orderNum){
      localStorage.set('ORDER_NUMBER', orderNum)
      this.$AppCall.openPayByOrder(JSON.stringify(attach));
      window.app_payment_callback =function(result){
        location.reload();
      }
    },
    /** 其他h5支付 **/
    otherH5Pay (orderNum, url) {
      localStorage.set('ORDER_NUMBER', orderNum)
      if (url) {
        parent.location.href = url
      }
    },
    /** pc 扫码支付 **/
    pcScanPay (orderNum, url) {
      window.localStorage.setItem('ORDER_NUMBER', orderNum)
      if (url) {
        window.sessionStorage.setItem('pcSancode', url)
        this.$router.push({
          name: 'pcscanpay'
        })
      }
    },
    /** 支付跳转 **/
    payJump (data) {
      let that = this
      let { alias, orderNum, url, attach } = data
      let _channel = window.localStorage.getItem('APP_CHANNEL')
      if (['100107'].includes(_channel)) {
        this.pcScanPay(orderNum, url)
      } else if (newUtils.isWechat() && (alias.includes('mayunwechat') || alias.includes('wechatgzh'))) {
        if (typeof window.parent.WeixinJSBridge == 'undefined') {
          if (window.parent.document.addEventListener) {
            window.parent.document.addEventListener(
              'WeixinJSBridgeReady',
              that.onBridgeReady(data),
              false
            )
          } else if (window.parent.document.attachEvent) {
            window.parent.document.attachEvent(
              'WeixinJSBridgeReady',
              that.onBridgeReady(data)
            )
            window.parent.document.attachEvent(
              'onWeixinJSBridgeReady',
              that.onBridgeReady(data)
            )
          }
        } else {
          this.onBridgeReady(data)
        }
      }
      else if (alias.includes('hcwxh5sm')) {
        let channelArray = ['110002', '110002001', '110002002']
        channelArray.includes(_channel) ? this.H5WechatPay(orderNum, url) : this.ScanPay(orderNum, url)
      } else if (alias.indexOf('jdpay') > -1) {
        this.jdPay(data, orderNum)
      } else if (alias.includes('zfbh5')||alias.includes('aliH5')) {
        this.H5AliPay(alias, orderNum, url, attach)
      } else if (alias.includes('wxh5')) {
        this.H5WechatPay(orderNum, url)
      } else if (alias.includes('wechatApp')) {
        this.AppWechatPay(attach, orderNum)
      } else if (alias.includes('umszfbapp')) {
        this.APPAliPay(attach, orderNum)
      } else if (alias.includes('unionpay')) {
        this.Unionpay(attach, orderNum)
      } else if (alias.includes('wifipay')) {
        this.wifiPay(attach.tpOrderId, orderNum)
      } else if (alias.includes('hyuewxsm')) {
        this.ScanPay(orderNum, url)
      } else if (alias.includes('wfsdkpay')) {
        this.wfsdkpay(attach, orderNum)
      } else {
        this.otherH5Pay(orderNum, url)
      } 
    },
    init () {
      let data = localStorage.get('orderData')
      /** 在支付宝内部显示返回App 查看**/
      if (newUtils.isAlipay()) {
        this.showbackAppCheck = true
      } else if (data) {
        /** 删除上个订单的数据 **/
        localStorage.remove('orderData')
        this.payJump(data)
      } else {
        this._getUserPayStatus()
        /** 支付方式抽免单 不需的时候删除 **/
        let ORDER_NUMBER = window.localStorage.getItem('ORDER_NUMBER')
        this._getFirstPayment(ORDER_NUMBER)
      }
      this.$marchSetsPoint('P_H5PT0057')
    },
    headBack(){
      if(this.showSuccess){
        this.$refs.paySuccess.confirmClick(()=>{
          window.localStorage.removeItem('originDeffer')
          let src = parent.document.querySelector('iframe') && parent.document.querySelector('iframe').src
          if (src.includes('gameMall') || src.includes('gamepayment')) {
            history.go(-1)
          } else if (parent.GameEval) {
            parent.GameEval('closeweb')
          } else {
            history.go(-1)
          }
        })
      }
    },
    headClose(){
      if(this.showSuccess){
        this.$refs.paySuccess.confirmClick(()=>{
          window.localStorage.removeItem('originDeffer')
          parent.GameEval('closeweb')
        })
      }
    }
  },
  created () {
    // 兼容ios 13
    let str= navigator.userAgent.toLowerCase();
    let ios = str.match(/cpu iphone os (.*?) like mac os/);
    if(ios && ios[1].split('_')[0] >= 13 ) {
      this.pageShow()
    } else {
      this.bindVisilityChange()
    }
    this.init()
  },
  beforeRouteEnter (to, from, next) {
    // 从linkUrl里面获取横竖屏信息
    const useLandscape = parent.SDK && parent.SDK.getUseLandscape()
    let baseWidth = 720
    let scale = document.documentElement.clientWidth / baseWidth
    if (useLandscape) {
      /** 页面页面宽度1280px **/
      baseWidth = 1280
      scale = document.documentElement.clientWidth / baseWidth > 1 ? 1 : document.documentElement.clientWidth / baseWidth
    }
    const baseSize = 30
    document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
    next()
  },
  destroyed () {
    /** 销毁定时器 **/
    this.timer = null
    clearInterval(this.timer)
  }
}
</script>

<style lang="less" scoped>
.g-p-callback {
  position: fixed;
  box-sizing: border-box;
  left: 50%;
  top: 50%;
}
.bg-center(@url) {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url(@url);
}
@media screen and (orientation: portrait) {
  /*竖屏 css*/
  .g-p-callback {
    height: 960px;
    width: 656px;
    margin-top: -480px;
    margin-left: -328px;
    font-family: PingFangSC-Regular, sans-serif;
    .bg-center('./images/portrait-bg.png');
  }
}
@media screen and (orientation: landscape) {
  /*横屏 css*/
  .g-p-callback {
    height: 648px;
    width: 998px;
    margin-top: -324px;
    margin-left: -500px;
    font-family: PingFangSC-Regular, sans-serif;
    .bg-center('./images/landscape-bg.png');
  }
}
</style>

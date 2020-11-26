<template>
  <div class="pay-callback">
    <div class="header" v-if="$moduleConfig.isShowHeader">
      <div class="back iconfont icon-return" @click="back"></div>
      支付
    </div>
    <!-- 支付成功 -->
    <pay-success v-if="showSuccess" :successData="successData" ref="paySuccess"></pay-success>
    <!-- 支付失败 -->
    <pay-error v-if="showError"></pay-error>
    <!-- 支付宝支付显示返回App查看 -->
    <backAppCheck v-if="showbackAppCheck" />
    <loading :mask="true" v-if="showLoading"></loading>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import PaySuccess from '../components/paySuccess'
import PayError from '../components/payError'
import backAppCheck from '../components/backAppCheck'
import Services from '@/services/payment'
import { newUtils, specialChannelJump } from '@/utils/utils'
import _get from 'lodash.get'
export default {
  name: 'paymentCallback',
  data: () => ({
    showSuccess: false,
    showError: false,
    showLoading: false,
    showbackAppCheck: false,
    successData: {}
  }),
  components: {
    PaySuccess,
    PayError,
    backAppCheck
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
      window.onpageshow = function () {
        if (newUtils.isIOS && event.persisted) {
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
      this.ORDER_NUMBER = localStorage.getItem('ORDER_NUMBER')
      this.showLoading = true
      /** 轮循 **/
      Services.getUserPayStatus({ value: this.ORDER_NUMBER }).then(res => {
        localStorage.removeItem('checkPlatOrderStatus')
        localStorage.removeItem('checkOrderStatus') // 游戏修改后删除
        let { code, data, payInfo } = res.data
        if (code === 200) {
          this.showLoading = false
          this.successData = Object.assign(payInfo,{
            cardMsg:data.cardMsg||''
          })
          this.showSuccess = true
        } else {
          this.showError = true
          this.showLoading = false
        }
      }).catch(error => {
        this.showLoading = false
        this.showError = true
      })
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
      localStorage.setItem('ORDER_NUMBER', data.orderNum)
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
            localStorage.setItem('isPlatform', true)
            that.$Toast('支付已取消!!')
          } else if (res.err_msg == 'get_brand_wcpay_request:fail') {
            that.$Toast('支付失败!!')
          } else {
            that.$Toast('缺少参数!!')
          }
          location.reload()
        }
      )
    },
    /** 京东支付 **/
    jdPay (data, orderNum) {
      localStorage.setItem('ORDER_NUMBER', orderNum)
      specialChannelJump('https://wap.beeplaying.com/xmWap/#/payment/jdpay?parmas=' + encodeURIComponent(JSON.stringify(data)), false)
    },
    /** 支付宝H5支付 **/
    H5AliPay (alias, orderNum, url, attach) {
      localStorage.removeItem('aliPayStatus')
      let agentCode = _get(attach, 'agentCode', '')
      if (agentCode == 'cibtnbnewzfbh5pay' || agentCode == 'pufazfbh5pay') {
        localStorage.setItem('ORDER_NUMBER', attach.mechartNo)
        this.$router.replace({ name: 'zfbMiddle', query: { url: data.token.code_url, alias } })
      } else {
        localStorage.setItem('ORDER_NUMBER', orderNum)
        this.$router.replace({ name: 'zfbMiddle', query: { url, alias, attach } })
      }
    },
    /** 微信H5支付 **/
    H5WechatPay (orderNum, url) {
      localStorage.removeItem('wechatPayStatus')
      localStorage.setItem('ORDER_NUMBER', orderNum)
      this.$router.replace({ name: 'wechatMiddle', query: { url } })
    },
    /** 微信App支付,并且是魅族渠道,吊起魅族原生支付 **/
    AppWechatPay (attach, orderNum) {
      if (window.android && window.android.wxPay) {
        localStorage.setItem('ORDER_NUMBER', orderNum)
        /** 转换参数变成字符串 **/
        let params = JSON.stringify(attach)
        /** 回调方法 **/
        window.wechatAppCallback = (code) => {
          this._getUserPayStatus()
        }
        window.android.wxPay(params, 'wechatAppCallback')
      } else {
        this.$Toast('android.wxPay undefined')
      }
    },
    /** 支付宝App支付,并且是魅族渠道,吊起魅族原生支付 **/
    APPAliPay (attach, orderNum) {
      localStorage.setItem('ORDER_NUMBER', orderNum)
      if (window.android && window.android.aliPay) {
        /** 转换参数变成字符串 **/
        let params = JSON.stringify(attach).replace(/:/g, '=').replace(/,/g, '&')
        /** 回调方法 **/
        window.aliAppCallback = (code) => {
          this._getUserPayStatus()
        }
        window.android.aliPay(params, 'aliAppCallback')
      } else {
        this.$Toast('android.aliPay undefined')
      }
    },
    /** 云闪付 **/
    Unionpay (attach, orderNum) {
      localStorage.setItem('ORDER_NUMBER', orderNum)
      let unionpay = document.getElementById('unionpay')
      if (unionpay) {
        unionpay.parentNode.removeNode(unionpay)
      }
      let oDiv = document.createElement('div')
      oDiv.id = 'unionpay'
      oDiv.innerHTML = attach
      document.body.appendChild(oDiv)
      document.all.pay_form.submit()
    },
    /** 其他h5支付 **/
    otherH5Pay (orderNum, url) {
      localStorage.setItem('ORDER_NUMBER', orderNum)
      if (url) {
        specialChannelJump(url, false)
      }
    },
    /** 扫码支付 **/
    ScanPay (orderNum, url) {
      window.localStorage.setItem('ORDER_NUMBER', orderNum)
      if (url) {
        url = encodeURIComponent(url)
        this.$router.push({
          name: 'scanpay',
          query: {
            img: url
          }
        })
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
      let _channel = localStorage['APP_CHANNEL']
      if (['100107'].includes(_channel)) {
        this.pcScanPay(orderNum, url)
      }
      else if (newUtils.isWechat() && (alias.includes('mayunwechat') || alias.includes('wechatgzh'))) {
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
        let channelArray = ['110002', '110002001', '110002002', ]
        channelArray.includes(_channel) ? this.H5WechatPay(orderNum, url) : this.ScanPay(orderNum, url)
      } else if (alias.indexOf('jdpay') > -1) {
        this.jdPay(data, orderNum)
      } else if (alias.includes('zfbh5') || alias.includes('aliH5')) {
        this.H5AliPay(alias, orderNum, url, attach)
      } else if (alias.includes('wxh5')) {
        this.H5WechatPay(orderNum, url)
      } else if (alias.includes('wechatApp')) {
        this.AppWechatPay(attach, orderNum)
      } else if (alias.includes('umszfbapp')) {
        this.APPAliPay(attach, orderNum)
      } else if (alias.includes('unionpay')) {
        this.Unionpay(attach, orderNum)
      } else if (alias.includes('hyuewxsm')) {
        this.ScanPay(orderNum, url)
      } else {
        this.otherH5Pay(orderNum, url)
      }
    },
    /** 头部返回 **/
    back () {
      if (this.showSuccess) {
        this.$refs.paySuccess.confirmClick()
      } else {
        let originUrl = localStorage.getItem('originDeffer')
        localStorage.removeItem('ORDER_NUMBER')
        localStorage.removeItem('originDeffer')
        if (originUrl) {
          specialChannelJump(originUrl)
        } else {
          this.$router.replace({ name: 'index' })
        }
      }

    },
    init () {
      let data = JSON.parse(localStorage.getItem('orderData'))
      /** 在支付宝内部显示返回App 查看**/
      if (newUtils.isAlipay()) {
        this.showbackAppCheck = true
      } else if (data) {
        /** 删除上个订单的数据 **/
        localStorage.removeItem('orderData')
        this.payJump(data)
      } else {
        this._getUserPayStatus()
        /** 支付方式抽免单 不需的时候删除 **/
        let ORDER_NUMBER = localStorage.getItem('ORDER_NUMBER')
        this._getFirstPayment(ORDER_NUMBER)
      }
      this.$marchSetsPoint('P_H5PT0057')
    }
  },
  created () {
    // 兼容ios 13
    let str = navigator.userAgent.toLowerCase()
    let ios = str.match(/cpu iphone os (.*?) like mac os/)
    if (ios && ios[1].split('_')[0] >= 13) {
      this.pageShow()
    } else {
      this.bindVisilityChange()
    }
    this.init()
  }
}
</script>

<style scoped lang="less">
.header {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
  padding: 0 38px;
  width: 100%;
  height: 94px;
  line-height: 94px;
  background: #f7f7f7;
  text-align: center;
  color: #252525;
  font-size: 36px;
  font-weight: bold;
  .back {
    float: left;
    font-size: 26px;
    color: #0f1726;
  }
}
</style>

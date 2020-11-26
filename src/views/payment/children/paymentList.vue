<template>
  <main class="payment-list-wrapper">
    <header class="header" v-if="$moduleConfig.plantVersion != 'red'&&$moduleConfig.isShowHeader">
      <div class="back iconfont icon-return" @click="back"></div>
      {{pageInfo.title}}
    </header>
    <div class="payment-list" :class="{ showHeader: $moduleConfig.isShowHeader }">
      <div class="title">
        {{ titleTips }}
      </div>
      <div class="order">
        <span>订单金额</span>
        <span>{{ Number(order.price).toFixed(2) }}元</span>
      </div>
      <div class="order order-detail" v-if="isShowOrderDetail">
        <span>订单详情</span>
        <span>{{order.name}}:{{ order.content }}</span>
      </div>
      <!-- 支付方式开始 -->
      <article class="pay-type">
        <section>
          <ul v-if="isLoad" class="list">
            <template v-for="(item, index) in payTypeList">
              <li :key="index" @click="listClick(item, index)" v-if="!(openSub&&item.balance)">
                <div class="item-title1" v-if="index == 0">支付方式</div>
                <!-- <div class="item-title1" v-if="index == 0">推荐使用</div> -->
                <!-- <div class="item-title" v-if="index == 1">更多支付方式</div> -->
                <div class="wrap">
                  <div class="icon">
                    <img v-if="item.wapImg" :src="item.wapImg | filter" alt="" />
                  </div>
                  <div class="content"
                    :class="{'no-border':item.value === '5' && payTypeIndex === index && false}">
                    <div class="text">
                      <!--labelImg 标签图 例如：加赠、首笔抽免单-->
                      <!--<img :src="item.labelImg|filter" alt v-if="item.labelImg">-->
                      <div class="pay-name pay_name">{{ item.name }}<span class="pay-label"
                          :class="{recommend:index==0&&!item.labelImg}"
                          v-if="getLabelName(item,index)">{{getLabelName(item,index)}}</span></div>
                      <div class="pay-description">{{ item.desc }}</div>
                    </div>
                    <!-- 好看余额不能支付状态 -->
                    <section v-if="(item.balance && item.isPay == false) || item.prohibit"
                      class="content__section">
                      <div class="content__div--disabled">暂不可用</div>
                    </section>
                    <div class="select" v-else :class="{'active': payTypeIndex===index}"></div>
                  </div>
                </div>
                <div class="other-desc"
                  v-if="item.value === '5' && payTypeIndex === index && false">
                  <a href="http://wap.beeplaying.com/xmWap#/payment/toSupportBankPage">查看支付说明></a>
                </div>
              </li>
            </template>
          </ul>
        </section>
        <section class="balance-wrapper"
          v-if="openSub && balanceData && balanceData.isPay && (payTypeIndex===null || !forbidSubType.includes(`,${payTypeList[payTypeIndex].value},`))"
          @click="toggleBalance()">
          <div class="name">
            <div class="pay-name">{{ balanceData.name.replace(/支付/,'抵扣') }}</div>
          </div>
          <div class="status">
            <div class="pay-description">{{ balanceText() }}</div>
            <div class="select" :class="{'active': balanceSelected}">
            </div>
          </div>
        </section>
      </article>
      <!-- 支付方式结束 -->
      <!-- 优惠券开始 -->
      <article class="coupons">
        <div class="btn no-coupons" v-if="usedCouponNum >= 6">
          <div class="left">优惠券</div>
          <div class="right">
            <span class="num">每天最多可使用6张优惠券</span>
            <span class="icon iconfont icon-next"></span>
          </div>
        </div>
        <div class="btn" @click="openCoupons" v-else-if="isShowCoupons">
          <div class="left">优惠券</div>
          <div class="right">
            <span class="used" v-if="spareMoney">{{ spareMoney }}</span>
            <span class="num" v-else-if="couponsCountNum">{{ couponsCountNum }}张可用</span>
            <span class="num" v-else>无可用优惠券</span>
            <span class="icon iconfont icon-next"></span>
          </div>
        </div>
        <modal v-model="showCouponsModal" :title="couponsDialogConfig.title"
          :closeButtonShow="couponsDialogConfig.closeButtonShow"
          :saveText="couponsDialogConfig.saveText" @on-save="useCoupons" @on-close="closeCoupon">
          <div>
            <ul class="coupons-list">
              <li :class="{'non-use':item.isAccess!==1}" v-for="(item, index) in couponsList"
                :key="index" @click="couponsClick(item, index)">
                <div>
                  <p class="name"><span>{{ item.name }}</span><i v-if="item.isAccess!==1">不可用</i>
                  </p>
                  <p class="coupons-desc">
                    <span>
                      有效期至{{ item.endTime|timeFilter }}
                    </span><br>
                    <span v-if="item.isAccess !== 1">
                      {{item.msg?item.msg:'订单金额不支持此优惠'}}
                    </span>
                  </p>
                </div>
                <span class="icon" v-if="item.isAccess === 1"
                  :class="{ active: couponsIndex === index }"></span>
              </li>
            </ul>
            <p class="no-use"><span @click="notUse()" v-if="couponsCountNum">暂不使用优惠券</span><span
                class="red-text" v-else>当前暂无可用优惠券</span></p>
          </div>
        </modal>
      </article>
      <!-- 优惠券结束 -->
      <!-- loading -->
      <loading :mask="true" v-if="showLoading" />
    </div>
    <div class="payment-btn">
      <div class="payment-money">
        还需支付<span>￥{{ payPrice }}</span>
      </div>
      <div class="btn disable" v-if="preventSubmit">
        <span>{{ pageInfo.button }}</span>
      </div>
      <div class="btn" @click="setPayData()" v-else>
        <span>{{ pageInfo.button }}</span>
      </div>
    </div>
    <!-- <n-u-tips v-if="order.bizType === 230"></n-u-tips> -->
    <div class="tips-tag" v-if="isH5Order && userInfo.catOwnCat">
      <div class="text-content">
        支付成功后可获得
        <p>({{Math.floor(order.price-(usedCoupon.amountPreferential||0))*10}}x鱼干加成)g鱼干</p>
      </div>
      <div class="icon"></div>
    </div>
    <!-- 抽免单活动 不需的时候删除 -->
    <gratis @hideordertip="hideordertip" />
    <!-- 支付限额 -->
    <PayLimit :limitInfo="payLimit" />
    <!-- 余额变动 -->
    <Modal v-model="showBalanceChange" title="温馨提示" :type="2" close-text="重新选择" save-text="立即支付"
      @on-save="submitPay" @on-close="reselect">
      <div class="balance-change">
        检测到您的余额有变动，<br />是否继续支付
      </div>
    </Modal>
    <!-- 实名认证通道 -->
    <Modal v-model="isShowAuthenticationTips" title="温馨提示" save-text="实名认证通道"
      @on-save="goToAuthenticate">
      <div class="balance-change authenticationTips">
        亲爱的玩家<br />按照《网络游戏管理暂行办法》的有关要求及您的个人权益保障，请尽快完成实名认证
      </div>
      <div class="authenticationTipsInfo" slot="other" @click="isShowAuthenticationTips=false">
        暂不实名认证</div>
    </Modal>
    <!-- 未成年限额 -->
    <Modal v-model="minorsPopType" :type="2" title="温馨提示" :close-button-show="false" save-text="知道了"
      @on-save="back('minors')">
      <div class="close_content">
        <p class="content-text" style="margin-top:0;text-align:left">
          <template v-if="minorsPopType===1">
            根据防沉迷规定，您单笔充值金额不得<br />超过{{payLimit.noAdultSingleLimit}}元，请重新选择商品。
          </template>
          <template v-else-if="minorsPopType===2">
            您本月累计充值已达{{payLimit.noAdultMonthLimit}}元，根据防沉<br />迷规定，您本月不可再进行充值行为。
          </template>
          <template v-else-if="minorsPopType===3">
            根据防沉迷规定，您每月充值累计不得<br />超过{{payLimit.noAdultMonthLimit}}元，现已充值{{payLimit.userMonthRecharge}}元，最多还<br />可充值{{Math.floor((payLimit.noAdultMonthLimit-payLimit.userMonthRecharge)*10)/10}}元，请重新选择商品。
          </template>
        </p>
      </div>
    </Modal>
    <coupon-stay-window ref="couponStayWindow" :from="2" :bizType="order.bizType||order.productType"
      :gameId="order.gameId" :originMoney="order.price" :receiveId="usedCoupon.id" />
  </main>
</template>

<script>
import { mapState } from 'vuex'
import PayLimit from '../components/payLimit'
import Gratis from '../components/gratis'
import couponStayWindow from '@/components/coupon/couponStayWindow.vue'
// import NUTips from '../components/newUserGift/tips'
import { localStorage, getUrlParams, newUtils, goLogin } from '@/utils/utils'
import Services from '@/services/payment'
import _get from 'lodash.get'
import base64url from 'base64-url'
export default {
  name: 'paymentList',
  data: () => ({
    /** loading **/
    showLoading: false,
    /** 用户充值限额 **/
    payLimit: {},
    /** 商品信息数据 **/
    // productInfo: [],
    hideOrderTips: false,
    // 显示tips '* 支付成功100%中大奖！'
    scratchStatus: false,

    /** 支付方式相关参数开始 **/
    // 支付方式列表
    payTypeList: [],
    // 选择支付方式的数据
    usedPayType: {},
    isLoad: false,
    payTypeIndex: 0,
    balanceData: {},
    // 是否支持组合支付
    openSub: false,
    forbidSubType: '',
    // 组合支付余额选择状态
    balanceSelected: false,
    showBalanceChange: false,
    newBalance: '',
    /** 支付方式相关参数结束 **/

    /** 优惠券相关参数开始 **/
    // 优惠券列表
    couponsList: [],
    // 当天使用过几张优惠券
    usedCouponNum: 0,
    // 选择的优惠券的index
    couponsIndex: 0,
    // 是否打开优惠券列表
    showCouponsModal: false,
    // 使用的优惠卷信息
    usedCoupon: {},
    /** 优惠券相关参数结束 **/
    // H5游戏订单
    isH5Order: false,
    //优化实名认证逻辑，未认证用户每日首次进入收银台时，改用弹窗提示，弹窗可关闭；展腾飞
    isShowAuthenticationTips: false,
    minorsPopType: 0, // 0:关闭 1:单笔超过日限额 2:超过月限额 3:单笔超过月限额

    hrefUrl: location.href,//当前location.href
  }),
  components: {
    Gratis,
    PayLimit,
    couponStayWindow
    // NUTips
  },
  computed: {
    ...mapState(['userInfo']),
    pageInfo () {
      if (localStorage.get('APP_CHANNEL') == '100100') {
        return {
          title: '确认下单',
          button: '确认下单'
        }
      }
      else {
        return {
          title: '支付',
          button: '立即支付'
        }
      }
    },
    order () {
      let info = localStorage.get('payment')
      /** 订单信息 **/
      if (this.isH5Order) {
        delete info.pf
        delete info.gurl
      }
      return info
    },
    isShowOrderDetail () {
      let arr = [233, 113, 106, 256, 251, 120]
      let type = this.order.bizType || this.order.productType
      type && (type = Number(type))
      if (arr.includes(type) && this.order.content) {
        return true
      }
      return false
    },
    /** 实际需要支付金额 **/
    payPrice () {
      let payPrice = this.order.price - (this.usedPayType.balancePrice || 0)
      if (this.usedCoupon && this.usedCoupon.amountPreferential) {
        payPrice = payPrice - this.usedCoupon.amountPreferential > 0 ? payPrice - this.usedCoupon.amountPreferential : 0
      }
      if (payPrice <= 0) {
        payPrice = 0
      }
      return payPrice.toFixed(2)
    },
    /** 头部提示文字 **/
    titleTips () {
      if (this.payLimit && this.payLimit.adult == 0) {
        return '* 为保护未成年人身心健康，请健康游戏。'
      }
      if (
        this.payLimit &&
        this.payLimit.adult == 1 &&
        this.payLimit.max == 1 &&
        this.payLimit.warnType == 'USER'
      ) {
        return '* 今日付费金额较多，请适度消费，健康游戏。'
      }
      if (this.scratchStatus) {
        return '* 支付成功100%中大奖！'
      }
      return ''
    },
    /** 当日充值达到最高限额, 或者用户是未成年阻止下单支付 **/
    preventSubmit () {
      return (
        this.payTypeList.length === 0 ||
        (this.payLimit &&
          this.payLimit.max == 1 &&
          this.payLimit.warnType == 'USER')
      )
    },
    isWifikeyCoreApp () {
      const ua = navigator.userAgent.toLowerCase()
      return /swan-wifikeycore/g.test(ua)
    },
    isWifikeyMiniApp () {
      const ua = navigator.userAgent.toLowerCase()
      return /swan-wifikey/g.test(ua)
    },
    /** 支付方式相关变量 开始 **/
    balanceNumber () {
      let min = 0
      try {
        min = this.balanceData.attr.udl > this.balanceData.balanceNum ? this.balanceData.balanceNum : this.balanceData.attr.udl
        min = min > this.order.price - Number(this.usedCoupon.amountPreferential || 0) ? this.order.price - Number(this.usedCoupon.amountPreferential || 0) : min
        return min.toFixed(2)
      } catch (error) {
        return 0
      }
    },
    /** 支付方式相关变量 结束 **/
    /** 优惠券相关变量 开始 **/
    isShowCoupons () {
      return !this.forbidSubType.includes(`,${this.usedPayType.value},`) && (this.couponsCountNum || this.canNotUsedCouponsCountNum) && this.usedPayType.value != '15'
    },
    // 计算优惠券张数
    couponsCountNum () {
      let isAccess =
        this.couponsList &&
        this.couponsList.filter(item => {
          return item.isAccess === 1
        }).length
      return isAccess || 0
    },
    // 计算优惠券张数
    canNotUsedCouponsCountNum () {
      let isAccess =
        this.couponsList &&
        this.couponsList.filter(item => {
          return item.isAccess === 2
        }).length
      return isAccess || 0
    },
    // 计算节约了多少钱
    spareMoney () {
      if (this.usedCoupon && this.usedCoupon.amountPreferential) {
        return `-￥${this.usedCoupon.amountPreferential.toFixed(2)}`
      } else {
        return false
      }
    },

    // 优惠券弹框配置
    couponsDialogConfig () {
      return {
        title: '优惠券',
        closeButtonShow: false,
        saveText: this.couponsCountNum ? '确认选择' : '返回'
      }
    },
    /** 优惠券相关变量 结束 **/
  },
  filters: {
    timeFilter (value) {
      return value.split(':').join(':').replace(/-/g, '.')
    }
  },
  methods: {
    /** 获取支付方式, 优惠券列表 **/
    _getInitPay () {
      /** 商品价钱没有不发起支付请求 **/
      if (!this.order.price) return false
      this.showLoading = true
      Services.getInitPay(this.order.price, `${this.order.bizType ? `&bizType=${this.order.bizType}` : this.order.productType ? `&bizType=${this.order.productType}` : ''}${this.order.gameId ? `${this.order.gameId === 28 ? '' : '&from=h5game'}&gameId=${this.order.gameId}` : ''}`)
        .then(async res => {
          let code = _get(res, 'data.code', 0)
          if (code === 101) {
            let message = _get(res, 'data.message', '')
            this.$Toast(message)
            return
          }
          /** 是否支持组合支付 **/
          this.openSub = _get(res, 'data.data.isOpenSub', false)
          this.forbidSubType = _get(res, 'data.data.forbidSubType', '')
          /** 支付方式列表, 处理余额支付数据 **/
          this.payTypeList = _get(res, 'data.data.paytypes', [])
          await this._getBalance()
          /** 优惠券列表 **/
          this.couponsList = _get(res, 'data.data.coupons', [])
          /** 当天使用过几张优惠券 **/
          this.usedCouponNum = _get(res, 'data.data.usedCouponNum', 0)
          this.defaultCoupons()
          /** 充值限额 **/
          this.payLimit = _get(res, 'data.data.limitInfo', {})
          this.showLoading = false
        })
        .catch(error => {
          this.showLoading = false
        })
    },
    /** 获取用户是否实名认证 **/
    _getAuthentication (params) {
      return Services.isAuthentication(params).then(res => {
        let { code, data } = _get(res, 'data', '')
        let { popUpNonAge, authRemind, isConfigChannel, countDownTime } = _get(res, 'data.data', {})
        let isAuthentication = 0
        if (code === 200) {
          isAuthentication = authRemind// authRemind 0=不弹出  1=弱引导（就是可关闭的弹窗） 2=强引导（直接跳转到实名认证页面的方式）
        }
        return isAuthentication
      })
    },
    async setPayData (uid) {
      let _payType = _get(this.usedPayType, 'value', 0)
      if (!_payType) {
        this.$Toast('请选择一个支付方式')
        return
      }
      this.payData = {
        /** 支付方式 **/
        payType: _payType,
        source: 1,
        /** 商品id **/
        value: _get(this.order, 'bizId', ''),
        /** 优惠券 **/
        coupon: _get(this.usedCoupon, 'id', ''),
        recepit: uid || '',
        bizType: _get(this.order, 'bizType', ''),
      }

      let _channel = localStorage.getString('APP_CHANNEL')

      if (_payType == "38" && !uid) {
        this.$AppCall.getUserId()
        window.app_getUserId_callback = (uid) => {
          // this.payData.recepit = uid; 
          this.setPayData(uid)
        }
        return
      }

      if (_get(this.order, 'thirdOrderId', '')) {
        this.payData['thirdSn'] = _get(this.order, 'thirdOrderId', '')
      }
      /** wifi支付 **/
      if (this.payData.payType === '35') {
        this.payData.recepit = this.isWifikeyCoreApp ? 'A0008' : this.isWifikeyMiniApp ? 'A0016' : ''
      }
      if (this.openSub) {
        let isBalance = _get(this.usedPayType, 'balance', false)
        let _payTypeSub = _get(this.usedPayType, 'balanceType', 0)
        if (!isBalance && _payTypeSub) {
          this.payData['payTypeSub'] = _payTypeSub
        }
        if (_payTypeSub) {
          try {
            this.showLoading = true
            const res = await Services.getBalance(_payTypeSub)
            this.showLoading = false
            let { code, data } = _get(res, 'data', 0)
            if (data < this.balanceData.balanceNum && data < this.balanceNumber) {
              if (data == 0 && this.payData.payTypeSub) {
                delete this.payData.payTypeSub
              }
              this.newBalance = data
              this.showBalanceChange = true
              return
            }
          } catch (error) {
            this.showLoading = false
          }
        }
      }
      if (this.order.gameId) this.payData.gameId = this.order.gameId
      if (this.isH5Order) {
        this.payData = { ...this.payData, ...this.order }
        delete this.payData.value
      }
      this.submitPay()
    },
    reselect () {
      location.reload()
    },
    /** 支付 支付 支付 支付 **/
    async submitPay () {
      /** 若用户是未成年的逻辑 **/
      if (!this.payLimit.adult) {
        if (this.order.price > this.payLimit.noAdultSingleLimit) {
          this.minorsPopType = 1 // 1:单笔超过日限额
          return
        }
        if (this.payLimit.userMonthRecharge >= this.payLimit.noAdultMonthLimit) {
          this.minorsPopType = 2 // 2:超过月限额
          return
        }
        if (this.order.price > this.payLimit.noAdultMonthLimit - this.payLimit.userMonthRecharge) {
          this.minorsPopType = 3 // 3:单笔超过月限额
          return
        }
        this.minorsPopType = 0 // 0:关闭
      }
      /** 用户下单金额超出当前支付限额不允许下单 **/
      if (this.payPrice && (this.usedPayType.limitMax || this.usedPayType.limitMin)) {
        if (
          this.usedPayType.limitMax != 0 &&
          this.payPrice > this.usedPayType.limitMax
        ) {
          this.$Toast(
            `订单金额大于${this.usedPayType.limitMax}元，请更换支付方式`
          )
          return false
        }
        if (
          this.usedPayType.limitMin != 0 &&
          this.payPrice < this.usedPayType.limitMin
        ) {
          this.$Toast(
            `订单金额不足${this.usedPayType.limitMin}元，请更换支付方式`
          )
          return false
        }
      }
      /** 用户没有实名认证不允许支付并且跳转到实名认证页面 **/
      let isAuthentication = await this._getAuthentication()
      if (isAuthentication) {//0=不弹出  1=弱引导（就是可关闭的弹窗） 2=强引导（直接跳转到实名认证页面的方式）
        let tipsData = JSON.parse(window.localStorage.getItem('authenticationTips'))
        if (isAuthentication == 1) {
          if (tipsData && tipsData.show === true) {
            this.isShowAuthenticationTips = true
            return false
          } else {
            this.isShowAuthenticationTips = false
          }
        } else {
          this.$router.push({ name: 'authentication' })
          return false
        }
      }
      /** 余额不足，或者限额，或者是余额支付 -->终止请求 **/
      if (!this.usedPayType.isPay && this.usedPayType.balance) {
        this.$Toast(this.usedPayType.desc)
        return false
      }
      /** 汇款转帐 **/
      if (this.payData.payType === '14') {
        this.$router.push({
          name: 'transferMiddle',
          query: {
            payData: JSON.stringify(this.payData),
            price: this.order.price
          }
        })
        return
      }
      this.showLoading = true
      Services[this.isH5Order ? 'newSdkOrder' : 'submitPay'](this.payData)
        .then(res => {
          this.showLoading = false
          let usedPayType = _get(this.usedPayType, 'value', '')
          let { code, data, message } = res.data
          if (code === 200) {
            this.$marchSetsPoint('A_H5PT0056000517')
            let _channel = localStorage.getString('APP_CHANNEL')
            if (_channel == 100099) {
              this.$AppCall.eventOrderWay()
            }
            if (usedPayType == 35) {
              localStorage.set('ORDER_NUMBER', data.orderNum)
              wifikey.pay({
                orderInfo: {
                  tpOrderId: data.attach.tpOrderId
                },
                success: res => {
                  this.showLoading = false
                  this.$router.replace({ name: 'paymentCallback' })
                },
                fail: msg => {
                  this.showLoading = false
                  this.$router.replace({ name: 'paymentCallback' })
                }
              })
            }
            else if (usedPayType == 38) {
              localStorage.set('ORDER_NUMBER', data.orderNum)
              this.$AppCall.openPayByOrder(JSON.stringify(data.attach))
              window.app_payment_callback = (result) => {
                this.$router.replace({ name: 'paymentCallback' })
              }
            }
            else {
              //35是WIFI渠道支付
              /** 余额支付 || 金叶子支付 **/
              if (this.usedPayType.balance || this.payData.payType.toString() === '15') {
                localStorage.set('ORDER_NUMBER', data.orderNum)
              }
              else if (data.alias.includes('chepiaobao')) {
                localStorage.set('ORDER_NUMBER', data.orderNum)
                parent.wx.miniProgram.navigateTo({
                  url: `/pages/checkoutCounter/checkoutCounter?orderNo=${data.attach}`
                })
                return
              }
              else {
                localStorage.set('orderData', data)
              }
              this.$router.replace({ name: 'paymentCallback' })
            }
          } else {
            this.$Toast(message)
          }
        })
        .catch(error => {
          this.showLoading = false
        })
    },
    /** 头部返回 **/
    back (type) {
      let isBack = getUrlParams('isBack')
      if (type === 'minors') {
        this.minorsPopType = 0
      }
      if (isBack === 'true') {
        history.go(-1)
      } else {
        this.$router.replace({ name: 'payment' })
      }
    },
    /** 获取商品数据 **/
    // _getProductInfo () {
    //   if (!this.order.bizId) {
    //     return false
    //   }
    //   Services.getProductInfo(this.order.bizId).then(res => {
    //     let { code, data } = res.data
    //     if (code == 200) {
    //       this.productInfo = data.contents
    //     }
    //   })
    // },
    hideordertip (flag) {
      this.hideOrderTips = flag
    },
    _getValidatePaySend () {
      Services.getGratis({ value: '' }).then(res => {
        let { code, data } = res.data
        if (code == 200 && data && data.type == 'sendCoupon') {
          this.scratchStatus = true
        }
      })
    },
    init () {
      let urlInfo = getUrlParams('pay_data') && decodeURIComponent(getUrlParams('pay_data')) && JSON.parse(decodeURIComponent(getUrlParams('pay_data')))
      let storageInfo = localStorage.get('payment')
      if (urlInfo || storageInfo.gameId) {
        if (urlInfo.gameId) {
          localStorage.set('payment', urlInfo)
          let gurl = urlInfo.gurl.includes('//') ? urlInfo.gurl : base64url.decode(urlInfo.gurl)
          let originDeffer = `${gurl}${gurl.includes('?') ? '&' : '?'}token=${localStorage.getString('OPEN_ACCESS_TOKEN')}&channel=${localStorage.getString('APP_CHANNEL')}&pf=${urlInfo.pf}&gurl=${urlInfo.gurl}&gameType=${urlInfo.gameId}`
          localStorage.set('originDeffer', originDeffer)
        }
        if (urlInfo.gameId !== 28 && storageInfo.gameId !== 28) {
          this.isH5Order = true
        }
      }
      // this._getProductInfo()
      this._getInitPay()
      this._getValidatePaySend()
    },
    /* 支付方式相关方法 开始 */

    /** 获取当前用户余额 **/
    async _getBalance () {
      this.balanceData = this.payTypeList.find((item, index) => {
        if (item.balance) {
          item.index = index
          return item
        }
      }) || {}
      /** 获取余额 **/
      if (this.balanceData && this.balanceData.value) {
        let res = {}
        try {
          res = await Services.getBalance(this.balanceData.value)
        } catch (error) {
          console.log('getBalance:', error.message)
        }
        let data = _get(res, 'data.data', 0)
        /** 获取余额数量，余额简介 **/
        this.balanceData.balanceNum = data
        this.balanceText()
        /** 把余额支付的位置放在最后 **/
        if (this.balanceData && (this.balanceData.index || !this.balanceData.isPay || !this.balanceData.index && this.openSub)) {
          this.payTypeList.splice(this.balanceData.index, 1)
          this.payTypeList.push(this.balanceData)
        }
      }
      this.filterOffLine()
      this.$marchSetsPoint('P_H5PT0056', {
        recharge_rmb: this.order.price,
        pay_type: _get(this.payTypeList, ['0', 'value'], 0),
        product_id: this.order.bizId,
        marketing_id: _get(this.couponsList, ['0', 'id'], 0),
        channel_balance: _get(this.balanceData, 'balanceNum', 0)
      })
    },
    // 展示已下线的支付方式
    filterOffLine () {
      // 禁用
      let prohibit = []
      // 正常使用
      let unProhibit = []
      for (let res of this.payTypeList) {
        if (res.prohibit) {
          // res.desc = '维护中，请使用其他支付方式支付'
          prohibit.push(res)
        } else {
          unProhibit.push(res)
        }
      }
      this.payTypeList = [...unProhibit, ...prohibit]
      this.isLoad = true
      this.setPayType(this.payTypeList[0])
    },
    // 余额显示文本 以及 是否支持余额
    balanceText () {
      let text = ''
      if (this.balanceData.attr && this.balanceData.attr.usable) {
        if (this.openSub && this.balanceData.balanceNum > 0 && this.balanceData.attr.udl > 0) {
          this.balanceData.isPay = true
          text = `可用${this.balanceNumber}元余额抵用${this.balanceNumber}元`
        } else if (this.balanceData.attr.udl < this.order.price) {
          this.balanceData.isPay = false
          text = `今日剩余支付限额 ${this.balanceData.attr.udl} 元,不足以支付当前订单`
        }
        else if (this.balanceData.balanceNum < this.order.price) {
          this.balanceData.isPay = false
          text = `可用余额 ${this.balanceData.balanceNum} 元,不足以支付当前订单`
        } else {
          this.balanceData.isPay = true
          text = `当前余额${this.balanceData.balanceNum}元`
        }
      } else {
        this.balanceData.isPay = false
        text = '当前支付方式无法使用'
      }
      this.balanceData.desc = text
      return text
    },
    listClick (item, index) {
      /** 好看余额不能支付的时候不能点击 **/
      if (item.balance && item.isPay == false || item.prohibit) {
        return
      }
      this.payTypeIndex = index
      if (this.forbidSubType.includes(`,${item.value},`) || this.payPrice <= 0) {
        this.balanceSelected = false
      }
      this.setPayType()
    },
    setPayType (usePayType) {
      if (!usePayType) {
        usePayType = this.payTypeList[this.payTypeIndex]
      }
      let couponPrice = _get(this.usedCoupon, 'amountPreferential', 0)
      let balancePrice = Number(this.balanceNumber) || 0
      if (this.balanceSelected && (this.order.price - (couponPrice + balancePrice) <= 0)) {
        this.payTypeIndex = null
        usePayType = this.balanceData
      }
      if (this.balanceSelected) {
        usePayType = { ...usePayType, balanceType: this.balanceData.value, balancePrice: this.balanceNumber }
      } else {
        usePayType = { ...usePayType, balanceType: 0, balancePrice: 0 }
      }
      this.usedPayType = usePayType
    },
    toggleBalance () {
      this.balanceSelected = !this.balanceSelected
      if (this.payTypeList[this.payTypeIndex] && this.forbidSubType.includes(`,${this.payTypeList[this.payTypeIndex].value},`)) {
        this.payTypeIndex = null
      }
      this.setPayType()
    },
    /* 支付方式相关方法 结束 */

    /* 优惠券相关方法 开始 */
    /** 打开优惠券 **/
    openCoupons () {
      this.showCouponsModal = true
      setTimeout(() => {
        newUtils.ScrollMove()
      }, 30)
      this.$marchSetsPoint('A_H5PT0056000516')
    },
    /** 假如用户有优惠券默认使用第一个可以使用的优惠券 **/
    defaultCoupons () {
      if (this.couponsList.length && this.usedCouponNum < 6) {
        let defaultUsed = this.couponsList.filter(item => {
          return item.isAccess === 1
        })
        if (defaultUsed.length) {
          /** 告诉父级默认的优惠券 **/
          this.usedCoupon = defaultUsed[0]
          this.useCoupons(defaultUsed[0])
        }
      }
    },
    /** 选择优惠券 **/
    couponsClick (item, index) {
      if (item.isAccess === 1) {
        this.couponsIndex = index
      }
    },
    /** 确认使用优惠券 **/
    useCoupons (value) {
      /** 告诉父级使用了优惠卷 **/
      this.usedCoupon = value ? value : this.couponsList[this.couponsIndex]
      if (this.balanceSelected) {
        this.setPayType()
      }
      this.showCouponsModal = false
    },
    closeCoupon () {
      if (!this.usedCoupon.id) this.couponsIndex = null
    },
    /** 不使用优惠券 **/
    notUse () {
      this.usedCoupon = {
        name: '不用使用优惠券',
        isAccess: 1,
        id: '',
        amountPreferential: 0
      }
      this.couponsIndex = null
      this.showCouponsModal = false
    },
    /* 优惠券相关方法 结束 */
    /** 获得支付方式标签 **/
    getLabelName (item, index) {
      if ((item.balance && item.isPay == false) || item.prohibit) {
        return ''
      } else {
        if (index == 0) {
          return item.labelImg || '推荐使用'
        } else {
          return item.labelImg || ''
        }
      }
    },
    goToAuthenticate () {
      this.isShowAuthenticationTips = false
      this.$router.push({ name: 'authentication' })
    }
  },
  created () {

    let APP_CHANNEL = window.localStorage['APP_CHANNEL']
    //检查是否能支付
    this.showLoading = true
    Services.paypreCheck().then(data => {
      this.showLoading = false
      if (_get(data, 'data.code', 0) == 101) {
        //提示要绑定手机号，就跳转到登录页
        goLogin(true)
      }
      else {
        /** 今天12点时间搓 **/
        let resetTime = new Date(new Date().toLocaleDateString()).getTime()
        /** 查看储存状态 **/
        let tipsData = JSON.parse(window.localStorage.getItem('authenticationTips'))
        /** 本地没有缓存或者本地缓存时间搓不对，重新记录数据 **/
        if (!tipsData || tipsData.resetTime !== resetTime) {
          window.localStorage.setItem('authenticationTips', JSON.stringify({ resetTime, show: true }))
        } else {
          window.localStorage.setItem('authenticationTips', JSON.stringify({ resetTime, show: false }))
        }
        this.init()
      }
    })
  },
  beforeDestroy () {
    let tipsData = JSON.parse(window.localStorage.getItem('authenticationTips'))
    if (tipsData && tipsData.show === true) {
      window.localStorage.removeItem('authenticationTips')
    }
  },
  watch: {
    isShowCoupons (newValue) {
      if (newValue) {
        this.defaultCoupons()
      } else {
        this.useCoupons({
          name: '不用使用优惠券',
          isAccess: 1,
          id: '',
          amountPreferential: 0
        })
      }
    },
    isShowAuthenticationTips (val) {
      if (!val) {
        /** 今天12点时间搓 **/
        let resetTime = new Date(new Date().toLocaleDateString()).getTime()
        /** 查看储存状态 **/
        let tipsData = JSON.parse(window.localStorage.getItem('authenticationTips'))
        /** 本地没有缓存或者本地缓存时间搓不对，重新记录数据 **/
        if (!tipsData || tipsData.resetTime !== resetTime) {
          window.localStorage.setItem('authenticationTips', JSON.stringify({ resetTime, show: true }))
        } else {
          window.localStorage.setItem('authenticationTips', JSON.stringify({ resetTime, show: false }))
        }
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === "paymentCallback") {
      next()
    } else {
      this.$refs.couponStayWindow.init(next, this.hrefUrl)
    }
  }
}
</script>

<style scoped lang="less">
@import url('./less/paymentList.less');
</style>

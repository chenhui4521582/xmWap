<template>
  <div class="pay-success"
    :class="{'has-n-u-tips':order.bizType === 230&&$moduleConfig.isShowHeader}">
    <n-u-tips :type="1" v-if="order.bizType===230"></n-u-tips>
    <div v-if="dividedata&&dividedata.open" class="pnl_bonus">
      * 您获得免费瓜分奖池的机会<a :href="dividedata.url">立即参与>></a>
    </div>
    <div class="pay-center">
      <div class="title">
        <span class="icon"></span>
        <span>支付成功</span>
      </div>
      <div class="card-tips" v-if="successData.cardMsg">{{successData.cardMsg}}</div>
      <div class="pay-money" :class="{showCardTips:successData.cardMsg}">
        支付金额：
        <span>￥{{successData.price.toFixed(2)}}</span>
      </div>
      <div class="pay-message">
        <div class="type">
          <div class="key">付款方式</div>
          <ul class="value">
            <li>
              <span>{{successData.payName}}</span>
              <em> ¥{{successData.payMoney.toFixed(2)}}</em>
            </li>
            <li v-if="balancePrice>0">
              <span>{{successData.isSub?'余额支付':'随机立减'}}</span>
              <em> ¥{{balancePrice.toFixed(2)}}</em>
            </li>
          </ul>
        </div>
        <div class="coupons" v-if="successData.discount">
          <div class="key">优惠</div>
          <div class="value">
            <em>-￥{{successData.discount.toFixed(2)}}</em>
          </div>
        </div>
      </div>
    </div>
    <!-- 刮刮卡 -->
    <div id="scratchCard" class="scratch-card"
      v-if="openGratis || firstPayment.show || isShowResetPay||isShowGiveLeaf">
      <vue-scratch-card :element-id="'scratchCard'" :ratio="0.1" :move-radius="50"
        :cover-img="coverImg" :start-callback="handleScratch" :clear-callback="ScratchEnd"
        :class="{'active': isScratch}">
        <div class="card-center" slot="result">
          <!-- type 32 = 优惠券 -->
          <div class="coupons-content" v-if="awards.type == 32">
            <img :src="awards.image | filter" class="yhj-pic" @click="goUse" />
          </div>
          <!-- type 1 = 金叶子 -->
          <div class="award-content" v-else-if="awards.type == 1">
            <img src="../img/leaf.png" class="pic-leaf" />
            <p class="award-name">
              恭喜您获得
              <span>{{awards.awardNum}}金叶子</span>
            </p>
            <div class="award-text">奖励已发送至您的账户</div>
          </div>
          <!-- type 10 = 话费券碎片 -->
          <div class="award-content" v-else-if="awards.type == 10">
            <img src="../img/hf-quan.png" class="pic-yhj" />
            <p class="award-name">
              恭喜您获得
              <span>{{awards.awardNum * 0.1}}元话费券碎片</span>
            </p>
            <div class="award-text">奖励已发送至您的账户</div>
          </div>
          <div class="no-award" v-else>
            <img src="../img/no-scratch-bg.png" alt />
          </div>
        </div>
      </vue-scratch-card>
    </div>
    <!-- banner -->
    <slider v-if="showBanner" :list="list" />
    <!-- 抽奖券抽奖提示 -->
    <p v-if="isDraw" class="coupon-tips">抽奖券已到账，<span class="draw" @click="$router.push(
      {
        name: 'onePay'
      }
    )">立即抽奖</span><span class="arrow">></span></p>
    <p class="red-text" v-if="isH5Order && userInfo.catOwnCat">
      *
      ({{Math.floor(successData.price - (successData.discount||0)) * 10}}x鱼干加成)g鱼干已收入囊中，可致招财猫进行查看。<br>
      鱼干发放有些许延迟，请耐心等待3~5分钟。
    </p>
    <!-- 刮刮卡弹出框 -->
    <Modal v-model="showModal" :title="modalConfig.title" :type="2" :saveText="modalConfig.saveText"
      :closeText="modalConfig.closeText" @on-save="confirm" @on-close="cancel">
      <div class="wrapper" v-html="modalConfig.text">
      </div>
    </Modal>
    <div class="success-btn" @click="confirmClick">完成</div>
    <!-- 夺宝礼包 -->
    <card-lottery ref="cardLottery" @againpay="openPopUp" />
    <new-user-coupon v-if="isNewUser" />
  </div>
</template>

<script>

import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import { specialChannelJump } from '@/utils/utils'
import ScratchCard from 'vue-scratch-card0'
import Service from '@/services/payment'
import ActivityService from '@/services/activity'
import _get from 'lodash.get'
import NUTips from './newUserGift/tips'
import $axios from '@/services/http/http'
import CardLottery from '@/components/popup/treasureGift1908'
import newUserCoupon from '@/components/coupon/newUserCoupon.vue'
import slider from './slider'
Vue.use(ScratchCard)
export default {
  name: 'paySuccess',
  props: {
    successData: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    isDraw: false,
    dividedata: null,
    /** 刮刮卡数据 **/
    awards: {
      image: '',
      type: '',
      awardNum: ''
    },
    /** 是否刮卡 **/
    isScratch: false,
    /** 是否显示弹出框 **/
    showModal: false,
    /** 弹出框配置 **/
    modalConfig: {
      title: '抽免单提示',
      closeButtonShow: false,
      saveText: '去抽奖',
      closeText: '返回',
      text: '真的不刮了吗？'
    },
    /** 重新支付刮刮卡开关 **/
    isShowResetPay: false,
    list: [],
    showCardTips: false
  }),
  computed: {
    ...mapState(['openGratis', 'firstPayment', 'userInfo']),//scratchText
    coverImg () {
      if (this.isShowResetPay) {//重新支付抽免单
        return require('../img/firstpayment.png')
      } else if (this.isShowGiveLeaf) {//笔笔送金叶
        return require('../img/bibileaf.png')
      } else if (this.firstPayment.show) {//支付送优惠券
        return require('../img/firstpayment.png')
      } else if (this.openGratis == 'firstOrder') {//首笔支付抽免单
        return require('../img/gratis-bg.png')
      } else {
        return require('../img/scratch-bg.png')
      }
    },
    order () {
      let data = localStorage.getItem('payment')
      if (!data) {
        return {}
      }
      return JSON.parse(data)
    },
    balancePrice () {
      return Math.floor((Math.floor((this.successData.price - this.successData.payMoney) * 100) / 100 - this.successData.discount) * 100) / 100
    },
    /** 笔笔送叶子刮刮卡开关 **/
    isShowGiveLeaf () {
      return this.openGratis == 'wheel'
    },
    showBanner () {
      return this.list.length
    },
    isH5Order () {
      return this.order && this.order.gameId && this.order.gameId !== 28
    },
    isNewUser () {
      if (localStorage.getItem('user_Info')) {
        let userInfo = JSON.parse(localStorage.getItem('user_Info'))
        if (userInfo.createTime) {
          // 一天的毫秒数
          let oneDay = 86400000
          // 注册天数
          let signInDay = (new Date().setMilliseconds(0) - userInfo.createTime) / oneDay
          // 当前时间减去创建时间
          if (signInDay - 8 <= 0) {
            return true
          }
        }
      }
      return false
    }
  },
  components: {
    NUTips,
    CardLottery,
    slider,
    newUserCoupon
  },
  methods: {
    // 是否有抽奖机会
    async getDraw () {
      const { data: { data } } = await ActivityService.getOneLottery()
      this.isDraw = data.bettingTimes
    },
    /** 抽免单 不需的时候删除 **/
    ...mapActions({
      _getGratis: 'GET_GRATIS'
    }),
    handleScratch () {
      if (this.isShowResetPay) {
        this._getResetPay()
      } else if (this.isShowGiveLeaf) {
        this._getGiveLeaf()
      }
      else if (this.firstPayment && this.firstPayment.show) {
        this._getfirstPayment()
      } else {
        this._getScratchCard()
      }
    },
    /** 获取重新支付是否有抽奖机会 **/
    _isShowScratchCard () {
      let orderNumber = localStorage.getItem('ORDER_NUMBER')
      if (!orderNumber) {
        return false
      }
      Service.isShowScratchCard(orderNumber).then(res => {
        let { code, data, message } = _get(res, 'data')
        if (code == 200) {
          this.isShowResetPay = data
        }
      })
    },
    /** 获取重新支付抽免单 **/
    _getResetPay () {
      let orderNumber = localStorage.getItem('ORDER_NUMBER')
      if (!orderNumber) {
        return false
      }
      Service.getResetPay(orderNumber).then(res => {
        if (res.data.code == 200) {
          this.awards.image = _get(res, 'data.data.image', '')
          this.awards.awardNum = _get(res, 'data.data.awardNum', '')
          this.awards.type = _get(res, 'data.data.type', '')
          this.isScratch = true
        }
      })
    },
    /** 获取支付方式抽免单 **/
    _getfirstPayment () {
      let value = localStorage.getItem('ORDER_NUMBER') || localStorage.getItem('NEW_ORDER_NUMBER')
      Service.getfirstPaymentSend({ value }).then(res => {
        let { code, data, message } = res.data
        if (code == 200) {
          this.awards = data
          this.isScratch = true
        }
      })
    },
    /** 获取刮刮卡数据 **/
    _getScratchCard () {
      let orderNumber = localStorage.getItem('ORDER_NUMBER')
      if (!orderNumber) {
        return false
      }
      Service.getScratchCard({ orderSn: orderNumber }).then(res => {
        if (res.data.code == 200) {
          this.awards.image = _get(res, 'data.data.image', '')
          this.awards.awardNum = _get(res, 'data.data.awardNum', '')
          this.awards.type = _get(res, 'data.data.type', '')
          this._getGratis(orderNumber)
          this.isScratch = true
        }
      })
      this.$marchSetsPoint('A_H5PT0057000518')
    },
    /** 刮完之后 **/
    ScratchEnd () {
      this.isScratch = true
    },
    /** 完成按钮跳转跳转 **/
    confirmJump () {
      let originUrl = localStorage.getItem('originDeffer')
      localStorage.removeItem('ORDER_NUMBER')
      localStorage.removeItem('originDeffer')
      if (originUrl) {
        specialChannelJump(originUrl)
      } else {
        this.$router.replace({ name: 'index' })
      }
    },
    /** 放弃刮卡 **/
    cancel () {
      this.showModal = false
      this.confirmJump()
      this.$marchSetsPoint('A_H5PT0057000521')
    },
    /** 去刮卡 **/
    confirm () {
      this.showModal = false
      this.$marchSetsPoint('A_H5PT0057000520')
    },
    /** 完成支付 **/
    confirmClick () {
      /** 抽免单 不需的时候删除 **/
      if ((this.firstPayment.show || this.openGratis || this.isShowResetPay) && !this.isScratch) {
        this.showModal = true
        if (this.isShowResetPay) {
          this.modalConfig.text = '您还没有抽免单，返回后将不再有入口， 确定不抽了吗？'
        } else if (this.isShowGiveLeaf) {
          this.modalConfig.title = '温馨提示'
          this.modalConfig.closeText = '确定放弃'
          this.modalConfig.text = '退出后将不再有抽奖入口了<br>确定放弃抽奖机会吗？'
        } else {
          this.modalConfig.text = '您还没有抽免单，返回后将不再有入口， 确定不抽了吗？'
        }
      } else {
        this.confirmJump()
      }
      // /** 没有刮卡,弹出挽留 **/
      // if (!this.isScratch) {
      //   this.showModal = true
      // }
    },
    /** 刮刮卡刮出优惠券  点击优惠卷去使用按钮 **/
    goUse () {
      this.$marchSetsPoint('A_H5PT0057000519')
      this.$router.push({ name: 'payment' })
    },
    /** 首页限时礼包活动 特殊代码 活动下线删除  **/
    limitCard () {
      if (this.successData && this.successData.type === 118) {
        localStorage.setItem('limitCardPayStatus', JSON.stringify(this.successData))
      }
    },
    openPopUp () {
      this.$refs.cardLottery.init()
    },
    /** 笔笔送金叶活动 特殊代码 活动下线删除  **/
    _getGiveLeaf () {
      let orderNumber = localStorage.getItem('ORDER_NUMBER')
      if (!orderNumber) {
        return false
      }
      Service.getRechargeGift(orderNumber).then(res => {
        if (res.data.code == 200) {
          this.awards.image = _get(res, 'data.data.image', '')
          this.awards.awardNum = _get(res, 'data.data.awardAmount', '')
          this.awards.type = _get(res, 'data.data.type', '')
          this._getGratis(orderNumber)
          this.isScratch = true
        }
      })
    },
    /** 获取banner图 **/
    _getPaymentBannerList () {
      Service.getPaySlider().then(res => {
        this.list = _get(res, 'data.data', []) || []
      })
    },
  },
  async mounted () {
    /** 限时礼包 不需的时候删除 **/
    this.limitCard()
    /** 抽免单 不需的时候删除 **/
    let orderNumber = localStorage.getItem('ORDER_NUMBER')
    this._getGratis(orderNumber)
    this.getDraw()
    let { data: data } = await $axios.post('//ops-api.beeplaying.com/ops/api/activity/divide-state')
    if (data.code == 200) {
      this.dividedata = data.data
    }
    /** 重新支付 **/
    this._isShowScratchCard()
    //banner
    this._getPaymentBannerList()
  },
  watch: {
    successData (newValue) {
      this.limitCard()
    }
  }
}
</script>

<style scoped lang="less">
.pay-success {
  min-height: 100vh;
  background: #f7f7f7;
  padding: 146px 24px 0;

  .pnl_bonus,
  .pnl_bonus a {
    & a {
      text-decoration: underline;
    }
    font-size: 24px;
    font-weight: 400;
    line-height: 36px;
    color: #ff4141;
    margin: 16px 0 28px;
  }

  &.has-n-u-tips {
    padding: 94px 24px 0;
  }
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32px;
    font-weight: bold;
    line-break: 1.1;
    color: #000;
    .icon {
      margin-right: 13px;
      width: 30px;
      height: 30px;
      background: url('../img/select.png') no-repeat center center;
      background-size: 100% 100%;
    }
  }
  .pay-money {
    text-align: center;
    color: #252525;
    font-weight: bold;
    font-size: 28px;
    &:not(.showCardTips) {
      margin-top: 24px;
    }
    span {
      color: #e94b41;
    }
  }
  .pay-message {
    margin-top: 40px;
    padding: 30px 20px;
    background: #fff;
    border-radius: 16px;
    .type {
      display: flex;
      justify-content: space-between;
      .value {
        min-width: 200px;
        li {
          display: flex;
          align-items: center;
          justify-content: space-between;
          line-height: 36px;
          span {
            color: #000;
          }
        }
      }
    }
    .coupons {
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .key {
      font-size: 24px;
      color: #888;
    }
    .value {
      font-size: 24px;
      color: #ff4141;
    }
  }
  .scratch-card {
    margin-top: 20px;
    height: 310px;
    padding: 24px 0;
    background: #fff;
    border-radius: 16px;
    .card-center {
      width: 100%;
      height: 100%;
      background: url('../img/success-bg.png') no-repeat center center;
      background-size: 100% 100%;
      overflow: hidden;
      .coupons-content {
        width: 100%;
        height: 100%;
        padding: 20px 25px;
      }
      .yhj-pic {
        vertical-align: top;
        width: 100%;
        height: 100%;
      }
      .pic-leaf {
        display: block;
        margin: 40px auto 22px;
        width: 93px;
        height: 73px;
      }
      .pic-yhj {
        display: block;
        margin: 43px auto 16px;
        width: 168px;
        height: 80px;
      }
      .award-name {
        margin-bottom: 10px;
        color: #1b1f2c;
        font-size: 28px;
        font-weight: bold;
        text-align: center;
        span {
          color: #e43f3f;
        }
      }
      .award-text {
        width: 100%;
        color: #a1a9c4;
        font-size: 22px;
        font-weight: bold;
        text-align: center;
      }
      .no-award {
        width: 100%;
        height: 100%;
        img {
          vertical-align: top;
          width: 100%;
          height: 100%;
        }
      }
      &.active {
        z-index: 3;
      }
    }
  }
  .success-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 90px;
    line-height: 90px;
    text-align: center;
    background-color: #ff4141;
    font-size: 24px;
    color: #ffffff;
  }
  .card-tips {
    text-align: center;
    margin: 12px 0;
    font-size: 28px;
    font-weight: bold;
    color: #FF4141;
  }
}
.wrapper {
  text-align: center;
  padding: 20px;
  color: #888888;
  font-size: 24px;
}
</style>

<!-- 外部刮刮卡组件隐藏默认图片-->
<style lang="less">
.scratch-card {
  position: relative;
  .scratchCard {
    height: 100%;
    &.active {
      .result {
        z-index: 3;
      }
    }
    .pic {
      display: none;
    }
    canvas {
      width: 100%;
      height: 100%;
    }
  }
}
</style>

<style lang="less" scoped>
.coupon-tips {
  text-align: center;
  font-size: 24px;
  color: #888;
  padding-top: 162px;
  .draw {
    color: #ff7800;
    border-bottom: 1px solid #ff7800;
  }
  .arrow {
    color: #ff7800;
    font-weight: bold;
  }
}
.red-text {
  color: #ff4141;
  font-size: 24px;
  margin-top: 14px;
  margin-left: 6px;
}
</style>

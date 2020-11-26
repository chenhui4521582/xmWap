<template>
  <div class="pay-success">
    <div class="pay-center">
      <!--<g-p-tips type="success"></g-p-tips>-->
      <div class="pay-title">
        <img src="../images/checked-red-icon.png" alt="">
        <span>支付成功</span>
      </div>
      <div class="card-tips" v-if="successData.cardMsg">{{successData.cardMsg}}</div>
      <div class="pay-money showCardTips">
        <span>支付金额：</span>
        <em>{{(successData.price).toFixed(2)}}<span>元</span></em>
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
              <em>
                ¥{{balancePrice.toFixed(2)}}</em>
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
      <!-- 刮刮卡 -->
      <div id="scratchCard" class="scratch-card"
        v-if="openGratis || firstPayment.show || isShowResetPay||isShowGiveLeaf">
        <vue-scratch-card :element-id="'scratchCard'" :ratio="0.1" :move-radius="50"
          :cover-img="coverImg" :start-callback="handleScratch" :clear-callback="scratchEnd"
          :class="{'active': isScratch}">
          <div class="card-center" slot="result">
            <!-- type 32 = 优惠券 -->
            <div class="coupons-content" v-if="awards.type == 32">
              <img :src="awards.image | filter" class="yhj-pic" @click="goUse" />
            </div>
            <!-- type 1 = 金叶子 -->
            <div class="award-content" v-else-if="awards.type == 1">
              <img src="../images/leaf.png" class="pic-leaf" />
              <p class="award-name">
                恭喜您获得
                <span>{{awards.awardNum}}金叶子</span>
              </p>
              <div class="award-text">奖励已发送至您的账户</div>
            </div>
            <!-- type 10 = 话费券碎片 -->
            <div class="award-content" v-else-if="awards.type == 10">
              <img src="../images/hf-quan.png" class="pic-yhj" />
              <p class="award-name">
                恭喜您获得
                <span>{{awards.awardNum * 0.1}}元话费券碎片</span>
              </p>
              <div class="award-text">奖励已发送至您的账户</div>
            </div>
            <div class="no-award" v-else-if="isScratch">
              <img src="../images/no-scratch-bg.png" alt />
            </div>
          </div>
        </vue-scratch-card>
      </div>
      <!-- banner -->
      <template v-if="useLandscape">
        <slider
          v-if="!(openGratis || firstPayment.show || isShowResetPay||isShowGiveLeaf)&&showBanner"
          :list="list" />
      </template>
      <template v-else>
        <slider v-if="showBanner" :list="list" />
      </template>
      <!-- 抽奖券抽奖提示 -->
      <p v-if="isDraw" class="coupon-tips">抽奖券已到账，<span class="draw"
          @click="toDraw">立即抽奖</span><span class="arrow">></span></p>
    </div>
    <div class="success-btn" @click="confirmClick(0)">返回游戏</div>
    <!-- 刮刮卡弹出框 -->
    <Modal v-model="showModal" :title="modalConfig.title" :type="2" :saveText="modalConfig.saveText"
      :closeText="modalConfig.closeText" @on-save="confirm" @on-close="cancel">
      <div class="wrapper" v-html="modalConfig.text">
      </div>
    </Modal>
    <!-- 夺宝礼包 -->
    <card-lottery></card-lottery>
    <new-user-coupon type="gamePayment" v-if="isNewUser" />
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import ScratchCard from 'vue-scratch-card0'
import Service from '@/services/payment'
import ActivityService from '@/services/activity'
import _get from 'lodash.get'
import GPTips from './tips'
import CardLottery from './cardLottery'
import slider from '../../landScape/components/slider'
import newUserCoupon from '@/components/coupon/newUserCoupon.vue'
Vue.use(ScratchCard)
export default {
  name: 'GPSuccess',
  props: {
    successData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      isDraw: false,
      bonusdata: null,
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
        saveText: '去刮',
        closeText: '不了',
        text: '真的不刮了吗？'
      },
      /** 重新支付刮刮卡开关 **/
      isShowResetPay: false,
      fromBackCallBack: null,//来自头部返回调用
      list: []
    }
  },
  computed: {
    ...mapState(['openGratis', 'firstPayment']),
    coverImg () {
      if (this.isShowResetPay) {//重新支付抽免单
        return require('../images/firstpayment.png')
      } else if (this.isShowGiveLeaf) {//笔笔送金叶
        return require('../images/bibileaf.png')
      } else if (this.firstPayment.show) {//支付送优惠券
        return require('../images/firstpayment.png')
      } else if (this.openGratis == 'firstOrder') {//首笔支付抽免单
        return require('../images/gratis-bg.png')
      } else {
        return require('../images/scratch-bg.png')
      }
    },
    order () {
      let order = localStorage.getItem('JDD_PARAM')
      if (order) {
        return JSON.parse(order)
      }
      return {}
    },
    balancePrice () {
      return this.successData.price - this.successData.payMoney - this.successData.discount
    },
    /** 笔笔送叶子刮刮卡开关 **/
    isShowGiveLeaf () {
      return this.openGratis == 'wheel'
    },
    showBanner () {
      return this.list.length
    },
    useLandscape () {
      return parent.SDK && parent.SDK.getUseLandscape()
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
  components: { GPTips, CardLottery, slider, newUserCoupon },
  methods: {
    // 是否有抽奖机会
    async getDraw () {
      const { data: { data } } = await ActivityService.getOneLottery()
      this.isDraw = data.bettingTimes
    },
    // 去抽奖
    toDraw () {
      const channel = window.localStorage.getItem('APP_CHANNEL')
      const token = window.localStorage.getItem('ACCESS_TOKEN')
      if (parent.SDK.getUseLandscape()) {
        parent.location.href = `https://wap.beeplaying.com/xmWap/#/mall/onePay?channel=${channel}&token=${token}`
      } else {
        parent.GameEval('openweb', `https://wap.beeplaying.com/xmWap/#/mall/onePay?channel=${channel}&token=${token}`)
      }
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
      let value = window.localStorage.getItem('ORDER_NUMBER')
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
    scratchEnd () {
      this.isScratch = true
    },
    /** 完成按钮跳转跳转 **/
    confirmJump () {
      let originUrl = localStorage.getItem('originDeffer')
      localStorage.removeItem('ORDER_NUMBER')
      localStorage.removeItem('originDeffer')
      if (parent.GameEval) {
        parent.GameEval('closeweb')
      } else if (originUrl) {
        parent.location.replace(originUrl)
      } else {
        this.$router.replace({ name: 'index' })
      }
    },
    /** 放弃刮卡 **/
    cancel () {
      this.showModal = false
      if (!this.fromBackCallBack) {
        this.confirmJump()
      } else {
        (this.fromBackCallBack)()
      }
      this.$marchSetsPoint('A_H5PT0057000521')
    },
    /** 去刮卡 **/
    confirm () {
      this.showModal = false
      this.$marchSetsPoint('A_H5PT0057000520')
    },
    /** 完成支付 **/
    confirmClick (fromBackCallBack) {
      this.fromBackCallBack = fromBackCallBack
      /** 抽免单 不需的时候删除 **/
      if ((this.firstPayment.show || this.openGratis || this.isShowResetPay) && !this.isScratch) {
        if (this.isShowResetPay) {
          this.modalConfig.text = '您还没有抽免单，返回后将不再有入口， 确定不抽了吗？'
        } else if (this.isShowGiveLeaf) {
          this.modalConfig.title = '温馨提示'
          this.modalConfig.closeText = '确定放弃'
          this.modalConfig.saveText = '去抽奖'
          this.modalConfig.text = '退出后将不再有抽奖入口了<br>确定放弃抽奖机会吗？'
        } else {
          this.modalConfig.text = '您还没有抽免单，返回后将不再有入口， 确定不抽了吗？'
        }
        this.showModal = true
      } else {
        if (!this.fromBackCallBack) {
          this.confirmJump()
        } else {
          (this.fromBackCallBack)()
        }
      }
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
    this.$marchSetsPoint('P_H5PT0098', {
      from_project_id: parent.SDK.getGameType(),
      recharge_rmb: this.order.price,
      edition: localStorage.getItem('gameMallStatus'),
      recharge_status: 'success'
    })
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
  height: 100%;
  overflow: hidden;
  position: relative;
  .pay-center {
    position: absolute;
    left: 0;
    right: 0;
    top: 78px;
    bottom: 90px;
    padding: 0 24px;
    overflow-x: hidden;
    overflow-y: auto;
    color: #fff;
    font-weight: bold;
  }
  .pay-title {
    display: flex;
    align-items: center;
    font-size: 0;
    justify-content: center;
    margin-bottom: 18px;
    img {
      width: 30px;
      height: 30px;
      margin-right: 9px;
    }
    span {
      font-size: 24px;
      line-height: 30px;
    }
  }
  .pay-money {
    text-align: center;
    font-size: 22px;
    margin-bottom: 20px;
    em {
      font-size: 24px;
      color: #ffea02;
      span {
        font-size: 22px;
      }
    }
  }

  .pay-message {
    padding: 15px;
    background: #005da8;
    border-radius: 10px;
    max-width: 600px;
    margin: 0 auto 20px;
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
            color: #fff;
          }
        }
      }
    }
    .coupons {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 2px solid rgba(0, 124, 226, 0.5);
      line-height: 24px;
      padding-top: 15px;
      margin-top: 12px;
    }
    .key {
      font-size: 22px;
      color: #90ccff;
    }
    .value {
      font-size: 22px;
      color: #ffea02;
    }
  }
  .scratch-card {
    width: 600px;
    height: 240px;
    border-radius: 16px;
    margin: 0 auto 20px;
    .card-center {
      width: 100%;
      height: 100%;
      background: url('../images/success-bg.png') no-repeat center center;
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
        margin: 20px auto 16px;
        width: 93px;
        height: 73px;
      }
      .pic-yhj {
        display: block;
        margin: 35px auto 5px;
        width: 168px;
        height: 80px;
      }
      .award-name {
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
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    height: 80px;
    line-height: 80px;
    text-align: center;
    background-color: #007ce2;
    font-size: 24px;
    font-weight: bold;
    color: #fff;
    border-radius: 0 0 32px 32px;
  }
  .card-tips {
    text-align: center;
    margin: 12px 0;
    font-size: 28px;
    font-weight: bold;
    color: #FFEA02;
  }
  .wrapper {
    text-align: center;
    padding: 20px;
    color: #888888;
    font-size: 24px;
  }
}
.mall-banner {
  width: 600px !important;
  margin: auto;
}
@media screen and (orientation: portrait) {
  /*竖屏 css*/
  .pay-success {
    .pay-title {
      margin-top: 27px;
    }
  }
}
</style>

<style lang="less" scoped>
.coupon-tips {
  text-align: center;
  font-size: 20px;
  color: #fff;
  padding-top: 24px;
  .draw {
    color: #e3d002;
    border-bottom: 1px solid #e3d002;
  }
  .arrow {
    color: #e3d002;
    font-weight: bold;
  }
}
</style>

<!-- 外部刮刮卡组件隐藏默认图片-->
<style scoped>
.scratch-card >>> .scratchCard {
  width: 100%;
  height: 100%;
}
.scratch-card >>> .scratchCard.active .result {
  z-index: 3;
}
.scratch-card >>> .scratchCard .pic {
  display: none;
}
.scratch-card >>> .scratchCard canvas {
  width: 100%;
  height: 100%;
}
</style>

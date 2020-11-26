<template>
  <section class="one-lottery-banner" v-if="showPic">
    <div class="img-wrap">
      <img v-if="clearFerrule && picType === 1" src="../img/oneLotteryBanner/before.png" alt="" @click="toOnePayIndex">
      <img v-if="!clearFerrule && picType === 1" src="../img/oneLotteryBanner/before-2.png" alt="" @click="toOnePayIndex">
      <img v-if="picType === 2" src="../img/oneLotteryBanner/after.png" alt="" @click="toOnePayIndex">
    </div>
    <one-lottery ref="oneLottery"></one-lottery>
  </section>
</template>

<script>
import OneLottery from '@/components/popup/oneLottery'
import Services from '@/services/activity'
import _get from 'lodash.get'
import { bottomBarJump } from '@/utils/utils'
export default {
  name: '',
  components: {
    OneLottery
  },
  data () {
    return {
      showPic: false,
      picType: 1,
      giftInfo: {}
    }
  },
  mounted () {
    this._getOneLottery()
  },
  computed: {
    curChannel () {
      return localStorage.getItem('APP_CHANNEL') ? localStorage.getItem('APP_CHANNEL') : this.getUrlParam('channel')
    },

    // src/components/popup/oneLottery.vue 还有一处
    clearFerrule () {
      return true
      // 以下为百度系套圈图标屏蔽
      // return (
      //   this.curChannel != '100039' &&
      //   this.curChannel != '100073' &&
      //   this.curChannel != '100039001' &&
      //   this.curChannel != '100042' &&
      //   this.curChannel != '100047' &&
      //   this.curChannel != '100048'
      // )
    },
  },
  methods: {
    /** 获取一元夺宝数据 **/
    _getOneLottery () {
      Services.getOneLottery().then(res => {
        let { code } = _get(res, 'data', '')
        if (code === 200) {
          let { bettingTimes, newUserFeedbackList, isNew } = _get(res, 'data.data', null)
          if (newUserFeedbackList[0] && newUserFeedbackList[0].buyStatus === 0 || isNew) {
            this.showPic = true
            this.picType = 1
            this.giftInfo = newUserFeedbackList[0]
          } else if ((newUserFeedbackList[0] && newUserFeedbackList[0].buyStatus === 1 || !isNew) && bettingTimes > 0) {
            this.showPic = true
            this.picType = 2
          } else {
            this.showPic = false
          }
        } else {
          this.showPic = false
        }
      })
    },

    /** 去支付 **/
    buySubmit () {
      localStorage.setItem('payment', JSON.stringify(this.giftInfo))
      localStorage.setItem('originDeffer', window.location.href)
      bottomBarJump('#/payment/paymentlist', 'paymentList', this.$router)
    },
    // 原本是去支付，现在跳转落地页
    toOnePayIndex () {
      this.$router.push({
        name:'onePay'
      })
    },
    goToTurn () {
      this.$refs.oneLottery.init()
    }
  }
}
</script>

<style lang="less" scoped>
.one-lottery-banner {
  margin-top: 20px;
  .img-wrap {
    font-size: 0;
    img {
      width: 100%;
    }
  }
}
</style>

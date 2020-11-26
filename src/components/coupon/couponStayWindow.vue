<template>
  <article class="coupon-stay-window">
    <sdk-popup v-if="type" :isSDK="false" v-model="isShowPop" title="温馨提示" :center-scroll="true"
      :confirm-text="confirmText" :cancel-text="cancelText" @on-confirm="confirm"
      @on-cancel="cancel">
      <div class="content-wrapper game-payment" v-html="contentText">
      </div>
    </sdk-popup>
    <Modal v-else v-model="isShowPop" title="温馨提示" :type="2" :closeText="cancelText"
      :centerScroll=true :saveText="confirmText" @on-save="confirm" @on-close="cancel">
      <div class="content-wrapper" v-html="contentText">
      </div>
    </Modal>
  </article>
</template>

<script>
import Services from '@/services/payment.js'
import _get from 'lodash.get'
export default {
  name: '',
  components: {

  },
  props: {
    type: {
      type: String,
      default: ''
    },
    // 1、商城，2、收银台
    from: {
      type: Number,
      default: 0
    },
    // 业务类型
    bizType: {
      type: Number,
      default: 0
    },
    // 游戏Id
    gameId: {
      type: Number,
      default: 0
    },

    // 总金额（收银台传）
    originMoney: {
      type: Number,
      default: 0
    },

    // 领用Id
    receiveId: {
      type: Number,
      default: 0
    },

  },
  data () {
    return {
      isShowPop: false,
      cancelText: "残忍离开",
      couponInfo: null,
      contentText: ""
    }
  },
  computed: {
    todayTime () {
      return new Date(new Date().toLocaleDateString()).getTime()
    },
    cacheTime () {
      return localStorage.getItem('coupon-stay-window-popup') ? Number(localStorage.getItem('coupon-stay-window-popup')) : 0
    },
    confirmText () {
      if (this.from === 2) {
        return "继续支付"
      }
      return "继续看看"
    }
  },
  mounted () {
  },
  methods: {
    async init (callback, url) {
      if (callback) {
        this.cancel = callback
      } else {
        this.cancel = (() => { this.$emit("callback") })
      }
      if (!this.type) {
        history.pushState({}, "", url)
      }
      if (this.cacheTime && this.cacheTime === this.todayTime) {
        this.cancel()
      } else {
        let params = {
          "bizType": this.bizType || 0,
          "from": this.from || 0,
          "gameId": this.gameId || 0,
          "originMoney": this.originMoney || 0,
          "receiveId": this.receiveId || 0
        }
        const res = await Services.couponStayWindow(params)
        const code = _get(res, 'data.code', 0)
        if (code === 200) {
          this.couponInfo = _get(res, 'data.data', null)
          if (this.couponInfo) {
            this.contentText = this.from === 1 ? `您当前有一张<span>${this.couponInfo.title}</span>优惠券即将过期，现在离开可能会错失使用机会哦` : this.from === 2 ? `此订单正在使用优惠券，下单立省<span>${this.couponInfo.discountMoney}元</span>，现在离开可能错失优惠券使用时机哦。` : ''
            this.$nextTick(() => {
              this.showPop(url)
            })
            return
          }
        }
        this.cancel()
      }
    },
    showPop (url) {
      this.isShowPop = true
      localStorage.setItem('coupon-stay-window-popup', this.todayTime)
      let pointArr = []
      if (this.type) {
        pointArr = ["A_H5PT0058004439", "A_H5PT0056004442"]
      } else {
        pointArr = ["A_H5PT0023004435", "A_H5PT0097004444"]
      }
      this.$marchSetsPoint(pointArr[this.from - 1])
    },
    cancel () { },
    confirm () {
      this.isShowPop = false
      let pointArr = []
      if (this.type) {
        pointArr = ["A_H5PT0023004436", "A_H5PT0056004443"]
      } else {
        pointArr = ["A_H5PT0058004440", "A_H5PT0097004445"]
      }
      this.$marchSetsPoint(pointArr[this.from - 1])
    }
  }
}
</script>

<style lang="less" scoped>
.coupon-stay-window {
  .content-wrapper {
    font-size: 24px;
    /deep/ span {
      color: #ff7800;
    }
    &.game-payment {
      padding: 16px 50px;
      font-size: 22px;
      color: #fff;
      /deep/ span {
        color: #ff7069;
      }
    }
  }
}
</style>

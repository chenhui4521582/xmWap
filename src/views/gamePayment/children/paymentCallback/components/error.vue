<template>
  <div class="pay-error">
    <div class="main-content">
      <g-p-tips type="error"></g-p-tips>
      <div class="icon">
        <img src="../images/error-icon.png" alt="">
      </div>
      <div class="pay-status">
        支付失败
      </div>
      <div v-if="firstPayment.message" class="firstPaymentTips">{{firstPayment.message}}抽免单限时开启<br>
        确定放弃难得的机会吗</div>
    </div>
    <div class="error-btn">
      <div class="reset-btn" @click="cancelPay">
        返回游戏
      </div>
      <div class="abandon-btn" @click="resetPay">
        重新支付
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { localStorage } from '@/utils/utils'
import GPTips from './tips'
export default {
  name: 'GPError',
  components: { GPTips },
  data () {
    return {
      bonusdata: {}
    }
  },
  computed: {
    ...mapState(['firstPayment']),
    order () {
      return localStorage.get('JDD_PARAM')
    }
  },
  async mounted () {
    this.$marchSetsPoint('P_H5PT0098', {
      from_project_id: parent.SDK.getGameType(),
      recharge_rmb: this.order.price,
      edition: localStorage.getString('gameMallStatus'),
      recharge_status: 'failed'
    })
  },
  methods: {
    /** 放弃按钮跳转跳转 **/
    cancelPay () {
      this.$marchSetsPoint('A_H5PT0098000769', {
        from_project_id: parent.SDK.getGameType(),
        recharge_rmb: this.order.price
      })
      let originUrl = localStorage.getString('originDeffer')
      localStorage.remove('ORDER_NUMBER')
      localStorage.remove('originDeffer')
      if (parent.GameEval) {
        parent.GameEval('closeweb')
      } else if (originUrl) {
        parent.location.replace(originUrl)
      } else {
        history.go(-1)
      }
    },
    /** 重新支付跳转跳转 **/
    resetPay () {
      this.$marchSetsPoint('A_H5PT0098000768', {
        from_project_id: parent.SDK.getGameType(),
        recharge_rmb: this.order.price,
        edition: localStorage.getString('gameMallStatus')
      })
      this.$router.replace({ name: 'GPList' })
    }
  }
}
</script>

<style scoped lang="less">
.pay-error {
  height: 100%;
  overflow: hidden;
  position: relative;
  .main-content {
    position: absolute;
    left: 0;
    right: 0;
    top: 96px;
    bottom: 90px;
    padding: 0 24px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .icon {
    text-align: center;
    font-size: 0;
    img {
      width: 150px;
      height: 150px;
    }
  }
  .pay-status {
    margin-top: 24px;
    font-size: 24px;
    color: #fff;
    text-align: center;
    font-weight: bold;
  }
  .tips {
    min-height: 30px;
    text-align: center;
    font-size: 26px;
    color: #ff4141;
  }
  .firstPaymentTips {
    margin-top: 10px;
    text-align: center;
    font-size: 24px;
    color: #fff;
    line-height: 35px;
  }
  .error-btn {
    position: absolute;
    left: 0;
    bottom: 10px;
    width: 100%;
    display: flex;
    justify-content: center;
    height: 80px;
    line-height: 80px;
    font-size: 24px;
    border-radius: 0 0 32px 32px;
    overflow: hidden;
    font-weight: bold;
    .reset-btn {
      width: 50%;
      text-align: center;
      color: #fff;
      background-color: #007ce2;
      overflow: hidden;
    }
    .abandon-btn {
      width: 50%;
      text-align: center;
      background: #ffe900;
      color: #633402;
    }
  }
}

@media screen and (orientation: portrait) {
  /*竖屏 css*/
  .pay-error {
    .icon {
      margin-top: 174px;
    }
  }
}
@media screen and (orientation: landscape) {
  /*横屏 css*/
  .pay-error {
    .icon {
      margin-top: 72px;
    }
  }
}
</style>

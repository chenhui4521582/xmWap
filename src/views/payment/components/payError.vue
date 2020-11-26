<template>
  <div class="pay-error">
    <!-- 抽免单活动 不需的时候删除 -->
    <gratis />
    <div class="icon">
      <img src="../img/error-icon.png" alt="">
    </div>
    <div class="pay-status">
      支付失败
    </div>
    <div v-if="dividedata&&dividedata.open" class="pnl_bonus">
      * 奖池瓜分活动已开启，支付成功即有机会瓜分千元大奖！
    </div>
    <template v-else-if="firstPayment.show">
      <div v-if="firstPayment.message" class="firstPaymentTips">
        {{firstPayment.message}}抽免单限时开启<br> 确定放弃难得的机会吗</div>
      <div class="tips" v-else>支付成功100%中大奖！</div>
    </template>
    <n-u-tips :type="2" v-if="order.bizType===230"></n-u-tips>
    <div class="error-btn">
      <template v-if="order.gurl">
        <div class="abandon-btn" @click="cancelPay">
          返回游戏
        </div>
      </template>
      <template v-else>
        <div class="reset-btn" @click="cancelPay">
          放弃支付
        </div>
        <div class="abandon-btn" @click="resetPay">
          重新支付
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Gratis from './gratis'
import NUTips from './newUserGift/tips'
import $axios from '@/services/http/http'
import { specialChannelJump } from '@/utils/utils'

export default {
  name: 'payError',
  components: {
    Gratis,
    NUTips
  },
  data () {
    return {
      dividedata: {}
    }
  },
  computed: {
    ...mapState(['firstPayment']),
    order () {
      let data = localStorage.getItem('payment')
      if (!data) {
        return {}
      }
      return JSON.parse(data)
    }
  },
  async mounted () {
    let { data: data } = await $axios.post('//ops-api.beeplaying.com/ops/api/activity/divide-state')
    if (data.code == 200) {
      this.dividedata = data.data
    }
  },
  methods: {
    /** 放弃按钮跳转跳转 **/
    cancelPay () {
      this.$marchSetsPoint('A_H5PT0057000523')
      let originUrl = localStorage.getItem('originDeffer')
      if (originUrl) {
        specialChannelJump(originUrl)
      } else {
        this.$router.replace({ name: 'index' })
      }
    },
    /** 重新支付跳转跳转 **/
    resetPay () {
      this.$marchSetsPoint('A_H5PT0057000522')
      this.$router.replace({ name: 'paymentList' })
    }
  }
}
</script>

<style scoped lang="less">
.pay-error {
  min-height: 100vh;
  background: #f7f7f7;
  padding: 100px 24px 0;

  .pnl_bonus,
  .pnl_bonus a {
    & a {
      text-decoration: underline;
    }
    text-align: center;
    font-size: 24px;
    font-weight: 400;
    line-height: 36px;
    color: #ff4141;
    margin: 16px 0 28px;
  }
  .firstPaymentTips {
    margin-top: 10px;
    text-align: center;
    font-size: 24px;
    color: #ff4141;
    line-height: 35px;
  }
  .icon {
    padding-top: 76px;
    text-align: center;
    img {
      vertical-align: top;
      width: 150px;
      height: 150px;
    }
  }
  .pay-status {
    margin-top: 41px;
    font-size: 32px;
    color: #000;
    text-align: center;
    font-weight: bold;
  }
  .tips {
    margin-top: 10px;
    text-align: center;
    font-size: 26px;
    color: #ff4141;
  }
  .error-btn {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    .reset-btn {
      flex: 1;
      height: 90px;
      line-height: 90px;
      text-align: center;
      font-size: 24px;
      color: #ff4141;
      background-color: #ffffff;
      overflow: hidden;
    }
    .abandon-btn {
      flex: 1;
      height: 90px;
      line-height: 90px;
      text-align: center;
      font-size: 24px;
      background: #ff4141;
      color: #ffffff;
    }
  }
}
</style>

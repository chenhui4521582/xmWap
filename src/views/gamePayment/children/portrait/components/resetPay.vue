<template>
  <div class="reset-pay" v-if="showResetPay">
    <div @click="_getGoodsMsg">您有一笔订单未支付，限时支付抽免单, 点击查看</div>
    <div class="close-icon" @click="closeTips()"></div>
  </div>
</template>
<script>
import Services from '@/services/payment'
import _get from 'lodash.get'
import { mapState } from 'vuex'
export default {
  name: 'resetPay',
  data: () => ({
    showResetPay: false,
    bizId: '',
  }),
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    _checkUserPayError () {
      Services.checkUserPayError().then(res => {
        let { code, data, message } = _get(res, 'data')
        if (code == 200) {
          this.showResetPay = true
          this.bizId = data
        }
      })
    },
    _getGoodsMsg () {
      Services.getGoodsMsg(this.bizId).then(res => {
        let { code, data, message } = _get(res, 'data')
        if (code == 200) {
          let type = _get(res, 'data.data.type')
          let payment = _get(res, 'data.data.product', {})
          payment.resetPayType = type
          localStorage.setItem('JDD_PARAM', JSON.stringify(payment))
          this.$marchSetsPoint('A_H5PT0058002859', {
            recharge_rmb: payment.price,
            product_id: payment.bizId,
            from_project_id: parent.SDK.getGameType()
          })
          this.$router.push({
            name: 'GPList'
          })
        }
      })
    },
    closeTips () {
      this.showResetPay = false
    }
  },
  mounted () {
    this._checkUserPayError()
  },
  watch: {
    '$store.state.userInfo.amount': {
      handler (value) {
        if (value < 100) {
          this.$Toast('金叶子不足啦，快来补充金叶吧~')
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style scoped lang="less">
.reset-pay {
  margin: 0 auto 16px;
  padding: 0 16px;
  height: 36px;
  line-height: 36px;
  background: #d7484c;
  font-size: 20px;
  color: #fff6e9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 18px;
  .check {
    display: flex;
    align-items: center;
    color: #ffea02;
  }
  .close-icon {
    width: 18px;
    height: 18px;
    background: url('../images/pink-close-icon.png') no-repeat;
    background-size: 100% 100%;
  }
}
</style>
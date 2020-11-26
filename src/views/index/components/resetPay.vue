<template>
  <div class="reset-pay" v-if="showResetPay">
    <div @click="_getGoodsMsg">您有一笔订单未支付, 限时支付抽免单, 点击查看</div>
    <div class="close-icon" @click="closeTips()"></div>
  </div>
</template>
<script>
import Services from '@/services/payment'
import _get from 'lodash.get'
export default {
  name: 'resetPay',
  data: () => ({
    showResetPay: false,
    bizId: ''
  }),
  methods: {
    _checkUserPayError () {
      Services.checkUserPayError().then(res => {
        let { code, data, message } = _get(res, 'data')
        if (code == 200) {
          this.showResetPay = true
          this.bizId = data
          this.$marchSetsPoint('A_H5PT0019003106')
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
          localStorage.setItem('payment', JSON.stringify(payment))
          this.$marchSetsPoint('A_H5PT0019002858', {
            recharge_rmb: payment.price,
            product_id: payment.bizId
          })
          this.$router.push({
            name: 'paymentList'
          })
        }
      })
    },
    closeTips () {
      this.showResetPay = false
    }
  },
  created () {
    this._checkUserPayError()
  }
}
</script>
<style scoped lang="less">
.reset-pay {
  margin: 30px 24px 20px;
  padding: 0 20px;
  height: 60px;
  background: #ff7777;
  font-size: 24px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 16px;
  .check {
    display: flex;
    align-items: center;
    color: #ff7800;
  }
  .close-icon {
    width: 24px;
    height: 24px;
    background: url('../img/pink-close-icon.png') no-repeat;
    background-size: 100% 100%;
  }
}
</style>
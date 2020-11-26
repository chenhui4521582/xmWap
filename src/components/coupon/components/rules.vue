<template>
  <sdk-popup v-if="type==='portrait'" :isSDK="false" v-model="show" title="资产说明" type="gamelist"
    :show-cancel="false" :center-scroll="true" @on-confirm="confirm">
    <div class="text" v-html="ruleText"></div>
  </sdk-popup>
  <sdk-popup v-else-if="type==='landscape'" :isSDK="false" v-model="show" title="资产说明" type="1"
    :show-cancel="false" :center-scroll="true" @on-confirm="confirm">
    <div class="text landscape-text" v-html="ruleText"></div>
  </sdk-popup>
  <Modal v-else v-model="show" title="资产说明" :type="2" :closeButtonShow=false :centerScroll=true
    @on-save="confirm">
    <div class="rulse-warp">
      <p class="font-cont" v-html="ruleText">
      </p>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'rules',
  data () {
    return {
      show: this.value,
      ruleText: '1.什么是优惠券？<br />&nbsp;&nbsp;&nbsp;优惠券是平台的一种福利券，可以直接用于充值购买游戏币或者抵扣部分游戏的充值费用，目前仅适用于本平台内的游戏。<br /><br />2.如何使用优惠券？<br />&nbsp;&nbsp;&nbsp;优惠券仅限在线支付时使用；<br />&nbsp;&nbsp;&nbsp;每个订单限使用一张优惠券；<br />&nbsp;&nbsp;&nbsp;每天最多可使用6张优惠券；<br />&nbsp;&nbsp;&nbsp;每个优惠券只能使用一次，不能叠加或者拆分使用。<br /><br />3.为什么我有优惠券，但支付时却不能使用？<br />&nbsp;&nbsp;&nbsp;优惠券如有使用金额门槛，则订单支付金额必须满足金额门槛才能使用；<br />&nbsp;&nbsp;&nbsp;优惠券如限制指定商品或游戏，则购买的商品需满足对应条件方可使用；<br />&nbsp;&nbsp;&nbsp;优惠券领取即绑定对应账号，该账号下优惠券仅限本账号使用，无法转增或替他人付款使用。<br /><br />4.提交订单的时候使用了优惠券，但并未支付。优惠券会退回么？<br />&nbsp;&nbsp;&nbsp;优惠券如未实际支付使用，会在1个小时内原路退回，请耐心等待。<br /><br />5.如果有其他问题怎么办？<br />&nbsp;&nbsp;&nbsp;如果上述问题没有帮助到您，您可以联系客服热线，<br />电话：400-873-5311。'
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    }
  },
  watch: {
    value (val) {
      this.show = val
    },
    show (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    confirm () {
      this.show = false
      if (this.type) {
        this.$marchSetsPoint('A_H5PT0058003990', { source_address: this.type })// 游戏内-商城-优惠券弹窗-资产说明-确认点击
      } else {
        this.$marchSetsPoint('A_H5PT0023003982')// H5平台-商城-优惠券弹窗-资产说明-确认点击
      }
    },
    close () {
      this.$emit('on-close')
    }
  }
}
</script>

<style lang="less" scoped>
.rulse-warp {
  height: 400px;
  overflow-y: scroll;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  .font-cont {
    font-size: 24px;
    line-height: 40px;
    color: #888888;
  }
}
.text {
  font-size: 22px;
  color: #fff;
  width: 420px;
  height: 350px;
  overflow-x: hidden;
  overflow-y: scroll;
  margin: 20px auto;
  -webkit-overflow-scrolling: touch;
  &.landscape-text {
    height: 270px;
  }
}
</style>

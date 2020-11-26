<template>
  <Modal v-model="show" title="资产说明" :type="2" :closeButtonShow=false :centerScroll=true  @on-save="show=false" >
      <div class="rulse-warp">
        <p class="font-cont">
          1.什么是优惠券？<br />
          &nbsp;&nbsp;&nbsp;优惠券是平台的一种福利券，可以直接用于充值购买游戏币或者抵扣部分游戏的充值费用，目前仅适用于本平台内的游戏。<br /><br />
          2.如何使用优惠券？<br />
          &nbsp;&nbsp;&nbsp;优惠券仅限在线支付时使用；<br />
          &nbsp;&nbsp;&nbsp;每个订单限使用一张优惠券；<br />
          &nbsp;&nbsp;&nbsp;每天最多可使用6张优惠券；<br />
          &nbsp;&nbsp;&nbsp;每个优惠券只能使用一次，不能叠加或者拆分使用。<br />
          <br />
          3.为什么我有优惠券，但支付时却不能使用？<br />
          &nbsp;&nbsp;&nbsp;优惠券如有使用金额门槛，则订单支付金额必须满足金额门槛才能使用；<br />
          &nbsp;&nbsp;&nbsp;优惠券如限制指定商品或游戏，则购买的商品需满足对应条件方可使用；<br />
          &nbsp;&nbsp;&nbsp;优惠券领取即绑定对应账号，该账号下优惠券仅限本账号使用，无法转增或替他人付款使用。<br /><br />
          4.提交订单的时候使用了优惠券，但并未支付。优惠券会退回么？<br />
          &nbsp;&nbsp;&nbsp;优惠券如未实际支付使用，会在1个小时内原路退回，请耐心等待。<br /><br />
          5.如果有其他问题怎么办？<br />
          &nbsp;&nbsp;&nbsp;如果上述问题没有帮助到您，您可以联系客服热线，电话：400-873-5311。
        </p>
      </div>
  </Modal>
</template>

<script>
export default {
  name: 'rulse',
  data() {
    return {
      show:this.value
    }
  },
  props:{
    value:{
      type:Boolean,
      default:false
    }
  },
  watch:{
    value(val){
      this.show = val
    },
    show(val){
      this.$emit('input',val)
    }
  },
  methods: {
    close() {
      this.$emit('on-close')
    }
  }
}
</script>

<style lang="less" scoped>
.rulse-warp{
  height: 400px;
  overflow-y: scroll;
  overflow-x: hidden;
  .font-cont{
    font-size: 24px;
    line-height: 40px;
    color: #888888;
  }
}
</style>

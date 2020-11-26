<template>
  <div class="pay-ways">
    <form method="post" :action="bForm.url" id="batchForm" v-if="bForm">
      <input name="amount" type="hidden" id="amount" :value="bForm.attach.amount" /><br/>
      <input name="callbackUrl" type="hidden" id="callbackUrl" :value="bForm.attach.callbackUrl" /><br/>
      <input name="currency" type="hidden" id="currency" :value="bForm.attach.currency" /><br/>
      <input name="merchant" type="hidden" id="merchant" :value="bForm.attach.merchant" /><br/>
      <input name="notifyUrl" type="hidden" id="notifyUrl" :value="bForm.attach.notifyUrl" /><br/>
      <input name="orderType" type="hidden" id="orderType" :value="bForm.attach.orderType" /><br/>
      <input name="sign" type="hidden" id="sign" :value="bForm.attach.sign" /><br/>
      <input name="tradeName" type="hidden" id="tradeName" :value="bForm.attach.tradeName" /><br/>
      <input name="tradeNum" type="hidden" id="tradeNum" :value="bForm.attach.tradeNum" /><br/>
      <input name="tradeTime" type="hidden" id="tradeTime" :value="bForm.attach.tradeTime" /><br/>
      <input name="userId" type="hidden" id="userId" :value="bForm.attach.userId" /><br/>
      <input name="version" type="hidden" id="version" :value="bForm.attach.version" /><br/>
      <input name="goodsInfo" type="hidden" id="goodsInfo" :value="bForm.attach.goodsInfo" /><br/>
      <input name="bizTp" type="hidden" id="bizTp" :value="bForm.attach.bizTp" /><br/>
    </form>

    <loading v-show="showLoading"></loading>
  </div>
</template>
<script type="text/javascript">
import {getUrlParams} from "@/utils/utils";

export default {
  data() {
    return {
      bForm: null,
      showLoading: true
    }
  },
  mounted() {
    this.bForm = getUrlParams('parmas') && JSON.parse(decodeURIComponent(getUrlParams('parmas')))
    this.$nextTick(() => {
      if(this.bForm) {
        document.getElementById('batchForm').submit()
      }
    })
  }
}
</script>
<style lang="less" scoped>

</style>
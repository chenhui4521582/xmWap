<template>
  <sdk-popup class="g-p-limit" :isSDK="false" title="温馨提示" v-model="showModal" :showClose="false"
    :showCancel="!limitMax" cancelText="调整充值额度" @on-cancel="goPayLimit"
    :showConfirm="limitMax||!limitMax&&limitInfo.warnTimes < 2" :confirmText="limitMax?'知道了':'继续支付'"
    @on-confirm="handleCancle">
    <div class="text" v-html="text"></div>
  </sdk-popup>
</template>
<script>
import { jumpUrl } from '@/utils/utils'
export default {
  name: 'GPLimit',
  props: {
    limitInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    showModal: false,
    toggle: false
  }),
  computed: {
    limitMax () {
      if (this.limitInfo.warnType == 'USER' && this.limitInfo.max == 1) {
        return true
      }
      return false
    },
    text () {
      if (this.limitMax) {
        return '平台监测您单日付费已达到限额。<br>请适度消费，健康游戏。'
      }
      return `今日付费金额较多，请适度消费，健康游戏。${this.limitInfo.warnTimes > 1 ? '' : '<br> 请确认是否继续支付？'}`
    }
  },
  methods: {
    handleCancle () {
      this.showModal = false
      if (this.limitMax) {
        this.$marchSetsPoint('A_H5PT0056001226')
      } else {
        this.$marchSetsPoint('A_H5PT0056001240')
      }
    },
    goPayLimit () {
      this.$marchSetsPoint('A_H5PT0056001225')
      let url = '/publicWap/personalCenter.html#/rechargeLimit'
      if (parent.SDK.getBackUrl().includes('xmWap')) {
        url = '/xmWap/#/personalCenter/setLimit'
      }
      jumpUrl({ url }, 'SDK')
    }
  },
  watch: {
    limitInfo (value) {
      // max?
      if (value.warnType == 'USER' && (value.max == 1 || value.max == 0)) {
        this.showModal = true
        this.$marchSetsPoint('A_H5PT0056001223')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.g-p-limit {
  .text {
    padding: 40px;
    white-space: nowrap;
  }
}
</style>
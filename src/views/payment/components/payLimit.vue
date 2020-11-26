<template>
  <Modal v-model="showModal" title="温馨提示" :type="2">
    <div class="center">
      <div class="text" v-html="text"></div>
    </div>
    <div class="button" slot="footer" v-if="limitInfo.warnType =='USER' && limitInfo.max == 1 "
      @click="handleCancle('ok')">
      <div class="btn cancel">知道了</div>
    </div>
    <div class="btns" slot="footer" v-if="limitInfo.warnType =='USER' && limitInfo.max == 0">
      <div class="btn cancel" @click="goPayLimit">调整充值额度</div>
      <div class="btn confirm" @click="handleCancle" v-if="limitInfo.warnTimes<2">继续支付</div>
    </div>
  </Modal>
</template>
<script>
export default {
  name: 'PayLimit',
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
    text () {
      if (this.limitInfo.warnType == 'USER' && this.limitInfo.max == 1) {
        return '平台监测您单日付费已达到限额。<br>请适度消费，健康游戏。'
      }
      return `今日付费金额较多，请适度消费，健康游戏。${this.limitInfo.warnTimes > 1 ? '' : '<br> 请确认是否继续支付？'}`
    }
  },
  methods: {
    handleCancle (ok) {
      this.showModal = false
      if (ok) {
        this.$marchSetsPoint('A_H5PT0056001226')
      } else {
        this.$marchSetsPoint('A_H5PT0056001240')
      }
    },
    goPayLimit () {
      this.$marchSetsPoint('A_H5PT0056001225')
      this.$router.push({ name: 'setLimit' })
    }
  },
  watch: {
    limitInfo (value) {
      if (value.warnType == 'USER' && (value.max == 1 || value.max == 0)) {
        this.showModal = true
        this.$marchSetsPoint('A_H5PT0056001223')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.center {
  color: #888888;
  font-size: 24px;
}
.toggle {
  margin-top: 10px;
  line-height: 30px;
  img {
    vertical-align: top;
    width: 30px;
    height: 30px;
  }
}
.button {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  .btn {
    text-align: center;
  }
}
</style>
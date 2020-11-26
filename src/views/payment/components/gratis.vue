<template>
  <div class="gratis"
    v-if="openGratis">
    <div class="gratis-braodcast"
      v-if="showBraodCast">
      <img src="../img/gratis/icon.png"
        alt=""
        class="icon">
      <span class="line"></span>
      <span>支付成功100%中大奖！</span>
    </div>
    <div class="gratis-tips"
      v-if="showTips"></div>
    <Modal v-model="logoutModal"
      :title="'温馨提示'"
      :saveText="'继续看看'"
      :closeText="'放弃'"
      @on-save="enterModal"
      @on-close="closedModal">
      <div class="center">
        购买任意商品即可抽取免单大奖，您确定要放弃吗？
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'gratis',
  data: () => ({
    logoutModal: false
  }),
  computed: {
    ...mapState(['openGratis']),
    showTips () {
      return this.$route.name === 'paymentList'
    },
    showBraodCast () {
      return ['paymentCallback', 'payment'].includes(this.$route.name)
    }
  },
  methods: {
    /** 抽免单 不需的时候删除 **/
    ...mapActions({
      _getGratis: 'GET_GRATIS'
    }),
    /** 是否展示离开弹框 **/
    isGratis () {
      let gratisPop = localStorage.getItem('gratisPop')
      if (!gratisPop && this.openGratis) {
        return true
      } else {
        return false
      }
    },
    showModal () {
      this.logoutModal = true
      this.$marchSetsPoint('A_H5PT0023001641')
    },
    enterModal () {
      this.logoutModal = false
      localStorage.setItem('gratisPop', new Date().getTime())
      this.$marchSetsPoint('A_H5PT0023001643')
    },
    closedModal () {
      this.$marchSetsPoint('A_H5PT0023001642')
      this.$marchSetsPoint('A_H5PT0023001644')
    }
  },
  mounted () {
    this._getGratis()
  },
  watch: {
    openGratis: {
      handler (val) {
        if (val && (this.showTips || this.showBraodCast)) {
          this.$emit('hideordertip', true)
        } else {
          this.$emit('hideordertip', false)
        }
      },
      immediate: true
    }
  }
}
</script>
<style lang="less" scoped>
.gratis {
  .gratis-braodcast {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 20px;
    margin: 30px 0;
    height: 48px;
    background: #fff;
    border-radius: 28px;
    color: #e8382b;
    font-size: 24px;
    .icon {
      width: 30px;
      height: 23px;
    }
    .line {
      margin: 0 27px;
      width: 2px;
      height: 27px;
      background: #fad7d5;
    }
  }
  .gratis-tips {
    position: fixed;
    right: 24px;
    bottom: 100px;
    width: 276px;
    height: 41px;
    background: url(../img/gratis/tips.png) no-repeat center center;
    background-size: 100% 100%;
  }
}
</style>

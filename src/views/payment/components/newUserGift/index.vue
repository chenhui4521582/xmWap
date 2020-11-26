<template>
  <section class="new-user-gift" v-if="info.showStatus">
    <div class="banner" @click="getGiftInfo()">
      <div class="count-down">倒计时:{{countTime}}</div>
    </div>
    <!-- 新手引导 -->
    <new-user-guide v-if="info.highLight" @on-close="closePop" />
    <Modal v-model="modal" :title="'温馨提示'" :type="2" save-text="马上购买" close-text="看看其他" @on-save="getGiftInfo" @on-close="closeModal">
      <div class="center">
        10倍返利仅此一次<br>
        6元最高可得60000金叶子
      </div>
    </Modal>
  </section>
</template>

<script>
import newUserGuide from './gift1'
import Services from '@/services/payment'
import { localStorage, newUtils } from '@/utils/utils'
export default {
  name: 'newUserGift',
  components: {
    newUserGuide
  },
  data () {
    return {
      info: {},
      giftInfo: {},
      countTime: '',
      modal: false
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    currentDate () {
      let date = new Date()
      let currentYear = date.getFullYear()
      let month = date.getMonth()
      let currentMonth = month >= 10 ? month : '0' + month
      let day = date.getDate()
      let currentDay = day >= 10 ? day : '0' + day
      return currentYear + '' + currentMonth + '' + currentDay
    }
  },
  methods: {
    isShowStatus () {
      /** 是否展示离开弹框 **/
      let newUserGiftPop = localStorage.get('newUserGiftPop')
      if ((!newUserGiftPop || this.currentDate - newUserGiftPop < 0) && this.info.showStatus) {
        return true
      } else {
        return false
      }
    },
    showModal () {
      this.modal = true
    },
    closeModal () {
      this.modal = false
      localStorage.set('newUserGiftPop', this.currentDate)
      this.$emit('on-back', true)
    },
    async init () {
      const res = await Services.newUserFirstRechargeStatus()
      let { data, code } = res.data
      if (code === 200) {
        this.info = data
        if (this.info.countDown > 0) this.countDown(this.info.countDown)
      }
    },
    async getGiftInfo () {
      const res = await Services.getMallProductListByType(230)
      let { data, code } = res.data
      if (code === 200) {
        this.giftInfo = data && data.mallBizConfigs && data.mallBizConfigs.length > 0 && data.mallBizConfigs[0]
        localStorage.set('payment', this.giftInfo)
        this.$router.replace({ name: 'paymentList' })
        this.$marchSetsPoint('A_H5PT0023002003')
      }
    },
    /** 倒计时 **/
    countDown (item) {
      if (!item) return false
      let date = item / 1000
      this.timer = setInterval(() => {
        date = date - 1
        if (date <= 0) {
          date = 0
          clearInterval(this.timer)
          this.$router.replace('/')
        }
        let day = Math.floor(date / 86400)
        let hour = Math.floor(parseInt(date / 60 / 60) % 24)
        let minute = Math.floor(parseInt(date / 60) % 60)
        let second = Math.floor(date % 60)
        // let countDay = day >= 10 ? day : '0' + day
        let countHour = hour >= 10 ? hour : '0' + hour
        let countMinute = minute >= 10 ? minute : '0' + minute
        let countSecond = second >= 10 ? second : '0' + second
        if (day > 0) {
          this.countTime = `${day}天${countHour}时${countMinute}分${countSecond}秒`
        } else {
          this.countTime = `${countHour}时${countMinute}分${countSecond}秒`
        }
      }, 1000)
    },
    closePop (val) {
      if (val) {
        this.getGiftInfo()
      } else {
        this.$marchSetsPoint('A_H5PT0023002004')
        this.init()
      }
    }
  },
  watch: {
    info: {
      handler (newValue, oldValue) {
        if (newValue.highLight) {
          newUtils.ScrollNoMove()
        } else {
          newUtils.ScrollMove()
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.new-user-gift {
  padding-top: 18px;
  .banner {
    height: 238px;
    background: url(./img/banner.png) no-repeat center center ;
    background-size: 100% 100%;
    margin: 0 -9px 9px;
    position: relative;
    .count-down {
      font-size: 20px;
      font-weight: bold;
      line-height: 36px;
      color: #ff5e00;
      position: absolute;
      top: 6px;
      left: 60px;
    }
  }
  .center {
    text-align: center;
    color: #888888;
    font-size: 24px;
    font-weight: 400;
    line-height: 36px;
  }
}
</style>

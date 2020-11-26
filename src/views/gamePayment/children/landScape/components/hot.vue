<template>
  <div class="hot">
    <div class="item" v-if="showHot || showOnePay" @click="onePay(hotListData[0])">
      <div class="count-dwon" v-if="countdownTime">
        {{countdownTime}}
      </div>
      <img v-if="hasLotteryTimes" src="../images/hasLottery.png" alt="">
      <img :src="hotListData[0].icon | httpImg" alt="" v-else>
    </div>
    <div class="item" v-if="showActivitie" @click="activityJump(activitieList[0].url)">
      <img :src="activitieList[0].cdnImage | httpImg" alt="">
    </div>
  </div>
</template>
<script>
import _get from 'lodash.get'
import { jumpUrl, gameActivityJump } from '@/utils/utils'
export default {
  name: 'hot',
  props: {
    hotList: {
      type: Object,
      default: () => ({})
    },
    activitieList: {
      type: Array,
      default: () => ([])
    },
  },
  data: () => ({
    countdownTime: ''
  }),
  filters: {
    httpImg (item) {
      let img = item.split(';')[0]
      if (img && !img.includes('http')) {
        return '//file.beeplaying.com/' + img
      } else {
        return img
      }
    }
  },
  computed: {
    hotListData () {
      return _get(this.hotList, 'list', [])
    },
    showHot () {
      return this.hotList.productType == 230 && this.hotListData.length && this.hotListData[0].buyFlag == 1
    },
    showActivitie () {
      return this.activitieList.length
    },
    showOnePay () {
      if (this.hotListData instanceof Array) {
        return this.hotList.productType == 116 && this.hotListData[0] && this.hotListData[0].buyStatus === 0 ||
          this.hotListData[0] && this.hotListData[0].buyStatus === 1 && this.hotList.bettingTimes > 0
      }
      return false
    },
    hasLotteryTimes () {
      return this.hotList.productType == 116 && this.hotListData[0] && this.hotListData[0].buyStatus === 1 && this.hotList.bettingTimes > 0
    }
  },
  methods: {
    countDown (date) {
      if (!date) return false
      date = date / 1000
      this.timer = setInterval(() => {
        this.lock = true
        date = date - 1
        if (date <= 0) {
          date = 0
          this.lock = false
          this.$emit('refresh')
          clearInterval(this.timer)
        }
        let day = Math.floor(date / 86400)
        let hour = Math.floor(parseInt(date / 60 / 60) % 24)
        let minute = Math.floor(parseInt(date / 60) % 60)
        let second = Math.floor(date % 60)
        let countHour = hour >= 10 ? hour : '0' + hour
        let countMinute = minute >= 10 ? minute : '0' + minute
        let countSecond = second >= 10 ? second : '0' + second
        if (day > 0) {
          this.countdownTime = `${day}天${countHour}小时${countMinute}分${countSecond}秒`
        } else {
          this.countdownTime = `${countHour}小时${countMinute}分${countSecond}秒`
        }
      }, 1000)
    },
    toPay (item) {
      localStorage.setItem('JDD_PARAM', JSON.stringify(item))
      this.$router.push({
        name: 'GPList'
      })
    },
    onePay (item) {
      if (this.hotListData[0] && this.hotListData[0].buyFlag || this.hotList.bettingTimes > 0) {
        parent.location.href = `https://wap.beeplaying.com/xmWap/#/mall/onePay?channel=${localStorage.getItem('APP_CHANNEL')}&token=${localStorage.getItem('ACCESS_TOKEN')}`
        return
      }
      this.toPay(item)
    },
    /** 活动点击跳转 **/
    activityJump (url) {
      gameActivityJump(url)
    }
  },
  mounted () {
    clearInterval(this.timer)
    this.countDown(this.hotList.endTime)
  },
  watch: {
    hotList (value) {
      if (value.endTime) {
        this.countDown(value.endTime)
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
}
</script>
<style lang="less" scoped>
.hot {
  height: 100%;
  display: flex;
  justify-content: center;
  .item {
    position: relative;
    padding-bottom: 5px;
    width: 330px;
    height: 432px;
    border-radius: 20px;
    &:nth-child(2) {
      margin-left: 14px;
    }
    img {
      vertical-align: top;
      max-width: 100%;
      max-height: 100%;
      border-radius: 20px;
    }
    .count-dwon {
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate(-50%, 0);
      width: 242px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      font-size: 18px;
      color: #de5900;
      background: #fff;
      border-radius: 0 0 2px 2px;
    }
  }
}
</style>

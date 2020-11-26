<template>
  <section class="overtime-wrapper" :class="{sdk:from}"
    v-if="gameType===achievementTaskInfo.gameType&&countdownTime" @click="goOvertimeDetail">
    <div class="overtime">
      <span>
        {{countdownTime}}
      </span>
      <span class="bonus">
        限时完成任务加奖{{achievementTaskInfo.awardsName}}
      </span>
    </div>
  </section>
</template>

<script>
import Services from '@/services/achievement'
import { jumpUrl } from '@/utils/utils'
export default {
  name: 'overtimeTask',
  components: {

  },
  data () {
    return {
      achievementTaskInfo: {},
      countdownTime: '',
      timer: null
    }
  },
  props: {
    gameType: {
      type: Number,
      default: 0
    },
    from: {
      type: String,
      default: ''
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      const res = await Services.getAchievementTaskInfo()
      const { data, code } = res.data
      if (code === 200) {
        this.achievementTaskInfo = data
        this.countDown(data.countdown)
      }
    },

    // 特惠倒计时
    countDown (info) {
      if (!info) return false
      let date = info / 1000
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
        let countDay = day >= 10 ? day : '0' + day
        let countHour = hour >= 10 ? hour : '0' + hour
        let countMinute = minute >= 10 ? minute : '0' + minute
        let countSecond = second >= 10 ? second : '0' + second
        if (day > 0) {
          this.countdownTime = `${countDay}天${countHour}:${countMinute}:${countSecond}`
        } else {
          this.countdownTime = `${countHour}:${countMinute}:${countSecond}`
        }
      }, 1000)
    },
    goOvertimeDetail () {
      jumpUrl({ url: '/activities/overtimeTask.html' }, this.from, '&gametype=' + this.gameType)
    }
  }
}
</script>

<style lang="less" scoped>
.overtime-wrapper {
  margin: 0 -9px -6px;
  &.sdk {
    margin: 0 16px -6px;
    .overtime {
      height: 66px;
      line-height: 72px;
      padding: 0 48px 0 62px;
      background: url('./img/overtime-sdk-bg.png') no-repeat center;
      background-size: 100% 100%;
      font-size: 20px;
      font-weight: 500;
      &::after {
        content: none;
      }
      .bonus {
        color: #ff2e01;
      }
    }
  }
  .overtime {
    height: 85px;
    background: url('./img/overtime-bg.png') no-repeat center;
    background-size: 100% 100%;
    line-height: 85px;
    padding: 0 68px 0 85px;
    display: flex;
    justify-content: space-between;
    position: relative;
    color: #000000;
    font-size: 24px;
    &::after {
      content: '';
      display: block;
      position: absolute;
      right: 30px;
      top: 0;
      width: 30px;
      height: 85px;
      background: url('./img/arrow.png') no-repeat center;
      background-size: 100% 100%;
    }
    .bonus {
      color: #ff4141;
    }
  }
}
</style>

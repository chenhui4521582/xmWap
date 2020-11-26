<template>
  <section class="king-overtime-wrapper" v-if="taskInfo.taskBatchIsEndTime" :class="{sdk:from}">
    <div class="king-overtime">
      <span v-if="!taskInfo.taskBatchIsOverdue && countdownTime">
        {{taskInfo.gameName}}{{countdownTime}}后过期
      </span>
      <span v-if="taskInfo.taskBatchIsOverdue">
        {{taskInfo.gameName}}已过期
      </span>
    </div>
  </section>
</template>

<script>
export default {
  name: 'kingOvertime',
  components: {

  },
  data () {
    return {
      countdownTime: '',
      timer: null
    }
  },
  props: {
    taskInfo: {
      type: Object,
      default: () => ({})
    },
    from: {
      type: String,
      default: ''
    }
  },
  mounted () {
    if (this.taskInfo.taskBatchIsEndTime && !this.taskInfo.taskBatchIsOverdue && this.taskInfo.taskBatchEndTime) {
      this.countDown(this.taskInfo.taskBatchEndTime)
    } else {
      this.countdownTime = ''
      clearInterval(this.timer)
    }
  },
  computed: {

  },
  methods: {
    // 特惠倒计时
    countDown (info) {
      clearInterval(this.timer)
      if (!info) return false
      let date = info / 1000
      this.timer = setInterval(() => {
        date = date - 1
        if (date <= 0) {
          date = 0
          clearInterval(this.timer)
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
    }
  },
  watch: {
    taskInfo: {
      deep: true,
      handler (val) {
        if (val.taskBatchIsEndTime && !val.taskBatchIsOverdue && val.taskBatchEndTime) {
          this.countDown(val.taskBatchEndTime)
        } else {
          this.countdownTime = ''
          clearInterval(this.timer)
        }
      }
    }
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less" scoped>
.king-overtime-wrapper {
  &.sdk {
    .king-overtime {
      height: 26px;
      line-height: 26px;
      margin: 0 auto 20px;
      width: 350px;
      background: #fff;
      font-size: 18px;
      font-weight: bold;
      color: #ff6664;
      border-radius: 13px;
      &::before,
      &::after {
        content: none;
      }
    }
  }
  .king-overtime {
    height: 60px;
    background: #ffebc3;
    line-height: 60px;
    text-align: center;
    color: #ff4141;
    font-size: 24px;
    position: relative;
    border-radius: 16px;
    margin-bottom: 10px;
    z-index: 1;
    &::before,
    &::after {
      content: '';
      display: block;
      position: absolute;
      bottom: -25px;
      width: 10px;
      height: 40px;
      background: url('./img/link-icon.png') no-repeat center;
      background-size: 100% 100%;
    }
    &::before {
      left: 80px;
    }
    &::after {
      right: 80px;
    }
    .bonus {
      color: #ff4141;
    }
  }
}
</style>

<template>
<div class="countdown">
  {{countdownTime}}后失效
</div>
</template>
<script>
export default {
  props: {
    time: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    countdownTime: '00:00'
  }),
  methods: {
    countDown () {
      if (!this.time) return false
      let date = this.time / 1000
      this.timer = setInterval(() => {
        date = date - 1
        if (date <= 0) {
          date = 0
          clearInterval(this.timer)
          this.showFlag = false
          this.$emit('coundownOver', false)
        }
        let minute = Math.floor(parseInt(date / 60) % 60)
        let second = Math.floor(date % 60)
        let countMinute = minute >= 10 ? minute : '0' + minute
        let countSecond = second >= 10 ? second : '0' + second
        this.countdownTime = `${countMinute}:${countSecond}`
      }, 1000)
    }
  },
  mounted () {
    clearInterval(this.timer)
    this.countDown()
  },
  watch: {
    time (value) {
      clearInterval(this.timer)
      this.countDown()
    }
  }
}
</script>
<style lang="less" scoped>
.countdown {
  font-size: 24px;
  color: #5C0C2C;
  font-weight: bold;
}
</style>
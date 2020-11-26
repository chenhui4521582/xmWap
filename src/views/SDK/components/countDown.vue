<template>
  <div class="count-down">{{countTime}}</div>
</template>

<script type="text/ecmascript-6">

  export default {
    name: 'CountDown',
    data() {
      return {
        countTime: ''
      }
    },
    props: {
      time: {
        type: Number,
        default: 0
      },
      isText: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
    },
    methods: {
      countDown(millisecond, fn) {
        let that = this;
        timer()
        let t = setInterval(timer, 1000)
        function timer() {
          if (millisecond <= 1) {
            that.countTime = ''
            clearInterval(t)
            that.$emit('refresh')
            if (fn) {
              fn()
            }
            return
          }
          let day = Math.floor(millisecond / (1000 * 60 * 60 * 24))
          let hour = Math.floor((millisecond % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          let minute = that.Appendzero(Math.floor((millisecond % (1000 * 60 * 60)) / (1000 * 60)))
          let second = that.Appendzero(Math.floor((millisecond % (1000 * 60)) / 1000))
          let hours = that.Appendzero(day * 24 + hour)
          that.countTime = `${day}天${hour}:${minute}:${second}`
          millisecond = millisecond - 1000
        }
      },
      Appendzero(obj) {
        if (obj < 10) return '0' + '' + obj
        else return obj
      },
    },
    watch: {
      time: {
        deep: true,
        immediate: true,
        handler: function (newVal) {
          this.countDown(newVal)
        }
      }
    }
  }
</script>

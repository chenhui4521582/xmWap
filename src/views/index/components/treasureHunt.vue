<template>
  <div class="treasurehunt" v-if="icoshow">
    <img class="icon_treasure" @click="enter" src="../img/treasurehunt.png" />
    <!-- <i class="redDot" v-if="showRedDot"></i> -->
    <div class="icon-bg">
      <span v-for="(item,key) in newcountTime.split('')" :key="key">{{item}}</span>
    </div>
  </div>
</template>
<script>
import Services from '@/services/index'
import _get from 'lodash.get'
export default {
  data() {
    return {
      icoshow: false,
      time: '',
      newcountTime: ''
    }
  },
  mounted() {
    //   3.10  14:40
    //   3.10  17:43
    // console.log('17:49')
    // console.log('3.11 14:23')
    Services.getState(1).then(res => {
      let { data } = res.data
      this.show = _get(data, 'rebateCountdown', '') 
    
      if (this.show > 0) {
        this.icoshow = true
        this.time = this.show
       this.fanlicountDown(this.time)
      }
    })
  },
  methods: {
    // 返利卡倒计时
    fanlicountDown(item) {
      if (!item) return false
      let date = item / 1000
      let { day, countHour, countMinute, countSecond } = this.getCountInfo(date)
    //   this.newcountTime = `${countHour}:${countMinute}:${countSecond}`
    let self = this
    doTimer();
      this.timer = setInterval(() => {
          doTimer();
      }, 1000);
      function doTimer(){
                date = date - 1
        if (date <= 0) {
          date = 0
          clearInterval(this.timer)
          self.newcountTime = ''
          return
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
          self.newcountTime = `${countHour}时${countMinute}分${countSecond}秒`
        } else {
          self.newcountTime = `${countHour}:${countMinute}:${countSecond}`
        }
      }
    },
    getCountInfo(dateinfo) {
      let day = Math.floor(dateinfo / 86400)
      let hour = Math.floor(parseInt(dateinfo / 60 / 60) % 24)
      let minute = Math.floor(parseInt(dateinfo / 60) % 60)
      let second = Math.floor(dateinfo % 60)
      // let countDay = day >= 10 ? day : '0' + day
      let countHour = hour >= 10 ? hour : '0' + hour
      let countMinute = minute >= 10 ? minute : '0' + minute
      let countSecond = second >= 10 ? second : '0' + second
      return {
        day,
        countHour,
        countMinute,
        countSecond
      }
    },
    // 进入活动
    enter() {
        this.$marchSetsPoint('A_H5PT0019002974')
      
      location.href = '//wap.beeplaying.com/activities/treasurehunt.html'
        
    }
  }
}
</script>
<style lang='less'>
.treasurehunt {
  position: fixed;
  z-index: 9;
  right: -20px;
  bottom: 500px;
  width: 153px;
  & .icon-bg {
    width: 4.5rem;
    height: 1rem;
    bottom: 0.35rem;
    position: absolute;
    line-height: 1rem;
    text-align: center;
    font-size: 0.8rem;
    font-family: Alibaba PuHuiTi;
    font-weight: 400;
    color: rgba(138, 28, 170, 1);
  }
  .icon_treasure {
    width: 4.5rem;
  }
}
</style>

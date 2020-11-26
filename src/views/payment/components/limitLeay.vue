<template>
  <div class="limit-leay" v-if="showLimitLeay">
    <div class="icon" :class="{animation: type === 2 || type === 1}">
      <img src="../img/limitLear/icon.png" alt="">
    </div>
    <div class="content">
      <!-- 活动开启 尚未到时间 -->
      <div class="type1" v-if="type === 1">
        <img src="../img/limitLear/word4.png" alt="" class="word4">
        <span class="count-down">{{countTime}}</span>
        <img src="../img/limitLear/word5.png" alt="" class="word5">
      </div>
      <!-- 活动开启 可以领取奖品 -->
      <div class="type2" v-if="type === 2" @click="pointClick">
        <img src="../img/limitLear/word2.png" alt="" class="word2">
      </div>
      <!-- 活动结束 -->
      <div class="type3" v-if="type === 3">
        <img src="../img/limitLear/word1.png" alt="" class="word1">
      </div>
      <div class="activity-time">
        <img src="../img/limitLear/word3.png" alt="" class="word3">
        <div class="count-down">{{limitLeayInfo.activityTime}}</div>
      </div>
    </div>
    <div class="get-btn" v-if="type === 2" @click="_getLimitLeayAward">
      <img src="../img/limitLear/getBtn.png" alt="" class="word2">
    </div>
    <!-- 领取弹出框 -->
    <awards-dialog
      v-model="showAwards"
      :awards="AwardsData.awards"
      :explainText="AwardsData.explainText"
      :confirmBtnText="AwardsData.confirmBtnText"
      @callback="awardsCallback"
      @closedCallback="awardsCallback"
    />
  </div>
</template>
<script>
import {newUtils} from '@/utils/utils'
import Services from '@/services/payment'
import _get from 'lodash.get'
export default {
  name: 'limitLeay',
  data: () => ({
    type: 1,
    /** 弹出框 **/
    showAwards: false,
    AwardsData: {
      awards: {
        awardsImage: '',
        awardsName: '388金叶子'
      },
      explainText: {
        html: ''
      },
      confirmBtnText: '继续赚金叶'
    },
    /** 限时金叶子数据 **/
    limitLeayInfo: {

    },
    /** 倒计时 **/
    countTime: ''
  }),
  computed: {
    showLimitLeay() {
      if(this.limitLeayInfo && this.limitLeayInfo.openFlag) {
        return true
      }else {
        return false
      }
    }
  },
  methods: {
    _getLimitLeayInfo() {
      Services.getLimitLeayInfo().then(res => {
        let {code, message} = _get(res, 'data', {})
        if(code === 200) {
          this.limitLeayInfo = _get(res, 'data.data', {})
          this.countDown(this.limitLeayInfo.countdown || 0)
          /** 今天领取完毕 **/
          if(this.limitLeayInfo.todayReceivedFlag) {
            this.type = 3
            return
          }
          /** 倒计时不等于 0 并且 今天没领取完毕 **/
          if(this.limitLeayInfo.countdown && !this.limitLeayInfo.todayReceivedFlag) {
            this.type = 1
            return 
          }
          /** 倒计时等于 0 并且 今天没领取完毕 **/
          if(!this.limitLeayInfo.countdown && !this.limitLeayInfo.todayReceivedFlag){
            this.type = 2
            this.$marchSetsPoint('A_H5PT0023001635')
          }
        }
      }) 
    },
    _getLimitLeayAward() {
      Services.getLimitLeayAward().then(res => {
        let {code, data, message} = _get(res, 'data', {})
        if(code === 200 ) {
          this.showAwards = true
          this.AwardsData.awards.awardsImage = data.awardsImage
          this.AwardsData.awards.awardsName = data.awardsName
          if(data.nextCountdown != null) {
            this.AwardsData.explainText.html = `<p style="font-size:.8rem;color:#ACACAC">下个宝箱将在 <span style="color:#FF9914;font-size:1rem;">${this.formatTime(data.nextCountdown)}</span> 后开启</p>`
          }else {
            this.AwardsData.explainText.html = `<p style="font-size:.8rem;color:#ACACAC">今天领取完啦，明天再来吧~ </p>`
          }
        }else {
          this.$Toast(message)
        }
      })
    },
    countDown(time) {
      if (!time) return false
      let date = time / 1000
      let hour = Math.floor(parseInt(date / 60 / 60) % 24)
      let minute = Math.floor(parseInt(date / 60) % 60)
      let second = Math.floor(parseInt(date) % 60)
      let countHour = hour >= 10 ? hour : '0' + hour
      let countMinute = minute >= 10 ? minute : '0' + minute
      let countSecond = second >= 10 ? second : '0' + second
      this.countTime = `${countHour}:${countMinute}:${countSecond}`
      this.timer = setInterval(() => {
        date = date - 1
        if (date <= 0) {
          date = 0
          /** 倒计时结束的时候重置接口 **/
          this._getLimitLeayInfo()
          clearInterval(this.timer)
        }
        
        let hour = Math.floor(parseInt(date / 60 / 60) % 24)
        let minute = Math.floor(parseInt(date / 60) % 60)
        let second = Math.floor(parseInt(date) % 60)
        let countHour = hour >= 10 ? hour : '0' + hour
        let countMinute = minute >= 10 ? minute : '0' + minute
        let countSecond = second >= 10 ? second : '0' + second
        this.countTime = `${countHour}:${countMinute}:${countSecond}`
      }, 1000)
    },
    formatTime(time) {
      if(time === null) {}
      time = time / 1000;
      let h = Math.floor(time / 60 / 24)
      let m = Math.floor(time / 60 % 60)
      let s = Math.ceil(time % 60)
      h = h < 10 ? `0${h}` : h;
      m = m < 10 ? `0${m}` : m;
      s = s < 10 ? `0${s}` : s;
      return `${h}:${m}:${s}`;
    },
    awardsCallback() {
      this.showAwards = false
      this._getLimitLeayInfo()
      this.$marchSetsPoint('A_H5PT0023001637')
    },
    pointClick() {
      this.$marchSetsPoint('A_H5PT0023001636')
    }
  },
  mounted() {
    this._getLimitLeayInfo()
  }
}
</script>
<style scoped lang="less">
  .limit-leay {
    display: flex;
    justify-content: flex-start;
    margin-top: 20px;
    height: 147px;
    background: url("../img/limitLear/bg.png") no-repeat center bottom;
    background-size: 100% auto;
    .icon {
      margin:0 14px 0 33px; 
      width: 146px;
      height: 147px;
      img {
        vertical-align: top;
        width: 100%;
      }
      &.animation {
        animation: animation infinite 2s ease-in-out; 
      }
    }
    .content {
      padding-top: 50px;
      .type1 {
        height: 23px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .word4 {
          width: 72px;
          height: 23px;
        }
        .count-down {
          margin: 0 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 148px;
          height: 30px;
          font-size: 24px;
          color: #E72C2C;
          background: #fff;
          border-radius: 10px;
        }
        .word5 {
          width: 120px;
          height: 23px;
        }
      }
      .type2 {
        height: 23px;
        .word2 {
          vertical-align: top;
          width: 274px;
          height: 23px;
        }
      }
      .type3 {
        height: 26px;
        .word1 {
          vertical-align: top;
          width: 346px;
          height: 26px;
        }
      }
      .activity-time {
        margin-top: 21px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .word3 {
          width: 96px;
          height: 23px;
        }
        .count-down {
          margin-left:16px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 219px;
          height: 30px;
          font-size: 22px;
          color: #DEA000;
          background: #fff;
          border-radius: 10px;
        }
      }

    }
    .get-btn {
      margin: 41px 0 0 22px; 
      width: 96px;
      height: 96px;
      img {
        vertical-align: top;
        width: 96px;
        height: 96px;
      }
    }
  }
  @keyframes animation {
    0%{}
    10%{}
    20%{}
    30%{}
    40%{}
    50%{
      transform: rotate(0)
    }
    60%{
      transform: rotate(10deg)
    }
    70%{
      transform: rotate(-10deg)
    }
    80%{
      transform: rotate(10deg)
    }
    90%{
      transform: rotate(-10deg)
    }
    100%{
      transform: rotate(0)
    }
  }
</style>
<template>
  <section class="tjl-task" v-if="tjlData">
    <div class="tjl-container" @click="gotopage">
      <div class="lv">
        <img src="../img/tjltask/LV.png" alt="">
        <template v-for="(item,index) in (tjlData.sort+'').split('')"><img :src="`${require(`../img/tjltask/lv/${item}.png`)}`" alt="" :key="index"></template>
      </div>
      <div class="info">
        <div class="counttime"><span class="sueno">第{{tjlData.issueNo}}季</span> <i>{{countdownTime}}</i></div>
        <div class="name">{{tjlData.taskName}}</div>
        <div class="progress-bg">
          <div class="progress-bar"
               :style="{ width: (tjlData.userProgress / tjlData.finishNum) * 100 + '%' }"></div>
          <div class="progress-text">
            <template v-for="item in (tjlData.userProgress+'').split('')"><img :src="`${require(`../img/tjltask/${item}.png`)}`" alt=""></template>
            <img src="../img/tjltask/split.png" alt=""><template v-for="item in (tjlData.finishNum+'').split('')"><img :src="`${require(`../img/tjltask/${item}.png`)}`" alt=""></template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import Services from '../../../services/task'
  export default {
    name: 'tjlTask',
    data(){
      return {
        tjlData:null,//淘金令任务数据
        countdownTime:'',
        countTimer:null
      }
    },
    methods:{
      gotopage(){
        location.href='https://wap.beeplaying.com/publicComponent/panningWand?isplat=true                                        '
      },
      countDown (time) {
        if (!time) return false
        let date = time
        this.countTimer = setInterval(() => {
          date = date - 1
          if (date <= 0) {
            date = 0
            /** 倒计时结束的时候重置接口 **/
            this.$emit('refresh')
            this.gettjlInfo()
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
            this.countdownTime = `${day}天${countHour}时${countMinute}分${countSecond}秒`
          } else {
            this.countdownTime = `${countHour}时${countMinute}分${countSecond}秒`
          }
        }, 1000)
      },
      async gettjlInfo(){
        let {code:tjlCode,data:tjlData}=(await Services.gettjlTaskPanel()).data
        if(tjlCode==200){
          this.tjlData=tjlData
          this.countDown(this.tjlData.countdown)// countdown 单位秒
        }else {
          this.tjlData=null
        }
      }
    },
    mounted(){
      this.gettjlInfo()
    }
  }
</script>

<style lang="less" scoped>
  .tjl-task {
    margin: 48px 24px 24px;
    .tjl-container {
      display: flex;
      align-items: center;
      padding:62px 0 17px 25px;
      box-sizing: border-box;
      width: 664px;
      height: 200px;
      background: url("../img/tjltask/banner.png");
      background-size: 100% 100%;
      .lv{
        width: 134px;
        height: 121px;
        background: url("../img/tjltask/lv_bg.png");
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 37px;
        img{
          height: 40px;
          &:nth-child(1){
            width: 46px;
            height: 33px;
          }
        }
      }
      .info{
        .counttime{
          width: 280px;
          height: 38px;
          background: url("../img/tjltask/counttime.png");
          background-size: 100% 100%;
          line-height: 38px;
          text-align: center;
          font-size: 22px;
          font-family: hzgb;
          font-weight: 400;
          font-style: italic;
          font-weight: bold;
          color: #FFFFFF;
          .sueno{
            background: linear-gradient(0deg, #CDF9FF 0%, #99FBFF 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          i{
            text-align: left;
            display: inline-block;
            padding-right: 10px;
            margin-left: 9px;
            background: linear-gradient(0deg, #FFFFDF 0%, #FFF58B 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
        .name{
          margin: 8px 0 17px;
          font-size: 22px;
          font-family: Source Han Sans CN;
          font-weight: 500;
          color: #FFFFFF;
        }
        .progress-bg {
          background: #fff;
          width: 370px;
          position: relative;
          height: 32px;
          background: url("../img/tjltask/percent.png");
          background-size: 100% 100%;
          overflow: hidden;
          .progress-bar {
            position: absolute;
            height: 24px;
            top:0;
            bottom: 0;
            left: 4px;
            margin: auto;
            max-width: 362px;
            background: url("../img/tjltask/percent_bar.png");
            background-size:362px 24px;
          }
          .progress-text {
            font-size: 20px;
            color: #575757;
            height: 32px;
            line-height: 32px;
            text-align: center;
            position: absolute;
            left: 0;
            right: 0;
            margin: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            img{
              height: 24px;
            }
          }
        }
      }
    }
  }
</style>

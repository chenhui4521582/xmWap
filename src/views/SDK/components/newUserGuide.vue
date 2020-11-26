<template>
  <div class="new-user-guide" v-if="show">
    <div class="mask"></div>
    <div class="step" v-if="step == 1">
      <div class="icon item">
        <img src="../img/userGuide-1.png" alt="">
      </div>
      <div class="icon2 item">
        <img src="../img/userGuide-arrow.png" alt="">
      </div>
      <div class="icon3 item">
        <img src="../img/cat1.png" alt="">
      </div>
      <div class="icon4 item">
        玩游戏做任务，<br>
        可领取话费券、金叶子、京东卡奖励
      </div>
      <div class="icon5 item" @click="next">
        下一步
      </div>
    </div>
    <div class="step1" v-if="step == 2">
      <div class="icon item">
        <img src="../img/userGuide-2.png" alt="">
      </div>
      <div class="icon2 item">
        <img src="../img/userGuide-arrow.png" alt="">
      </div>
      <div class="icon3 item">
        <img src="../img/cat2.png" alt="">
      </div>
      <div class="icon4 item">
        游戏中每消耗<span>1000</span>金叶子，<br>
        可获得<span>1g</span>鱼干，鱼干为招财猫道具，<br>
        <span>可提升猫等级，开启特权</span>
      </div>
      <div class="icon5 item" @click="closed">
        我知道了<span v-if="time != 0">（{{time}}s）</span>
      </div>
    </div>
  </div>
</template>
<script>
import Services from '@/services/newUserGuide'
import utils from "@/utils/utils"
export default {
  name: 'newUserGuide',
  data: () => ({
    show: false,
    step: 1,
    time: 4
  }),
  methods: {
    next(){
      this.step = 2
      this.countdown()
    },
    countdown () {
      setTimeout(res=> {
        if(this.time == 0) {return}
        this.time = this.time -1
        this.countdown()
      }, 1000)
    },
    _saveNewUserGuide () {
	    Services.saveNewUserGuide({ version: 6, position: 1001 })
    },
    _getNewUserGuide () {
      Services.getNewUserGuide({version: 6}).then(res => {
        let {data} = res.data
        if (data == '1001') {
          this.show = true
          // 阻止浏览器滚动
          utils.ScrollToTop()
          utils.ScrollNoMove()
        }
      })
    },
    closed() {
      if(this.time == 0) {
        this.show = false
        // 允许浏览器滚动
        utils.ScrollMove()
        this._saveNewUserGuide()
      }
    }
  },
  mounted() {
    this._getNewUserGuide()
  }
}
</script>
<style lang="less" scoped>
.new-user-guide {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 12;
  .mask {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 1;
    background: rgba(0,0,0,.7)
  }
  .item {
    position: absolute;
    z-index: 2;
    img {
      vertical-align: top;
      width: 100%;
      height: 100%;
    }
  }
  .step{
    .icon {
      top: 334px;
      right: 39px;
      width: 540px;
      height: 100px;
    }
    .icon2 {
      top: 442px;
      right: 538px;
      width: 38px;
      height: 83px;
    }
    .icon3 {
      z-index: 3;
      top: 474px;
      right: 382px;
      width: 160px;
      height: 193px;
    }
    .icon4 {
      padding: 10px 18px 0 ;
      top: 487px;
      right: 37px;
      width: 360px;
      height: 100px;
      background: url(../img/userGuide-tips1.png) no-repeat center top;
      background-size: 100% 100%; 
      font-size: 20px;
      line-height: 35px;
      color: #fff;
      white-space: nowrap;
    }
    .icon5 {
      z-index: 3;
      top: 573px;
      right: 102px;
      width: 218px;
      height: 88px;
      background: url(../img/userGuide-btn.png) no-repeat center top;
      background-size: 100% 100%; 
      font-size: 24px;
      line-height: 88px;
      text-align: center;
      color: #260E01;
    }
  }
  .step1{
    .icon {
      top: 78px;
      right: 366px;
      width: 230px;
      height: 50px;
    }
    .icon2 {
      top: 134px;
      right: 538px;
      width: 38px;
      height: 83px;
    }
    .icon3 {
      top: 190px;
      right: 372px;
      width: 160px;
      height: 193px;
      z-index: 3;
    }
    .icon4 {
      padding: 10px 15px 0 28px;
      top: 173px;
      right: 37px;
      width: 360px;
      height: 130px;
      background: url(../img/userGuide-tips2.png) no-repeat center top;
      background-size: 100% 100%; 
      font-size: 20px;
      line-height: 32px;
      color: #fff;
      white-space: nowrap;
      span {
        color: #FFC000;
      }
    }
    .icon5 {
      z-index: 3;
      top:298px;
      right: 102px;
      width: 218px;
      height: 88px;
      background: url(../img/userGuide-btn.png) no-repeat center top;
      background-size: 100% 100%; 
      font-size: 20px;
      line-height: 88px;
      text-align: center;
      color: #260E01;
      font-weight: bold;
      span {
        font-size: 20px;
        font-weight: normal;
      }
    }
  }
}
</style>
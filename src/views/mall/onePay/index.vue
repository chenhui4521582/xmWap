<template>
  <main class="one-pay-wrapper">
    <header class="header">
      <img @click="back" class="back" src="./assets/back.png" alt="返回">
      <img v-if="!isShow" class="buy" src="./assets/buy.png" alt="购买">
    </header>
    <section v-if="!isShow" class="goods">
      <img v-if="userInfo" :src="userInfo.productIcon | prodcutIconImg" alt="">
    </section>
    <img src="./assets/luck-draw.png" class="luck-draw" alt="">
    <p class="tip">1元首充购买之后即可进行抽奖</p>
    <div class="lottery">
      <ul class="lottery-items">
        <li :class="[currentIndex === index ? `current item item${index}` : `item item${index}`]"
          v-for="(item, index) in awards" :key="index">
          <img :src="item.awardsImage.split(';')[0] | httpImg" alt="">
        </li>
      </ul>
      <div :class="{'active' : isBuy || isDraw}" class="run-btn" @click="_getOneLotteryAwards">
      </div>
    </div>
    <footer @click="buySubmit" v-if="isBuy" class="footer">
      <img class="arrow" src="./assets/arrow.png" alt="">
      <span></span>
      <img class="arrow rotate" src="./assets/arrow.png" alt="">
    </footer>
    <img v-else class="footer-grey" src="./assets/button-grey.png" alt="">
    <!-- 一元抽奖弹框 -->
    <div class="lotter-award" v-if="showLoeeryAward">
      <div class="mask"></div>
      <div class="center">
        <div class="bg">
          <img src="./assets/lotter-award-bg.png" alt="">
        </div>
        <div class="awards">
          <div class="awards-img">
            <img :src="prize.awardsImg | httpImg" alt="">
          </div>
          <div class="awards-name">
            {{this.prize.awardsName}}
          </div>
        </div>
        <div class="confirm" @click="showLoeeryAward=false">确认</div>
      </div>
    </div>
  </main>
</template>

<script>
import Services from '@/services/activity'
import { bottomBarJump } from '@/utils/utils'
import _get from 'lodash.get'

export default {
  data () {
    return {
      isFirst: true,
      isShow: false,
      animationLock: false,
      currentIndex: 9,
      showLoeeryAward: false,
      prize: null,
      userInfo: null,
      isDraw: false,
      awards: []
    }
  },
  filters: {
    httpImg (item) {
      let img = item.split(';')[0]
      if (img && !img.includes('http')) {
        return '//file.beeplaying.com/' + img
      } else {
        return img
      }
    },
    prodcutIconImg (item) {
      let img = item.split(';')[1]
      if (img && !img.includes('http')) {
        return '//file.beeplaying.com/' + img
      } else {
        return img
      }
    },
  },
  computed: {
    isBuy () {
      return this.userInfo && this.userInfo.buyFlag
    }
  },
  mounted () {
    this.getOneLottery()
    this.getPrize()
  },
  methods: {
    // 获取购买、抽奖资格
    async getOneLottery () {
      const { data: { data } } = await Services.getOneLottery()
      if (this.isFirst) {
        this.isFirst = false
        this.isShow = data.bettingTimes
      }
      this.userInfo = data.newUserFeedbackList[0]
      this.isDraw = data.bettingTimes
    },
    // 获取奖品
    async getPrize () {
      const { data: { data: { awards } } } = await Services.getOneLotteryList({ value: 2 })
      this.awards = awards
      // this.awards.push(this.awards[0])
    },
    /** 转盘动画 **/
    lotteryAnimation (index, callback) {
      /** 默认转的圈数 **/
      this.defaultIndex = 24
      /** 默认速度 **/
      this.defaultSpeed = 30
      /** 终点圈数 **/
      this.endIndex = this.defaultIndex + index
      this.currentIndex = 0
      let animation = () => {
        this.endIndex -= 1
        this.currentIndex += 1
        if (this.currentIndex == 8) {
          this.currentIndex = 0
        }
        if (this.endIndex < 10) {
          this.defaultSpeed += 30
        }
        if (this.endIndex === 0) {
          callback && callback.call(this)
          return false
        }
        setTimeout(() => {
          animation()
        }, this.defaultSpeed)
      }
      animation()
    },
    // 抽奖
    async _getOneLotteryAwards () {
      if (this.isBuy && !this.isDraw) {
        this.$Toast('购买后即可抽奖哦~')
        return
      }
      if (!this.isBuy && !this.isDraw) {
        this.$Toast('已经抽过奖啦')
        return
      }
      if (this.animationLock) return
      const { data: { data } } = await Services.getOneLotteryAwards({ value: 2 })
      this.prize = data
      this.isDraw = this.prize.bettingTimes
      this.awards.forEach((item, index) => {
        if (item.configId === this.prize.configId) {
          this.lotteryAnimation(index, () => {
            this.prize.awardsImg = item.awardsImage.split(';')[0]
            this.showLoeeryAward = true
            this.animationLock = false
          })
        }
      })
    },
    /** 去支付 **/
    buySubmit () {
      localStorage.setItem('payment', JSON.stringify(this.userInfo))
      localStorage.setItem('originDeffer', window.location.href)
      bottomBarJump('#/payment/paymentlist', 'paymentList', this.$router, {
        isBack: true
      })
    },
    // 返回
    back () {
      try {
        if (parent && parent.closeWebView) {
          parent && parent.closeWebView()
        } else {
          history.go(-1)
        }
      } catch (error) {
        history.go(-1)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@keyframes move {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(20px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes rotate-move {
  0% {
    transform: translateX(0) rotate(-180deg);
  }
  50% {
    transform: translateX(-20px) rotate(-180deg);
  }
  100% {
    transform: translateX(0) rotate(-180deg);
  }
}

.one-pay-wrapper {
  background: #feddaa;
  min-height: 100vh;
  padding-bottom: 104px;
  position: relative;
  .header {
    background: url('./assets/banner.png') no-repeat;
    background-size: cover;
    height: 656px;
    position: relative;
    .back {
      width: 80px;
      position: absolute;
      top: 44px;
      left: 0;
    }
    .buy {
      width: 434px;
      left: 143px;
      bottom: -17px;
      position: absolute;
    }
  }
  .goods {
    padding: 40px 22px 0;
    img {
      width: 100%;
    }
  }
  .luck-draw {
    display: block;
    width: 434px;
    margin: 63px auto 0;
  }
  .tip {
    font-size: 22px;
    text-align: center;
    color: #b18643;
    padding: 17px 0 22px;
  }
  .content {
    width: 670px;
    background: url('./assets/draw-bg.png') no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    padding: 47px 53px 27px 53px;
    display: flex;
    flex-wrap: wrap;
    color: #944d00;
    font-size: 24px;
    .prize {
      width: 175px;
      height: 144px;
      margin-right: 19px;
      padding-bottom: 16px;
      box-sizing: border-box;
      background: #ffd9a2;
      border-radius: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      &:nth-child(3n + 3) {
        margin-right: 0;
      }
      img {
        width: 90px;
      }
    }
    .draw-button {
      width: 175px;
      height: 144px;
      margin-right: 19px;
      box-sizing: border-box;
      img {
        width: 100%;
      }
    }
  }
  .footer-grey {
    width: 100%;
    height: 104px;
    position: fixed;
    bottom: 0;
  }
  .footer {
    width: 100%;
    padding: 0 91px;
    height: 104px;
    position: fixed;
    bottom: 0;
    background: url('./assets/button.png') no-repeat;
    background-size: cover;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .arrow {
      width: 85px;
      animation: move 1s infinite ease-in-out;
      &.rotate {
        animation: rotate-move 1s infinite ease-in-out;
      }
    }
  }
  .lottery {
    position: relative;
    width: 670px;
    background: url('./assets/draw-bg.png') no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    // width: 560px;
    height: 580px;
    .bg {
      width: 100%;
      img {
        vertical-align: top;
        width: 100%;
      }
    }
    .lottery-items {
      position: absolute;
      top: 0px;
      left: 0;
      width: 100%;
      li {
        position: absolute;
        width: 175px;
        height: 144px;
        background: url('./assets/lottery-item.png') no-repeat center center;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 60%;
          max-height: 100%;
        }
        &.current {
          background: url('./assets/one_lottery_active.png') no-repeat center
            center;
          background-size: 100% 100%;
        }
        &.item0 {
          top: 50px;
          left: 50px;
        }
        &.item1 {
          top: 50px;
          left: 248px;
        }
        &.item2 {
          top: 50px;
          right: 50px;
        }
        &.item3 {
          top: 220px;
          right: 50px;
        }
        &.item4 {
          top: 390px;
          right: 50px;
        }
        &.item5 {
          top: 390px;
          left: 248px;
        }
        &.item6 {
          top: 390px;
          left: 50px;
        }
        &.item7 {
          top: 220px;
          left: 50px;
        }
      }
    }
    .run-btn {
      position: absolute;
      padding-bottom: 8px;
      width: 175px;
      height: 144px;
      left: 248px;
      top: 220px;
      background: url('./assets/draw-grey.png') no-repeat center center;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #cf3600;
      font-size: 24px;
      font-weight: bolder;
      &.active {
        background: url('./assets/draw.png') no-repeat center center;
        background-size: 100% 100%;
      }
    }
    .closed {
      position: absolute;
      left: 50%;
      bottom: -90px;
      z-index: 2;
      display: flex;
      justify-content: center;
      width: 62px;
      height: 62px;
      transform: translate(-50%, 0);
      color: #fff;
      background: url('~@/assets/images/global-close.png') no-repeat center
        center;
      background-size: 60px 60px;
    }
  }
  .lotter-award {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 11;
    .mask {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.2);
      z-index: 1;
    }
    .center {
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 3;
      padding-top: 220px;
      width: 560px;
      height: 645px;
      .bg {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        img {
          vertical-align: top;
          width: 100%;
        }
      }
      .awards {
        position: relative;
        z-index: 2;
        .awards-img {
          text-align: center;
          height: 160px;
          img {
            vertical-align: top;
            height: 100%;
          }
        }
        .awards-name {
          text-align: center;
          font-size: 26px;
          color: #fff;
          font-weight: 700;
          margin-top: 5%;
        }
      }
      .confirm {
        position: relative;
        z-index: 2;
        width: 50%;
        display: block;
        border: none;
        padding: 3% 0;
        margin: 10% auto;
        text-align: center;
        font-size: 28px;
        background-image: -webkit-gradient(
          linear,
          left top,
          left bottom,
          from(#fff2c5),
          to(#ffc600)
        );
        background-image: -webkit-linear-gradient(#fff2c5, #ffc600);
        background-image: linear-gradient(#fff2c5, #ffc600);
        font-weight: bolder;
        color: #cf3600;
        border-radius: 40px;
        -webkit-box-shadow: 1px 4px 10px rgba(0, 0, 0, 0.3);
        box-shadow: 1px 4px 10px rgba(0, 0, 0, 0.3);
      }
    }
  }
}
</style>

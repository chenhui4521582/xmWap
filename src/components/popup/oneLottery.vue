<template>
  <transition :name="hideAnimation">
    <div class="one-lottery" v-if="showOneLottery">
      <div class="mask"></div>
      <!-- 一元礼包 -->
      <div class="content" v-if="showCard">
        <div class="body">
          <!-- 跑马灯 -->
          <div class="horn">
            <swiper :options="defaultOptions" v-if="showHorn">
              <swiper-slide v-for="(item, index) in oneLotteryHornData" :key="index">
                <div class="text">恭喜{{ item.name }}抽到{{ item.awardName }}</div>
              </swiper-slide>
            </swiper>
          </div>
          <!-- 礼包内容 -->
          <div class="awards">
            <img v-if="clearFerrule" class="prize" src="./img/one_lottery/prize.png" alt />
            <img v-else class="prize" src="./img/one_lottery/price-tq.png" alt />
          </div>
          <div class="buySubmit" @click="buySubmit">1元购买</div>
        </div>
        <div class="closed" @click="closed"></div>
      </div>
      <!-- 一元抽奖 -->
      <div class="lottery" v-if="showOneLotteryRun">
        <div class="bg">
          <img src="./img/one_lottery/lottery-bg.png" alt="">
        </div>
        <ul class="lottery-items">
          <li :class="[currentIndex === index ? `current item item${index}` : `item item${index}`]" v-for="(item, index) in oneLotteryList.awards" :key="index">
            <img :src="item.awardsImage.split(';')[0] | filter" alt="">
          </li>
        </ul>
        <div class="run-btn" @click="_getOneLotteryAwards">
          立即<br>抽奖
        </div>
        <div class="closed" @click="closed" v-if="!showLoeeryAward"></div>
      </div>
      <!-- 一元抽奖弹框 -->
      <div class="lotter-award" v-if="showLoeeryAward">
        <div class="mask"></div>
        <div class="center">
          <div class="bg">
            <img src="./img/one_lottery/lotter-award-bg.png" alt="">
          </div>
          <div class="awards">
            <div class="awards-img">
              <img :src="lotteryAward.awardsImg | filter" alt="">
            </div>
            <div class="awards-name">
              {{this.lotteryAward.awardsName}}
            </div>
          </div>
          <div class="confirm" @click="hideLotteryAward">确认</div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Services from '@/services/activity'
import _get from 'lodash.get'
import { bottomBarJump, newUtils } from '@/utils/utils'
export default {
  name: 'oneLottery',
  props: {
    animation: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    defaultOptions: {
      autoplay: {
        delay: 1000,
        stopOnLastSlide: false,
        disableOnInteraction: true,
      },
      loop: true,
      direction: 'vertical',
      observer: true,
      observeParents: true,
      height: 48
    },
    showOneLottery: false,
    oneLotteryHornData: [],
    /** 抽奖转盘 **/
    oneLotteryList: {},
    currentIndex: 0,
    /** 抽奖转盘弹框 **/
    showLoeeryAward: false,
    lotteryAward: {},
    animationLock: false
  }),
  components: {
    swiper,
    swiperSlide
  },
  computed: {
    curChannel () {
      return localStorage.getItem('APP_CHANNEL') ? localStorage.getItem('APP_CHANNEL') : this.getUrlParam('channel')
    },
    // src/views/payment/components/oneLotteryBanner.vue 还有一处
    clearFerrule () {
      return true
      // 以下为百度系套圈图标屏蔽
      // return (
      //   this.curChannel != '100039' &&
      //   this.curChannel != '100073' &&
      //   this.curChannel != '100039001' &&
      //   this.curChannel != '100042' &&
      //   this.curChannel != '100047' &&
      //   this.curChannel != '100048'
      // )
    },
    showHorn () {
      return this.oneLotteryHornData.length
    },
    showCard () {
      return this.oneLotteryData[0] && this.oneLotteryData[0].buyStatus === 0 || this.isNew
    },
    showOneLotteryRun () {
      return (this.oneLotteryData[0] && this.oneLotteryData[0].buyStatus === 1 || !this.isNew) && this.bettingTimes > 0
    },
    hideAnimation () {
      return this.animation ? 'hide' : ''
    }
  },
  methods: {
    /** 关闭弹框 **/
    closed () {
      /** 解除滚动条锁定 **/
      this.showOneLottery = false
      /** 删除数据 **/
      this.oneLotteryHornData = []
    },
    /** 获取一元夺宝数据 **/
    _getOneLottery () {
      Services.getOneLottery().then(res => {
        let { code, message } = _get(res, 'data', '')
        if (code === 200) {
          let { bettingTimes, newUserFeedbackList, isNew } = _get(res, 'data.data', null)
          this.oneLotteryData = newUserFeedbackList
          this.bettingTimes = bettingTimes
          this.isNew = isNew
          if (this.oneLotteryData[0] && this.oneLotteryData[0].buyStatus === 0 || this.isNew) {
            /** 获取购买用户记录跑马灯数据 **/
            this.showOneLottery = true
            this._getOneLotteryHornData()
          } else if ((this.oneLotteryData[0] && this.oneLotteryData[0].buyStatus === 1 || !this.isNew) && this.bettingTimes > 0) {
            this._getOneLotteryList()
          } else if ((this.oneLotteryData[0] && this.oneLotteryData[0].buyStatus === 1 || !this.isNew) && this.bettingTimes === 0) {
            this.$Toast('您已购买过该商品哦~')
          } else {
            this.$Toast('该商品已售罄~')
          }
        } else {
          this.$Toast(message)
        }
      })
    },
    /** 获取一元夺宝列表 **/
    _getOneLotteryList () {
      Services.getOneLotteryList({ value: 2 }).then(res => {
        let { data, code } = _get(res, 'data', {})
        if (code === 200) {
          this.showOneLottery = true
          this.oneLotteryList = data
        }
      })
    },
    /** 获取一元夺宝购买记录 **/
    _getOneLotteryHornData () {
      Services.getOneLotteryHornData({ version: 2 }).then(res => {
        this.oneLotteryHornData = _get(res, 'data.data', [])
      })
    },
    /** 去支付 **/
    buySubmit () {
      this.closed()
      if (!this.oneLotteryData[0]) {
        return false
      }
      localStorage.setItem('payment', JSON.stringify(this.oneLotteryData[0]))
      localStorage.setItem('originDeffer', window.location.href)
      bottomBarJump('#/payment/paymentlist', 'paymentList', this.$router)
    },
    /** 获取一元礼包转盘的值 **/
    _getOneLotteryAwards () {
      /** 动画锁 **/
      if (this.animationLock) return false
      this.animationLock = true
      Services.getOneLotteryAwards({ value: 2 }).then(res => {
        let { code, data, message } = _get(res, 'data', '')
        if (code === 200) {
          this.lotteryAward = data
          this.oneLotteryList.awards.forEach((item, index) => {
            if (item.configId === this.lotteryAward.configId) {
              this.lotteryAnimation(index, () => {
                this.lotteryAward.awardsImg = item.awardsImage.split(';')[0]
                this.showLoeeryAward = true
                this.animationLock = false
              })
            }
          });
        } else {
          this.animationLock = false
          this.$Toast(message)
        }
      })
    },
    /** 转盘动画 **/
    lotteryAnimation (index, callback) {
      /** 默认转的圈数 **/
      this.defaultIndex = 24;
      /** 默认速度 **/
      this.defaultSpeed = 30;
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
    /** 关闭转盘奖品 **/
    hideLotteryAward () {
      this.showLoeeryAward = false
    },
    init () {
      this._getOneLottery()
    }
  },
  watch: {
    showOneLottery (value) {
      if (value) {
        newUtils.ScrollNoMove()
      } else {
        newUtils.ScrollMove()
      }
    }
  }
}
</script>

<style scoped lang="less">
.one-lottery {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 14;
  .mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 1;
  }
  .content {
    position: absolute;
    left: 50%;
    top: 47%;
    transform: translate(-50%, -50%);
    padding-top: 320px;
    width: 100%;
    height: 920px;
    background: url('./img/one_lottery/bg.png') no-repeat top center;
    background-size: 100% auto;
    z-index: 2;
    .horn {
      overflow: hidden;
      box-sizing: border-box;
      padding: 0 3%;
      margin: 0 auto 20px;
      width: 63%;
      height: 48px;
      line-height: 48px;
      background: #c44d2f;
      text-align: center;
      color: #ffe355;
      font-size: 24px;
      border-radius: 40px;
    }
    .awards {
      margin: 0 auto;
      width: 72%;
      img {
        vertical-align: top;
        width: 100%;
      }
    }
    .buySubmit {
      margin: 20px auto 0;
      padding-bottom: 10px;
      width: 310px;
      height: 80px;
      background: url('./img/one_lottery/btn.png') no-repeat top center;
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bolder;
      color: #cf3600;
      font-size: 26px;
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
  .lottery {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 560px;
    height: 585px;
    z-index: 2;
    .bg {
      width: 100%;
      img {
        vertical-align: top;
        width: 100%;
      }
    }
    .lottery-items {
      position: absolute;
      top: 100px;
      left: 0;
      width: 100%;
      li {
        position: absolute;
        width: 140px;
        height: 120px;
        background: url('./img/one_lottery/lottery-item.png') no-repeat center center;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 60%;
          max-height: 100%;
        }
        &.current {
          background: url('./img/one_lottery/one_lottery_active.png') no-repeat center center;
          background-size: 100% 100%;
        }
        &.item0 {
          top: 50px;
          left: 50px;
        }
        &.item1 {
          top: 50px;
          left: 210px;
        }
        &.item2 {
          top: 50px;
          right: 50px;
        }
        &.item3 {
          top: 190px;
          right: 50px;
        }
        &.item4 {
          top: 330px;
          right: 50px;
        }
        &.item5 {
          top: 330px;
          left: 210px;
        }
        &.item6 {
          top: 330px;
          left: 50px;
        }
        &.item7 {
          top: 190px;
          left: 50px;
        }
      }
    }
    .run-btn {
      position: absolute;
      padding-bottom: 8px;
      width: 130px;
      height: 130px;
      left: 215px;
      top: 290px;
      background: url('./img/one_lottery/run-btn.png') no-repeat center center;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #cf3600;
      font-size: 24px;
      font-weight: bolder;
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
      position: absolute;
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
.hide-leave-active {
  animation: hideAnimation 1s ease-in-out;
}
@keyframes hideAnimation {
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(0.1);
  }
  100% {
    transform-origin: 675px 685px;
    transform: scale(0);
  }
}
</style>

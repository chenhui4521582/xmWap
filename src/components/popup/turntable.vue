<template>
  <transition :name="hideAnimation">
    <div class="turntable" v-if="showTurntable">
      <div class="mask"></div>
      <div class="content">
        <div class="title" @click="openPreference">
          <img src="./img/turntable/top_title.png" alt />
        </div>
        <div class="wrapper">
          <img class="bg" src="./img/turntable/bg.png" alt />
          <div class="light"></div>
          <ul class="awards" ref="awards">
            <li v-for="(item, index) in turntableData.awards" :key="index" :style="domSort(index)">
              <div class="award-name">{{ item.awardsName }}</div>
              <div class="award-img">
                <img :src="item.awardsImage | filter" alt />
              </div>
            </li>
          </ul>
          <div class="awards-btn disabled" v-if="turntableData.enabled === 2">
            <span class="turn-countdown">{{ countTime }}</span>
          </div>
          <div class="awards-btn run" @click="runLottery" v-else>
            <span class="turn-countdown"
              v-if="turntableData.enabled === 3">({{ turntableData && turntableData.leftDays }}天)</span>
          </div>
        </div>
        <div class="rule-btn" @click="openRule">活动规则</div>
        <div class="turntable-closed" v-if="!showRule" @click="hideTurntable"></div>
      </div>
      <!-- 规则 -->
      <div class="rule" v-if="showRule">
        <div class="text">
          <h4>
            ————
            <span>活动规则</span>
            ————
          </h4>
          <p>●即日起，只要在平台充值任意金额，立即畅享每日幸运转盘VIP特权(30天内有效)</p>
          <p>●幸运转盘每24小时刷新一次，您可以在刷新时间结束后直接参与幸运转盘，获得丰厚的游戏奖励</p>
          <p>●幸运转盘VIP特权自参与活动起30个自然日内有效，该特权将在您最后一次充值的第31天后自动解除</p>
        </div>
        <div class="rule-closed" @click="hideRule"></div>
      </div>
      <!-- 奖品弹框 -->
      <div class="awards-pop" v-if="showAward">
        <div class="mask"></div>
        <div class="content">
          <div class="award-img">
            <img :src="awards.awardsImg | filter" alt />
          </div>
          <div class="award-name">{{ awards.awardsName }}</div>
          <div class="play-btn" v-if="isGameGift" @click="handleClickPlayBtn">前往领取</div>
          <div class="recommend" v-else @click="handleClickRecommend">
            <img :src="awardsBanner.image|filter" alt />
          </div>
          <div class="closed" @click="hideAward"></div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script type="text/javascript">
import { mapActions, mapMutations } from 'vuex'
import _get from 'lodash.get'
import Services from '@/services/activity'
import { jumpUrl, newUtils } from '@/utils/utils'
export default {
  name: 'turntable',
  props: {
    animation: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    /** 是否显示 **/
    showTurntable: false,
    /** 转盘列表 **/
    turntableData: {},
    /** 规则 **/
    showRule: false,
    showAwards: false,
    /** 倒计时 **/
    countTime: '00:00:00',
    /** 奖品 **/
    awards: {},
    showAward: false,
    /** 奖品banner图 **/
    awardsBanner: {}
  }),
  computed: {
    isGameGift () {
      let giftArray = [40, 41, 43, 32]
      return giftArray.indexOf(this.awards.awardsType) > -1
    },
    hideAnimation () {
      return this.animation ? 'hide' : ''
    }
  },
  methods: {
    ...mapActions(['GET_USERINFO']),
    ...mapMutations(['SET_TURNTABLE_REDDOT']),
    /** 打开充值特惠 **/
    openPreference () {
      this.$emit('openPreference')
      this.$marchSetsPoint('A_H5PT0019002026')
    },
    /** 关闭转盘 **/
    hideTurntable () {
      this.showTurntable = false
      this.$parent.initDialog()
    },
    /** 打开规则 **/
    openRule () {
      this.showRule = true
    },
    /** 关闭规则 **/
    hideRule () {
      this.showRule = false
    },
    /** 关闭奖品弹框 **/
    hideAward () {
      this.showAward = false
    },
    /** 打开奖品弹框 **/
    openAward () {
      this.showAward = true
      if (this.awards.jumpUrl) this.$marchSetsPoint('A_H5PT0225003043')
    },
    /** 计算转盘奖品角度 **/
    domSort (index) {
      let mean = Math.floor(360 / this.turntableData.awards.length)
      return `transform: rotate(${Math.floor(mean * (index + 0.5))}deg)`
    },
    /** 倒计时 **/
    countDown (time) {
      if (!time) return false
      this.countTime = '00:00:00'
      clearInterval(this.timer)
      let date = time / 1000
      this.timer = setInterval(() => {
        date = date - 1
        if (date <= 0) {
          date = 0
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
    /** 转盘转动 **/
    runLottery () {
      Services.getTurnTableAward((betting, banner) => {
        let { code, data, message } = _get(betting, 'data', {})
        if (code === 200) {
          this.awards = data
          let dom = this.$refs.awards
          let current =
            this.turntableData.awards &&
            this.turntableData.awards.find((item, index) => {
              return this.awards.sort === item.sort
            })
          /** 打开动画 **/
          this.turntableAnimation(dom, current.sort, () => {
            this.awardsBanner = _get(banner, 'data.data[0]', {})
            this.openAward()
            /** 通知父级重新拉取数据 **/
            this._getTurntable()
            /** 更新用户数据 **/
            this.GET_USERINFO()
            /** 更新转盘红点 **/
            this.SET_TURNTABLE_REDDOT(false)
          })
        } else if (code === 123) {
          /** 打开充值特惠 **/
          this.$emit('openPreference')
        } else {
          this.$Toast(message)
        }
      })
    },
    /** 转盘动画 **/
    turntableAnimation (dom, index, callback) {
      /** 动画没有执行完的时候 不可以再次点击**/
      if (this.animationLock) {
        return false
      }
      this.animationLock = true
      /** 当前转了几次了 **/
      this.newNumber = this.newNumber === undefined ? 0 : this.newNumber
      /** 动画默认圈数 **/
      this.animationRoate = 9 * 360
      /** 旋转次数+1 **/
      this.newNumber += 1
      /** 停止位置大于奖品个数，旋转角度=0 **/
      if (index >= dom.childNodes.length) {
        index = 0
      }
      /** 上次度数 **/
      let provDeg = this.newNumber * this.animationRoate
      /** 奖品所在位置角度 **/
      let awardDeg = index * Math.ceil(360 / dom.childNodes.length)
      /** 随机度数 **/
      let MathDeg = 180 / dom.childNodes.length
      /** 最终旋转度数 = 上次度数  + 奖品所在位置角度 + 随机度数  **/
      dom.style.transition = 'all 3.2s ease-in-out'
      dom.style.transform = `translate(-50%, 0) rotate(-${provDeg +
        awardDeg +
        MathDeg}deg)`
      /** 动画运行完成解锁并且运行回调 **/
      setTimeout(() => {
        this.animationLock = false
        if (callback) {
          callback && callback.call(this)
        }
      }, 3200)
    },
    /** 强广位点击 **/
    handleClickRecommend () {
      jumpUrl(this.awardsBanner)
    },
    /** 领取游戏道具 **/
    handleClickPlayBtn () {
      this.$marchSetsPoint('A_H5PT0225003044')
      jumpUrl({ url: this.awards.jumpUrl })
    },
    /** 获取转盘夺宝 **/
    _getTurntable (callback) {
      this.showLoading = true
      Services.getTurntable().then(res => {
        this.showLoading = false
        let { code, data } = _get(res, 'data')
        if (code === 200) {
          this.showTurntable = true
          this.turntableData = data
        }
        if (this.turntableData.enabled === 2 && this.turntableData.distanceOpen) {
          this.countDown(this.turntableData.distanceOpen)
        }
        if (callback) {
          callback({
            name: 'turntable',
            isShow: code == 200
          })
        }
      })
    },
    init (callback) {
      this._getTurntable(callback)
    }
  },
  watch: {
    showTurntable (value) {
      if (value) {
        newUtils.ScrollNoMove()
      } else {
        newUtils.ScrollMove()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.turntable {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 13;
  .mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
  }
  .content {
    position: absolute;
    width: 530px;
    top: 47%;
    left: 50%;
    transform: translate(-50%, -50%);
    .title {
      margin: 0 auto 20px;
      height: 168px;
      text-align: center;
      img {
        vertical-align: top;
        height: 100%;
      }
      animation: btnScale 1.5s infinite linear;
    }
    .wrapper {
      position: relative;
      width: 530px;
      height: 700px;
      .bg {
        width: 100%;
        height: 100%;
      }
      .light {
        position: absolute;
        left: 50%;
        top: 10px;
        margin-left: -260px;
        width: 520px;
        height: 520px;
        background: url('./img/turntable/light1.png') no-repeat top center;
        background-size: 100% 100%;
        animation: changeBg 0.3s infinite ease;
      }
      .awards {
        position: absolute;
        left: 50%;
        top: 36px;
        transform: translate(-50%, 0) rotate(0);
        width: 458px;
        height: 458px;
        background: url('./img/turntable/split_bg.png') no-repeat top center;
        background-size: 100% 100%;
        li {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          right: 0;
          padding-top: 10px;
          .award-name {
            padding-bottom: 5px;
            text-align: center;
            font-size: 24px;
            color: #c56100;
          }
          .award-img {
            margin: 0 auto;
            width: 84px;
            height: 84px;
            img {
              vertical-align: top;
              width: 100%;
            }
          }
        }
      }
      .awards-btn {
        position: absolute;
        left: 50%;
        top: 150px;
        transform: translate(-50%, 0);
        width: 206px;
        height: 222px;
        &.run {
          background: url('./img/turntable/enabled.png') no-repeat top center;
          background-size: 100% 100%;
          span {
            position: absolute;
            bottom: 55px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 22px;
            color: #fff;
            -webkit-text-stroke: 2px #854528;
            font-weight: bold;
          }
        }
        &.disabled {
          background: url('./img/turntable/disabled.png') no-repeat top center;
          background-size: 100% 100%;
          span {
            position: absolute;
            bottom: 65px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 22px;
            color: #fff;
            -webkit-text-stroke: 0.02rem hsla(0, 0%, 42%, 0.6);
          }
        }
      }
    }
    .rule-btn {
      position: absolute;
      right: 30px;
      bottom: 150px;
      z-index: 2;
      width: 86px;
      height: 76px;
      line-height: 40px;
      text-align: center;
      font-size: 18px;
      color: #fff;
      background: url('./img/turntable/rule-btn.png') no-repeat top center;
      background-size: 100% 100%;
    }
    .turntable-closed {
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
  .rule {
    position: absolute;
    left: 50%;
    top: 250px;
    transform: translate(-50%, 0);
    width: 623px;
    height: 653px;
    background: url('//file.beeplaying.com/cdn/wap/images/payTurntable/rule-bg.png')
      no-repeat center center;
    background-size: 100% 100%;
    .text {
      padding: 60px 60px 0;
      line-height: 40px;
      font-size: 24px;
      color: #fff;
    }
    .rule-closed {
      width: 61px;
      height: 64px;
      position: absolute;
      right: -10px;
      top: -20px;
      background: url('//file.beeplaying.com/cdn/common/images/payTurntable/bigClose.png')
        no-repeat center center;
      background-size: 100% 100%;
    }
  }
  .awards-pop {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    .mask {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      background: rgba(0, 0, 0, 0.7);
    }
    .content {
      position: absolute;
      padding-top: 354px;
      width: 100%;
      height: 730px;
      left: 50%;
      top: 30%;
      transform: translate(-50%, -50%);
      background: url('./img/turntable/award-bg.png') no-repeat top center;
      background-size: 100% auto;
      border-radius: 50px;
      .award-img {
        margin: 0 auto;
        width: 158px;
        height: 156px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          display: block;
          max-width: 100%;
          max-height: 100%;
        }
      }
      .award-name {
        height: 26px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
      }
      .recommend {
        margin: 22px auto 0;
        width: 364px;
        height: 118px;
        img {
          vertical-align: top;
          width: 100%;
          height: 100%;
        }
      }
      .play-btn {
        margin: 40px auto 0;
        width: 318px;
        height: 103px;
        background: url('./img/turntable/award-btn.png') no-repeat top center;
        background-size: 100% 100%;
        text-align: center;
        line-height: 85px;
        font-size: 30px;
        font-weight: bold;
        color: rgba(144, 79, 34, 1);
      }
      .closed {
        position: absolute;
        left: 50%;
        bottom: -80px;
        z-index: 2;
        width: 60px;
        height: 60px;
        transform: translate(-50%, 0);
        background: url('./img/turntable/turntable-closed.png') no-repeat top
          center;
        background-size: 100% 100%;
      }
    }
  }
}
@keyframes changeBg {
  0% {
    background: url('./img/turntable/light1.png') no-repeat center center;
    background-size: 100% 100%;
  }

  100% {
    background: url('./img/turntable/light2.png') no-repeat center center;
    background-size: 100% 100%;
  }
}
@keyframes btnScale {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.1);
  }

  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
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

<template>
  <section>
    <div class="pop-mask-new" v-if="showPop"></div>
    <div class="egg-content" v-if="showPop">
      <div class="before" :class="{step1:step===1,step2:step===2}">
        <div class="bottom"></div>
        <div class="egg" @click.stop="clickEgg()">
          <div class="crack" v-if="step===2"></div>
        </div>
        <div class="hammer" @click.stop="clickEgg()"></div>
        <div class="close" @click="close()"></div>
      </div>
      <div class="after" :class="{step2:step===2}">
        <div class="text">20元</div>
        <div class="btn" @click="goGame()"></div>
        <div class="handle"></div>
        <div class="other">
          已有{{recieveCount}}人提现
        </div>
        <div class="close" @click="close()"></div>
      </div>
    </div>
  </section>
</template>

<script>
import Services from '@/services/index'
import { jumpUrl } from '@/utils/utils'
export default {
  name: '',
  components: {

  },
  data () {
    return {
      step: 0,
      timer: null,
      showPop: false,
      gameUrl: '',
      recieveCount: 0
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      try {
        const res = await Services.newUserEggGuide()
        let { data, code } = res.data
        if (code === 200) {
          this.step = 1
          this.showPop = true
          this.gameUrl = data.gameUrl
          this.recieveCount = data.recieveCount
          this.$marchSetsPoint('A_H5PT0019001825')
          this.timer = setTimeout(() => {
            this.step = 2
            this.$marchSetsPoint('A_H5PT0019001827', { status: 0 })
            clearTimeout(this.timer)
          }, 3000)
        } else {
          this.close()
        }
      } catch (error) {
        this.close()
      }
    },
    clickEgg () {
      clearTimeout(this.timer)
      this.step = 2
      this.$marchSetsPoint('A_H5PT0019001827', { status: 1 })
    },
    goGame () {
      this.$marchSetsPoint('A_H5PT0019001829')
      jumpUrl({ url: this.gameUrl })
    },
    close () {
      if (this.step === 1) {
        this.$marchSetsPoint('A_H5PT0019001826')
      } else if (this.step === 2) {
        this.$marchSetsPoint('A_H5PT0019001830')
      }
      clearTimeout(this.timer)
      this.showPop = false
    }
  }
}
</script>

<style lang="less" scoped>
.pop-mask-new {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 100;
}
.egg-content {
  position: fixed;
  left: 0;
  top: 150px;
  width: 100%;
  height: 860px;
  z-index: 100;
}
.before {
  position: absolute;
  width: 500px;
  height: 684px;
  left: 50%;
  margin-left: -250px;
  z-index: 100;
  .bg-paved('../img/newUserEgg/bg.png');
  transform: scale(1);
  transform-origin: center bottom; /*定义动画的旋转中心点*/
  .bottom {
    position: absolute;
    bottom: -50px;
    left: 50%;
    margin-left: -250px;
    width: 500px;
    height: 100px;
    .bg-paved('../img/newUserEgg/bottom.png');
  }
  .egg {
    position: absolute;
    bottom: -40px;
    left: 50%;
    margin-left: -125px;
    width: 250px;
    height: 342px;
    transform-origin: center bottom; /*定义动画的旋转中心点*/
    .bg-paved('../img/newUserEgg/egg.png');
    &::before {
      content: '';
      position: absolute;
      bottom: -28px;
      right: -192px;
      width: 220px;
      height: 186px;
      transform-origin: left top;
      transform: rotate(180deg);
      z-index: 101;
      .bg-paved('../img/newUserEgg/egg-top.png');
      opacity: 0;
    }
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      width: 250px;
      height: 250px;
      .bg-paved('../img/newUserEgg/egg-bottom.png');
      opacity: 0;
    }
    .crack {
      position: absolute;
      top: 84px;
      left: 3px;
      width: 0;
      height: 122px;
      background: url('../img/newUserEgg/crack.png') no-repeat left;
      background-size: cover;
      z-index: 101;
      animation: showCrack 1s ease-in-out 1s forwards;
    }
  }
  .hammer {
    position: absolute;
    bottom: -36px;
    right: -40px;
    width: 240px;
    height: 292px;
    transform-origin: right bottom; /*定义动画的旋转中心点*/
    .bg-paved('../img/newUserEgg/hammer.png');
    opacity: 1;
    z-index: 101;
  }
  &.step1 {
    .egg {
      animation: eggRoute5 2s linear infinite;
    }
    .hammer {
      animation: hammerRoute5 0.8s linear infinite;
    }
  }
  &.step2 {
    animation: hiddenBefore 0.5s ease-in-out 1 forwards 2.4s;
    .egg {
      animation: eggHiden 0s ease-in-out 2s forwards;
      &::before {
        animation: eggTopShow 0.4s ease-in-out 2s forwards;
      }
      &::after {
        animation: eggShow 0s ease-in-out 2s forwards;
      }
    }
    .hammer {
      animation: hammerRoute10 2s ease-in-out 1 forwards;
    }
  }
  .close {
    bottom: -132px;
  }
}
.after {
  width: 720px;
  height: 904px;
  position: absolute;
  top: 0;
  left: 50%;
  margin-left: -360px;
  z-index: -1;
  opacity: 0;
  background: url('../img/newUserEgg/end-bg.png') no-repeat center top;
  background-size: cover;
  transform-origin: center 68%; /*定义动画的旋转中心点*/
  .text {
    color: #f62d37;
    font-size: 110px;
    text-align: center;
    margin-top: 258px;
  }
  .btn {
    position: absolute;
    bottom: 170px;
    left: 50%;
    margin-left: -125px;
    width: 250px;
    height: 92px;
    border-radius: 46px;
    .bg-paved('../img/newUserEgg/btn.png');
  }
  .other {
    position: absolute;
    bottom: 110px;
    width: 100%;
    font-size: 24px;
    color: #fff;
    text-align: center;
  }
  .handle {
    position: absolute;
    width: 130px;
    height: 96px;
    bottom: 90px;
    right: 90px;
    .bg-paved('../img/newUserEgg/handle.png');
  }
  &.step2 {
    z-index: 101;
    animation: showAfter 0.5s ease-in-out 1 forwards 2.4s;
    .btn {
      animation: bgChange 1s linear infinite 3s;
    }
    .handle {
      animation: handleChange 1s linear infinite 3s;
    }
  }
  .close {
    bottom: 24px;
  }
}
.close {
  width: 60px;
  height: 60px;
  position: absolute;
  left: 50%;
  margin-left: -26px;
  .bg-paved('~@/assets/images/global-close.png');
}
.bg-paved(@url) {
  background: url(@url) no-repeat center;
  background-size: 100% 100%;
}
@keyframes eggRoute5 {
  25% {
    transform: rotate(-5deg);
  }
  75% {
    transform: rotate(5deg);
  }
}
@keyframes showCrack {
  0% {
    width: 0;
  }
  99% {
    width: 222px;
  }
  100% {
    width: 0;
  }
}
@keyframes hammerRoute5 {
  0% {
    transform: rotate(20deg);
  }
  50% {
    transform: rotate(15deg);
  }
  100% {
    transform: rotate(20deg);
  }
}
@keyframes hammerRoute10 {
  0% {
    transform: rotate(20deg);
  }
  10% {
    transform: rotate(10deg);
  }
  30% {
    transform: rotate(30deg);
  }
  50% {
    transform: rotate(-5deg);
  }
  56% {
    transform: rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: rotate(0deg);
    opacity: 0;
  }
}
@keyframes eggHiden {
  100% {
    .bg-paved('');
  }
}
@keyframes eggHiden {
  100% {
    .bg-paved('');
  }
}
@keyframes eggShow {
  100% {
    opacity: 1;
  }
}
@keyframes eggTopShow {
  0% {
    opacity: 1;
  }
  100% {
    bottom: 10px;
    transform: rotate(360deg);
    opacity: 1;
  }
}
@keyframes bgChange {
  0% {
    transform: scale(1);
    box-shadow: none;
  }
  49% {
    transform: scale(1);
    box-shadow: none;
  }

  50% {
    transform: scale(0.95);
    box-shadow: 0 0 100px #ffc923;
  }
  99% {
    transform: scale(0.95);
    box-shadow: 0 0 100px #ffc923;
  }
  100% {
    transform: scale(1);
    box-shadow: none;
  }
}
@keyframes handleChange {
  0% {
    bottom: 90px;
    right: 90px;
  }
  48% {
    bottom: 90px;
    right: 90px;
  }

  49% {
    bottom: 110px;
    right: 126px;
  }
  98% {
    bottom: 110px;
    right: 126px;
  }
  100% {
    bottom: 90px;
    right: 90px;
  }
}
@keyframes hiddenBefore {
  50% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0);
  }
}
@keyframes showAfter {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

<template>
  <article v-if="isShow" class="task-first-wrapper"
    :class="{'showHeader': $moduleConfig.isShowHeader}" @touchmove.prevent="">
    <div class="newVersionTaskFirst" v-if="step&&step<3">
      <div class="center" :class="{step1:step===1,step2:step===2}">
        <div class="box">
        </div>
        <div class="desc">
          {{textList[step-1].desc}}
        </div>
        <div class="arrow">
          <img src="../../img/newVersionTask/arrow.png" alt="">
        </div>
        <div class="btn" @click="changeStep()">
          {{textList[step-1].btn}}
          <p v-if="step===1" @click.stop="skip()">跳过</p>
        </div>
      </div>
    </div>
    <div class="newVersionTaskHand" v-if="step===3">
      <div class="center">
        <div class="hand">
          <img src="../../img/newVersionTask/hand.png" alt="">
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import Services from '@/services/newUserGuide'
import utils from '@/utils/utils';
export default {
  name: 'task-first',
  data: () => ({
    isShow: true,
    step: 0,
    textList: [{ desc: '完成限时新手任务累计可得50元话费', btn: '话费能干嘛' }, { desc: '话费可换取iPhone/京东卡等奖品福利', btn: '知道了' }],
    newVersionTaskOpened: {
      task: Date.now()
    },
    handTimer: null
  }),
  methods: {
    changeStep () {
      this.$marchSetsPoint('A_H5PT0022002640', { 'source_address': this.step }) // H5平台-任务-新手任务-新手引导蒙层-点击下一步
      this.step++
    },
    skip () {
      this.step = 3
      this.$marchSetsPoint('A_H5PT0022002641') // H5平台-任务-新手任务-新手引导3点击跳过
    }
  },
  mounted () {
    this.step = 1
    this.$marchSetsPoint('A_H5PT0022002639') // H5平台-任务-新手任务-新手引导蒙层加载完成
    localStorage.setItem('newVersionTaskOpened', JSON.stringify(this.newVersionTaskOpened))
  },
  watch: {
    step (val) {
      if (val && val < 3) {
        utils.ScrollNoMove()
        return
      }
      this.handTimer = setTimeout(() => {
        this.step = 0
        clearTimeout(this.handTimer)
      }, 3000)
      utils.ScrollMove()
    }
  },
  destroyed () {
    clearTimeout(this.handTimer)
  }
}
</script>

<style lang="less" scope>
.newVersionTaskFirst {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 11;
  .center {
    position: absolute;
    height: 100%;
    width: 100%;
    .box {
      position: absolute;
      box-shadow: 0 0 0 10000px rgba(0, 0, 0, 0.6);
    }
    .arrow {
      width: 78px;
      height: 86px;
      position: absolute;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .desc {
      position: absolute;
      width: 288px;
      padding: 30px 20px;
      background: rgba(0, 0, 0, 0.33);
      border-radius: 16px;
      font-size: 24px;
      font-weight: 400;
      line-height: 38px;
      color: #fff;
    }
    .btn {
      position: absolute;
      width: 170px;
      height: 56px;
      border: 2px solid #fff;
      border-radius: 16px;
      font-size: 24px;
      font-weight: 500;
      line-height: 50px;
      color: #fff;
      text-align: center;
      box-sizing: border-box;
      p {
        color: #bdbdbd;
        margin: 10px auto 0;
        width: 60px;
      }
    }
    &.step1 {
      .box {
        left: 0;
        right: 0;
        top: 180px;
        height: 60px;
      }
      .arrow {
        left: 96px;
        top: 240px;
      }
      .desc {
        left: 54px;
        top: 310px;
      }
      .btn {
        left: 100px;
        top: 470px;
      }
    }
    &.step2 {
      .box {
        right: 12px;
        top: 10px;
        width: 460px;
        height: 126px;
      }
      .arrow {
        right: 300px;
        top: 150px;
      }
      .desc {
        right: 150px;
        top: 220px;
      }
      .btn {
        right: 210px;
        top: 370px;
      }
    }
  }
}
.newVersionTaskHand {
  overflow: hidden;
  .hand {
    position: absolute;
    top: 320px;
    right: 30px;
    width: 75px;
    animation: tranRotateZ 1s linear infinite;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.task-first-wrapper.showHeader {
  .center {
    top: 100px;
  }
  .hand {
    top: 420px;
  }
}
@keyframes tranRotateZ {
  0% {
    transform: rotateZ(0deg);
  }
  50% {
    transform: rotateZ(30deg);
  }
  100% {
    transform: rotateZ(0deg);
  }
}
</style>
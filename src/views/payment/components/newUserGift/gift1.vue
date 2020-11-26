<template>
  <div class="newUserGift" :class="{'showHeader': $moduleConfig.isShowHeader}">
    <div class="center">
      <div class="box">
        <img src="./img/gift1_mask.png" alt="" @click="close(1)">
      </div>
      <div class="bg">
        <img src="./img/gift1_tips.png" alt="">
      </div>
      <div class="circle">
      </div>
      <div class="hand">
        <img src="./img/hand.png" alt="">
      </div>
      <div class="btn" @click="close()">
        暂不需要
      </div>
    </div>
  </div>
</template>

<script>
import Services from '@/services/newUserGuide'
import utils from '@/utils/utils';
export default {
  name: 'new-user-gift',
  data: () => ({
    isShow: true
  }),
  methods: {
    close (val) {
      this.$emit('on-close', val)
    }
  },
  mounted () {
    this.$marchSetsPoint('A_H5PT0023002002')
  }
}
</script>

<style lang="less" scope>
.newUserGift {
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
      top: 12px;
      height: 258px;
      left: 12px;
      right: 12px;
      box-shadow: 0 0 0 10000px rgba(22, 22, 22, 0.7);
      border-radius: 15px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .bg {
      position: absolute;
      left: 0;
      top: 295px;
      width: 696px;
      height: 334px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .btn {
      position: absolute;
      left: 50%;
      bottom: 66px;
      width: 170px;
      height: 56px;
      margin-left: -85px;
      border: 2px solid #bbbbbb;
      border-radius: 16px;
      font-size: 24px;
      font-weight: 500;
      line-height: 50px;
      color: #bbbbbb;
      text-align: center;
      box-sizing: border-box;
    }
    .hand {
      position: absolute;
      top: 220px;
      right: 28px;
      width: 150px;
      animation: tranRotateZ 1s linear infinite;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .circle {
      position: absolute;
      top: 170px;
      right: 84px;
      width: 110px;
      height: 110px;
      border-radius: 50%;
      border: 10px solid #c4f2ec;
      animation: scaleChange 1s linear infinite;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  &.showHeader {
    .center {
      .box {
        top: 98px;
      }
      .bg {
        top: 376px;
      }
      .circle {
        top: 250px;
      }
      .hand {
        top: 300px;
      }
    }
  }

  @keyframes scaleChange {
    0% {
      opacity: 1;
      transform: scale(0.2);
    }
    100% {
      opacity: 0.5;
      transform: scale(1);
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
}
</style>
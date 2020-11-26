<template>
  <div class="detainment" v-if="value">
    <div class="mask"></div>
    <div class="content">
      <div class="award-img">
        <img src="./img/award-img.png" alt="">
      </div>
      <p class="p2">话费券抽奖限时开启</p>
      <p class="p3">快来试试吧</p>
      <div class="award-btn" @click="goLottery">
        <img src="./img/popup-btn2.png" alt="">
      </div>
      <div class="close" @click="hide">
        <img src="./img/close-icon.png" alt="">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'detainment',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hide () {
      this.$emit('back')
    },
    goLottery() {
      this.$marchSetsPoint('A_H5PT0035003105')
      window.location.href = "https://wap.beeplaying.com/activities/hfLottery.html#/"
    }
  },
  mounted() {
    this.$marchSetsPoint('A_H5PT0035003104')
  }
}
</script>
<style scoped lang="less">
img {
  vertical-align: top;
  width: 100%;
  height: 100%;
}
.detainment {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  .mask {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,.7);
    z-index: 1;
  }
  .content {
    position: absolute;
    left: 50%;
    top: 46%;
    transform: translate(-50%, -50%);
    z-index: 2;
    width: 693px;
    height: 693px;
    background: url(./img/popup-bg2.png) no-repeat center center;
    background-size: 100% 100%;
    .award-img {
      margin: 248px 0 0 221px;
      width: 249px;
    }
    p {
      text-align: center;
      font-size: 24px;
      &.p1 {
        margin-top: 10px;
        color: #A62CF3;
      }
      &.p2 {
        margin-top: 76px;
        color: #FFFFFF;
        font-size: 32px;
        font-weight:bold;
      }
      &.p3 {
        margin-top: 10px;
        font-size:24px;
        color: #fff;
        font-weight:500;
      }
    }
    .award-btn {
      margin: 22px auto 0;
      width: 351px;
      height: 71px;
    }
    .close {
      position: absolute;
      left: 50%;
      bottom: -70px;
      width: 38px;
      height: 38px;
      transform: translate(-50%, 0);
    }

  }
}
</style>
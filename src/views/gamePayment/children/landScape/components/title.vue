<template>
  <div class="title">
    <div class="leaf">
      <img class="top-leaf-icon" src="../images/top-leaf.png" alt="">
      <span class="user-info">{{userInfo.amount | conversion}}</span>
    </div>
    <p class="top-center">
      <span>游戏商城</span>
      <span class="rule-icon" @click="openRule"></span>
    </p>
    <div class="btn-close" @click="closeWebview"></div>
  </div>
</template>
<script>
export default {
  name: 'MallTitle',
  props: {
    userInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    showRule: false
  }),
  filters: {
    conversion (value) {
      if (!value && value != 0) return ''
      let unit = ''
      let number = 0
      if (value >= 100000000) {
        unit = '亿'
        number = (value / 100000000).toFixed(2)
      } else if (value >= 10000) {
        unit = '万'
        number = (value / 10000).toFixed(2)
      } else {
        number = value.toFixed(1)
      }

      let numberArr = number.split('.')
      if (Number(numberArr[1]) === 0) {
        return numberArr[0] + unit
      } else if (numberArr[1].split('')[1] === '0') {
        numberArr[1] = numberArr[1].split('')[0]
      }
      return numberArr.join('.') + unit
    },
  },
  methods: {
    openRule () {
      this.$emit('openMallPop', 1)
    },
    closeWebview () {
      this.$emit("showCouponStayWindow")
    }
  }
}
</script>
<style lang="less" scoped>
.bg-center(@url) {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url(@url);
}
.title {
  width: 100%;
  height: 66px;
  position: relative;
  text-align: center;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: space-between;
  padding-left: 48px;
  .leaf {
    display: flex;
    align-items: center;
    .top-leaf-icon {
      width: 40px;
      height: 40px;
      position: relative;
    }
    .user-info {
      font-size: 20px;
      font-weight: bold;
      color: #fff;
      min-width: 140px;
      height: 30px;
      line-height: 32px;
      background: #0252ae;
      border-radius: 10px;
      margin-left: -28px;
      text-align: left;
      padding-left: 28px;
    }
  }
  .top-center {
    display: flex;
    align-items: center;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 30px;
    color: #fff;
    .rule-icon {
      box-sizing: border-box;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-left: 3px;
      .bg-center('../images/problem-icon.png');
    }
  }
  .btn-close {
    width: 70px;
    height: 70px;
    .bg-center('../images/btn-close.png');
    margin-top: -12px;
    margin-right: 24px;
  }
}
</style>
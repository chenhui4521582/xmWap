<template>
  <article class="small-user-callback">
    <div class="recall-icon" v-if="showIcon" :class="{ hasunread: showRedDot }"
      @click="toActPage(1)">
    </div>
    <section class="pop" v-if="showPop">
      <div class="content">
        <p>
          玩游戏 攒话费红包<br>
          满<span>10元</span>直接提现
        </p>
        <div class="btn" @click="toActPage()">立即前往</div>
      </div>
      <div class="close" @click="closePop"></div>
    </section>
  </article>
</template>

<script>
import { mapActions } from 'vuex'
import { jumpUrl } from '@/utils/utils'
import indexServices from '@/services/index'
import $axios from '@/services/http/http'

export default {
  name: 'smallUserCallback',
  data: () => ({
    smallUserCallbackInfo: {},
    /** 弹框参数 1.签到送叶子 2.加赠送叶子 3.任务积分领红包 4.游戏任务领积分 **/
    showPop: false
  }),
  methods: {
    ...mapActions({
      getUserInfo: 'GET_USERINFO'
    }),
    /** 打开弹框 **/
    openPop () {
      this.$marchSetsPoint('A_H5PT0019003890') // H5平台-累充0用户回流活动-首页弹窗加载完成
      this.showPop = true
      let endTime = new Date(new Date().toLocaleDateString()).getTime().toString()
      localStorage.setItem('smallUserReturn', endTime)
    },
    /** 关闭弹框 **/
    closePop () {
      this.showPop = false
      this.$parent.initDialog()
    },
    conversion (value) {
      if (value >= 10000) {
        return `${Math.floor(value / 1000) / 10}万`
      } else {
        return value
      }
    },
    toActPage (type) {
      if (type) {
        this.$marchSetsPoint('A_H5PT0019003892') // H5平台-累充0用户回流活动-固定 入口点击
      } else {
        this.$marchSetsPoint('A_H5PT0019003891') // H5平台-累充0用户回流活动-首页弹窗-立即前往点击
      }
      jumpUrl({ url: '/activities/returnBackUser.html#/?from=activityEntry' })
    },
    async init (callback) {
      let res = await indexServices.getSmallUserInfo()
      let { code, data } = res.data
      if (code === 200) {
        this.smallUserCallbackInfo = data
        if (this.havePopUp && data.showFlag) {
          this.openPop()
          return
        }
      }
      callback({
        name: 'smallUserCallback',
        isShow: false
      })
    }
  },
  computed: {
    showIcon () {
      return this.smallUserCallbackInfo.showFlag
    },
    showRedDot () {
      return this.smallUserCallbackInfo.showRedDot
    },
    havePopUp () {
      let endTime = new Date(new Date().toLocaleDateString()).getTime().toString()
      let info = localStorage.getItem('smallUserReturn')
      if (info === endTime) {
        return false
      }
      return true
    }
  },
  mounted () {
  }
};
</script>

<style scoped lang="less">
.small-user-callback {
  .recall-icon {
    width: 120px;
    height: 150px;
    position: fixed;
    bottom: 500px;
    z-index: 10;
    right: 0;
    &:before {
      content: '';
      position: absolute;
      width: 75px;
      height: 89px;
      background: url('./images/index-icon.png') no-repeat center center;
      background-size: 100% 100%;
      z-index: 10;
      top: 50%;
      left: 46%;
      animation: shake 0.5s infinite;
    }
    &.hasunread:after {
      content: '';
      position: absolute;
      top: 24px;
      right: 21px;
      width: 20px;
      height: 20px;
      background: url('./images/reddot.png') no-repeat;
      background-size: 100% 100%;
      z-index: 11;
    }
  }
  .pop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 99;
    .content {
      box-sizing: border-box;
      width: 512px;
      height: 610px;
      background: url('./images/welcome-bg.png') no-repeat;
      background-size: 100% 100%;
      margin: 240px auto 0;
      font-size: 40px;
      font-family: Alibaba PuHuiTi;
      font-weight: 800;
      color: #fff;
      text-align: center;
      padding-top: 340px;
      span {
        color: #fbd72c;
      }
      .btn {
        width: 290px;
        height: 88px;
        line-height: 88px;
        font-size: 36px;
        color: #ee1028;
        background: #ffc495;
        margin: 30px auto;
        border-radius: 44px;
        font-weight: 400;
      }
    }
    .close {
      width: 60px;
      height: 60px;
      background: url('./images/close-icon.png') no-repeat;
      background-size: 100% 100%;
      margin: 60px auto;
    }
  }
}
@keyframes shake {
  0% {
    transform-origin: center center;
    transform: translate(-50%, -50%) rotateZ(0deg);
  }
  20% {
    transform-origin: center center;
    transform: translate(-50%, -50%) rotateZ(10deg);
  }
  40% {
    transform-origin: center center;
    transform: translate(-50%, -50%) rotateZ(-10deg);
  }
  60% {
    transform-origin: center center;
    transform: translate(-50%, -50%) rotateZ(5deg);
  }
  80% {
    transform-origin: center center;
    transform: translate(-50%, -50%) rotateZ(-5deg);
  }
  100% {
    transform-origin: center center;
    transform: translate(-50%, -50%) rotateZ(0deg);
  }
}
</style>

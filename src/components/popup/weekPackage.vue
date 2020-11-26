<template>
  <div class="pop-window" v-if="showAwardPop || showActivityPop">
    <div class="pop-mask" @touchmove.prevent></div>
    <div class="bonus-success" :class="{ plus: type == 2 }" v-if="type">
      <div class="info" :class="{ type2: type == 2 }">
        <div class="desc">
          加赠<i>{{ transUint(weekPackage.onceAwardsAmount) }}金叶子</i>已到账<br />请注意查收
        </div>
        <div class="use-coupons" v-if="type === 1">
          <p>--你获得的8折优惠券即将过期--</p>
          <img src="./img/week_package/coupons.png" alt="" />
          <div class="use-btn" @click="gotouse">立即使用</div>
        </div>
        <div class="use type2" v-if="type == 2" @click="close(0)">知道啦</div>
      </div>
      <div class="close" :class="{ type1: type == 1 }" @click="close(1)"></div>
    </div>
    <div class="bonus-success pop" v-else>
      <div class="bonus-success-btn" @click="gotoweekPackage"></div>
      <div class="close" @click="close(1)"></div>
    </div>
  </div>
</template>
<script type="text/javascript">
import { bottomBarJump, newUtils } from '@/utils/utils'
import Services from '@/services/activity'
export default {
  data () {
    return {
      weekPackage: {},
      showAwardPop: false,
      type: 0,
      showActivityPop: false,
    }
  },
  methods: {
    transUint (awards) {
      let finish =
        awards > 10000 ? parseFloat((awards / 10000).toFixed(1)) + '万' : awards
      return finish
    },
    close () {
      this.showAwardPop = false
      this.showActivityPop = false
    },
    gotouse () {
      this.$marchSetsPoint('A_H5PT0074001701')
      bottomBarJump('#/my/coupon', 'myCoupon', this.$router)
    },
    /** 是否显示入口 **/
    async _getWeekPackageInfo (callback) {
      let res = await Services.getweekPackageInfo()
      let { code, data } = res.data
      if (code === 200) {
        this.weekPackage = data
        this.showActivityPop = this.weekPackage.activityPopup
        this.showAwardPop = this.weekPackage.awardsPopup
        this.showAwardPop && (this.type = this.weekPackage.couponIsUse ? 2 : 1)
        if (this.showActivityPop || this.showAwardPop) {
          this.$marchSetsPoint('A_H5PT0074001700')
        }
      }
      callback({
        name: 'weekPackage',
        isShow: this.showActivityPop || this.showAwardPop,
      })
    },
    gotoweekPackage () {
      location.href = 'https://wap.beeplaying.com/activities/weekpackage.html'
    },
    init (callback) {
      this._getWeekPackageInfo(callback)
    },
  },
  mounted () {
    // this.init()
  },
  watch: {
    showAwardPop (value) {
      if (value) {
        newUtils.ScrollNoMove()
      } else {
        newUtils.ScrollMove()
      }
    },
  },
}
</script>
<style lang="less" scoped>
.pop-window {
  position: relative;
  z-index: 11;
  width: 100%;
  height: 100%;
  min-height: 100%;
  max-height: 100%;
  .pop-close {
    width: 0.68 * 100px;
    height: 0.68 * 100px;
    position: absolute;
    right: -0.34 * 100px;
    top: -0.34 * 100px;
  }
}
.pop-mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10;
}
.bonus-success {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 5.77 * 100px;
  height: 7.11 * 100px;
  background: url('./img/week_package/pop1.png');
  background-size: 100% 100%;
  z-index: 11;
  &.plus {
    width: 6.04 * 100px;
    height: 6 * 100px;
    background: url('./img/week_package/pop2.png');
    background-size: 100% 100%;
  }
  &.pop {
    width: 509px;
    height: 801px;
    background: url('./img/week_package/bg.png');
    background-size: 100% 100%;
  }
  .img {
    position: absolute;
    top: 1.05 * 100px;
    left: 1.7 * 100px;
    right: 1.75 * 100px;
    height: 1.45 * 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .title {
    position: absolute;
    top: 2.73 * 100px;
    left: 0;
    right: 0;
    margin: auto;
    font-size: 0.3 * 100px;
    font-weight: bold;
    color: rgba(84, 52, 20, 1);
    text-align: center;
  }
  .info {
    width: 100%;
    position: absolute;
    top: 328px;
    bottom: 69px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    &.type2 {
      top: 348px;
      bottom: 55px;
    }
  }
  .desc {
    font-size: 0.32 * 100px;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    line-height: 0.4 * 100px;
    text-align: center;
    i {
      color: #f3d159;
    }
  }
  .use-coupons {
    padding-top: 10px;
    width: 359px;
    height: 218px;
    background: #5d2ac6;
    border-radius: 10px;
    text-align: center;
    p {
      font-size: 22px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: #ffffff;
    }
    img {
      margin: 10px 0 10px 0;
      width: 226px;
      height: 88px;
    }
    .use-btn {
      margin: auto;
      width: 182px;
      height: 46px;
      background: linear-gradient(
        -12deg,
        rgba(255, 231, 168, 1),
        rgba(255, 216, 97, 1)
      );
      box-shadow: 0px 2px 2px 0px rgba(38, 38, 38, 0.26);
      border-radius: 23px;
      font-size: 24px;
      font-weight: bold;
      color: rgba(137, 66, 24, 1);
      line-height: 46px;
    }
  }
  .use {
    width: 1.82 * 100px;
    height: 0.46 * 100px;
    background: linear-gradient(
      -12deg,
      rgba(255, 231, 168, 1),
      rgba(255, 216, 97, 1)
    );
    box-shadow: 0px 2px 2px 0px rgba(38, 38, 38, 0.26);
    border-radius: 0.23 * 100px;
    font-size: 0.24 * 100px;
    font-weight: bold;
    color: rgba(137, 66, 24, 1);
    line-height: 0.46 * 100px;
    text-align: center;
    &.type2 {
      width: 1.84 * 100px;
      height: 0.6 * 100px;
      line-height: 0.6 * 100px;
      background: transparent;
      border: 2px solid #ccc;
      border-radius: 0.3 * 100px;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
    }
  }
  .bonus-success-btn {
    width: 200px;
    height: 200px;
    background: url('./img/week_package/btn.png');
    background-size: 100% 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -80px;
    margin-left: -94px;
    animation: btnScale 0.6s infinite linear;
  }
  .close {
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
    background: url('./img/week_package/pop_close.png') no-repeat center center;
    background-size: 60px 60px;
    &.type1 {
      left: 50%;
    }
  }
}
@keyframes btnScale {
  0% {
    transform: scale(1.1);
  }

  50% {
    transform: scale(1.1);
  }

  51% {
    transform: scale(1);
  }

  100% {
    transform: scale(1);
  }
}
</style>

<template>
  <transition :name="hideAnimation">
    <div class="preference" v-if="showPreference">
      <div class="mask"></div>
      <div class="content">
        <div class="body">
          <div class="awards">
            <img class="prize" :src="preferenceData.icon.split(';')[1] | filter" alt />
          </div>
          <div class="buySubmit"
            :class="{price2:preferenceData.price==2,pricegt50:preferenceData.price>=50}"
            @click="buySubmit"></div>
        </div>
        <div class="closed" @click="closed"></div>
        <div class="rule" :class="{price2:preferenceData.price==2}" @click="openPreferenceRule">
          礼包详情
          <span class="iconfont icon-next"></span>
        </div>
      </div>
      <!-- 充值特惠规则 -->
      <Modal v-model="showPreferenceRule" :title="'礼包详情'" :closeButtonShow="false"
        @on-save="hidePreferenceRule">
        <div class="rule-content">
          1. 即日起，此活动礼包等级根据购买金额依次累加。
          <br />2. 礼包购买成功，可收到金叶子、话费券及其他奖励。
          <br />3. 游戏大礼包包含道具可至游戏内查看。当前充值礼包内含游戏道具详情请点击游戏大礼包图标查看。
          <br>说明：套圈至欢乐套圈查看；记牌器、超级加倍道具至斗地主查看；冰冻、锁定道具至街机欢乐捕鱼查看；黄金球杆至欢乐竞技台球查看。
          <br />4. 游戏中心不为未成年人提供交易服务。
        </div>
      </Modal>
    </div>
  </transition>
</template>

<script>
import Services from '@/services/activity'
import _get from 'lodash.get'
import { bottomBarJump, newUtils } from '@/utils/utils'
export default {
  name: 'preference',
  props: {
    animation: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    showPreference: false,
    preferenceData: {},
    showPreferenceRule: false
  }),
  computed: {
    hideAnimation () {
      return this.animation ? 'hide' : ''
    }
  },
  methods: {
    /** 获取充值特惠 **/
    _getPreference () {
      this.showLoading = true
      Services.getPreference().then(res => {
        this.showLoading = false
        let { code, data } = _get(res, 'data')
        if (code === 200) {
          this.preferenceData = data
          this.showPreference = true
        }
      })
    },
    /** 去充值 **/
    buySubmit () {
      this.closed()
      if (newUtils.isEmptyObject(this.preferenceData)) {
        return false
      }
      localStorage.setItem('payment', JSON.stringify(this.preferenceData))
      if (this.$route.name !== 'index') {
        localStorage.setItem('originDeffer', window.location.href)
      }
      bottomBarJump('#/payment/paymentlist', 'paymentList', this.$router)
    },
    /** 关闭弹框 **/
    closed () {
      this.showPreference = false
    },
    /** 关闭规则 **/
    hidePreferenceRule () {
      this.showPreferenceRule = false
    },
    /** 打开规则 **/
    openPreferenceRule () {
      this.showPreferenceRule = true
    },
    init () {
      this._getPreference()
    }
  },
  watch: {
    showPreference (value) {
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
.preference {
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
  }
  .content {
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    width: 100%;
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
      font-size: 12px;
      border-radius: 40px;
    }
    .awards {
      margin: 0 auto;
      width: 96%;
      img {
        vertical-align: top;
        width: 100%;
      }
    }
    .buySubmit {
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
      bottom: 80px;
      /*transform: translate(-50%, 0);*/
      width: 320px;
      height: 120px;
      background: url('./img/prefence/btn.png') no-repeat top center;
      background-size: 100% 100%;
      animation: huxi 3s infinite ease-in-out;
      &.price2 {
        bottom: 0;
      }
      &.pricegt50 {
        width: 315px;
        height: 120px;
        background: url('./img/prefence/btn1.png') no-repeat top center;
        background-size: 100% 100%;
        animation: huxi 3s infinite ease-in-out;
      }
    }
    .closed {
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
      bottom: -75px;
      width: 60px;
      height: 60px;
      background: url('~@/assets/images/global-close.png') no-repeat center
        center;
      background-size: 60px 60px;
    }
    .rule {
      position: absolute;
      bottom: 160px;
      right: 80px;
      display: flex;
      align-items: center;
      color: #fff;
      font-size: 26px;
      font-weight: bold;
      &.price2 {
        bottom: 120px;
        right: 100px;
      }
    }
  }
}
.rule-content {
  color: #888888;
  line-height: 43px;
  font-size: 24px;
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
@keyframes huxi {
  0% {
    transform: scale(0.9);
  }
  10% {
    transform: scale(1);
  }
  20% {
    transform: scale(0.9);
  }
  30% {
    transform: scale(1);
  }
  40% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1);
  }
  60% {
    transform: scale(0.9);
  }
  70% {
    transform: scale(1);
  }
  80% {
    transform: scale(0.9);
  }
  90% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.9);
  }
}
</style>

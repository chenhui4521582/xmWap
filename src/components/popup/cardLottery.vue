<template>
  <transition :name="hideAnimation">
    <div class="card-lottery" v-if="showCardLottery">
      <div class="mask"></div>
      <div class="center">
        <div class="card-lottery-list" v-if="showList">
          <img class="bg" :src="cardLotteryData.activityBackgroundImage" alt />
          <ul class="list">
            <template v-for="(item, index) in cardLotteryData.leaguePacksList">
              <li :key="index" @click="goToPay(item)">
                <img :src=" item.icon.split(';')[0] || item.icon.split(';')[1] | filter" alt />
              </li>
            </template>
          </ul>
          <div class="rule-btn" @click="openRule"></div>
        </div>
        <div class="card-lottery-result" v-if="showResult">
          <div class="success" v-if="cardSuccess" @click="resetOrder">
            <img src="./img/card_lottery/lucky.png" />
            <span>
              指定号码:{{cardResultData.hitNum}}
              <br />
              <i>获得号码：{{cardResultData.getBag.num}}</i>
            </span>
            <p class="desc">
              奖励
              <i>{{cardResultData.getBag.awardsName}}</i>已发送 ,
              <br />可至"我的" — "我的资产"里查看
            </p>
          </div>
          <div class="error" v-else>
            <img src="./img/card_lottery/failed.png" @click="resetOrder" />
            <span>
              指定号码:{{cardResultData.hitNum}}
              <br />
              <i>获得号码：{{cardResultData.getBag.num}}</i>
            </span>
          </div>
        </div>
        <div class="card-lottery-closed" @click="hideCardLottery"></div>
      </div>
      <div class="rule" v-if="showRule">
        <div class="mask"></div>
        <div class="center">
          <img :src="cardLotteryData.rulesBackgroundImage | filter" alt />
          <div class="rule-closed" @click="hideRule"></div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { bottomBarJump, newUtils } from '@/utils/utils'
import Services from '@/services/activity'
import _get from 'lodash.get'
export default {
  name: 'cardLottery',
  props: {
    animation: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    showCardLottery: false,
    cardLotteryData: {},
    cardResultData: {},
    showRule: false
  }),
  computed: {
    showList() {
      return (
        this.cardLotteryData.leaguePacksList &&
        this.cardLotteryData.leaguePacksList.length &&
        !this.cardResultData.getBag
      )
    },
    showResult() {
      return _get(this.cardResultData, 'getBag', false)
    },
    cardSuccess() {
      return (
        this.cardResultData.getBag &&
        this.cardResultData.getBag.num === this.cardResultData.hitNum
      )
    },
    hideAnimation() {
      return this.animation ? 'hide': ''
    }
  },
  methods: {
    /** 去支付 **/
    goToPay(item) {
      localStorage.setItem('payment', JSON.stringify(item))
      localStorage.setItem('originDeffer', window.location.href)
      bottomBarJump('#/payment/paymentlist','paymentList',this.$router)
    },
    /** 关闭规则 **/
    hideRule() {
      this.showRule = false
    },
    /** 打开规则 **/
    openRule() {
      this.showRule = true
    },
    /** 关闭夺宝礼包 **/
    hideCardLottery() {
      this.showCardLottery = false
    },
    /** 再来一单 **/
    resetOrder() {
      this._getCardLottery()
    },
    /** 获取夺宝礼包是否支付 **/
    _getCardLotteryResult() {
      Services.getCardLotteryResult().then(res => {
        this.cardResultData = _get(res, 'data.data', {})
        if (this.cardResultData.getBag != null) {
          this.showCardLottery = true
        }
      })
    },
    /** 获取夺宝礼包列表 **/
    _getCardLottery() {
      this.showLoading = true
      this.cardResultData = {}
      Services.getCardLottery('2018052501').then(res => {
        this.showLoading = false
        let { code, data } = _get(res, 'data', {})
        if (code === 200) {
          this.cardLotteryData = data
          this.showCardLottery = true
        }
      })
    },
    init() {
      this._getCardLottery()
    }
  },
  mounted() {
    this._getCardLotteryResult()
  },
  watch: {
    showActivityPop(value) {
      if(value) {
        newUtils.ScrollNoMove()
      }else {
        newUtils.ScrollMove()
      }
    }
  }
}
</script>
<style scoped lang="less">
.card-lottery {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 11;
  .mask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
  }
  .center {
    position: absolute;
    left: 50%;
    top: 45%;
    transform: translate(-50%, -50%);
    .card-lottery-list {
      width: 569px;
      height: 875px;
      .bg {
        width: 100%;
        height: 100%;
        img {
          vertical-align: top;
          width: 100%;
          height: 100%;
        }
      }
      .rule-btn {
        position: absolute;
        top: 134px;
        right: 40px;
        width: 128px;
        height: 38px;
      }
      .list {
        position: absolute;
        top: 187px;
        padding: 0 34px;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        li {
          margin-bottom: 10px;
          width: 50%;
          img {
            vertical-align: top;
            width: 100%;
          }
        }
      }
    }
    .card-lottery-result {
      .success {
        width: 600px;
        img {
          width: 100%;
          vertical-align: top;
        }
        span {
          position: absolute;
          bottom: 220px;
          left: 190px;
          color: #fff;
          font-size: 30px;
          i {
            color: #fce723;
            font-weight: 700;
          }
        }
        p {
          margin-top: 30px;
          font-size: 30px;
          color: #fff;
          line-height: 40px;
          font-weight: 700;
          text-align: center;
          i {
            color: #ffc924;
          }
        }
      }
      .error {
        width: 600px;
        img {
          width: 100%;
          vertical-align: top;
        }
        span {
          position: absolute;
          bottom: 130px;
          left: 190px;
          color: #fff;
          font-size: 30px;
          i {
            color: #fce723;
            font-weight: 700;
          }
        }
      }
    }
    .card-lottery-closed {
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
      background: url('~@/assets/images/global-close.png') no-repeat center center;
      background-size: 60px 60px;
    }
  }
  .rule {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    .mask {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
    }
    .center {
      position: absolute;
      width: 545px;
      left: 50%;
      top: 40%;
      transform: translate(-50%, -50%);
      img {
        vertical-align: top;
        width: 100%;
      }
    }
    .rule-closed {
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
      background: url('~@/assets/images/global-close.png') no-repeat center center;
      background-size: 60px 60px;
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
    transform: scale(.1);
  }
  100% {
    transform-origin: 675px 685px;
    transform: scale(0)
  }
}
</style>

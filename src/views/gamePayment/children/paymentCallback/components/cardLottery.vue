<template>
  <section class="card-lottery" v-if="showResult">
    <div class="pop-mask"></div>
    <section class="result-pop">
      <div class="result-wrap" :class="prizingList.num==dataList.hitNum?'lucky':'failed'">
        <template v-if="prizingList.haveExtra">
          <div class="ext-award">
            <div class="ext-title">
              特别爱给特别的你
            </div>
            <div class="ext-img">
              <img :src="prizingList.awardUrl|filter" alt="额外奖励">
              <span>{{prizingList.extraAwardName}}</span>
            </div>
            <p class="ext-other">再购买三次礼包仍可以获得额外加赠</p>
          </div>
        </template>
        <template v-else>
          <div class="man-icon" @click="againpay"></div>
        </template>
        <p class="number-show">
          <span>指定号码：{{dataList.hitNum}}</span><br>
          <i>获得号码：{{prizingList.num}}</i>
        </p>
        <div class="more-btn" @click="againpay"></div>
        <p class="desc" v-if="prizingList.num==dataList.hitNum||prizingList.haveExtra">奖励已发放,可至“我的”-“我的资产”查看</p>
      </div>
      <div class="close-btn" @click="closePop"></div>
    </section>
  </section>
</template>

<script>
import { localStorage } from '@/utils/utils'
import Services from '@/services/activity'
import _get from 'lodash.get'
export default {
  name: 'GPCardLottery',
  data () {
    return {
      showResult: false,
      prizingList: {},
      dataList: {}
    }
  },
  mounted () {
    this._getCardLotteryResult()
  },
  methods: {
    /** 获取夺宝礼包是否支付 **/
    _getCardLotteryResult () {
      Services.getCardLotteryResult().then(res => {
        this.dataList = _get(res, 'data.data', {})
        if (this.dataList.getBag) {
          this.showResult = true
          this.prizingList = this.dataList.getBag
        }
      })
    },
    /** 打开夺8礼包 **/
    againpay () {
      this.showResult = false
      parent.GameEval && parent.GameEval('openweb', `https://wap.beeplaying.com/payment/#/treasure/gift1908?channel=${localStorage.getString('APP_CHANNEL')}&token=${localStorage.getString('ACCESS_TOKEN')}`)
    },
    /** 关闭弹窗 **/
    closePop () {
      this.showResult = false
    }
  }
}
</script>

<style lang="less" scoped>
.pop-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 2;
}
.result-pop {
  position: absolute;
  text-align: center;
  z-index: 11;
  left: 0;
  right: 0;
  margin: auto;
  top: 50%;
  transform: translateY(-60%);
  .result-wrap {
    width: 448px;
    height: 798px;
    margin: auto;
    padding-top: 352px;
    box-sizing: border-box;
    background-position: center center;

    &.lucky {
      .bg-set('../images/lucky-bg.png');

      .man-icon {
        .bg-set('../images/lucky-man.png');
        width: 330px;
        height: 320px;
        margin: 30px auto 0;
      }
    }

    &.failed {
      .bg-set('../images/failed-bg.png');

      .man-icon {
        .bg-set('../images/failed-man.png');
        width: 150px;
        height: 200px;
        margin: 100px auto 0;
      }
    }

    .ext-award {
      margin: 74px auto 0;
      font-size: 18px;
      width: 326px;
      height: 304px;
      box-sizing: border-box;
      border: 2px solid #8f7adc;
      border-radius: 10px;

      .ext-title {
        padding: 8px 0 12px;
        color: #fbce46;

        &::before {
          content: '';
          display: block;
          width: 230px;
          height: 26px;
          .bg-set('../images/ex-text.png');
          margin: 6px auto;
        }
      }

      .ext-img {
        width: 148px;
        height: 148px;
        margin: auto;
        background: #9e62cc;
        border-radius: 10px;
        box-sizing: border-box;
        position: relative;

        img {
          max-width: 100px;
          max-height: 80px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -74%);
        }

        span {
          display: block;
          width: 100%;
          position: absolute;
          bottom: 16px;
          left: 0;
        }
      }

      .ext-other {
        margin-top: 16px;
        color: #ddb7f7;
      }
    }

    p.number-show {
      position: absolute;
      width: 100%;
      top: 352px;
      left: 50%;
      margin-left: -50%;
      font-size: 24px;
      line-height: 30px;

      i {
        color: #fce723;
        font-weight: bold;
      }
    }
  }

  .more-btn {
    position: absolute;
    bottom: 38px;
    left: 50%;
    .bg-set('../images/more-btn.png');
    width: 208px;
    height: 56px;
    margin-left: -104px;
  }

  .desc {
    position: absolute;
    bottom: 12px;
    left: 50%;
    width: 100%;
    margin-left: -50%;
    font-size: 18px;
    color: #ac6aca;
    line-height: 20px;
    font-weight: normal;
    text-align: center;
  }

  .close-btn {
    position: absolute;
    width: 48px;
    height: 48px;
    background: url(../images/btn-close.png);
    background-size: 100% 100%;
    left: 50%;
    bottom: -80px;
    margin-left: -30px;
  }

  .bg-set(@url) {
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url(@url);
  }
}

@media screen and (orientation: landscape) {
  /*横屏 css*/
  .result-pop {
    transform: translateY(-60%) scale(0.8);
  }
}
</style>

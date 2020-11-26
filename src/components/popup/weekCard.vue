<template>
  <div v-if="isSDK">
    <sdk-popup v-model="show" type="weekCard" :showClose="true" :showCancel="false"
      confirm-text="立即抢购" @on-confirm="buyWeekCard">
      <section class="sdk-wrapper">
        <img class="sdk-title-img" src="./img/week_card/sdk-title.png" alt="">
        <img class="sdk-info-img" src="./img/week_card/sdk-info.png" alt="">
        <div class="desc">
          <p v-for="(item,index) in cardContent" :key="index">{{item}}</p>
        </div>
      </section>
    </sdk-popup>
  </div>
  <article class="week-card" v-else-if="show" @touchmove.self.prevent>
    <div class="mask"></div>
    <section class="content">
      <img class="pop-bg" src="./img/week_card/card-bg.png" alt="">
      <div class="desc">
        <p v-for="(item,index) in cardContent" :key="index">{{item}}</p>
      </div>
      <div class="close-wrapper">
        <div class="iconfont icon-closed" @click="closed"></div>
      </div>
      <img class="btn" src="./img/week_card/buy-btn.png" alt="" @click="buyWeekCard">
    </section>
  </article>
</template>

<script>
import { findCard } from '../../services/global'
import { bottomBarJump } from '../../utils/utils'
import _get from 'lodash.get'
export default {
  name: 'weekCardPopup',
  props: {
    isSDK: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    cardContent () {
      let content = this.weekCardInfo.content && this.weekCardInfo.content.split(';')
      content && content[0] && (content[0] =  content[0].match(/(\d+)/)[0]/ 10000 + '万金叶')
      content && content[1] && (content[1] = content[1].match(/(\d+)/)[0] / 1000 + '千金叶*6天')
      return content
    },
    gameType () {
      return getUrlParams('gametype') && parseInt(getUrlParams('gametype'))
    }
  },
  data () {
    return {
      show: false,
      weekCardInfo: {}
    }
  },
  mounted () {
    this._findCard()
  },
  methods: {
    async _findCard () {
      const res = await findCard()
      this.weekCardInfo = _get(res, 'data.data[0]', {})
    },
    buyWeekCard () {
      this.$marchSetsPoint('A_H5PT0022003797', { source_address: this.isSDK ? 'SDK' : 'platform' }) // H5平台-任务-新人任务-周卡礼包弹窗-立即抢购点击
      localStorage.setItem('payment', JSON.stringify(this.weekCardInfo))
      localStorage.setItem('JDD_PARAM', JSON.stringify(this.weekCardInfo))
      if (this.isSDK) {
        this.closeTask()
        parent.GameEval && parent.GameEval('openweb', location.origin + '/xmWap/#/gamepayment/list')
      } else {
        this.$router.push({ path: '/payment/paymentlist', query: { isBack: true } })
      }
    },
    openPop () {
      this.show = true
      this.$marchSetsPoint('A_H5PT0022003795', { source_address: this.isSDK ? 'SDK' : 'platform' }) // H5平台-任务-新人任务-周卡礼包弹窗加载完成
    },
    closed () {
      this.show = false
      this.$marchSetsPoint('A_H5PT0022003796', { source_address: this.isSDK ? 'SDK' : 'platform' }) // H5平台-任务-新人任务-周卡礼包弹窗-关闭点击
    },
    closeTask () {
      try {
        switch (this.gameType) {
          case 22:
            if (parent && parent.closeTaksPage) {
              parent.closeTaksPage()
            }
            break
          default:
            if (parent && parent.GameEval) {
              parent.GameEval('closeweb')
              parent.window.bp && parent.bp.event.emit('Event_Close_TaskPage')
              parent.cc.Notification && parent.cc.Notification.emit('Event_Close_TaskPage')
            }
            break
        }
      } catch (e) {
        window.parent.postMessage('closeweb', '*')
      }
    },
  }
}
</script>

<style lang="less" scoped>
.week-card {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
  .mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 99;
  }
  .content {
    z-index: 99;
    width: 470px;
    height: 530px;
    position: absolute;
    top: 45%;
    left: 50%;
    margin-left: -235px;
    margin-top: -265px;
    .pop-bg {
      width: 100%;
    }
    .close-wrapper {
      position: absolute;
      right: 0;
      top: 0;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-closed {
      color: #888;
      font-size: 18px;
    }
    .desc {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 24px;
      color: #fff;
      font-weight: 500;
      position: absolute;
      bottom: 180px;
      width: 100%;
      p {
        flex: 1;
        text-align: center;
      }
    }
    .btn {
      width: 330px;
      height: 86px;
      position: absolute;
      bottom: 40px;
      left: 50%;
      margin-left: -165px;
    }
  }
}
.sdk-wrapper {
  .sdk-title-img {
    width: 376px;
    height: 107px;
    margin: 78px auto 24px;
    display: block;
  }
  .sdk-info-img {
    width: 402px;
    height: 185px;
    margin: 0 auto;
    display: block;
  }
  .desc {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 26px;
    font-style: italic;
    color: #fff;
    font-weight: 500;
    position: absolute;
    bottom: 201px;
    width: 100%;
    padding: 0 36px 0 24px;
    box-sizing: border-box;
    p {
      flex: 1;
      text-align: center;
    }
  }
}
</style>

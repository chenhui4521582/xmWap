<template>
  <article class="sdk-activity-wrapper">
    <div ref="sdkActivity" class="sdk-activity-container">
      <section class="sdk-activity">
        <ul class="list" v-if="showActivity">
          <li v-for="(item, index) in activityList" :key="index" @click.stop="handleAcitiy(item)">
            <div class="img" v-html="item.description || item.lightDescription"></div>
            <div class="red" v-if="!item.hasRead"></div>
          </li>
        </ul>
        <div class="nolist" v-else>
          <img src="../../img/no-message.png" alt="">
        </div>
      </section>
    </div>
    <!-- outPopup -->
    <sdk-popup v-model="showOutPop" title="温馨提示" @on-confirm="outPopCallback()">
    </sdk-popup>
  </article>
</template>
<script>
// import OutPopup from './components/outPopup'
import { mapState } from 'vuex'
import { getUrlParams, jumpUrl } from '@/utils/utils'
import Services from '@/services/SDK'
import _get from 'lodash.get'
import BScroll from 'better-scroll'
export default {
  name: 'sdk-activity',
  data: () => ({
    activityList: [],
    showOutPop: false
  }),
  components: {
    /** sdk活动中心跳转提示弹框 **/
    // OutPopup
  },
  computed: {
    ...mapState(['userInfo']),
    showActivity () {
      return this.activityList.length
    }
  },
  methods: {
    /** 获取活动列表 **/
    _getActivityList () {
      Services.getActivityList().then(res => {
        let { code, data, message } = _get(res, 'data', {})
        if (code === 200) {
          this.activityList = data.activities
        }
      })
    },
    /** 保存活动列表已读 **/
    _saveActivityRead () {
      return Services.saveActivityRead()
    },
    /** 跳出弹框 **/
    handleAcitiy (item) {
      this.$marchSetsPoint('A_H5PT0061001231')
      this.showOutPop = true
      this.url = item.linkUrl || item.lightLinkUrl
    },
    outPopCallback () {
      this.showOutPop = false
      this.activityJump(this.url)
    },
    /** 活动点击跳转 **/
    async activityJump (url) {
      if (!url) {
        return false
      }
      let ACCESS_TOKEN = getUrlParams('token') || localStorage.getItem('ACCESS_TOKEN')
      let APP_CHANNEL = getUrlParams('channel') || localStorage.getItem('APP_CHANNEL')
      let popupUrl = ''
      let popupArray = {
        /** 一元夺宝 **/
        popup_oneLottery: `https://wap.beeplaying.com/payment/#/yiyuanchou?channel=${APP_CHANNEL}&token=${ACCESS_TOKEN}`,
        /** 充值特惠 **/
        popup_getPreference: `https://wap.beeplaying.com/payment/#/miniFeedBack${APP_CHANNEL}&token=${ACCESS_TOKEN}`,
        /** 夺宝礼包 **/
        popup_getCardLottery: `https://wap.beeplaying.com/payment/#/treasure/gift?channel=${APP_CHANNEL}&token=${ACCESS_TOKEN}`,
        /** 转盘夺宝 **/
        popup_getTurntable: `https://wap.beeplaying.com/payment/#/payTurntable?channel=${APP_CHANNEL}&token=${ACCESS_TOKEN}`,
        /** 底Bar 兼容打开弹框,统一版本后删除 **/
        openOneLottery: `https://wap.beeplaying.com/payment/#/yiyuanchou?channel=${APP_CHANNEL}&token=${ACCESS_TOKEN}`,
        openGameTreasureGift: `https://wap.beeplaying.com/payment/#/treasure/gift?channel=${APP_CHANNEL}&token=${ACCESS_TOKEN}`,
        feedback: `https://wap.beeplaying.com/payment/#/miniFeedBack${APP_CHANNEL}&token=${ACCESS_TOKEN}`,
        open_payTurntable: `https://wap.beeplaying.com/payment/#/payTurntable?channel=${APP_CHANNEL}&token=${ACCESS_TOKEN}`,
        /** 夺宝礼包 **/
        treasureCeremony1908: `https://wap.beeplaying.com/payment/#/treasure/gift1908?channel=${APP_CHANNEL}&token=${ACCESS_TOKEN}`,
        /** 转盘夺宝 **/
      }
      for (let i in popupArray) {
        if (i === url) {
          popupUrl = popupArray[i]
          break
        }
      }
      await this._saveActivityRead()
      if (popupUrl && parent && parent.GameEval) {
        parent && parent.closeTaksPage()
        parent.GameEval('openweb', popupUrl)
      } else {
        jumpUrl({ url }, 'SDK')
      }
    },
    init () {
      this._getActivityList()
    }
  },
  mounted () {
    this.init()
    new BScroll(this.$refs.sdkActivity, { scrollY: true, click: true })
  }
}
</script>
<style lang="less" scoped>
.sdk-activity-container {
  position: absolute;
  top: 225px;
  bottom: 12px;
  left: 14px;
  right: 15px;
  background: #fff5e7;
  box-shadow: 0px 2px 15px 0px #a15a21;
  border-radius: 30px 30px 30px 60px;
  box-sizing: border-box;
  overflow: hidden;
  .list {
    padding: 52px 50px 0;
    li {
      position: relative;
      margin: 0 auto 30px;
      background: #68789e;
      border-radius: 20px;
      .img {
        height: 146px;
        overflow: hidden;
        border-radius: 20px;
        img {
          display: block;
          height: 100%;
          margin: auto;
        }
      }
      .red {
        position: absolute;
        right: -10px;
        top: -10px;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: red;
        border: 3px #fff5e7 solid;
      }
    }
  }
  .nolist {
    margin: 249px auto 0;
    width: 338px;
    height: 226px;
    img {
      vertical-align: top;
      width: 100%;
    }
  }
}

/* 横屏模式 */
@media screen and (orientation: landscape) {
  .sdk-activity {
    .nolist {
      margin: 69px auto 0;
    }
  }
}
</style>
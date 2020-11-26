<template>
  <div class="activity" :class="{'showHeader': $moduleConfig.isShowHeader}">
    <header class="activity-header" v-if="$moduleConfig.isShowHeader">
      <div class="back iconfont icon-return" @click="back"></div>
      <div class="items">活动中心</div>
      <div class="closed"></div>
    </header>
    <div class="activity-main">
      <div class="activity-content">
        <div class="activity-list" v-if="showActivity">
          <ul>
            <li v-for="(item, index) in ActivityList" :key="index"
              @click="handClick(item.lightLinkUrl)">
              <div class="banner" v-html="item.lightDescription"></div>
              <div class="content">
                <div class="text">
                  <div class="name" v-html="item.name"></div>
                  <div class="time" v-if="item.activityBeginTime && item.activityEndTime">
                    活动时间：{{
                    item.activityBeginTime | formatTime('y.m.d')
                    }}-{{ item.activityEndTime | formatTime('m.d') }}
                  </div>
                </div>
                <div class="btn btn1" v-if="item.activityStatus == 0">立即开始</div>
                <div class="btn btn2" v-if="item.activityStatus == 2">进行中</div>
                <div class="btn btn3" v-if="item.activityStatus == 3">即将结束</div>
                <div class="btn btn4" v-if="item.activityStatus == 1">预热中</div>
                <div class="btn btn5" v-if="item.activityStatus == 4">已结束</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 活动中心 弹框 -->
    <!-- 一元破冰 -->
    <one-lottery ref="oneLottery" />
    <!-- 充值特惠 -->
    <preference ref="preference" />
    <!-- 夺宝礼包 -->
    <cardLottery ref="cardLottery" @againpay="openPopUp" />
    <!-- 转盘夺宝 -->
    <turntable ref="turntable" @openPreference="openPopUp('popup_getPreference')" />
    <!-- loading -->
    <loading v-show="showLoading" :mask="true" />
  </div>
</template>
<script>
import OneLottery from '@/components/popup/oneLottery'
import Preference from '@/components/popup/preference'
import Turntable from '@/components/popup/turntable'
import CardLottery from '@/components/popup/treasureGift1908'
import { mapMutations } from 'vuex'
import Services from '@/services/activity'
import _get from 'lodash.get'
import newUtils, { jumpUrl } from '@/utils/utils'
export default {
  name: 'activity',
  data: () => ({
    ActivityList: [],
    showLoading: true,
    /** 百度底bar配置 **/
  }),
  components: {
    OneLottery,
    Preference,
    Turntable,
    CardLottery
  },
  computed: {
    showActivity () {
      return this.ActivityList.length
    }
  },
  methods: {
    ...mapMutations({
      setActivityRedDot: 'SET_ACTIVITY_REDDOT'
    }),
    /** 获取活动列表 **/
    _getActivity () {
      this.showLoading = true
      Services.getActivity().then(res => {
        this.showLoading = false
        let { code, data } = res.data
        if (code === 200) {
          this.ActivityList = _get(data, 'activities', [])
        }
      })
    },
    /** 打开弹框 **/
    openPopUp (item) {
      if (!item) {
        return false
      }
      let popupArray = {
        /** 一元夺宝 **/
        popup_oneLottery: 'oneLottery',
        /** 充值特惠 **/
        popup_getPreference: 'preference',
        /** 夺宝礼包 **/
        popup_getCardLottery: 'cardLottery',
        /** 转盘夺宝 **/
        popup_getTurntable: 'turntable',
        /** 底Bar 兼容打开弹框,统一版本后删除 **/
        openOneLottery: 'oneLottery',
        treasureCeremony: 'cardLottery',
        feedback: 'preference',
        open_payTurntable: 'turntable',
        treasureCeremony1908: 'cardLottery'
      }
      for (let i in popupArray) {
        if (i === item) {
          this.$refs[popupArray[i]].init()
        }
      }
    },
    /** 返回按钮 **/
    async back () {
      this.$router.push('/')
    },
    /** 活动中心点击 **/
    async handClick (url) {
      this.$marchSetsPoint('A_H5PT0019000191')
      if (url && url != '0') {
        if (url.indexOf('popup') != -1 || url == 'treasureCeremony1908') {
          this.openPopUp(url)
        } else {
          jumpUrl({ url })
        }
      }
    },
    init () {
      /** 设置红点 **/
      this.setActivityRedDot(false)
      this._getActivity()
      this.$marchSetsPoint('P_H5PT0141')
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style scoped lang="less">
.activity {
  min-height: 100vh;
  background: #f7f7f7;
  .activity-header {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    padding: 26px 24px;
    background: #f7f7f7;
    display: flex;
    z-index: 3;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    height: 100px;
    .items {
      font-weight: bold;
      font-size: 36px;
      color: #252525;
    }
    .closed,
    .back {
      position: absolute;
      font-size: 30px;
      top: 50%;
      transform: translate(0, -50%);
    }
    .closed {
      right: 24px;
    }
    .back {
      left: 24px;
    }
  }
  &.showHeader {
    .activity-main {
      padding: 100px 24px 0;
    }
  }
  .activity-main {
    padding: 20px 24px 0;
    z-index: 2;
    background-color: #f7f7f7;
    .activity-content {
      overflow: hidden;
      position: relative;
      z-index: 2;
      ul {
        li {
          margin-bottom: 20px;
          overflow: hidden;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
          .banner {
            width: 100%;
            height: 220px;
            overflow: hidden;
            img {
              vertical-align: top;
              width: 100%;
              height: 220px;
            }
          }
          .content {
            padding: 20px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .name {
              font-size: 28px;
              color: #000;
              line-height: 1.2;
              font-weight: bold;
            }
            .time {
              margin-top: 10px;
              line-height: 1;
              font-size: 24px;
              color: #888888;
            }
          }
          .btn {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 170px;
            height: 56px;
            border-radius: 16px;
            overflow: hidden;
            font-size: 24px;
            &.btn1 {
              color: #fff;
              background-color: #ff4141;
            }
            &.btn2 {
              color: #ff4141;
              background: #f0f0f0;
            }
            &.btn3 {
              background: #df3333;
              color: #fff;
            }
            &.btn4 {
              background: #df3333;
              color: #fff;
            }
            &.btn5 {
              background: #ffb2b2;
              color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>

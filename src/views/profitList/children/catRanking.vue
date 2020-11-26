<template>
  <div class="profit-main">
    <div class="header-bg">
      <div class="center"></div>
      <div class="bottom"></div>
    </div>
    <div class="profit-content">
      <!-- 我的盈利榜 -->
      <div class="my-profit">
        <div class="item">
          <div class="title">
            <span class="icon iconfont icon-people"></span>
            <span>我的排名</span>
          </div>
          <div class="value">
            <span v-if="myProfit.myRank">{{myProfit.myRank}}</span>
            <a @click="goCat" v-else>暂未领猫></a>
          </div>
        </div>
        <div class="item">
          <div class="title">
            <span class="icon iconfont icon-leaf"></span>
            <span>我的等级</span>
          </div>
          <div class="value">
            Lv.{{myProfit.level|levelFilter}}
          </div>
        </div>
        <div class="rule-icon iconfont icon-question" @click="showRule"></div>
      </div>
      <div class="profit-explain">
        每日20:00发榜，奖励限24小时内至招财猫领取
      </div>
      <!-- 排行榜 -->
      <div class="ranking">
        <div class="title">
          本期榜单
        </div>
        <div class="ranking-list">
          <div class="ranking-title">
            <ul>
              <li class="num">排名</li>
              <li class="name">玩家等级</li>
              <li class="currprofit">升级进度</li>
              <li class="price">奖励</li>
            </ul>
          </div>
          <div class="ranking-center">
            <better-scroll ref="scroll" :data="scrollData" :listenScroll="true" :probeType="3" @scroll="scroll">
              <ul>
                <li v-for="(item, index) in scrollData" @click="openUserInfo(item)" :key="index">
                  <span class="num">
                    <i v-if="item.rank < 4" :class="`ranking${item.rank}`"></i>
                    <i v-else>{{item.rank}}</i>
                  </span>
                  <span class="name">
                    <i>Lv.{{item.catLevel|levelFilter}} {{item.catName}}</i>
                  </span>
                  <span class="currprofit">{{
                    item.catLevel|percentFilter
                  }}%</span>
                  <span class="price">{{ item.catCurrency }}</span>
                </li>
              </ul>
            </better-scroll>
            <!-- 返回顶部按钮 -->
            <div v-show="isBackTop" class="scroll-top" @click="backTop()"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 招财猫榜规则 -->
    <Modal v-model="isRule" title="规则说明" :closeButtonShow="false" @on-save="closeRule">
      <div class="rule-content">
        1、等级榜每天20:00结算，按照等级排名可获得猫币奖励，猫币可购买各种礼品；<br />
        2、等级一致的情况下，升级进度高的排在前面;<br />
        3、猫币奖励需在发榜后24小时内至“招财猫”-“排行”领取，过期会失效哦。<br />
      </div>
    </Modal>
    <cat-first-pop v-if="isShowPop" @close="closeFirstPop"></cat-first-pop>
    <!--用户信息弹框-->
    <userInfo ref="userInfo" />
  </div>
</template>
<script type="text/javascript">
import BetterScroll from '@/components/betterScroll/betterScroll'
import { getUrlParams, jumpUrl } from '@/utils/utils'
import Services from '@/services/profit'
import _get from 'lodash.get'
import catFirstPop from '../components/catFirstPop.vue';
import UserInfo from '../components/userInfo'

export default {
  data () {
    return {
      currentPage: 1,
      from: getUrlParams('from') || 'index',
      /** 我的数据 **/
      myProfit: {
        level: 0,
        myRank: ''
      },
      /** 滚动到底部锁 **/
      scrollLock: false,
      /** 传入scroll展示的数据 **/
      scrollData: [],
      /** 是否显示返回顶部按钮 **/
      isBackTop: false,
      isRule: false,
      isShowPop: false
    }
  },
  components: {
    BetterScroll,
    catFirstPop,
    UserInfo
  },
  filters: {
    levelFilter: value => {
      try {
        return value.toString().split('.')[0]
      } catch (error) {
        return 0
      }
    },
    percentFilter: value => {
      try {
        let percent = (parseFloat('0.' + value.toString().split('.')[1]) * 100).toFixed(2).toString()
        if (percent.length < 5) {
          percent = percent
        }
        return percent
      } catch (error) {
        return '00.00'
      }
    }
  },
  methods: {
    openUserInfo(item){
      this.$refs.userInfo.init(item.userId);
    },
    /** 获取列表 **/
    _getRankList () {
      this.showLoading = true
      Services.getCatRankList({ pageSize: 100, page: this.currentPage })
        .then(res => {
          const result = _get(res, 'data.data')
          this.showLoading = false
          /** 我的招财猫数据 **/
          this.myProfit.myRank = result.rank > 1000 ? '1000+' : result.rank
          this.myProfit.level = result.level || 0
          /** 列表数据 **/
          this.scrollData = result.rankings || []
        })
    },
    /** 列表滚动到底部重新获取数据 **/
    scroll (pos) {
      /** 是否显示返回顶部 **/
      if (Math.abs(Math.round(pos.y)) > 200) {
        this.isBackTop = true
      } else {
        this.isBackTop = false
      }
    },
    /** 列表返回顶部 **/
    backTop () {
      this.$marchSetsPoint('A_H5PT0025001195')
      this.$refs.scroll.scrollTo(0, 0)
      this.isBackTop = false
    },
    init() {
      this.from = getUrlParams('from') || 'index'
      this._getRankList()
    },
    goCat () {
      jumpUrl({ url: '/petcat/' }, null, '&catright=1')
    },
    /** 打开-招财猫榜-规则 **/
    showRule () {
      this.$marchSetsPoint('A_H5PT0025001730')
      this.isRule = true
    },
    /** 关闭-招财猫榜-规则 **/
    closeRule () {
      this.isRule = false
    },
    closeFirstPop () {
      this.isShowPop = false
    }
  },
  mounted () {
    this.init()
    this.isShowPop = !localStorage.getItem('newCatList')
  }
}
</script>
<style lang="less" scoped>
.profit-main {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 123px;
  top: 104px;
  padding: 0 24px;
  z-index: 2;
  .profit-content {
    position: relative;
    z-index: 1;
    .my-profit {
      position: relative;
      display: flex;
      justify-content: center;
      background: #fff;
      border-radius: 16px;
      height: 150px;
      padding: 30px 0;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
      .item {
        flex: 1;
        border-right: 1px solid #e6e6e6;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .title {
          line-height: 1;
          text-align: center;
          span {
            color: #000000;
            font-size: 24px;
            &:first-child {
              font-size: 30px;
              color: #ff4141;
              margin-right: 6px;
            }
          }
        }
        .value {
          text-align: center;
          font-size: 38px;
          color: #252525;
          font-weight: bold;
          line-height: 1;
          a {
            text-decoration: underline;
          }
          &:last-child {
            font-size: 32px;
          }
        }
        &:nth-child(2) {
          border: none;
        }
      }
      .rule-icon {
        position: absolute;
        right: 11px;
        top: 11px;
        color: #bbbbbb;
        font-size: 26px;
      }
    }
    .profit-explain {
      margin-top: 20px;
      text-align: center;
      font-size: 24px;
      color: #ff4141;
    }
    .ranking {
      margin-top: 42px;
      .title {
        font-size: 28px;
        color: #252525;
        font-weight: bold;
      }
      .ranking-list {
        position: relative;
        margin-top: 20px;
        border-radius: 16px 16px 0 0;
        overflow: hidden;
        .ranking-title {
          height: 50px;
          line-height: 50px;
          background: #FFFAD4;
          ul {
            display: flex;
            justify-content: space-between;
            align-items: center;
            li {
              text-align: center;
              font-size: 24px;
              color: #000000;
              &.num {
                width: 19%;
              }
              &.name {
                width: 27%;
              }
              &.currprofit {
                width: 27%;
              }
              &.price {
                width: 27%;
              }
            }
          }
        }
        .ranking-center {
          position: fixed;
          padding-bottom: 26px;
          top: 454px;
          left: 24px;
          right: 24px;
          bottom: 100px;
          overflow: hidden;
          background: #fffdef;
          border-radius: 0 0 16px 16px;
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
          ul {
            li {
              width: 100%;
              height: 90px;
              line-height: 90px;
              font-size: 24px;
              color: #000000;
              display: flex;
              justify-content: space-between;
              align-items: center;
              &:nth-of-type(odd) {
                background: #fff;
              }
              &:nth-of-type(even) {
                background: #fffdef;
              }
              span {
                display: block;
                text-align: center;
                &.num {
                  width: 19%;
                  color: #acacac;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  .ranking1 {
                    display: block;
                    width: 38px;
                    height: 38px;
                    background: url('../img/cat-icon1.png') no-repeat center
                      center ;
                    background-size: 100% 100%;
                  }
                  .ranking2 {
                    display: block;
                    width: 38px;
                    height: 38px;
                    background: url('../img/cat-icon2.png') no-repeat center
                      center ;
                    background-size: 100% 100%;
                  }
                  .ranking3 {
                    display: block;
                    width: 38px;
                    height: 38px;
                    background: url('../img/cat-icon3.png') no-repeat center
                      center;
                    background-size: 100% 100%;
                  }
                }
                &.name {
                  width: 27%;
                  overflow: hidden;
                  text-align: center;
                  white-space: nowrap;
                }
                &.currprofit {
                  width: 27%;
                }
                &.price {
                  width: 27%;
                }
              }
            }
          }
          .scroll-top {
            position: absolute;
            right: 0;
            bottom: 59px;
            width: 53px;
            height: 53px;
            background: url('../img/back_top.png') no-repeat center center;
            background-size: 52px 52px;
          }
        }
      }
    }
  }
}
</style>

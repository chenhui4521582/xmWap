<template>
  <main class="profit" :class="[{'profit-game':showClosed},`profit-${screenType}`]">
    <article class="profit-wrapper">
      <header class="profit-list-header" v-if="$moduleConfig.isShowHeader || showClosed">
        <!-- 平台打开排行榜显示返回按钮 -->
        <div class="back" @click="back">
          <span class="iconfont icon-return"></span>
          <span>本期榜单</span>
        </div>
        <div class="items">
          上期排名
        </div>
        <div class="closed">
          <div v-show="showClosed" class="iconfont icon-close" @click="closed"></div>
        </div>
      </header>
      <div class="profit-main" :class="$moduleConfig.plantVersion">
        <div class="profit-content">
          <!-- 我的盈利榜 -->
          <div class="my-profit">
            <div class="item">
              <div class="title">
                <span class="icon iconfont icon-people"></span>
                <span>我的排名</span>
              </div>
              <div class="value">
                {{ (myProfit && myProfit.index) || '3000+' }}
              </div>
            </div>
            <div class="item">
              <div class="title">
                <span class="icon iconfont icon-leaf"></span>
                <span>当前盈利</span>
              </div>
              <div class="value">
                {{ (myProfit && myProfit.amount) || 0 }}
              </div>
            </div>
            <div class="item">
              <div class="title">
                <span class="icon iconfont icon-ranking"></span>
                <span>当前奖励</span>
              </div>
              <div class="value">
                {{ (myProfit && myProfit.awardsName) || '暂无奖励' }}
              </div>
            </div>
            <div class="rule-icon iconfont icon-question" @click="showRule"></div>
          </div>
          <!-- 排行榜 -->
          <div class="ranking">
            <div class="ranking-list">
              <div class="ranking-title">
                <ul>
                  <li class="num">排名</li>
                  <li class="name">盈利达人</li>
                  <li class="currprofit">当前盈利</li>
                  <li class="price">奖励</li>
                </ul>
              </div>
              <div class="ranking-center" :class="$moduleConfig.plantVersion">
                <better-scroll ref="scroll" :data="scrollData" :listenScroll="true" :probeType="3"
                  @scroll="scroll">
                  <ul>
                    <li v-for="(item, index) in scrollData" :key="index"
                      :class="{ 'no-expand': !isExpand && item.index === 3 }">
                      <span class="num">
                        <i v-if="item.index < 4" :class="`ranking${item.index}`"></i>
                        <i v-else>{{ item.index }}</i>
                      </span>
                      <span class="name">
                        <img v-if="item.headImg" :src="item.headImg | filter" alt="" />
                        <img v-else
                          src="//file.beeplaying.com/cdn/common/images/common/img_photo.png"
                          alt="" />
                        <i>{{ item.nickName }}</i>
                      </span>
                      <span class="currprofit">{{ item.amount }}</span>
                      <span class="price">{{ item.awardsName }}</span>
                    </li>
                  </ul>
                </better-scroll>
                <!-- 返回顶部按钮 -->
                <div v-show="isBackTop" class="scroll-top" @click="backTop()"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 规则 -->
      <rule v-model="isRule" :isRule="isRule" />
    </article>
  </main>
</template>
<script type="text/javascript">
import BetterScroll from '@/components/betterScroll/betterScroll'
import rule from '../components/rule'
import { getUrlParams } from '@/utils/utils'
import Services from '@/services/profit'
import _get from 'lodash.get'
export default {
  data () {
    return {
      currentPage: 1,
      profitNew: [],
      from: getUrlParams('from') || 'index',
      /** 我的数据 **/
      myProfit: {},
      /** 倒计时 **/
      countTime: '',
      /** 滚动到底部锁 **/
      scrollLock: false,
      /** 传入scroll展示的数据 **/
      scrollData: [],
      /** 展开的时候列表数据 **/
      expandList: [],
      /** 不展开时候的数据 **/
      noExpandList: [],
      /** 是否展开榜单 **/
      isExpand: false,
      /** 是否显示返回顶部按钮 **/
      isBackTop: false,
      /** 是否显示规则 **/
      isRule: false
    }
  },
  components: {
    rule,
    BetterScroll
  },
  computed: {
    showClosed () {
      return this.from === 'game'
    },
    gameType () {
      return getUrlParams('gametype')
    },
    screenType () {
      return getUrlParams('screentype')
    }
  },
  methods: {
    /** 返回按钮 **/
    async back () {
      /** H5平台-盈利榜-返回 **/
      this.$marchSetsPoint('A_H5PT0025000606')
      this.$router.back(-1)
    },
    /** 游戏内-盈利榜-关闭 **/
    closed () {
      if (parent.parent.closeWebView) {
        parent.parent.closeWebView()
      }
    },
    /** 获取列表 **/
    _getRankList () {
      this.showLoading = true
      Services.getLastRankList({ pageSize: 100, page: this.currentPage }).then(res => {
        this.showLoading = false
        /** 我的上次排行榜数据 **/
        this.myProfit = _get(res, 'data.data.me')

        /** 列表数据 **/
        this.scrollData = this.scrollData.concat(
          _get(res, 'data.data.lastRankList', [])
        )
        /** 解除滚动限制 **/
        this.scrollLock = false
      })
        .catch(error => {
          /** 解除滚动限制 **/
          this.scrollLock = false
        })
    },
    /** 列表滚动到底部重新获取数据 **/
    scroll (pos) {
      let height = document.querySelector('.ranking-center ul').clientHeight
      let boxHeight = document.querySelector('.ranking-center').clientHeight
      let endPosition = height - boxHeight
      if (Math.abs(Math.round(pos.y)) > endPosition) {
        /** 添加滚动锁数据没有回来不允许加载数据**/
        if (this.scrollLock) {
          return false
        }
        this.scrollLock = true
        setTimeout(() => {
          // 向列表添加数据
          this.currentPage++
          this._getRankList()
        }, 100)
      }
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
    /** 打开-盈利榜-规则 **/
    showRule () {
      this.$marchSetsPoint('A_H5PT0025000609')
      this.isRule = true
    },
    init () {
      this.from = getUrlParams('from') || 'index'
      this._getRankList()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
.profit {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  overflow-x: hidden;
}
.profit-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  min-height: 960px;
  background: #f7f7f7;
  .profit-list-header {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    padding: 26px;
    background-color: #f7f7f7;
    display: flex;
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
      font-size: 24px;
      color: #000;
      .iconfont {
        font-size: 24px;
      }
    }
    .closed {
      right: 24px;
      top: 50%;
      transform: translate(0, -50%);
    }
    .back {
      left: 24px;
      top: 50%;
      transform: translate(0, -50%);
    }
  }
  .profit-main {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 100px;
    padding: 0 24px;
    z-index: 2;
    &.red {
      top: 0;
      padding: 24px 24px 0;
    }
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
              color: #000;
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
            color: #000;
            font-weight: bold;
            line-height: 1.1;
          }
          &:nth-child(3) {
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
      .ranking {
        margin-top: 30px;
        .ranking-list {
          position: relative;
          margin-top: 20px;
          border-radius: 16px 16px 0 0;
          overflow: hidden;
          .ranking-title {
            height: 50px;
            line-height: 50px;
            background: #fffdef;
            ul {
              display: flex;
              justify-content: space-between;
              align-items: center;
              li {
                text-align: center;
                font-size: 24px;
                color: #000;
                font-weight: bold;
                &.num {
                  width: 19%;
                }
                &.name {
                  width: 30%;
                }
                &.currprofit {
                  width: 24%;
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
            top: 331px;
            left: 24px;
            right: 24px;
            bottom: 60px;
            overflow: hidden;
            background: #fffdef;
            border-radius: 0 0 16px 16px;
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
            &.red {
              top: 249px;
            }
            ul {
              li {
                width: 100%;
                height: 90px;
                line-height: 90px;
                font-size: 24px;
                color: #000;
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
                      background: url('../img/ranking-icon1.png') no-repeat
                        center center;
                      background-size: 100% 100%;
                    }
                    .ranking2 {
                      display: block;
                      width: 38px;
                      height: 38px;
                      background: url('../img/ranking-icon2.png') no-repeat
                        center center;
                      background-size: 100% 100%;
                    }
                    .ranking3 {
                      display: block;
                      width: 38px;
                      height: 38px;
                      background: url('../img/ranking-icon3.png') no-repeat
                        center center;
                      background-size: 100% 100%;
                    }
                  }
                  &.name {
                    width: 30%;
                    overflow: hidden;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    white-space: nowrap;
                    img {
                      margin-right: 10px;
                      width: 38px;
                      height: 38px;
                    }
                  }
                  &.currprofit {
                    width: 24%;
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
}
</style>

<style lang="less">
.profit-game {
  .profit-wrapper {
    transform-origin: center;
    bottom: auto;
    top: 50%;
    margin-top: -16rem;
    transform: scale(0.8) translate3d(0, 0, 0);
    .profit-main {
      .profit-content {
        .ranking {
          .ranking-list {
            .ranking-center {
              bottom: 24px;
            }
          }
        }
      }
    }
  }
  &.profit-portrait {
    .profit-wrapper {
      transform: scale(0.8) translate3d(0, 0, 0);
    }
  }
  &.profit-landscape {
    .profit-wrapper {
      transform: scale(0.4) translate3d(0, 0, 0);
    }
  }
}
</style>

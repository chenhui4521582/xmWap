<template>
  <div class="profit-main" :class="$moduleConfig.isShowHeader&&'show-header'">
    <div class="profit-list-header" v-if="$moduleConfig.isShowHeader">
      <div class="items">
        <div class="back iconfont icon-return" @click="back"></div>
        <div class="title">热度榜单</div>
      </div>
    </div>
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
            <span>{{myProfit.myRank}}</span>
          </div>
        </div>
        <div class="item">
          <div class="title">
            <img src="../images/fire.png" alt="" class="fire">
            <span>我的热度</span>
          </div>
          <div class="value">
            {{myProfit.myHot}}
          </div>
        </div>
        <div class="rule-icon iconfont icon-question" @click="showRule"></div>
      </div>
      <div class="profit-explain">
        榜单为日榜，计算每日0时-24时的热度，次日0点重新计算
      </div>
      <!-- 排行榜 -->
      <div class="ranking">
        <div class="ranking-list">
          <div class="ranking-title">
            <ul>
              <li class="num">排名</li>
              <li class="name">玩家</li>
              <li class="price">热度</li>
            </ul>
          </div>
          <div class="ranking-center">
            <better-scroll ref="scroll" :data="scrollData" :listenScroll="true" :probeType="3"
              @scroll="scroll">
              <ul>
                <li v-for="(item, index) in scrollData" :key="index">
                  <span class="num">
                    <i>{{item.rank}}</i>
                  </span>
                  <span class="name">
                    <img v-if="item.profilePhoto" :src="item.profilePhoto | filter" alt=""
                      @click="viewImg(item.profilePhoto)">
                    <img v-else src="//file.beeplaying.com/cdn/common/images/common/img_photo.png"
                      alt="" />
                    <i>{{item.nickname}}</i>
                  </span>
                  <span class="price">{{ item.hot }}</span>
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
    <Modal v-model="isRule" title="热度榜规则" :closeButtonShow="false" @on-save="closeRule">
      <div class="rule-content">
        1.榜单为日榜,计算每日0时-24时的热度,次日0点重新计算;<br />
        2.热度计算公式为:<br>今日登上"游戏动态"和"奖励动态"总次数 × 10;<br />
        3.榜单无奖励,仅展示前20名。<br />
      </div>
    </Modal>
  </div>
</template>
<script type="text/javascript">
import BetterScroll from '@/components/betterScroll/betterScroll'
import { getUrlParams, jumpUrl } from '@/utils/utils'
import Services from '@/services/find'
import _get from 'lodash.get'

export default {
  data () {
    return {
      currentPage: 1,
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
      pageSize: 100,
    }
  },
  components: {
    BetterScroll,
  },
  methods: {
    back () {
      this.$router.replace('/find')
    },
    /** 获取列表 **/
    _getRankList () {
      this.showLoading = true
      Services.getFindRank({ pageSize: this.pageSize, page: this.currentPage })
        .then(res => {
          const result = _get(res, 'data.data')
          this.showLoading = false
          this.myProfit.myRank = result.myRank == 0 ? '未上榜' : result.myRank
          this.myProfit.myHot = result.myHot || 0
          /** 列表数据 **/
          this.scrollData = this.scrollData.concat(result.rankList || [])
          /** 解除滚动限制 **/
          if ((result.rankList || []).length == this.pageSize) {
            this.scrollLock = false
          } else {
            this.scrollLock = true
          }
        })
    },
    /** 列表滚动到底部重新获取数据 **/
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
    init () {
      this._getRankList()
    },
    /** 打开-规则 **/
    showRule () {
      this.$marchSetsPoint('A_H5PT0025001730')
      this.isRule = true
    },
    /** 关闭-规则 **/
    closeRule () {
      this.isRule = false
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
.profit-main {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0px;
  padding: 24px;
  z-index: 2;
  background: #f7f7f7;
  &.show-header {
    padding: 0 24px;
    top: 100px;
    .profit-content .ranking .ranking-list .ranking-center {
      top: 408px;
    }
  }
  .profit-list-header {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    padding: 26px;
    background: #f7f7f7;
    display: flex;
    height: 100px;
    .items {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      padding-left: 20px;
      .title {
        position: relative;
        display: block;
        margin: 0 17px;
        font-size: 32px;
        color: rgba(0, 0, 0, 1);
        font-weight: bold;
      }
    }
    .back {
      position: absolute;
      font-size: 30px;
      left: 26px;
      top: 50%;
      transform: translate(0, -50%);
    }
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
          display: flex;
          align-items: center;
          justify-content: center;
          span {
            color: #000000;
            font-size: 24px;
            &:first-child {
              font-size: 30px;
              color: #ff4141;
              margin-right: 6px;
            }
          }
          .fire {
            width: 30px;
            height: 30px;
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
            font-size: 42px;
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
      width: 690px;
      height: 88px;
      line-height: 88px;
      text-align: center;
      font-size: 24px;
      color: #ff4141;
      background: url('../images/rank/horn.png');
      background-size: 100% 100%;
      padding-bottom: 10px;
      box-sizing: border-box;
      position: relative;
      left: -9px;
    }
    .ranking {
      .title {
        font-size: 28px;
        color: #252525;
        font-weight: bold;
      }
      .ranking-list {
        position: relative;
        border-radius: 16px 16px 0 0;
        overflow: hidden;
        .ranking-title {
          height: 50px;
          line-height: 50px;
          background: #fffad4;
          ul {
            display: flex;
            justify-content: space-between;
            align-items: center;
            li {
              text-align: center;
              font-size: 24px;
              color: #000000;
              &.num {
                width: 26%;
              }
              &.name {
                width: 37%;
              }
              &.price {
                width: 37%;
              }
            }
          }
        }
        .ranking-center {
          position: fixed;
          padding-bottom: 26px;
          top: 332px;
          left: 24px;
          right: 24px;
          bottom: 53px;
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
                  width: 26%;
                  color: #acacac;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
                &.name {
                  width: 37%;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  text-align: left;
                  white-space: nowrap;
                  line-height: 30px;
                  img {
                    margin-right: 10px;
                    vertical-align: top;
                    width: 30px;
                    height: 30px;
                  }
                }
                &.price {
                  width: 37%;
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
            background: url('../images/back_top.png') no-repeat center center;
            background-size: 52px 52px;
          }
        }
      }
    }
  }
}
</style>

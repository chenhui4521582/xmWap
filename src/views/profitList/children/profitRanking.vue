<template>
  <div class="profit-main">
    <div class="profit-content">
      <!-- 我的盈利榜 -->
      <div class="my-profit">
        <div class="item">
          <div class="title">
            <span class="icon iconfont icon-people"></span>
            <span>我的排名</span>
          </div>
          <div class="value">
            {{
            (profitNew.profitMe && profitNew.profitMe.index) ||
            (profitNew.capacity && profitNew.capacity + '+')
            }}
          </div>
        </div>
        <div class="item">
          <div class="title">
            <span class="icon iconfont icon-leaf"></span>
            <span>当前盈利</span>
          </div>
          <div class="value">
            <span>{{ myProfit.amount || 0 }}</span>
            <!--橡皮擦-->
            <eraser v-if="showClearBtn" :amount="this.myProfit.amount"
              :firstClearShow="firstClearShow" @getMyProfit="_getMyProfit()"></eraser>
          </div>
        </div>
        <div class="item">
          <div class="title">
            <span class="icon iconfont icon-ranking"></span>
            <span>当前奖励</span>
          </div>
          <div class="value">
            {{ myProfit.awardsName || '暂无奖励' }}
          </div>
        </div>
        <div class="rule-icon iconfont icon-question" @click="showRule"></div>
      </div>
      <!-- 跑马灯 -->
      <horn :hornMessage="hornMessage" />
      <!-- 排行榜 -->
      <div class="ranking">
        <div class="title">
          <div class="item left">
            <span>本期榜单</span>
            <span>结算倒计时 {{ countTime }}</span>
          </div>
          <div class="item right">
            <span @click="checkPrevRank">上期榜单</span>
            <span class="iconfont icon-next"></span>
          </div>
        </div>
        <div class="ranking-list">
          <div class="ranking-title">
            <ul>
              <li class="num">排名</li>
              <li class="name">盈利达人</li>
              <li class="currprofit">当前盈利</li>
              <li class="price">奖励</li>
            </ul>
          </div>
          <div class="ranking-center" :class="{ 'no-expand': !isExpand }">
            <better-scroll ref="scroll" :data="scrollData" :listenScroll="true" :probeType="3"
              @scroll="scroll">
              <ul>
                <li v-for="(item, index) in scrollData" v-if="!item.expand" :key="index"
                  @click="openUserInfo(item)">
                  <span class="num">
                    <i v-if="item.index < 4" :class="`ranking${item.index}`"></i>
                    <i v-else>{{ item.index }}</i>
                  </span>
                  <span class="name">
                    <img v-if="item.headImg" :src="item.headImg | filter" alt="" />
                    <img v-else src="//file.beeplaying.com/cdn/common/images/common/img_photo.png"
                      alt="" />
                    <i>{{ item.nickName }}</i>
                  </span>
                  <span class="currprofit">{{ item.amount }}</span>
                  <span class="price">{{ item.awardsName }}</span>
                </li>
                <!-- 展开按钮 -->
                <li v-else class="scroll-up" @click="toggleRanking">
                  点击打开完整榜单
                  <div class="btn"></div>
                </li>
              </ul>
            </better-scroll>
            <div class="ranking-bottom"></div>
            <!-- 收起按钮 -->
            <div v-show="isExpand" class="scroll-down" @click="toggleRanking">
              点击收起榜单
              <div class="btn"></div>
            </div>
            <!-- 返回顶部按钮 -->
            <div v-show="isBackTop" class="scroll-top" @click="backTop()"></div>

          </div>
          <!-- 第一次进入页面用户头像tips -->
          <div class="master-tips" v-if="userTipsShow">
            <img src="../img/master-tips.png" alt="">
          </div>
        </div>
      </div>
    </div>
    <!-- 规则 -->
    <rule v-model="isRule" />
    <!--用户信息弹框-->
    <userInfo ref="userInfo" />
    <profit-first-pop v-model="firstPopShow" @firstPopHide="firstPopHide"></profit-first-pop>
  </div>
</template>
<script type="text/javascript">
import BetterScroll from '@/components/betterScroll/betterScroll'
import horn from '../components/horn'
import rule from '../components/rule'
import eraser from '../components/eraser'
import profitFirstPop from '../components/profitFirstPop'
import { getUrlParams } from '@/utils/utils'
import Services from '@/services/profit'
import _get from 'lodash.get'
import AwardsDialog from '../../../components/awardsDialog/awardsDialog'
import UserInfo from '../components/userInfo'

export default {
  data () {
    return {
      currentPageSize: 100,
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
      isRule: false,
      /** 是否显示发榜弹框 **/
      showAwards: false,
      /** 第一次进入引导弹框 **/
      firstPopShow: false,
      /** 第一次进入清除按钮引导动画 **/
      firstClearShow: false,
      /** 第一次进入用户头像上的提示 **/
      userTipsShow: false
    }
  },
  computed: {
    /** 根据我的排名生成跑马灯 **/
    hornMessage () {
      return {
        index: _get(this.profitNew, 'profitMe.index', ''),
        nextAwardsName: _get(this.myProfit, 'nextAwardsName', ''),
        capacity: _get(this.profitNew, 'capacity', '')
      }
    },

    /** 是否显示擦除按钮 **/
    showClearBtn () {
      return this.myProfit.amount < 0
    }
  },
  inject: ['gameType', 'screenType'],
  methods: {
    /** 获取排行榜列表 **/
    _getRankList () {
      this.showLoading = true
      Services.getRankList({ pageSize: this.currentPageSize, page: 1 })
        .then(res => {
          this.showLoading = false
          this.profitNew = _get(res, 'data.data', [])
          /** 倒计时 **/
          this.countDown(_get(this.profitNew, 'countdown', 0))
          /** 列表数据 **/
          this.expandList = _get(res, 'data.data.rankingList', [])
          /** 不展开的时候数据 **/
          this.noExpandList = []
          this.noExpandList = this.noExpandList.concat(
            _get(res, 'data.data.topThrees', []),
            [{ expand: true }],
            _get(res, 'data.data.bottomTwo', [])
          )
          /** 解除滚动限制 **/
          if (_get(res, 'data.data.rankingList', []).length === 100) {
            this.scrollLock = false
          }
          /** 把数据赋值给scrollData **/
          if (this.isExpand) {
            this.scrollData = this.expandList
          } else {
            this.scrollData = this.noExpandList
          }
        })
        .catch(error => {
          /** 解除滚动限制 **/
          this.scrollLock = false
        })
    },
    /** 获取用户信息 **/
    _getMyProfit () {
      Services.getMyProfit().then(res => {
        this.myProfit = _get(res, 'data.data', [])
        this.firstPopInit()
      })
    },
    /** 倒计时 **/
    countDown (item) {
      if (!item) return false
      let date = item / 1000
      this.timer = setInterval(() => {
        date = date - 1
        if (date <= 0) {
          date = 0
          clearInterval(this.timer)
        }
        let hourse = Math.floor(parseInt(date / 60 / 60) % 24)
        let minute = Math.floor(parseInt(date / 60) % 60)
        let second = Math.floor(date % 60)
        let countHourse = hourse >= 10 ? hourse : '0' + hourse
        let countMinute = minute >= 10 ? minute : '0' + minute
        let countSecond = second >= 10 ? second : '0' + second
        this.countTime = `${countHourse}:  ${countMinute}:  ${countSecond}`
      }, 1000)
    },
    /** 列表滚动到底部重新获取数据 **/
    scroll (pos) {
      /** 未展示状态禁止 滚动到底部拉取数据**/
      if (!this.isExpand) {
        return false
      }
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
          this.currentPageSize = 1000
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
    /** 切换是否展开 **/
    toggleRanking () {
      this.isBackTop = false
      this.isExpand = !this.isExpand
      /** 返回顶部 **/
      this.$refs.scroll.scrollTo(0, 0)
      if (this.isExpand) {
        this.scrollData = this.expandList
        this.$marchSetsPoint(1210070209, { platform_id: 40000 })
      } else {
        this.scrollData = this.noExpandList
        this.$marchSetsPoint(1210070210, { platform_id: 40000 })
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
    /** 查看上期榜单 **/
    checkPrevRank () {
      if (this.from === 'game') {
        this.$marchSetsPoint('A_H5PT0071000612')
      } else {
        this.$marchSetsPoint('A_H5PT0025000610')
      }
      this.$router.push({ path: `/profitlist/provranking?from=${this.from}&gametype=${this.gameType}&screentype=${this.screenType}` })
    },
    /** 显示发榜奖励框 **/
    showAwardsDialog () {
      this.showAwards = true
    },
    /** 发榜奖励回调 **/
    awardsCallback () {
      this.showAwards = false
    },
    openUserInfo (item) {
      this.$refs.userInfo.init(item.userId)
    },
    /** 第一次进入引导弹框 **/
    firstPopInit () {
      let firstPopCache = localStorage.getItem('profitFirstPop')
      if (!firstPopCache) {
        this.firstPopShow = true
        localStorage.setItem('profitFirstPop', Date.now())
        return
      }
      this.firstClearInit()
    },
    /** 第一次进入引导弹框关闭回调 **/
    firstPopHide () {
      this.userTipsShow = true
      this.firstClearInit()
    },
    /** 第一次进入清除按钮引导动画 **/
    firstClearInit () {
      this.firstEnterHide()
      /** 判断是否需要展示擦除动画 **/
      let firstClearCache = localStorage.getItem('profitFirstClear')
      if (!firstClearCache && this.showClearBtn) {
        this.firstClearShow = true
        localStorage.setItem('profitFirstClear', Date.now())
        return
      }
    },
    /** 第一次进入清除关闭倒计时 **/
    firstEnterHide () {
      this.timer = setTimeout(() => {
        this.firstClearShow = false
        this.userTipsShow = false
      }, 4000)
      let element = document.querySelectorAll('.profit')[0]
      element.addEventListener('touchstart', () => {
        this.firstClearShow = false
        this.userTipsShow = false
      })
    },
    init () {
      this.from = getUrlParams('from') || 'index'
      this._getMyProfit()
      this._getRankList()
    }
  },
  components: {
    AwardsDialog,
    rule,
    horn,
    eraser,
    BetterScroll,
    UserInfo,
    profitFirstPop
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
          color: #000;
          font-weight: bold;
          line-height: 1;
        }
        &:nth-child(3) {
          border: none;
          .value {
            height: 38px;
            line-height: 38px;
            font-size: 20px;
            color: #bbbbbb;
          }
        }
        &:nth-child(2) {
          .value {
            display: flex;
            justify-content: center;
            align-items: center;
          }
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
      margin-top: 60px;
      .title {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        font-size: 28px;
        .left {
          span {
            &:first-child {
              margin-right: 10px;
              font-size: 28px;
              color: #000;
              font-weight: bold;
            }
            &:last-child {
              font-size: 24px;
              color: #ff4141;
            }
          }
        }
        .right {
          span {
            &:first-child {
              font-size: 24px;
              color: #888888;
            }
            &:last-child {
              font-size: 24px;
              color: #888888;
            }
          }
        }
      }
      .ranking-list {
        position: relative;
        margin-top: 20px;
        border-radius: 16px 16px 0 0;
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
          padding-bottom: 60px;
          top: 511px;
          left: 24px;
          right: 24px;
          bottom: 100px;
          overflow: hidden;
          background: #fffdef;
          border-radius: 0 0 16px 16px;
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
          &.no-expand {
            max-height: 608px;
            padding-bottom: 26px;
          }
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
                    background: url('../img/ranking-icon1.png') no-repeat center
                      center;
                    background-size: 100% 100%;
                  }
                  .ranking2 {
                    display: block;
                    width: 38px;
                    height: 38px;
                    background: url('../img/ranking-icon2.png') no-repeat center
                      center;
                    background-size: 100% 100%;
                  }
                  .ranking3 {
                    display: block;
                    width: 38px;
                    height: 38px;
                    background: url('../img/ranking-icon3.png') no-repeat center
                      center;
                    background-size: 100% 100%;
                  }
                }
                &.name {
                  width: 27%;
                  overflow: hidden;
                  display: flex;
                  justify-content: flex-start;
                  align-items: center;
                  white-space: nowrap;
                  img {
                    margin-right: 10px;
                    width: 30px;
                    height: 30px;
                  }
                }
                &.currprofit {
                  width: 27%;
                }
                &.price {
                  width: 27%;
                }
              }
              &.scroll-up {
                position: relative;
                width: 100%;
                height: 60px;
                background: #fffad4;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 24px;
                color: rgba(255, 65, 65, 1);
                .btn {
                  margin-left: 10px;
                  width: 30px;
                  height: 30px;
                  background: url('../img/up-btn.png') no-repeat center center;
                  background-size: 100% 100%;
                }
              }
            }
          }
          .scroll-down {
            position: absolute;
            bottom: 0;
            z-index: 1;
            left: 0;
            width: 100%;
            height: 60px;
            background: #fffad4;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            color: rgba(255, 65, 65, 1);
            .btn {
              margin-left: 10px;
              width: 30px;
              height: 30px;
              background: url('../img/down-btn.png') no-repeat center center;
              background-size: 100% 100%;
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
        .master-tips {
          position: absolute;
          left: 38px;
          top: 0;
          width: 210px;
          height: 70px;
          img {
            vertical-align: top;
            height: 100%;
            width: 100%;
          }
        }
      }
    }
  }
}

@keyframes fadeInOut {
  0% {
    opacity: 1;
  }
  25% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  75% {
    opacity: 1;
  }
}
</style>

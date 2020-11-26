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
            {{ myProfit.rankingIndex }}
          </div>
        </div>
        <div class="item">
          <div class="title">
            <span class="icon iconfont icon-phone"></span>
            <span>话费券</span>
          </div>
          <div class="value">
            <span>{{ myProfit.hfAmount || 0 }}元</span>
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
      <div v-if="myProfit.startTime && countNum>0" class="pnl_rule">
          活动时间 {{formatTime(myProfit.startTime ,'y.m.d')}} ~ {{formatTime(myProfit.endTime ,'y.m.d')}}
      </div>
      <!-- 排行榜 -->
      <div class="ranking">
        <div class="title">
          <div class="item left">
            <span>{{title}}</span>
          </div>
          <div v-if="countNum>0" class="item right countTime">
             <span>活动倒计时 {{ countTime }}</span>
          </div>
        </div>
        <div class="ranking-list">
          <div class="ranking-title">
            <ul>
              <li class="num">排名</li>
              <li class="name">盈利达人</li>
              <li class="currprofit">话费券数量</li>
              <li class="price">奖励</li>
            </ul>
          </div>
          <div class="ranking-center" :class="{ 'no-expand': !isExpand ,'no-time':countNum==0}">
            <better-scroll ref="scroll" :data="scrollData" :listenScroll="true" :probeType="3"
              @scroll="scroll">
              <ul>
                <li v-for="(item, index) in scrollData" v-if="!item.expand" :key="index" @click="openUserInfo(item)">
                  <span class="num">
                    <i v-if="item.rank < 4" :class="`ranking${item.rank}`"></i>
                    <i v-else>{{ item.rank }}</i>
                  </span>
                  <span class="name">
                    <img v-if="item.profilePhoto" :src="item.profilePhoto | filter" alt="" />
                    <img v-else src="//file.beeplaying.com/cdn/common/images/common/img_photo.png"
                      alt="" />
                    <i>{{ item.nickName }}</i>
                  </span>
                  <span class="currprofit">{{ item.profitAmount }}</span>
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
        </div>
      </div>
    </div>
    <!-- 规则 -->
    <Modal v-model="isRule" title="规则说明" :closeButtonShow="false" @on-save="closeRule">
      <div class="rule-content">
        1.新人话费榜活动时间为：{{formatTime(myProfit.startTime,'y年m月d日')}}-{{formatTime(myProfit.endTime ,'y年m月d日')}}<br />
        2.话费榜仅对排名前20发放奖励，奖励均为话费券<br />
        3.活动结束后发榜，奖励自动发至账户，同时会有站内信通知
      </div>
    </Modal>
    <!--用户信息弹框-->
    <userInfo ref="userInfo" />
    <profit-first-pop></profit-first-pop>

  </div>
</template>
<script type="text/javascript">
import BetterScroll from "@/components/betterScroll/betterScroll"
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
      currentPage: 1,
      from: getUrlParams('from') || 'index',
      /** 我的数据 **/
      myProfit: {},
      /** 倒计时 **/
      countTime: '',
      countNum:100,
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
      showAwards: false
    }
  },
  computed: {
    title(){
      if(this.countNum == 0){
        return '榜单已发榜'
      }
      return '本期榜单'
    }
  },
  methods: {

    formatTime(date, type){
      if(date && date.indexOf('-')>-1)
      {
        date = date.replace(/-/g,'/')
      }

      if (date instanceof Date) {
        date = data.getTime()
      } else {
        date = new Date(date)
      }
      
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      let d = date.getDate()
      let h = date.getHours()
      let minute = date.getMinutes()
      let second = date.getSeconds()
      m = m < 10 ? `0${m}` : m
      d = d < 10 ? `0${d}` : d
      h = h < 10 ? `0${h}` : h
      minute = minute < 10 ? `0${minute}` : minute
      second = second < 10 ? `0${second}` : second
      if (type === 'y-m-d h:m:s') {
        return `${y}-${m}-${d} ${h}:${minute}:${second}`
      } else if (type === 'y-m-d') {
        return `${y}-${m}-${d}`
      } 
      else if (type === 'y年m月d日') {
        return `${y}年${m}月${d}日`
      } 
      else if (type === 'm-d') {
        return `${m}-${d}`
      } else if (type === 'y.m.d') {
        return `${y}.${m}.${d}`
      } else if (type === 'm.d') {
        return `${m}.${d}`
      } else {
        return `${y}-${m}-${d} ${h}:${minute}:${second}`
      }
    },

    /** 关闭规则 **/
    closeRule () {
      this.isRule = false
    },
    /** 获取排行榜列表 **/
    _getRankList () {
      this.showLoading = true
      Services.getNewUserRankingList({ pageSize: 100, page: this.currentPage })
        .then(res => {
          this.showLoading = false
         
          /** 列表数据 **/
          this.expandList = this.expandList.concat(
            _get(res, 'data.data.resultList', [])
          )

          /** 不展开的时候数据 **/
          this.noExpandList = []
          this.noExpandList = this.noExpandList.concat(
            _get(res, 'data.data.topThreeList', []),
            [{ expand: true }],
            _get(res, 'data.data.bottomThreeList', [])
          )
          /** 解除滚动限制 **/
          if (_get(res, 'data.data.resultList', []).length == 100) {
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
      Services.getNewUserRankingInfo().then(res=>{
        this.myProfit = _get(res,'data.data',{});
         /** 倒计时 **/
         this.countNum = _get(this.myProfit, 'countDown', 0);
        this.countDown(_get(this.myProfit, 'countDown', 0))
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
        let days = Math.floor(parseInt(date / 60 / 60 / 24 ))
        let hours = Math.floor(parseInt(date / 60 / 60) % 24)
        let minute = Math.floor(parseInt(date / 60) % 60)
        let second = Math.floor(date % 60)
        let countHourse = hours >= 10 ? hours : '0' + hours
        let countMinute = minute >= 10 ? minute : '0' + minute
        let countSecond = second >= 10 ? second : '0' + second
        this.countTime = `${days}天${countHourse}:${countMinute}:${countSecond}`
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
      this.$marchSetsPoint('A_H5PT0025002681')
      this.isRule = true
    },
    /** 查看上期榜单 **/
    checkPrevRank () {
      if (this.from === 'game') {
        this.$marchSetsPoint('A_H5PT0071000612')
      } else {
        this.$marchSetsPoint('A_H5PT0025000610')
      }
      this.$router.push({ path: `/profitlist/provranking?from=${this.from}` })
    },
    /** 显示发榜奖励框 **/
    showAwardsDialog () {
      this.showAwards = true
    },
    /** 发榜奖励回调 **/
    awardsCallback () {
      this.showAwards = false
    },
    openUserInfo(item){
      this.$refs.userInfo.init(item.userId);
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

    .pnl_rule
    {
      position: relative;
      margin-top: 20px;
      overflow: hidden;
      height: 70px;
      background: url('../img/tip.png') no-repeat center top ;
      background-size: 100% 100%;
      border-radius: 16px;
      box-shadow:0px 3px 6px rgba(0,0,0,0.08);
      line-height: 70px;
      text-align: center;
      font-size: 24px;
      color: #000000;
      span {
        color: #FF4141;
      }
    }

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
      margin-top: 38px;
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
          }
        }
        .right {
          &.countTime
          {
            font-size: 24px;
            color: #FF4141;
          }
        }
      }
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
          top: 489px;
          left: 24px;
          right: 24px;
          bottom: 100px;
          overflow: hidden;
          background: #fffdef;
          border-radius: 0 0 16px 16px;
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);

          &.no-time
          {
            top: 400px;
          }
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
                      center ;
                    background-size: 100% 100%;
                  }
                  .ranking2 {
                    display: block;
                    width: 38px;
                    height: 38px;
                    background: url('../img/ranking-icon2.png') no-repeat center
                      center ;
                    background-size: 100% 100%;
                  }
                  .ranking3 {
                    display: block;
                    width: 38px;
                    height: 38px;
                    background: url('../img/ranking-icon3.png') no-repeat center
                      center ;
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

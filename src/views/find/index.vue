<template>
  <div class="find-warp">
    <!-- 公共头部 -->
    <base-header ref="header"></base-header>
    <!-- recommend -->
    <recommend v-if="showRecommend" :recommendList="recommendList" ref="recommend" />
    <!-- rank -->
    <rank v-if="showRank" ref="rank" :showRecommend="showRecommend" :rankList="rankList.slice(0,3)"
      @openUserInfo="openUserInfo" />
    <!-- 大神攻略 & 游戏礼包 -->
    <div class="master-strategy" ref="strategy">
      <template v-if="isShowGift">
        <ul class="double-wrap">
          <li @click="goMasterStrategy">
            <img src="./images/master-strategy-icon.png" alt="">
          </li>
          <li @click="goGameGift">
            <img src="./images/game-gift-icon.png" alt="">
          </li>
        </ul>
      </template>
      <template v-else>
        <div class="wrap" @click="goMasterStrategy">
          <div class="icon">大神攻略</div>
          <div class="text" v-html="masterStrategy"></div>
          <div class="go">更多攻略<span class="iconfont icon-next"></span></div>
        </div>
      </template>
    </div>
    <!-- tab 切换 -->
    <div class="tab-warp"
      :class="{'center': tabList.length < 5, showRankorrecommend:showRank||showRecommend, fixed:isShowTopIcon}"
      ref="tabFixed">
      <div class="tab-item" v-for="(tab,index) in tabList"
        :class="{'tab-item-active': index===tabSelected}" :key="index" @click="switchTab(index)">
        <span>{{tab}}</span>
        <i class="line" v-show="index===tabSelected"></i>
      </div>
      <!-- loading -->
      <loading :mask="false" size="small" v-if="showLoading" />
    </div>
    <!-- tab 切换 -->
    <div class="tab-warp"
      :class="{'center': tabList.length < 5,showRankorrecommend:showRank||showRecommend,static:isShowTopIcon}"
      v-if="isShowTopIcon">
      <div class="tab-item" v-for="(tab,index) in tabList"
        :class="{'tab-item-active': index===tabSelected}" :key="index" @click="switchTab(index)">
        <span>{{tab}}</span>
        <i class="line" v-show="index===tabSelected"></i>
      </div>
    </div>
    <div class="find-content"
      :class="{top:isShowTopIcon&&tabSelected==0&&topData&&topData.top&&countdownTime}">
      <div class="content-warp">
        <template v-if="dynamicList.length>0">
          <ul class="list-warp">
            <template v-for="(item ,index) in dynamicList">
              <li class="list-item" :key="index"
                v-if="!(isShowTopIcon&&tabSelected==0&&item.top&&countdownTime)">
                <div class="list-content" :class="{top:tabSelected==0&&item.top&&countdownTime}">
                  <div class="img-warp" @click="openUserInfo(item)">
                    <img :src="(item.profilePhoto||avatar) | filter">
                    <img :src="item.icon | filter" class="gameicon" v-if="item.icon">
                  </div>
                  <div class="content-warp" v-html="item.remark.replace('【','[').replace('】','] ')"
                    @click="openUserInfo(item)">
                  </div>
                  <div class="info">
                    <div class="time">{{item.timeline}}</div>
                    <div class="gotosee" @click="jump(item.url)"
                      v-if="tabSelected>0||!item.top||!countdownTime">
                      去看看<i class="icon iconfont icon-next"></i></div>
                  </div>
                </div>
                <div class="list-content-top" v-if="tabSelected==0&&item.top&&countdownTime">
                  <div class="top-warp">
                    <span>置顶</span>
                    <span class="counttime">{{countdownTime}}</span>
                  </div>
                  <div class="info">
                    <span class="gotoreceive" @click="divideBag(item)">
                      <template v-if="userInfo.userId==item.userId">
                        {{item.receiveNum}}人已领<i class="icon iconfont icon-next"></i>
                      </template>
                      <template v-else>
                        <template v-if="item.received||item.receiveNum<100">
                          <img src="./images/share/fortune_bag.png" alt=""
                            :class="{animation:!topData.received}">
                          <em v-if="!item.received">抢福袋 吸好运 <i
                              class="icon iconfont icon-next"></i></em>
                          <template v-else>
                            <em>已抢</em>&nbsp;看看手气<i class="icon iconfont icon-next"></i>
                          </template>
                        </template>
                        <template v-else>
                          <img src="./images/share/fortune_bag_gray.png" alt=""><em
                            class="gray">未抢到</em>&nbsp;看看手气<i class="icon iconfont icon-next"></i>
                        </template>
                      </template>
                    </span>
                  </div>
                </div>
              </li>
            </template>
            <div class="bottom-line">
              <bottom-line></bottom-line>
            </div>
          </ul>
        </template>
        <div class="list-item fixed"
          v-if="isShowTopIcon&&tabSelected==0&&topData.top&&countdownTime" ref="topDataFixed">
          <div class="list-content top">
            <div class="img-warp" @click="openUserInfo(topData)">
              <img :src="(topData.profilePhoto||avatar) | filter">
              <img :src="topData.icon | filter" class="gameicon" v-if="topData.icon">
            </div>
            <div class="content-warp" v-html="topData.remark.replace('【','[').replace('】','] ')"
              @click="openUserInfo(topData)">
            </div>
            <div class="info">
              <div class="time">{{topData.timeline}}</div>
            </div>
          </div>
          <div class="list-content-top">
            <div class="top-warp">
              <span>置顶</span>
              <span class="counttime">{{countdownTime}}</span>
            </div>
            <div class="info">
              <span class="gotoreceive" @click="divideBag(topData)">
                <template v-if="userInfo.userId==topData.userId">
                  {{topData.receiveNum}}人已领<i class="icon iconfont icon-next"></i>
                </template>
                <template v-else>
                  <template v-if="topData.received||topData.receiveNum<100">
                    <img src="./images/share/fortune_bag.png" alt=""
                      :class="{animation:!topData.received}">
                    <em v-if="!topData.received">抢福袋 吸好运 <i
                        class="icon iconfont icon-next"></i></em>
                    <template v-else>
                      <em>已抢</em>&nbsp;看看手气<i class="icon iconfont icon-next"></i>
                    </template>
                  </template>
                  <template v-else>
                    <img src="./images/share/fortune_bag_gray.png" alt=""><em
                      class="gray">未抢到</em>&nbsp;看看手气<i class="icon iconfont icon-next"></i>
                  </template>
                </template>
              </span>
            </div>
          </div>
        </div>
        <div class="incre" :class="{fixed:isShowTopIcon}" @click="refresh"
          v-if="(increNum||newSharingShow)&&!showLoading">
          <template v-if="newSharingShow">有福袋 <i>立即前往</i></template>
          <template v-else>有{{increNum}}新动态 <i>点击刷新</i></template>
        </div>
      </div>
    </div>
    <!--用户信息弹框-->
    <userInfo ref="userInfo" :fromPage="fromPage" />
    <!-- 返回顶部按钮 -->
    <div v-show="isShowTopIcon&&(showRecommend||showRank)" class="scroll-top" @click="backTop()">
    </div>
    <shareEntry v-if="showShareEntry" :noticeId="maxId" :countdownTime="countdownTime"
      @getNewShare="getNewShare"></shareEntry>
    <!-- 领取弹出框 @callback="awardsCallback"  @closedCallback="awardsCallback" -->
    <awards-dialog v-model="showAwards" :awards="AwardsData&&AwardsData.awards"
      :tipsOtherText="AwardsData&&AwardsData.tipsOtherText" confirmBtnText="收入囊中"
      @callback="showAwards=false" />
    <Modal v-model="showEmpty" class="rule-pop" :centerScroll="true" title="你来晚了"
      :closeButtonShow=false :saveText="'去看看别人手气'" @on-save="goToReceiveDetail">
      <div class="awards_empty">
        <img src="./images/share/sad.png" alt="">
        <div class="text">
          <div class="item">用户{{topData&&topData.nickname}}</div>
          <div class="item">的好运福袋已被领完</div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import baseHeader from '@/components/baseHeader/baseHeader'
import baseFooter from '@/components/baseFooter/baseFooter'
import Recommend from './components/recommend/recommend'
import rank from './components/rank'
import UserInfo from '@/views/profitList/components/userInfo'
import shareEntry from './components/shareEntry/index'
import findService from '@/services/find'
import { saveNewUserTask } from '@/services/global'
import { jumpUrl } from '../../utils/utils'
import { mapActions, mapState, mapMutations } from 'vuex'
import _get from 'lodash.get'
export default {
  name: 'mall',
  components: {
    baseHeader,
    baseFooter,
    Recommend,
    rank,
    UserInfo,
    shareEntry
  },
  data () {
    return {
      tabSelected: 0,//tab序号位
      recommendList: [],//推荐位数据
      rankList: [],//排行榜数据
      dynamicList: [],//动态数据ICON
      isShowTopIcon: false,//是否显示置顶icon
      pageSize: 30,
      avatar: '/cdn/common/images/common/img_photo.png',//默认头像
      scrollEnd: false,//是否滑动底部
      showLoading: false,
      increNum: 0,//新增动态个数
      newSharingShow: false,
      timer: null,//定时器
      fromPage: 'find',
      showShareEntry: true,
      showAwards: false,
      AwardsData: {},
      showEmpty: false,
      topData: null,
      countdownTime: '',
      maxId: 0,//推荐动态的最大ID
      countTimer: null,//定时器
      masterStrategy: '',
      isShowGift: false
    }
  },
  async mounted () {
    await this.init()
  },
  computed: {
    ...mapState(['userInfo']),
    tabList () {
      return ['推荐动态', '游戏动态', '奖励动态']
    },
    distance () {
      let distance =
        (this.$refs.recommend && this.$refs.recommend.$el.offsetHeight || 0) +
        (this.$refs.rank && this.$refs.rank.$el.offsetHeight || 0) +
        (this.$refs.strategy && this.$refs.strategy.offsetHeight || 0)
      let headerDistance = this.$refs.header && this.$refs.header.$el.offsetHeight || 0
      return distance ? distance - headerDistance : 0
    },
    /** 是否显示推荐位 **/
    showRecommend () {
      return this.recommendList.length > 0
    },
    /** 是否显示排行榜 **/
    showRank () {
      return this.rankList.length > 0
    }
  },
  methods: {
    ...mapActions({
      _getUserInfo: 'GET_USERINFO' // 获取用户信息
    }),
    ...mapMutations({
      _setFindBagCanReceive: 'SET_FINDBAGCANRECEIVE'//设置福袋可领取状态
    }),
    /** 跳转 **/
    jump (url) {
      this.$marchSetsPoint('A_H5PT0272003221', {
        target_project_name: url
      })
      jumpUrl({ url })
    },
    countDown (time) {
      if (!time) return false
      let date = time / 1000
      this.countTimer = setInterval(() => {
        date = date - 1
        if (date <= 0) {
          date = 0
          clearInterval(this.countTimer)
          this.countdownTime = ''
          this._setFindBagCanReceive(false)
          return
        }
        let day = Math.floor(date / 86400)
        let hour = Math.floor(parseInt(date / 60 / 60) % 24)
        let minute = Math.floor(parseInt(date / 60) % 60)
        let second = Math.floor(date % 60)
        let countHour = hour >= 10 ? hour : '0' + hour
        let countMinute = minute >= 10 ? minute : '0' + minute
        let countSecond = second >= 10 ? second : '0' + second
        if (day > 0) {
          this.countdownTime = `${day}天${countHour}:${countMinute}:${countSecond}`
        } else {
          this.countdownTime = `${countHour}:${countMinute}:${countSecond}`
        }
      }, 1000)
    },
    scrollInit (event) {
      event && event.stopPropagation()
      let divHeight = document.querySelector('.find-warp').offsetHeight
      let scrollTop = (document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop)
      this.isShowTopIcon = scrollTop >= this.distance
      if (scrollTop + document.body.clientHeight - divHeight >= -20) {
        !this.scrollEnd && !this.showLoading && this.getDynamicList({
          minId: this.dynamicList[this.dynamicList.length - 1].id,
          pageSize: this.pageSize,
          tabType: this.tabSelected + 1
        })
      }
    },
    async init () {
      this.$marchSetsPoint('P_H5PT0272')
      await this.getRecommendData()
      await this.getRankData()
      localStorage['redDot_find'] = 1
      this.isShowTopIcon = (document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop) >= this.distance
      window.addEventListener('scroll', this.scrollInit, false)
      await this.getDynamicList({
        pageSize: this.pageSize,
        tabType: this.tabSelected + 1
      })
      this.timer = setInterval(() => {
        this.getIncreData()
      }, 30000)
      this._showPack()
      this._saveNewUserTask()
    },
    /** tab 切换 **/
    async switchTab (index) {
      if (this.tabSelected != index) {
        let points = ['A_H5PT0272003218', 'A_H5PT0272003216', 'A_H5PT0272003217']
        this.$marchSetsPoint(points[index])
        this.increNum = 0
        this.tabSelected = index
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          this.getIncreData()
        }, 30000)
        this.refreshData()
      }
    },
    /** 打开用户信息弹窗 **/
    openUserInfo (item) {
      if (!item.rank) {
        this.$marchSetsPoint('A_H5PT0272003219')
      }
      this.$refs.userInfo.init(item.userId)
    },
    /** 获得推荐位数据 **/
    async getRecommendData () {
      const { data, code } = (await findService.getFindRecommend()).data
      if (code === 200) {
        this.recommendList = data
      }
    },
    /** 获得排行榜数据 **/
    async getRankData () {
      const { data, code } = (await findService.getFindRank()).data
      if (code === 200) {
        this.rankList = data.rankList || []
      }
    },
    /** 获得动态列表数据 **/
    async getDynamicList (param) {
      this.showLoading = true
      const { data, code, message } = (await findService.getFindDynamicList(param)).data
      if (code === 200) {
        if (param.minId) {
          this.dynamicList = [...this.dynamicList, ...data]
        } else {
          this.dynamicList = data
        }
        if (this.tabSelected == 0) {
          this.topData = this.dynamicList[0]
          this.topData && !this.countdownTime && this.countDown(this.topData.countDown || 0)
          if (this.topData && this.topData.top && this.countdownTime) {
            this.maxId = this.dynamicList.length > 1 ? this.dynamicList[1].id : this.topData.id
          } else {
            this.maxId = this.dynamicList.length ? this.dynamicList[0].id : 0
          }
        }
        if (data.length < this.pageSize) {
          this.scrollEnd = true
        } else {
          this.scrollEnd = false
        }
        this.showLoading = false
      } else {
        this.showLoading = false
        this.$Toast(message)
      }
    },
    /** 列表返回顶部 **/
    backTop () {
      this.$marchSetsPoint('A_H5PT0025001195')
      document.body.scrollTop = 0
      !document.body.scrollTop && (document.documentElement.scrollTop = 0)
    },
    /** 新增刷新(动态和福袋) **/
    async refresh () {
      //H5平台-发现-好运分享-福袋提示点击A_H5PT0272003345
      this.$marchSetsPoint(this.newSharingShow ? 'A_H5PT0272003345' : 'A_H5PT0272003220')
      if (this.newSharingShow) {
        this.tabSelected = 0
      }
      this.increNum = 0
      this.newSharingShow = false
      this.refreshData()
    },
    /** 刷新动态第一页数据 **/
    async refreshData () {
      await this.getDynamicList({
        pageSize: this.pageSize,
        tabType: this.tabSelected + 1
      })
      if (this.isShowTopIcon) {
        document.body.scrollTop = this.distance
        !document.body.scrollTop && (document.documentElement.scrollTop = this.distance)
      }
    },
    /** 获得新增数据条数 **/
    async getIncreData () {
      let params = Object.assign({ tabType: this.tabSelected + 1 }, this.dynamicList.length ? { maxId: this.dynamicList[0].id } : {})
      const { data, code } = (await findService.getFindDynamicIncrNum(params)).data
      if (code === 200) {
        this.increNum = data && data.newNum
        this.newSharingShow = data && data.newSharing
      }
    },
    /** 瓜分福袋 **/
    async divideBag (item) {
      if (this.userInfo.userId != item.userId && !item.received) {
        this.$marchSetsPoint('A_H5PT0272003338')//H5平台-发现-非分享者-抢福袋点击
        let { code, data, message } = (await findService.getFindDivideBag(this.topData.luckyBagLogId)).data
        if (code == 200) {
          this._setFindBagCanReceive(false)
          //H5平台-发现-非分享者-抢到福袋弹窗加载完成A_H5PT0272003339
          //H5平台-发现-非分享者-未抢到福袋弹窗加载完成A_H5PT0272003340
          this.$marchSetsPoint(data.win ? 'A_H5PT0272003339' : 'A_H5PT0272003340')
          if (data.win) {
            this.AwardsData = {
              awards: {
                awardsImage: `${require('./images/share/leaf.png')}`,
                awardsName: `好运金叶x${data.leafNum}`,
                nofilter: true
              },
              tipsOtherText: `您从用户${this.topData.nickname}的福袋吸取`
            }
            this.showAwards = true
            this._getUserInfo()
            if (this.tabSelected == 0) {
              await this.getDynamicList({
                pageSize: this.pageSize,
                tabType: this.tabSelected + 1
              })
              if (this.isShowTopIcon) {
                document.body.scrollTop = this.distance
                !document.body.scrollTop && (document.documentElement.scrollTop = this.distance)
              }
            }
          } else {
            this.showEmpty = true
          }
        } else {
          this.$Toast(message)
        }
      } else {
        //H5平台-发现-分享者-领取情况查看点击A_H5PT0272003342
        //H5平台-发现-非分享者-领取情况查看点击A_H5PT0272003343
        this.$marchSetsPoint(this.userInfo.userId == item.userId ? 'A_H5PT0272003342' : 'A_H5PT0272003343')
        this.$router.push(`/receiveDetail/${this.topData.luckyBagLogId}/${this.topData.nickname}`)
      }
    },
    goToReceiveDetail () {
      //H5平台-发现-非分享者-未抢到福袋弹窗-看看手气点击
      this.$marchSetsPoint('A_H5PT0272003341')
      this.$router.push(`/receiveDetail/${this.topData.luckyBagLogId}/${this.topData.nickname}`)
    },
    //分享成功刷新推荐动态
    getNewShare (flag) {
      if (flag) {
        this.tabSelected = 0
      } else {
        if (this.tabSelected == 0) {
          this.refreshData()
        } else {
          this.getIncreData()
        }
      }
    },
    /** 获取大神攻略数据 **/
    _getMasterStrategy () {
      findService.getMasterStrategy().then(res => {
        const { code, data, message } = _get(res, 'data', {})
        if (code == 200) {
          this.masterStrategy = _get(res, 'data.data.content', '')
        }
      })
    },
    /** 跳转大神攻略 **/
    goMasterStrategy () {
      this.$marchSetsPoint('A_H5PT0272003391')
      window.location.href = `${process.env['VUE_APP_HOST_PLATFORM']}/activities/masterstrategy.html?from=find`
    },
    async _showPack () {
      try {
        const res = await findService.showPack()
        const { code, data, message } = _get(res, 'data', {})
        if (code === 200) {
          this.isShowGift = data
        }
        if (!this.isShowGift) {
          this._getMasterStrategy()
        }
      } catch (error) {
        this._getMasterStrategy()
      }
    },
    goGameGift () {
      this.$router.push({ path: '/find/giftPack' })
    },
    // 保存任务进入发现页
    _saveNewUserTask () {
      saveNewUserTask({ value: 9 })
    }
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scrollInit)
  },
  destroyed () {
    clearInterval(this.timer)
    clearInterval(this.countTimer)
    this.timer = null
    this.countTimer = null
  }
}
</script>
<style lang="less" scoped>
.find-warp {
  min-height: 100vh;
  background-color: #f7f7f7;
  overflow-x: hidden;
  .tab-warp {
    padding: 0 24px 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: center;
    position: relative;
    &.center {
      justify-content: center;
    }
    &:not(.showRankorrecommend) {
      margin-top: 70px;
    }
    &.fixed {
      position: fixed;
      top: 70px;
      left: 0;
      right: 0;
      margin: auto;
      background: #f7f7f7;
      z-index: 1;
    }
    &.static {
      opacity: 0;
    }
    .tab-item {
      flex: 1;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32px;
      color: #888888;
      .line {
        position: absolute;
        bottom: 2px;
        left: 50%;
        margin-left: -16px;
        overflow: hidden;
        width: 32px;
        height: 6px;
        background: #ff4141;
        border-radius: 3px;
      }
    }
    .tab-item-active {
      color: #000000;
      font-weight: bold;
    }
  }
  .master-strategy {
    margin: 0 24px 0;
    padding-bottom: 40px;
    .double-wrap {
      position: relative;
      display: flex;
      align-content: center;
      justify-content: space-between;
      li {
        width: 330px;
        height: 110px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .wrap {
      position: relative;
      padding: 20px;
      background: #ffefd1;
      border-radius: 16px;
      .icon {
        position: absolute;
        left: 20px;
        top: 20px;
        width: 100px;
        height: 30px;
        line-height: 30px;
        font-size: 20px;
        color: #fff;
        background: #ff4141;
        border-radius: 6px;
        text-align: center;
      }
      .text {
        display: -webkit-box;
        text-indent: 110px;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        font-size: 24px;
        color: #000;
        line-height: 40px;
        height: 70px;
      }
      .go {
        position: absolute;
        padding-left: 8px;
        right: 20px;
        bottom: 20px;
        font-size: 20px;
        background: #ffefd1;
        color: #ff7800;
      }
    }
  }
  .find-content {
    width: 100%;
    .content-warp {
      height: 100%;
      width: 100%;
      position: relative;
      .incre {
        position: absolute;
        top: 10px;
        left: 0;
        right: 0;
        margin: auto;
        width: 240px;
        height: 60px;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 0px 0px 16px 16px;
        font-size: 20px;
        font-weight: 500;
        text-align: center;
        line-height: 60px;
        color: #fff;
        i {
          color: #ffbc00;
        }
        &.fixed {
          position: fixed;
          top: 150px;
        }
      }
    }
    .list-warp {
      padding: 10px 24px 0;
      display: flex;
      flex-direction: column;
      margin-bottom: 60px;
    }
    .bottom-line {
      padding: 0 0;
    }
    .list-item {
      width: 100%;
      margin-bottom: 12px;
      .list-content {
        position: relative;
        background-color: #fff;
        height: 120px;
        border-radius: 16px;
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .img-warp {
          width: 80px;
          height: 80px;
          margin-right: 12px;
          position: relative;
          img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
          }
          .gameicon {
            width: 30px;
            height: 30px;
            position: absolute;
            right: 0;
            bottom: 0;
          }
        }
        .content-warp {
          width: 65%;
          max-height: 68px;
          font-size: 24px;
          font-weight: 400;
          color: rgba(0, 0, 0, 1);
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        .info {
          font-size: 20px;
          font-weight: 400;
          color: rgba(136, 136, 136, 1);
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          .gotosee {
            margin-top: 10px;
            font-size: 20px;
            font-weight: 500;
            color: rgba(255, 120, 0, 1);
            i {
              margin-left: 4px;
            }
          }
        }
        &.top {
          background: rgba(255, 239, 207, 1);
          border-radius: 16px 16px 0px 0px;
        }
      }
      .list-content-top {
        height: 60px;
        background: rgba(255, 228, 156, 1);
        border-radius: 0px 0px 16px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        box-sizing: border-box;
        .top-warp {
          display: flex;
          align-items: center;
          span {
            font-size: 20px;
            font-weight: 500;
            color: rgba(255, 120, 0, 1);
            &:nth-child(1) {
              display: inline-block;
              width: 60px;
              height: 30px;
              line-height: 30px;
              color: rgba(255, 255, 255, 1);
              text-align: center;
              margin-right: 10px;
              background: rgba(255, 120, 0, 1);
              border-radius: 8px;
            }
          }
        }
        .info {
          font-size: 20px;
          font-weight: 400;
          color: rgba(136, 136, 136, 1);
          display: flex;
          .gotoreceive {
            font-size: 20px;
            font-weight: 500;
            color: rgba(255, 120, 0, 1);
            display: flex;
            align-items: center;
            i {
              margin-left: 4px;
            }
            img {
              width: 40px;
              height: 41px;
              margin-right: 3px;
              &.animation {
                animation: huxi 3s infinite ease-in-out;
              }
            }
            em {
              color: rgba(255, 65, 65, 1);
              &.gray {
                color: #888888;
              }
            }
          }
        }
      }
      &.fixed {
        width: 672px;
        position: fixed;
        top: 150px;
        left: 0;
        right: 0;
        margin: auto;
      }
    }
    &.top {
      margin-top: 182px;
    }
  }
  .scroll-top {
    position: fixed;
    right: 24px;
    bottom: 300px;
    width: 53px;
    height: 53px;
    background: url('./images/back_top.png') no-repeat center center;
    background-size: 52px 52px;
  }
}

.awards_empty {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 220px;
    height: 124px;
    margin-bottom: 23px;
  }
  .text {
    font-size: 24px;
    font-weight: 400;
    line-height: 36px;
    color: rgba(136, 136, 136, 1);
    text-align: center;
  }
}
@keyframes huxi {
  0% {
    transform: scale(0.9);
  }
  10% {
    transform: scale(1);
  }
  20% {
    transform: scale(0.9);
  }
  30% {
    transform: scale(1);
  }
  40% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1);
  }
  60% {
    transform: scale(0.9);
  }
  70% {
    transform: scale(1);
  }
  80% {
    transform: scale(0.9);
  }
  90% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.9);
  }
}
</style>


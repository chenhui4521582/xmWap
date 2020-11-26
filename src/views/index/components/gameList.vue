<template>
  <div class="game-list">
    <!--最近在玩-->
    <horn-recent-play :list="recentlyPlayData" @goGame="goJumpOutsideGame">
      <!-- 跑马灯 -->
      <horn-list></horn-list>
    </horn-recent-play>
    <btc-tips @show-btc="showBTC" />
    <!--36强广位 配啥图片展示啥图片 跳转到配置的链接-->
    <advertisePosition></advertisePosition>
    <!-- 游戏导航 -->
    <div class="game-nav" :class="{'no-scroll': !showScroll}">
      <div class="wrap" ref="gameListNav" v-if="showScroll">
        <div class="select" @click="goSelect">
          <div class="wrap">
            <img src="../img/select-icon.png" alt="" class="icon">
            <p>搜索您感兴趣的游戏</p>
          </div>
        </div>
        <better-scroll v-if="showScroll" ref="scroll" :scrollY=false :scrollX=true
          :data="detailPlayData" :listenScroll="true" :probeType="3">
          <ul ref="gameListItems">
            <li ref="navItem" v-for="(item, index) in navList" :key="index"
              :class="{'active': navIndex == index}" @click="gameNavClick(index, item)">
              {{item}}
              <div class="line" v-if="navIndex == index"></div>
            </li>
          </ul>
        </better-scroll>
      </div>
    </div>
    <!--游戏分类-->
    <other-games :list="detailPlayData" :recommendList="recommendPlayData"
      @goGame="goJumpOutsideGame" />
    <!-- 返回顶部 -->
    <div class="back-top" v-if="showBackTop" @click="backTop">
      <img src="../img/back-top.png" alt="">
    </div>
  </div>
</template>

<script>
import BetterScroll from '@/components/betterScroll/betterScroll'
import services from '@/services/index'
import { jumpUrl } from '@/utils/utils'
import hornRecentPlay from './hornRecentPlay'
import otherGames from './otherGames'
import hornList from './hornList'
import btcTips from './turntableBtc/btcTips'
import advertisePosition from './advertisePosition'
import { mapState } from 'vuex'

export default {
  name: 'gameList',
  data () {
    return {
      recentlyPlayData: [],
      recommendPlayData: [],
      detailPlayData: [],
      navIndex: 0,
      scrollArray: [],
      navScrollArray: [],
      navList: ['推荐'],
      showBackTop: false,
      showScroll: false
    }
  },
  components: {
    BetterScroll,
    hornRecentPlay,
    otherGames,
    hornList,
    btcTips,
    advertisePosition
  },
  methods: {
    gameNavClick (index, item) {
      this.navIndex = index
      this.navMove(index)
      window.scrollTo(0, this.scrollArray[index])
      this.$marchSetsPoint('A_H5PT0019002869', {
        game_type: item
      })
    },
    goJumpOutsideGame (item, index) {
      this.$marchSetsPoint('A_H5PT0019001287', {
        position_id: index,
        target_project_id: item.type,
        task_id: item.id,
        task_name: item.name
      })
      jumpUrl(item)
    },
    goSelect () {
      this.$marchSetsPoint('A_H5PT0019002886')
      this.$router.push({
        name: 'select'
      })
    },
    /** 返回顶部 **/
    backTop () {
      window.scrollTo(0, 0)
      this.$refs.scroll.scrollTo(0, 0)
      this.navIndex = 0
      this.showBackTop = false
      this.$marchSetsPoint('A_H5PT0019002874')
    },
    /** 导航条自动移动到中间 **/
    navMove (index) {
      /** 屏幕的宽度 **/
      let oWidth = document.body.clientWidth
      /** ul宽度 **/
      let oUlWidth = this.$refs.gameListItems && this.$refs.gameListItems.scrollWidth
      /** 元素宽度 **/
      let itemWidth = this.$refs.navItem[index] && this.$refs.navItem[index].clientWidth || 0
      /** 位移距离 = 当前元素的位置 - 屏幕宽度的一半 + 当前元素宽度的一半 + margin 20**/
      let positionLeft = this.navScrollArray[index] - (oWidth / 2) + (itemWidth / 2)
      /** 滚动到最后一个 **/
      if ((oUlWidth - this.navScrollArray[index] - (itemWidth / 2)) < (oWidth / 2)) {
        let lis = this.$refs.navItem
        this.$refs.scroll && this.$refs.scroll.scrollToElement(lis[lis.length - 1])
        return
      }
      /** 滚动到中间 **/
      if ((this.navScrollArray[index] + (itemWidth / 2)) > (oWidth / 2)) {
        this.$refs.scroll && this.$refs.scroll.scrollTo(-positionLeft, 0)
      } else {
        this.$refs.scroll && this.$refs.scroll.scrollTo(0, 0)
      }
    },
    /** 计算每一个导航条的位置 **/
    countNavScroll () {
      let items = this.$refs.navItem
      for (var i = 0; i < items.length; i++) {
        this.navScrollArray.push(items[i].offsetLeft)
      }
    },
    /** 计算每个模块的滚动高度 **/
    countScroll () {
      let items = document.getElementsByClassName('game_item')
      let navHeight = this.$refs['gameListNav'].clientHeight
      for (var i = 0; i < items.length; i++) {
        if (i == 0) {
          this.scrollArray.push(items[i].offsetTop - navHeight - 10)
        } else {
          let titleHeight = items[i].childNodes[0].clientHeight
          this.scrollArray.push(items[i].offsetTop - (navHeight - titleHeight))
        }
      }
    },
    /** 浮动导航栏 **/
    scrollFixed () {
      this.navScrollTop = this.$refs['gameListNav'].offsetTop
      window.addEventListener('scroll', this.scrollInit, false)
    },
    scrollInit (event) {
      event && event.stopPropagation()
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      if (scrollTop >= this.scrollArray[0]) {
        this.$refs.gameListNav && this.$refs.gameListNav.classList.add('fixed')
      } else {
        this.$refs.gameListNav && this.$refs.gameListNav.classList.remove('fixed')
      }
      if (scrollTop >= 600) {
        this.showBackTop = true
      } else {
        this.showBackTop = false
      }
      this.scrollArray.filter((item, index) => {
        if (scrollTop >= item && scrollTop <= this.scrollArray[index + 1] - 50) {
          this.navIndex = index
          this.navMove(index)
        }
      })
    },
    showBTC () {
      this.$emit('show-btc')
    }
  },
  mounted () {
    /** 获取最近玩过的 **/
    services.getRecentlyPlayDataV2().then(res => {
      let { code, data } = res.data
      if (code == 200) {
        this.recentlyPlayData = data.list
      }
    })
    /** 获取推荐游戏 **/
    services.getRecommendPlayData().then(res => {
      let { code, data } = res.data
      if (code == 200) {

        data.list.forEach(item => {
          item.showType = 1
        })

        this.recommendPlayData = data.list

      }
    })
    /** 获取游戏分类 **/
    services.getDetailPlayData().then(res => {
      let { code, data } = res.data
      if (code == 200) {
        this.detailPlayData = data.list
        if (this.detailPlayData.length) {
          this.detailPlayData.forEach(item => {
            this.navList.push(item.showName)
          })
          let APP_CHANNEL = window.localStorage.getItem('APP_CHANNEL')
          window.scrollTo(0, 0)
          if (APP_CHANNEL != 100006) {
            this.showScroll = true
            window.setTimeout(res => {
              this.scrollFixed()
              this.scrollInit()
              this.countScroll()
              this.countNavScroll()
            }, 300)
          }
        }
      }
    })
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scrollInit)
  }
}
</script>

<style scoped lang="less">
img {
  vertical-align: top;
  max-width: 100%;
}
.game-list {
  margin-top: 10px;
  .game-nav {
    &.no-scroll {
      height: 40px;
    }
    width: 100%;
    height: 115px;
    overflow: hidden;
    .wrap {
      width: 100%;
      height: 166px;
      &.fixed {
        position: fixed;
        z-index: 11;
        left: 0;
        right: 0;
        top: 0;
        background: #fff;
        ul {
          padding: 0 0 10px;
        }
        .select {
          display: block;
        }
      }
      .select {
        margin: 13px 0;
        display: none;
        height: 70px;
        background: #f7f7f7;
        border-radius: 35px;
        .wrap {
          padding-left: 20px;
          height: 70px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
        .icon {
          margin-right: 20px;
          width: 36px;
          height: 36px;
        }
        p {
          flex: 1;
          height: 40px;
          line-height: 40px;
          font-size: 24px;
          color: #888;
        }
      }
      ul {
        padding: 40px 0 30px 0;
        display: inline-flex;
        li {
          position: relative;
          padding: 0 24px;
          float: left;
          white-space: nowrap;
          height: 45px;
          line-height: 45px;
          font-size: 32px;
          color: #888888;
          font-weight: 500;
          &.active {
            color: #000000;
            font-weight: bold;
          }
          .line {
            position: absolute;
            left: 50%;
            bottom: -9px;
            transform: translate(-50%, 0);
            width: 32px;
            height: 6px;
            border-radius: 3px;
            background: #ff4141;
          }
        }
      }
    }
  }
  .bottom-line {
    padding: 30px 0;
  }
  .back-top {
    position: fixed;
    z-index: 11;
    right: 21px;
    bottom: 110px;
    width: 60px;
    height: 60px;
    img {
      vertical-align: top;
      width: 100%;
      height: 100%;
    }
  }
}
</style>

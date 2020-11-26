<template>
  <main class="profit" :class="[{'profit-game':showClosed},`profit-${screenType}`]">
    <article class="profit-wrapper">
      <section class="profit-list-header">
        <!-- 平台打开排行榜显示返回按钮 -->
        <div class="items">
          <div v-show="showBack" class="back iconfont icon-return" @click="back"></div>
          <template v-if="tabList.length > 0">
            <div class="title" v-for="(item, index) in tabList" :key="index"
              :class="{ current: currentIndex == index }" @click="handleClick(item, index)">
              {{ item.name }}
              <span class="line"></span>
            </div>
          </template>
          <div v-show="showClosed" class="closed iconfont icon-close" @click="closed"></div>
        </div>
      </section>
      <router-view></router-view>
      <profit-recommend v-if="!showClosed" />
    </article>
  </main>
</template>
<script type="text/javascript">
import Services from '@/services/profit'
import { getUrlParams } from '@/utils/utils'
import profitRecommend from './components/profitRecommend'
import { saveNewUserTask } from '@/services/global'
import _get from 'lodash.get'
export default {
  data () {
    return {
      tabList: [
        { name: '盈利榜', url: '/profitlist' },
        { name: '招财猫榜', url: '/profitlist/catranking' }
      ],
      currentIndex: 0,
      from: 'index'
    }
  },
  props: {},
  provide: {
    gameType: getUrlParams('gametype'),
    screenType: getUrlParams('screentype')
  },
  computed: {
    gameType () {
      return getUrlParams('gametype')
    },
    screenType () {
      return getUrlParams('screentype')
    },
    showBack () {
      return (this.from === 'index' || this.from === 'plat') && this.$moduleConfig.plantVersion != 'red'
    },
    showClosed () {
      return this.from === 'game'
    }
  },
  components: {
    profitRecommend
  },
  methods: {
    async handleClick (item, index) {
      this.currentIndex = index
      if (item.name == '盈利榜') {
        /** H5平台-盈利榜-盈利榜榜按钮 **/
        this.$marchSetsPoint('A_H5PT0025000607')
      }
      else if (item.name == '新人话费榜') {
        /** H5平台-盈利榜-新人话费榜按钮 **/
        this.$marchSetsPoint('A_H5PT0025002682')
      }
      else if (item.name == '招财猫榜') {
        /** H5平台-盈利榜-招财猫榜按钮 **/
        this.$marchSetsPoint('A_H5PT0025000608')
      }
      this.$router.replace(`${item.url}?from=${this.from}`)
    },
    back () {
      /** H5平台-盈利榜-返回 **/
      this.$marchSetsPoint('A_H5PT0025000606')
      this.$router.back(-1)
    },
    closed () {
      /** 游戏内-盈利榜-关闭 **/
      if (parent.parent.closeWebView) {
        parent.parent.closeWebView()
      }
    },
    /** 保存新手任务进入我的页面 **/
    _saveNewUserTask () {
      saveNewUserTask({ value: 5 })
    },
    /** 获取财富榜 **/
    _getRichList () {
      Services.getRichList().then(res => {
        let list = _get(res, 'data.data.list', [])
        if (list && list.length) {
          this.tabList.push({
            name: '财富榜',
            url: '/profitlist/richList'
          })
        }
      })
    },
    /** 初始化 **/
    init () {
      //调接口判断显示哪些tab
      Services.getNewUserRankingInfo().then(res => {
        if (res.data.code == 200) {
          this.tabList.splice(1, 0, { name: '新人话费榜', url: '/profitlist/newUserRanking' })
        }
      })

      this.from = getUrlParams('from') || 'index'
      if (this.from === 'game') {
        /** 游戏内进入排行榜 **/
        this.$marchSetsPoint('P_H5PT0071', { project_id: this.gameType })
      } else {
        /** 平台进入排行榜 **/
        this.$marchSetsPoint('P_H5PT0025')
      }
      if (this.$route.name == 'profitRanking') {
        this.currentIndex = 0
      } else if (this.$route.name == 'richList') {
        this.currentIndex = 2
      } else {
        this.currentIndex = 1
      }
      this._saveNewUserTask()
      this._getRichList()
    }
  },
  mounted () {
    localStorage['isOpenedRankList'] = 1
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
    position: absolute;
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
        color: #888888;
        .line {
          position: absolute;
          left: 50%;
          bottom: -10px;
          height: 6px;
          width: 32px;
          background: rgba(37, 37, 37, 1);
          transform: translate(-50%, 0);
          border-radius: 3px;
          background: #ff4141;
          display: none;
        }
      }
      .title.current {
        font-weight: bold;
        font-size: 32px;
        color: #000000;
        .line {
          display: block;
        }
      }
    }
    .back,
    .closed {
      position: absolute;
      font-size: 30px;
    }
    .back {
      left: 26px;
      top: 50%;
      transform: translate(0, -50%);
    }
    .closed {
      right: 26px;
      top: 50%;
      transform: translate(0, -50%);
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

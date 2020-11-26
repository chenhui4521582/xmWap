<template>
  <main class="land-scape">
    <mall-title :userInfo="userInfo" @openMallPop="openMallPop"
      @showCouponStayWindow="showCouponStayWindow" />
    <article class="wrap">
      <section class="mall-container">
        <div class="nav">
          <ul>
            <li class="item" v-for="(item,index) in nav" :key="index"
              :class="[`nav-${item.type}`,{'activated': currentNav == item.type}]"
              @click.stop="navClick(item,index)">
              <p>
                {{item.name}}
              </p>
              <span class="tips" v-if="isTestVersion&&item.type==='lb'">限时升级</span>
            </li>
          </ul>
        </div>
        <div class="center-wrapper">
          <hot :hotList="hotList" :activitieList="activitieList" v-if="currentNav ==='hb'"
            @refresh="_getHot" />
          <gift v-if="currentNav === 'cz'" @openMallPop="openMallPop"
            @openGameGiftPop="openGameGiftPop" @nav-change="navChange"
            :is-test-version='isTestVersion' @goMore="getMore" @showMonthTips="openMonthTips"
            @showWeekTips="openWeekTips" />
          <goods-list v-if="currentNav === 'lb'" @openMallPop="openMallPop" :goods-list='goodsList'
            @nav-change="navChange" :is-test-version='isTestVersion' />
          <cat-prop-list v-if="currentNav === 'cat'" @openMallPop="openMallPop"
            @nav-change="navChange" />
        </div>
      </section>
    </article>
    <mall-pop v-model="showMallPop"></mall-pop>
    <!-- 充值特惠查看游戏礼包 -->
    <sdk-popup v-model="showGameGiftPop" :isSDK="false" :title="'游戏大礼包包含内容:'" :showClose="false"
      :showCancel="false" confirm-text="知道了" @on-confirm="showGameGiftPop=false">
      <div class="text" style="padding:1rem"
        v-html="gameGift.map(item=>item.awardsName+'*'+item.awardsNum).join('<br>')">
      </div>
    </sdk-popup>
    <coupon type="landscape" @setOutCoupon="setOutCoupon" />
    <!--周卡/月卡弹窗-->
    <sdk-popup v-model="showWeekTips" title="周卡加赠" :isSDK="false" :show-confirm="false"
      cancel-text="知道了">
      <div class="modal_content bg0">
        <p>
          自购买第二天起，每天登录可领<i>{{currentCard&&(currentCard.content.split(';')[1].split(/['+','*']/)[1])}}</i>,持续<i>6天</i>
        </p>
      </div>
    </sdk-popup>
    <sdk-popup v-model="showMonthTips" title="月卡加赠" :isSDK="false" :show-confirm="false"
      cancel-text="知道了">
      <div class="modal_content">
        <p>1、自购买第二天起，每天登录可领加赠，持续<i>29天</i></p>
        <p>
          2、加赠为以下奖品中的随机一种：<i>{{currentCard&&(currentCard.content.split(';')[1].split(/['+','*']/)[1])}}</i>
        </p>
      </div>
    </sdk-popup>
    <coupon-stay-window type="gamePayment" :receiveId="outCoupon.receiveId" :gameId="gameType"
      ref="couponStayWindow" :from="1" />
  </main>
</template>
<script>
import Services from '@/services/payment'
import MallTitle from './components/title.vue'
import Hot from './components/hot'
import Gift from './components/gift'
import GoodsList from './components/goodsList'
import CatPropList from './components/catPropList'
import MallPop from './components/mallPop'
import coupon from '@/components/coupon/coupon'
import couponStayWindow from '@/components/coupon/couponStayWindow.vue'
import _get from 'lodash.get'
import { resolve } from 'url'
export default {
  name: 'landScape',
  data: () => ({
    userInfo: {},
    currentNav: '',
    currentIndex: 0,
    hotList: {},
    activitieList: [],
    showMallPop: 0,
    showGameGiftPop: false,
    gameGift: [],
    goodsList: [],
    isTestVersion: false,
    showWeekTips: false,
    showMonthTips: false,
    currentCard: null,
    hrefUrl: location.href,
    outCoupon: {}
  }),
  components: {
    MallTitle,
    Hot,
    Gift,
    GoodsList,
    CatPropList,
    MallPop,
    coupon,
    couponStayWindow
  },
  computed: {
    hotListData () {
      return _get(this.hotList, 'list', [])
    },
    showHot () {
      return this.hotList.productType == 230 && this.hotListData.length && this.hotListData[0].buyFlag == 1
    },
    showOnePay () {
      if (this.hotListData instanceof Array) {
        return this.hotList.productType == 116 && this.hotListData[0] && this.hotListData[0].buyStatus === 0 ||
          this.hotListData[0] && this.hotListData[0].buyStatus === 1 && this.hotList.bettingTimes > 0
      }
      return false
    },
    nav () {
      let arr = [
        { type: 'cz', name: '超值礼包' },
        { type: 'lb', name: '热门单品' },
        { type: 'cat', name: '招财猫礼包' }
      ]
      if (this.showHot || this.showOnePay || this.activitieList.length) {
        arr.unshift({ type: 'hb', name: '火爆推荐' })
      }
      return arr
    },
    gameType () {
      try {
        return parent.SDK.getGameType()
      } catch (e) {
        return 0
      }
    }
  },
  methods: {
    navClick (item, index) {
      this.currentNav = item.type
      this.currentIndex = index
      this.$marchSetsPoint('A_H5PT0058002260', {
        task_id: index,
        task_name: item.name,
        edition: 'landScopeMall'
      })
    },
    _getUserInfo () {
      Services.getUserInfo().then(res => {
        let { code, data, message } = _get(res, 'data')
        if (code == 200) {
          this.userInfo = _get(res, 'data.data', [])
        }
      })
    },
    _getHot () {
      Services.getHot().then(res => {
        let { code, data, message } = _get(res, 'data')
        if (code == 200) {
          this.hotList = _get(res, 'data.data', {})
        }
      })
    },
    _getActivites () {
      Services.getActivites().then(res => {
        let { code, data, message } = _get(res, 'data')
        if (code == 200) {
          this.activitieList = _get(res, 'data.data', [])
        }
      })
    },
    _getGoodsList () {
      return new Promise((resolve, reject) => {
        Services.getMallList().then(res => {
          let { code, data, message } = _get(res, 'data')
          if (code == 200) {
            this.goodsList = _get(res, 'data.data.common', [])
            let version = sessionStorage.getItem('Mall_Version')
            if (version && version === '2.0.0') {
              this.isTestVersion = true
            } else {
              this.isTestVersion = false
            }
          }
          resolve()
        })
      })
    },
    init () {
      this._getGoodsList().then(() => {
        this._getUserInfo()
        this._getHot()
        this._getActivites()
      })
      this.$marchSetsPoint('P_H5PT0058', {
        edition: 'landScopeMall'
      })
      localStorage.setItem('gameMallStatus', 'landScape')
    },
    openMallPop (type) {
      this.showMallPop = type
    },
    openGameGiftPop (value, arr) {
      this.showGameGiftPop = value
      this.gameGift = arr
    },
    navChange (type) {
      if (type) {
        this.navClick(this.nav[this.currentIndex + 1], this.currentIndex + 1)
      } else {
        this.navClick(this.nav[this.currentIndex - 1], this.currentIndex - 1)
      }
    },
    getMore () {//点击热门单品 更多
      this.$marchSetsPoint('A_H5PT0058004067', { edition: 'landScopeMall', project_id: parent.SDK.getGameType() })
      let item = this.nav.filter(item => item.name == '热门单品')[0]
      if (item) {
        this.currentNav = item.type
        this.currentIndex = this.nav.findIndex(item => item.name == '热门单品')
      }
    },
    openMonthTips (card) {
      this.currentCard = card
      this.showMonthTips = true
    },
    openWeekTips (card) {
      this.currentCard = card
      this.showWeekTips = true
    },
    setOutCoupon (item) {
      this.outCoupon = item
    },
    showCouponStayWindow () {
      if (parent && parent.closeWebView) {
        this.$refs.couponStayWindow.init(parent.closeWebView, this.hrefUrl)
      }
    }
  },
  mounted () {
    this.init()
  },
  beforeRouteEnter (to, from, next) {
    /** 页面页面宽度1280px **/
    const baseWidth = 1280
    const baseSize = 30
    const scale = document.documentElement.clientWidth / baseWidth > 1 ? 1 : document.documentElement.clientWidth / baseWidth
    document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
    next()
  },
  beforeRouteLeave (to, from, next) {
    // 恢复 720px 基准
    let baseWidth = 720
    if (to.name === 'GPList') {
      baseWidth = 1280
    }
    const baseSize = 30
    const scale = document.documentElement.clientWidth / baseWidth > 1 ? 1 : document.documentElement.clientWidth / baseWidth
    document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
    next()
  },
  watch: {
    nav (val) {
      this.currentNav = val[0].type
    }
  }
}
</script>

<style lang="less" scoped>
.bg-center(@url) {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url(@url);
}
.land-scape {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 1060px;
  height: 648px;
  margin-top: -324px;
  margin-left: -530px;
  box-sizing: border-box;
  .bg-center('./images/landscape-mall-bg.png');
  .wrap {
    padding: 74px 30px 0;
    height: 582px;
    box-sizing: border-box;
    .mall-container {
      height: 100%;
      display: flex;
      justify-content: flex-start;
    }
    .nav {
      width: 180px;
      z-index: 1;
      margin-top: 30px;
      .item {
        width: 180px;
        height: 80px;
        line-height: 80px;
        text-align: center;
        color: #be9957;
        font-size: 24px;
        font-weight: bold;
        margin-top: -10px;
        box-sizing: border-box;
        padding-left: 20px;
        position: relative;
        .bg-center('./images/normal-tag-bg.png');
        &.activated {
          height: 90px;
          line-height: 90px;
          color: #fff;
          font-size: 28px;
          .bg-center('./images/activated-tag-bg.png');
        }
        .tips {
          position: absolute;
          top: 0;
          left: -20px;
          color: #fff;
          font-size: 18px;
          background: #ff5347;
          text-align: center;
          height: 30px;
          line-height: 30px;
          padding: 0 8px;
          border-radius: 6px;
          font-weight: bold;
          white-space: nowrap;
        }
      }
    }
    .center-wrapper {
      position: absolute;
      left: 200px;
      top: 140px;
      right: 70px;
      bottom: 40px;
      z-index: 1;
      overflow-x: hidden;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      padding: 18px;
      border-radius: 1px;
      background: #fff5e7;
      box-shadow: 0px 2px 15px 0px rgba(161, 90, 33, 0.56);
      border-radius: 20px 20px 50px 50px;
    }
  }
}
.modal_content {
  padding: 20px 66px;
  box-sizing: border-box;
  font-size: 20px;
  font-weight: bold;
  line-height: 30px;
  color: #ffffff;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &.bg0 {
    text-align: center;
  }
}
</style>

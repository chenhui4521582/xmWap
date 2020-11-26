<template>
  <div class="portrait">
    <mall-title :userInfo="userInfo" @openMallPop="openMallPop"
      @showCouponStayWindow="showCouponStayWindow" />
    <div class="portrait-container">
      <div class="portrait-nav">
        <ul>
          <li class="nav-item" v-for="(item,index) in nav" :key="index"
            :class="[`nav-${item.type}`,{'activated': currentNav == item.type}]"
            @click="navClick(item,index)">
            {{item.name}}
          </li>
        </ul>
      </div>
      <section class="main-container">
        <hot v-if="currentNav === 'hb'" :hotList="hotList" :activitieList="activitieList"
          @refresh="_getHot" />
        <goods-list v-if="currentNav === 'cz'" @openMallPop="openMallPop" @nav-change="navChange"
          @openGameGiftPop="openGameGiftPop" @showMonthTips="openMonthTips"
          @showWeekTips="openWeekTips" />
        <cat-prop-list v-if="currentNav === 'cat'" @openMallPop="openMallPop"
          @nav-change="navChange" />
      </section>
    </div>
    <!--新人免单点击页面返回按钮出现的挽留弹窗-->
    <detainment-pop v-if="showdetainmentpop" @close="showdetainmentpop=false" @goon="goback">
    </detainment-pop>
    <mallPop v-model="showMallPop" />
    <!-- 充值特惠查看游戏礼包 -->
    <sdk-popup v-model="showGameGiftPop" :isSDK="false" :title="'游戏大礼包包含内容:'" :showClose="false"
      :showCancel="false" confirm-text="知道了" @on-confirm="showGameGiftPop=false">
      <div class="text" style="padding:1rem"
        v-html="gameGift.map(item=>item.awardsName+'*'+item.awardsNum).join('<br>')">
      </div>
    </sdk-popup>
    <coupon type="portrait" @setOutCoupon="setOutCoupon" />
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
  </div>
</template>
<script type="text/javascript">
import MallTitle from './components/title'
import Hot from './components/hot'
import GoodsList from './components/goodsList'
import CatPropList from './components/catPropList'
import MallPop from './components/mallPop'
import coupon from '@/components/coupon/coupon'
import couponStayWindow from '@/components/coupon/couponStayWindow.vue'
import Services from '@/services/payment'
import _get from 'lodash.get'
export default {
  name: 'portrait',
  data: () => ({
    userInfo: {},
    currentNav: '',
    currentIndex: 0,
    hotList: {},
    activitieList: [],
    showdetainmentpop: false,
    showfreeorder: false,
    showMallPop: 0,
    showGameGiftPop: false,
    gameGift: [],
    showWeekTips: false,
    showMonthTips: false,
    currentCard: null,
    hrefUrl: location.href,
    outCoupon: {}
  }),
  components: {
    MallTitle,
    Hot,
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
        { type: 'cz', name: '超值活动' },
        { type: 'cat', name: '招财猫礼包' }
      ]
      if (this.showHot || this.showOnePay || this.activitieList.length) {
        arr.unshift({ type: 'hb', name: '火爆活动' })
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
    openMallPop (type) {
      this.showMallPop = type
    },
    openGameGiftPop (value, arr) {
      this.showGameGiftPop = value
      this.gameGift = arr
    },
    navClick (item, index) {
      this.currentNav = item.type
      this.currentIndex = index
      this.$marchSetsPoint('A_H5PT0058002260', {
        task_id: index,
        task_name: item.name,
        edition: 'portraitMall'
      })
    },
    /** 获取用户信息 **/
    _getUserInfo () {
      Services.getUserInfo().then(res => {
        let { code, data, message } = _get(res, 'data')
        if (code == 200) {
          this.userInfo = _get(res, 'data.data', [])
        }
      })
    },
    /** 获取火爆商品 **/
    _getHot () {
      Services.getHot().then(res => {
        let { code, data, message } = _get(res, 'data')
        if (code == 200) {
          this.hotList = _get(res, 'data.data', [])
        }
      })
    },
    /** 获取活动配置 **/
    _getActivites () {
      Services.getActivites().then(res => {
        let { code, data, message } = _get(res, 'data')
        if (code == 200) {
          this.activitieList = _get(res, 'data.data', [])
        }
      })
    },
    /** 初始化 **/
    init () {
      localStorage.setItem('gameMallStatus', 'portrait')
      this._getUserInfo()
      this._getHot()
      this._getActivites()
    },
    navChange (type) {
      if (type) {
        this.navClick(this.nav[this.currentIndex + 1], this.currentIndex + 1)
      } else {
        this.navClick(this.nav[this.currentIndex - 1], this.currentIndex - 1)
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
    // 恢复 720px 基准
    const baseWidth = 720
    const baseSize = 30
    const scale = document.documentElement.clientWidth / baseWidth
    document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
    next()
  },
  beforeRouteLeave (to, from, next) {
    // 恢复 720px 基准
    const baseWidth = 720
    const baseSize = 30
    const scale = document.documentElement.clientWidth / baseWidth
    document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
    next()
  },
  destroyed () {
    // 恢复 720px 基准
    const baseWidth = 720
    const baseSize = 30
    const scale = document.documentElement.clientWidth / baseWidth
    document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
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
.portrait {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -525px;
  margin-left: -344px;
  width: 688px;
  height: 1050px;
  box-sizing: border-box;
  font-weight: bold;
  .bg-center('./images/portrait-mall-bg.png');
  .portrait-container {
    margin-top: -1px;
    padding-bottom: 30px;
    .portrait-nav {
      padding-top: 10px;
      margin-top: 60px;
      ul {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 6px;
      }
      .nav-item {
        width: 180px;
        height: 110px;
        margin-left: -6px;
        .bg-center('./images/normal-tag-bg.png');
        display: flex;
        align-items: center;
        justify-content: center;
        color: #be9957;
        font-size: 24px;
        box-sizing: border-box;
        padding-top: 20px;
        &.activated {
          width: 216px;
          color: #fff;
          .bg-center('./images/activated-tag-bg.png');
        }
      }
    }
    .main-container {
      position: absolute;
      top: 226px;
      bottom: 50px;
      left: 50px;
      right: 50px;
      padding-bottom: 22px;
      background: rgba(255, 245, 231, 1);
      box-shadow: 0px 2px 15px 0px rgba(161, 90, 33, 0.56);
      border-radius: 28px 28px 60px 60px;
      box-sizing: border-box;
      overflow: hidden;
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

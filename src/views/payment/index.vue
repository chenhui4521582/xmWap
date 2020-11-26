<template>
  <div class="pay-mall" :class="{'showHeader': $moduleConfig.isShowHeader}">
    <header class="mall-header" v-if="$moduleConfig.isShowHeader">
      <!-- 返回按钮 -->
      <div class="back iconfont icon-return" @click="back()"></div>
      <div class="items">
        充值
      </div>
    </header>
    <div class="tabs" :class="{'showHeader': $moduleConfig.isShowHeader}">
      <div class="item"
        :class="{selected:currentTab===item.value,disabled:oftenBuyData.length==0&&index==0||!item.value,empty:!item.value}"
        v-for="(item,index) in tabs" @click="selectTabIndex(item,index)" :key="'tab'+index">
        {{item.label}}
      </div>
    </div>
    <div class="mall-content" id="app">
      <div class="mall-body">
        <!-- 重新支付 -->
        <reset-pay />
        <often-buy :buyData="oftenBuyData" @toPay="toPay" ref="anchor0"></often-buy>
        <!-- 抽免单活动, 下线时需删除 -->
        <gratis ref="gratis" />
        <!-- 一元破冰 -->
        <one-lottery-banner />
        <!-- 首页弹框超划算礼包 -->
        <inexpensive-card ref="inexpensiveCard" @toPay="toPay" />
        <!-- banner -->
        <slider v-if="showBanner" :list="list" />
        <!-- 限时领金叶子活动, 下线时需删除 -->
        <limit-leay />
        <!--充值特惠-->
        <preference v-if="showPreference" :gameGift="gameGift" :preferenceList="preferenceList"
          @openPop="openPop" @toPay="toPay" ref="anchor1"></preference>
        <!-- 新人首充礼包, 下线时需删除 -->
        <!--  <new-user-gift ref="newUserGift" @on-back="back" /> -->
        <!--超值礼包-->
        <hot-card @toPay="toPay" ref="anchor2" v-if="!testMallVersion"></hot-card>
        <!--推荐单品-->
        <recommend-card @toPay="toPay" ref="anchor2" @goMore="goMore" v-else></recommend-card>
        <!-- 优惠券包 -->
        <coupon-bag @toPay="toPay" />
        <!-- 周卡 -->
        <week-card :weeks-conent=weeksConent :weeks-card=weeksCard :monthCard="monthCard"
          @toPay="toPay" ref="anchor3">
        </week-card>
        <!-- 其他商品 -->
        <commodity-list :mall-list="mallList" :is-test-version="testMallVersion" @toPay="toPay"
          ref="anchor4"></commodity-list>
        <!--招财猫礼包-->
        <catPackages @toPay="toPay" ref="anchor5"></catPackages>
      </div>
      <div class="footer">
        <p>
          <em>适度娱乐 理性消费 </em>
          <br>
          <em>由于属于虚拟物品 购买成功后不予退款</em>
          <br>
          <span @click="openPop('detail')">购买详情</span>
        </p>
      </div>
    </div>
    <!-- 返回顶部按钮 -->
    <div v-show="isShowTopIcon" class="scroll-top" @click="toTop"></div>
    <coupon @setOutCoupon="setOutCoupon" @toPay="toPay" />
    <!-- 充值特惠查看游戏礼包 -->
    <Modal v-model="showPop" :title="popTitle" :closeButtonShow="false" save-text="知道了"
      @on-save="showPop=false">
      <div class="game-gift-content" v-html="popText">
      </div>
    </Modal>
    <coupon-stay-window :receiveId="outCoupon.receiveId" ref="couponStayWindow" :from="1" />
  </div>
</template>
<script>
import LimitLeay from './components/limitLeay'
import Gratis from './components/gratis'
import newUserGift from './components/newUserGift'
import oneLotteryBanner from './components/oneLotteryBanner'
import weekCard from './components/weekCard'
import InexpensiveCard from '@/components/inexpensiveCard/inexpensiveCard'
import Slider from './components/slider'
import ResetPay from './components/resetPay'
import coupon from '@/components/coupon/coupon'
import { localStorage, newUtils, jumpUrl } from '@/utils/utils'
import Services from '@/services/payment'
import _get from 'lodash.get'
import oftenBuy from './components/oftenBuy'
import preference from './components/preference'
import hotCard from './components/hotCard'
import catPackages from './components/catPackages'
import commodityList from './components/commodityList'
import recommendCard from './components/recommendCard'
import couponStayWindow from '@/components/coupon/couponStayWindow.vue'
import couponBag from '@/components/couponBag/couponBag'
export default {
  name: 'paymentMall',
  data: () => ({
    /** 获取充值特惠 **/
    preferenceList: {},
    /** 获取周卡 **/
    weeksCard: null,
    /** 其他商品 **/
    mallList: [],
    /** banner **/
    list: [],
    //是否点击查看游戏礼包
    showPop: false,
    popText: '',
    popTitle: '',
    currentTab: 'anchor0',
    isShowTopIcon: false,//是否显示回到顶部图标
    offsetTopArr: [],
    oftenBuyData: [],
    testMallVersion: false,
    /** 获取月卡 **/
    monthCard: null,
    hrefUrl: location.href,
    outCoupon: {}
  }),
  filters: {
    split (item, type, num) {
      return item.split(type)[num]
    },
    httpImg (item) {
      let img = item.split(';')[0]
      if (img && !img.includes('http')) {
        return process.env.VUE_APP_FILE_HOST + img
      } else {
        return img
      }
    },
    formatLimitBuy (dailyLimitPerUser) {
      return dailyLimitPerUser ? `限购${dailyLimitPerUser}次` : '不限购'
    }
  },
  components: {
    LimitLeay,
    Gratis,
    InexpensiveCard,
    Slider,
    // newUserGift,
    weekCard,
    oneLotteryBanner,
    ResetPay,
    oftenBuy,
    preference,
    hotCard,
    catPackages,
    commodityList,
    coupon,
    recommendCard,
    couponBag,
    couponStayWindow
  },
  computed: {
    showPreference () {
      return !newUtils.isEmptyObject(this.preferenceList)
    },
    showWeeksCard () {
      // return !newUtils.isEmptyObject(this.weeksCard) && !this.$refs.newUserGift.info.showStatus
      return !newUtils.isEmptyObject(this.weeksCard)
    },
    showMallList () {
      return this.mallList.length
    },
    preferenceImg () {
      let img = this.preferenceList && this.preferenceList.icon.split(';')[0]
      return img
    },
    weeksConent () {
      if (!(this.weeksCard && this.weeksCard.content)) {
        return []
      }
      let array = this.weeksCard.content.split(';')
      let weeksArray = []
      for (let i in array) {
        let weeksData = {}
        weeksData.name = array[i].split(':')[0]
        weeksData.amount = array[i].split(':')[1]
        weeksArray.push(weeksData)
      }
      return weeksArray
    },
    showBanner () {
      return this.list.length
    },
    //充值回馈游戏礼包
    gameGift () {
      return this.preferenceList && this.preferenceList.awardsList && this.preferenceList.awardsList.filter(item => [20, 21, 40, 41, 6, 49].includes(item.awardsType)) || []
    },
    tabs () {
      let arr = [{ label: '经常购买', value: 'anchor0' }, { label: '充值特惠', value: 'anchor1' }, { label: '超值礼包', value: 'anchor2' }, { label: '周卡/月卡', value: 'anchor3' }, { label: '热门单品', value: 'anchor4' }, { label: '招财猫礼包', value: 'anchor5' }]
      if (this.testMallVersion) {//针对实验组用户，在原先“超值礼包”的位置加上“推荐单品”模块进行替代
        arr[2] = { label: '推荐单品', value: 'anchor2' }
      }
      return arr
    }
  },
  methods: {
    openPop (type) {
      switch (type) {
        case 'gift':
          this.popText = this.gameGift.map(item => item.awardsName + '*' + item.awardsNum).join(',')
          this.popTitle = '游戏大礼包包含内容:'
          break
        case 'detail':
          this.popText = '<p style="text-align: left;">1.幸运商店出售虚拟货币，可用于特定游戏支付。</p><p style="text-align: left;">2.购买成功后，可至“我的资产”中查看。</p><p style="text-align: left;">3.因为网络波动或者系统系统原因，商品未到账，可联系客服处理，一经核实，补发商品。</p>'
          this.popTitle = '购买详情'
          break

        default:
          break
      }
      this.showPop = true
    },
    /** 获取充值特惠 **/
    _getPreferenceList () {
      Services.getPreferenceList().then(res => {
        this.preferenceList = _get(res, 'data.data', {})
      })
    },
    /** 获取其他商品 **/
    async _getMallList () {
      const res = await Services.getMallList()
      this.$nextTick(() => {
        this.mallList = _get(res, 'data.data.common', [])
        this.weeksCard = _get(res, 'data.data.card[0]', null)
        this.monthCard = _get(res, 'data.data.monthCard[0]', null)
        let version = sessionStorage.getItem('Mall_Version')
        if (version && version === '2.0.0') {
          this.testMallVersion = true
        } else {
          this.testMallVersion = false
        }
      })
    },
    /** 获取banner图 **/
    _getPaymentBannerList () {
      Services.getPaymentBannerList().then(res => {
        this.list = _get(res, 'data.data', []) || []
      })
    },
    toPay (item, type) {
      /** 埋点 **/
      switch (type) {
        /** 招财猫礼包 **/
        case 0:
          this.$marchSetsPoint('A_H5PT0023003026', {
            product_id: item.bizId,
            recharge_rmb: item.price
          })
          break
        /** 热门礼包 **/
        case 1:
          this.$marchSetsPoint('A_H5PT0023000511')
          break
        /** 充值特惠 **/
        case 2:
          this.$marchSetsPoint('A_H5PT0023000513')
          break
        /** 周卡 **/
        case 3:
          this.$marchSetsPoint('A_H5PT0023000512')
          break
        /** 更多商品 **/
        case 4:
          this.$marchSetsPoint('A_H5PT0023000514')
          break
        /** 推荐单品 **/
        case 5:
          this.$marchSetsPoint('A_H5PT0023004066', { product_id: item.bizId, product_name: item.name, project_id: 0 })
          break
        /** 优惠券包 **/
        case 6:
          this.$marchSetsPoint('A_H5PT0023004091', { product_price: item.price, product_id: item.bizId, product_name: item.name })
          break
        /** 月卡 **/
        case 7:
          this.$marchSetsPoint('A_H5PT0023004142', { product_price: item.price, product_id: item.bizId, product_name: item.name, recharge_rmb: item.price })
          break
      }
      if (item.dailyLimitPerUser && !item.buyFlag) {
        this.$Toast('该商品今日已售完，请明日再买哦～')
        return
      }
      localStorage.set('payment', item)
      localStorage.remove('originDeffer')
      this.$router.replace({ name: 'paymentList' })
    },
    back () {
      let isBack = localStorage.get('paymentIsBack')
      if (isBack === 'true') {
        localStorage.remove('paymentIsBack')
        if (history.length > 1) {
          history.go(-1)
        } else {
          this.$router.push('/')
        }
        return
      }
      /** 新手首充 不需的时候删除 **/
      if (this.$refs.newUserGift && this.$refs.newUserGift.isShowStatus()) {
        this.$refs.newUserGift.showModal()
        return
      }
      if (this.$refs.gratis && this.$refs.gratis.isGratis()) {
        /** 抽免单活动 不需的时候删除 **/
        this.$refs.gratis.showModal()
        return
      }
      this.$router.push('/')
    },
    init () {
      this.$marchSetsPoint('P_H5PT0023')
      this._getOftenBuyData()
      this._getPreferenceList()
      this._getMallList()
      this._getPaymentBannerList()
    },
    selectTabIndex (item, index) {
      if (item.value !== this.currentTab && (index == 0 && this.oftenBuyData.length || index > 0) && item.value) {
        this.currentTab = item.value
        this.getAnchor(this.$refs[item.value].$el)
      }
    },
    getAnchor (el) {
      if (window == window.top) {
        document.body.scrollTop = el.offsetTop
        !document.body.scrollTop && (document.documentElement.scrollTop = el.offsetTop)
      } else {
        document.getElementById('app').scrollTop = el.offsetTop
        this.isShowTopIcon = false
      }
    },
    _getOftenBuyData () {
      Services.getFrequentPurchaseList().then(res => {
        this.oftenBuyData = _get(res, 'data.data', [])
        this.currentTab = this.oftenBuyData.length ? this.tabs[0].value : this.tabs[1].value
      })
    },
    toTop () {
      document.body.scrollTop = 0
      !document.body.scrollTop && (document.documentElement.scrollTop = 0)
    },
    goMore () {//热门单品点击更多
      this.$marchSetsPoint('A_H5PT0023004065', {
        project_id: 0
      })
      this.$refs['anchor4'] && this.getAnchor(this.$refs['anchor4'].$el)
    },
    setOutCoupon (item) {
      this.outCoupon = item
    }
  },
  created () {
    this.init()
  },
  mounted () {
    setTimeout(() => {
      for (let i = 0; i < this.tabs.filter(item => item.value).length; i++) {
        this.offsetTopArr.push(this.$refs[this.tabs[i].value] && this.$refs[this.tabs[i].value].$el && this.$refs[this.tabs[i].value].$el.offsetTop >= 0 ? this.$refs[this.tabs[i].value].$el.offsetTop : -1)
      }
    }, 1000)
    if (window == window.top) {
      window.onscroll = () => {
        //超过一屏就显示回到顶部的图标
        let distance = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        distance = distance < 0 ? 0 : distance
        let index = this.offsetTopArr.indexOf(this.offsetTopArr.filter(item => distance >= item && item >= 0).reverse()[0])
        index = (index == -1 ? (this.oftenBuyData.length ? 0 : 1) : index)
        this.currentTab = this.tabs[index].value
        this.isShowTopIcon = distance > 0
      }
    } else {
      window.ontouchmove = () => {
        //超过一屏就显示回到顶部的图标
        this.isShowTopIcon = document.getElementById('app').scrollTop > 0
      }
    }
    /** 
     * name: 首页弹框超划算礼包
     * remark: 这个组件有点特殊需要父组件调用组件init初始化
    **/

    this.$refs.inexpensiveCard.init()
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === "paymentList") {
      next()
    } else {
      this.$refs.couponStayWindow.init(next, this.hrefUrl)
    }
  }
}
</script>
<style scoped lang="less">
.pay-mall {
  overflow: hidden;
  background-color: #f7f7f7;
  &.showHeader {
    padding-top: 304px;
  }
  padding-top: 210px;
  .mall-header {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    background-color: #f7f7f7;
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: 0 24px;
    height: 94px;
    z-index: 10;
    .back {
      float: left;
      font-size: 30px;
    }
    .items {
      width: 100%;
      text-align: center;
      font-weight: bold;
      font-size: 32px;
      color: #252525;
    }
  }
  .mall-content {
    position: relative;
    background: #f5f5f5;
    .mall-body {
      position: relative;
      padding: 0 24px;
      overflow: hidden;
      .host-card {
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
        background: #fff;
        border-radius: 16px;
        height: 360px;
        position: relative;
        ul {
          li {
            position: absolute;
            border-radius: 16px;
            .name {
              line-height: 1;
              font-size: 28px;
              color: #333;
              font-weight: bold;
            }
            .presented {
              font-size: 24px;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              color: #acacac;
              .give-icon {
                margin-right: 6px;
                width: 30px;
                height: 30px;
                background: #32c9fe;
                color: #fff;
                font-size: 18px;
                font-weight: bold;
                line-height: 30px;
                text-align: center;
                border-radius: 50%;
              }
            }
            .btn {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 170px;
              height: 56px;
              font-size: 24px;
              background: #f0f0f0;
              border-radius: 16px;
              color: #ff4141;
              span {
                line-height: 1;
              }
              .code {
                margin-top: 3px;
                font-size: 20px;
              }
            }
            &:nth-child(1) {
              left: 36px;
              top: 22px;
              padding-right: 40px;
              width: 227px;
              .icon {
                margin-bottom: 16px;
                width: 168px;
                height: 157px;
                img {
                  vertical-align: top;
                  width: 100%;
                  height: 100%;
                }
              }
              .desc {
                margin-bottom: 20px;
                .name {
                  margin-bottom: 6px;
                  text-align: center;
                }
                .presented {
                  white-space: nowrap;
                  text-align: center;
                }
              }
              .btn {
                margin-left: 5px;
              }
              .line {
                position: absolute;
                right: 0;
                top: 26px;
                width: 2px;
                height: 273px;
                background: #eee;
              }
            }
            &:nth-child(2) {
              left: 267px;
              top: 35px;
              padding: 0 0 14px 45px;
              width: 380px;
              height: 150px;
              .desc {
                position: absolute;
                right: 0;
                top: 0;
              }
              .name {
                margin-bottom: 6px;
              }
              .presented {
                text-align: left;
                .give-icon {
                  background: #5186ca;
                }
              }
              .icon {
                width: 118px;
                height: 110px;
                img {
                  vertical-align: top;
                  width: 100%;
                  height: 100%;
                }
              }
              .btn {
                position: absolute;
                right: 0;
                bottom: 27px;
              }
              .line {
                position: absolute;
                left: 0;
                bottom: 0;
                width: 348px;
                height: 2px;
                background: #eee;
              }
            }
            &:nth-child(3) {
              left: 267px;
              top: 185px;
              padding: 20px 0 0 45px;
              width: 380px;
              height: 150px;
              .desc {
                position: absolute;
                right: 0;
                top: 20px;
              }
              .name {
                margin-bottom: 6px;
              }
              .presented {
                text-align: left;
                .give-icon {
                  background: #f126d4;
                }
              }
              .icon {
                width: 118px;
                height: 110px;
                img {
                  vertical-align: top;
                  width: 100%;
                  height: 100%;
                }
              }
              .btn {
                position: absolute;
                right: 0;
                bottom: 0;
              }
            }
          }
        }
      }
      .preference {
        position: relative;
        overflow: hidden;
        margin-top: 20px;
        height: 296px;
        border-radius: 16px;
        background: #fff;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
        img {
          vertical-align: top;
          width: 100%;
          height: 100%;
        }
        .btn {
          position: absolute;
          right: 23px;
          top: 16px;
          width: 130px;
          height: 38px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24px;
          color: #fff;
          background-color: #ff4141;
          border-radius: 10px;
          .code {
            margin-top: 3px;
            font-size: 18px;
          }
        }
        .gamegift {
          position: absolute;
          right: 181px;
          top: 68px;
          width: 152px;
          height: 201px;
          border-radius: 10px;
        }
      }
      .commodity-list {
        margin-top: 50px;
        .title {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          height: 40px;
          text-align: center;
          .line {
            margin-right: 10px;
            width: 6px;
            height: 32px;
            background: #ff7800;
            border-radius: 20px;
          }
          .name {
            font-size: 32px;
            color: #252525;
            font-weight: bold;
            line-height: 1.1;
          }
        }
        ul {
          margin-top: 14px;
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          li {
            position: relative;
            margin-right: 12px;
            margin-bottom: 15px;
            width: 216px;
            text-align: center;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);

            .amount {
              margin-top: 18px;
              display: flex;
              justify-content: center;
              align-items: center;
              img {
                margin-right: 5px;
                vertical-align: top;
                width: 30px;
                height: 30px;
              }
            }
            .img {
              margin: 15px auto 17px;
              height: 106px;
              img {
                vertical-align: top;
                height: 100%;
              }
            }
            .price {
              margin: 0 auto 20px;
              width: 110px;
              height: 42px;
              background: rgba(255, 65, 65, 1);
              border-radius: 10px;
              font-size: 24px;
              font-weight: 500;
              text-align: center;
              line-height: 42px;
              color: rgba(255, 255, 255, 1);
              .code {
                margin-top: 3px;
                font-size: 20px;
              }
            }
            .tips {
              position: absolute;
              top: -6px;
              left: -6px;
              width: 98px;
              height: 98px;
              img {
                vertical-align: top;
                width: 100%;
                height: 100%;
              }
            }
            &.active {
              margin-right: 0;
            }
          }
        }
      }
    }
    .footer {
      margin: 54px auto 40px;
      p {
        margin-bottom: 5px;
        text-align: center;
        font-size: 20px;
        color: #bbbbbb;
      }
      span {
        color: #f67804;
        text-decoration: underline;
      }
    }
  }
  .font-cont {
    font-size: 26px;
    line-height: 1.5;
  }
  .game-gift-content {
    font-size: 24px;
    color: #888888;
    text-align: center;
    line-height: 30px;
  }
  .tabs {
    position: fixed;
    top: 0;
    &.showHeader {
      top: 94px;
    }
    left: 0;
    right: 0;
    margin: auto;
    width: 672px;
    height: 190px;
    background: rgba(187, 187, 187, 1);
    border-radius: 0px 0px 16px 16px;
    overflow: hidden;
    padding: 30px 36px;
    z-index: 11;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .item {
      width: 180px;
      height: 56px;
      background: rgba(172, 172, 172, 1);
      border-radius: 16px;
      font-size: 24px;
      font-weight: 500;
      color: rgba(240, 240, 240, 1);
      margin-bottom: 20px;
      text-align: center;
      line-height: 56px;
      &.selected {
        color: rgba(255, 65, 65, 1);
        background: rgba(255, 255, 255, 1);
      }
      &.disabled {
        color: rgba(136, 136, 136, 1);
      }
      &.empty {
        background: none;
      }
    }
  }
  .scroll-top {
    position: fixed;
    right: 0;
    bottom: 59px;
    width: 53px;
    height: 53px;
    background: url('./img/back_top.png') no-repeat;
    background-size: 100% 100%;
    z-index: 1;
  }
}
</style>

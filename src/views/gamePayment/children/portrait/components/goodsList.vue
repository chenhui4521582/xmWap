<template>
  <div class="goods-list" ref="goodsList">
    <!-- <img v-if="showfreeorder" src="./images/freeordertipsbg.png" alt="" style="height: 1rem;width: 12rem;display: block;margin:.4rem auto 0" /> -->
    <!-- 重新支付 & 优惠券 -->
    <reset-pay @openMallPop="openMallPop" />
    <!-- 轮播 -->
    <section class="border-bottom">
      <slider :list="sliderList" />
    </section>
    <!-- 一元首冲 -->
    <section class="border-bottom firstPay-one-wrapper" v-if="showOnePay">
      <div class="firstPay-one item" @click="onePay(onePayData)">
        <img v-if="hasLotteryTimes" src="../images/hasLottery1.png" alt="">
        <img v-else :src="onePayData.productIcon | httpImg" alt="">
      </div>
    </section>
    <!-- 充值特惠 -->
    <section class="preference border-bottom" v-if="showPreference">
      <div class="wrap">
        <div class="items">
          <div class="item" v-for="(item, index) in preferenceAwardsList" :key="index"
            @click="feedbackGoToPay(item,preferenceList, 2)">
            <div class="img">
              <img :src="item.awardsImage | httpImg" alt="" v-if="item.awardsType" />
              <img :src="item.awardsImage" alt="" v-else />
            </div>
            <P v-if="item.awardsNum">{{countAwardName(item)}}<br>x{{countAwardNum(item)}}</P>
            <P v-else-if="item.awardsName==='通用礼包转盘'">VIP转盘<br>x30天</P>
            <p v-else>{{countAwardName(item)}}</p>
            <img class="add-icon" src="../images/add-icon.png" alt="" />
          </div>
        </div>
        <div class="btns" @click="toPay(preferenceList,2)">
          <div class="preference-name">
            充值回馈
          </div>
          <div class="btn">
            ￥{{ preferenceList.price }}
          </div>
        </div>
      </div>
    </section>
    <!-- 超值推荐 -->
    <section class="hot-card border-bottom" v-if="showHotCard">
      <p class="title">超值礼包</p>
      <p class="btc-title" v-if="showBtc" @click="goBtc">超值礼包有折扣了<i class="iconfont icon-next"></i>
      </p>
      <div class="items">
        <div class="left-wrapper">
          <template v-for="(item, index) in leaguePacksList">
            <div class="item" @click="toPay(item, 4)" :key="index" v-if="index<1">
              <div class="icon">
                <img :src="item.productIcon|httpImg" alt="">
              </div>
              <div class="content">
                {{ item.content | split('+', 0) }}
                <div class="give-detail"><span>{{ item.content | split('+', 1) }}</span></div>
              </div>
              <div class="btn">
                ￥{{item.price}}
              </div>
            </div>
          </template>
        </div>
        <div class="right-wrapper">
          <template v-for="(item, index) in leaguePacksList">
            <div class="item" @click="toPay(item, 4)" :key="index" v-if="index>0">
              <div class="icon">
                <img :src="item.productIcon|httpImg" alt="">
              </div>
              <div class="content">
                {{ item.content | split('+', 0) }}<br>
                <div class="give-detail"><span>{{ item.content | split('+', 1) }}</span></div>
              </div>
              <div class="btn">
                ￥{{item.price}}
              </div>
            </div>
          </template>
        </div>
      </div>
    </section>
    <!--推荐单品-->
    <recommend-card v-if="isTestVersion" @toPay="toPay" @goMore="goMore"></recommend-card>
    <!--优惠券包-->
    <coupon-bag type="portrait" @toPay="toPay" />
    <!-- 周卡 -->
    <!-- 周卡 -->
    <week-card :weeksCard="weeksCard" :monthCard="monthCard" @toPay="toPay" @openPop="openPop">
    </week-card>
    <!-- 更多商品 -->
    <div class="goods" v-if="showGoodList" ref="goods">
      <p class="title">更多商品<span v-if="isTestVersion">限时升级</span></p>
      <ul>
        <li v-for="(item, index) in goodsList" :key="index" @click="toPay(item)">
          <div class="icon" v-if="item.dailyLimitPerUser">
            <img src="../images/pay1.png" alt="" v-if="item.buyFlag" />
            <img src="../images/pay2.png" alt="" v-else />
          </div>
          <div class="desc">
            <img src="../images/leaf.png" alt="">
            {{ item.amount}}
          </div>
          <p class="add-award" v-if="isTestVersion">
            <span v-if="item.awardsList&&item.awardsList.length&&item.awardsList[0].awardsNum">
              {{item.awardsList|awardFilter}}
            </span>
          </p>
          <div class="img">
            <img :src="item.icon | httpImg" alt="" />
            <img class="img-tips" :src="item.awardsList|awardImgFilter|filter" alt=""
              v-if="item.awardsList&&item.awardsList[0]&&item.awardsList[0].awardsImage">
          </div>
          <div class="btn">
            <span class="code">￥</span>
            <span>{{ item.price }}</span>
          </div>
        </li>
        <li class="empty" v-for="item in emptyLiNumber" :key="`empty${item}`"></li>
      </ul>
    </div>
  </div>
</template>
<script>
import Slider from './slider'
import ResetPay from './resetPay'
import couponBag from '@/components/couponBag/couponBag'
import Services from '@/services/payment'
import _get from 'lodash.get'
import recommendCard from './recommendCard'
import weekCard from './weekCard'
export default {
  name: 'goodsList',
  data: () => ({
    sliderList: [],
    leaguePacksList: [],
    preferenceList: {},
    weeksCard: null,
    goodsList: [],
    oneFirstPay: [],
    bettingTimes: 0,
    isTestVersion: false,
    showBtc: false,
    monthCard: null
  }),
  components: {
    Slider,
    ResetPay,
    recommendCard,
    couponBag,
    weekCard
  },
  computed: {
    showHotCard () {
      if (this.leaguePacksList instanceof Array && !this.isTestVersion) {
        return this.leaguePacksList.length
      }
      return false
    },
    showPreference () {
      if (this.preferenceList instanceof Object) {
        return Object.keys(this.preferenceList).length
      }
      return false
    },
    showWeeks () {
      if (this.weeksCard instanceof Array) {
        return this.weeksCard.length
      }
      return false
    },
    weeksContent () {
      if (this.showWeeks) {
        let array = this.weeksCard[0].content.split(';')
        let weeksArray = []
        for (let i in array) {
          let weeksData = {}
          weeksData.name = array[i].split(':')[0]
          weeksData.amount = array[i].split(':')[1]
          weeksArray.push(weeksData)
        }
        return weeksArray
      }
      return []
    },
    showOnePay () {
      if (this.oneFirstPay instanceof Array) {
        return (this.oneFirstPay[0] && this.oneFirstPay[0].buyStatus === 0) ||
          this.oneFirstPay[0] && this.oneFirstPay[0].buyStatus === 1 && this.bettingTimes > 0
      }
      return false
    },
    onePayData () {
      if (this.oneFirstPay instanceof Array) {
        return this.oneFirstPay[0]
      }
      return []
    },
    hasLotteryTimes () {
      return this.oneFirstPay[0] && this.oneFirstPay[0].buyStatus === 1 && this.bettingTimes > 0
    },
    showGoodList () {
      return this.goodsList && this.goodsList.length
    },
    gameGift () {
      return this.preferenceList && this.preferenceList.awardsList && this.preferenceList.awardsList.filter(item => [20, 21, 40, 41, 6, 49].includes(item.awardsType)) || []
    },
    preferenceAwardsList () {
      if (this.gameGift.length > 1) {
        let giftitem = {
          awardsName: '游戏礼包',
          awardsImage: `${require('../images/gamegift.png')}`,
          awardsNum: 0,
          awardsType: 0,
          phyAwardsId: 0,
          remark: '',
          params: null
        }
        let arr = this.preferenceList.awardsList.filter(item => ![20, 21, 40, 41, 6, 49].includes(item.awardsType))
        arr.splice(2, 0, giftitem)
        return arr
      } else {
        return this.preferenceList.awardsList
      }
    },
    emptyLiNumber () {
      if (this.showGoodList && this.goodsList.length && this.goodsList.length % 3) {
        return 3 - this.goodsList.length % 3
      }
      return 0
    }
  },
  filters: {
    split (item, type, num) {
      return item.split(type)[num]
    },
    httpImg (item) {
      let img = item
      if (img && img.includes(';')) {
        img = img.split(';')[0]
      }
      if (img && !img.includes('http')) {
        return '//file.beeplaying.com/' + img
      } else {
        return img
      }
    },
    awardFilter (list) {
      let info = list[0]
      if (info.awardsNum >= 10000) {
        return `赠${Math.floor(info.awardsNum / 1000) / 10}万金叶`
      }
      return `赠${info.awardsNum || 0}金叶`
    },
    awardImgFilter (list) {
      let info = list[0]
      return info.awardsImage
    }
  },
  methods: {
    countAwardName (item) {
      if (item.awardsType == 10) {
        return '话费券'
      } else {
        return item.awardsName
      }
    },
    countAwardNum (item) {
      if (item.awardsType == 10) {
        return item.awardsNum / 10 + '元'
      } else {
        return item.awardsNum
      }
    },
    /** 获取轮播图 **/
    _getSlider () {
      Services.getSlider1().then(res => {
        let { code, data, message } = _get(res, 'data')
        if (code == 200) {
          this.sliderList = _get(res, 'data.data', [])
        }
      })
    },
    _getGift () {
      Services.getGift().then(res => {
        let { code, message, data } = _get(res, 'data')
        if (code == 200) {
          this.leaguePacksList = _get(res, 'data.data.leaguePacksList', [])
          this.preferenceList = _get(res, 'data.data.feedBack', false)
          this.weeksCard = _get(res, 'data.data.card[0]', null)
          this.oneFirstPay = _get(res, 'data.data.newFeedBack', [])
          this.bettingTimes = _get(res, 'data.data.bettingTimes', 0)
          this.monthCard = _get(res, 'data.data.monthCard[0]', null)
          this.preferenceListSort()
        }
      })
    },
    _getGoodsList () {
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
      })
    },
    preferenceListSort () {
      let leaf = []
      if (this.preferenceList && this.preferenceList.awardsList) {
        this.preferenceList.awardsList.forEach((item, index) => {
          if (item.awardsType == 1) {
            leaf = this.preferenceList.awardsList.splice(index, 1)
          }
        })
        this.preferenceList.awardsList = [...leaf, ...this.preferenceList.awardsList]
      }
    },
    onePay (item) {
      if (this.oneFirstPay[0] && this.oneFirstPay[0].buyFlag || this.bettingTimes > 0) {
        parent.GameEval('openweb', `https://wap.beeplaying.com/xmWap/#/mall/onePay?channel=${localStorage.getItem('APP_CHANNEL')}&token=${localStorage.getItem('ACCESS_TOKEN')}`)
        return
      }
      this.toPay(item)
    },
    toPay (item, type) {
      if (item.dailyLimitPerUser && !item.buyFlag) {
        this.$Toast('该商品每日限购一次哦')
        return
      }
      localStorage.setItem('JDD_PARAM', JSON.stringify(item))
      switch (type) {
        case 1:
          /** 六元首冲 **/
          this.$marchSetsPoint('P_H5PT0058', { edition: 'portrait' })
          break
        case 2:
          /** 充值回馈 **/
          this.$marchSetsPoint('A_H5PT0058000525', { edition: 'portrait' })
          break
        case 3:
          /** 周卡 **/
          this.$marchSetsPoint('A_H5PT0058000528', { edition: 'portrait' })
          break
        case 4:
          /** 超值推荐 **/
          this.$marchSetsPoint('A_H5PT0058000526', { edition: 'portrait' })
          break
        case 5:
          /** 热门单品 **/
          this.$marchSetsPoint('A_H5PT0058004068', { product_id: item.bizId, product_name: item.name, edition: 'portrait', project_id: parent.SDK.getGameType() })
          break
        case 6:
          /** 优惠券包点击 **/
          this.$marchSetsPoint('A_H5PT0058004092', {
            product_price: item.price, product_id: item.bizId, product_name: item.name, edition: 'portrait'
          })
          break
        case 7:
          /** 月卡 **/
          this.$marchSetsPoint('A_H5PT0058004147', {
            product_price: item.price, product_id: item.bizId, product_name: item.name, edition: 'portrait', recharge_rmb: item.price, project_id: parent.SDK.getGameType()
          })
          break
        default:
          /** 热门单品 **/
          this.$marchSetsPoint('A_H5PT0058000527', { edition: 'portrait' })
          break
      }
      this.$router.push({
        name: 'GPList'
      })
    },
    init () {
      this._getGoodsList()
      this._getSlider()
      this._getGift()
      this._getBtcActive()
    },
    feedbackGoToPay (item, preferenceList, type) {
      if (item.awardsType) {
        this.toPay(preferenceList, type)
      } else {
        this.$emit('openGameGiftPop', true, this.gameGift)
      }
    },
    openMallPop (type) {
      this.$emit('openMallPop', type)
    },
    scroll () {
      let scrollStart = false
      let scrollEnd = false
      let element = document.querySelector('.goods-list')
      element.addEventListener('touchstart', () => {
        if (element.offsetHeight + element.scrollTop === element.scrollHeight) {
          scrollStart = true
        } else {
          scrollStart = false
        }
      })
      element.addEventListener('touchmove', () => {
        if (element.offsetHeight + element.scrollTop === element.scrollHeight) {
          scrollEnd = true
        } else {
          scrollEnd = false
        }
      })
      element.addEventListener('touchend', () => {
        if (element.offsetHeight + element.scrollTop >= element.scrollHeight && scrollStart && scrollEnd) {
          this.$emit('nav-change', 1)
        }
        scrollEnd = false
      })
    },
    goBtc () {
      this.$marchSetsPoint('A_H5PT0058003900', {
        project_id: SDK.getGameType()
      })
      parent.location.href = `https://wap.beeplaying.com/activities/valuepackages.html`
    },
    _getBtcActive () {
      Services.getBtcActive().then(res => {
        const { code, data, message } = _get(res, 'data')
        if (code == 200) {
          if (data.state == 1) {
            this.showBtc = true
          }
        }
      })
    },
    goMore () {//点击热门单品 更多
      this.$marchSetsPoint('A_H5PT0058004067', { edition: 'portrait', project_id: parent.SDK.getGameType() })
      this.$refs['goods'] && (this.$refs['goodsList'].scrollTop = this.$refs['goods'].offsetTop)
    },
    openPop (type) {
      if (type) {
        this.$emit('showMonthTips', this.monthCard)
      } else {
        this.$emit('showWeekTips', this.weeksCard)
      }
    },
  },
  mounted () {
    this.init()
    this.scroll()
  }
}
</script>
<style scoped lang="less">
.bg-center(@url) {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url(@url);
}
.goods-list {
  padding: 0 16px 20px;
  overflow-y: scroll;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  height: 730px;
  margin-top: 20px;
  .border-bottom {
    border-bottom: 2px dashed #e6ad5d;
  }
  .firstPay-one {
    text-align: center;
    width: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 28px;
    margin: 20px 0;
    img {
      vertical-align: top;
      max-height: 170px;
      max-width: 100%;
    }
  }
  .preference {
    width: 100%;
    color: #000;
    font-size: 20px;
    .wrap {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 14px 16px 0;
    }
    .icon {
      position: absolute;
      left: -5px;
      top: -5px;
      width: 85px;
      height: 85px;
      img {
        vertical-align: top;
        width: 100%;
        height: 100%;
      }
    }
    .items {
      display: flex;
      justify-content: flex-start;
      .item {
        position: relative;
        padding: 3px 17px 0 0;
        text-align: center;
        &:last-child {
          padding: 3px 0 0 0;
          .add-icon {
            display: none;
          }
        }
        .img {
          margin: 0 auto 5px;
          width: 90px;
          height: 90px;
          img {
            vertical-align: top;
            width: 100%;
            height: 100%;
          }
        }
        p {
          white-space: nowrap;
          width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 30px;
        }
        .add-icon {
          position: absolute;
          right: 0;
          top: 48px;
          width: 17px;
          height: 17px;
        }
      }
    }
    .btns {
      .preference-name {
        font-size: 26px;
        text-align: center;
        color: #9f752a;
        line-height: 30px;
      }
    }
  }
  .btn {
    margin: 0 auto;
    width: 110px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    .bg-center('../images/buy-btn.png');
  }
  .hot-card {
    position: relative;
    overflow: hidden;
    padding: 20px 0;
    color: #9f752a;
    font-weight: bold;
    font-size: 26px;
    .title {
      margin-bottom: 10px;
      height: 30px;
      line-height: 30px;
    }
    .btc-title {
      position: absolute;
      right: 0;
      top: 20px;
      height: 30px;
      line-height: 30px;
      font-size: 22px;
      font-weight: bold;
    }
    .items {
      display: flex;
      align-items: center;
      .item {
        padding: 14px 0;
        .icon {
          width: 112px;
          min-height: 90px;
          margin: auto;
          img {
            width: 100%;
          }
        }
        .content {
          color: #000;
          font-size: 20px;
          line-height: 26px;
          .give-detail {
            position: relative;
            color: #9f752a;
            font-size: 18px;
            display: flex;
            align-items: flex-start;
            &::before {
              content: '';
              display: block;
              width: 22px;
              height: 22px;
              font-size: 0;
              margin-right: 2px;
              .bg-center('../images/give-icon.png');
            }
          }
        }
      }
      .left-wrapper {
        width: 150px;
        text-align: center;
        .give-detail {
          justify-content: center;
        }
        .btn {
          margin-top: 10px;
        }
      }
      .right-wrapper {
        flex: 1;
        border-left: 2px solid #ffd78f;
        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          &:first-child {
            border-bottom: 2px solid #ffd78f;
          }
        }
      }
    }
  }
  .goods {
    padding: 20px 0;
    color: #9f752a;
    font-size: 26px;
    font-weight: bold;
    .title {
      margin-bottom: 10px;
      span {
        font-size: 18px;
        margin-left: 18px;
        color: #ff5347;
      }
    }
    ul {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      li {
        position: relative;
        margin-bottom: 10px;
        width: 180px;
        min-height: 210px;
        background: #f4e5d1;
        border-radius: 16px;
        padding: 12px 0;
        box-sizing: border-box;
        .icon {
          position: absolute;
          top: -6px;
          left: -6px;
          width: 108px;
          height: 100px;
          img {
            vertical-align: top;
            width: 100%;
            height: 100%;
          }
        }
        .img {
          margin: 6px auto;
          height: 74px;
          text-align: center;
          position: relative;
          img {
            vertical-align: top;
            height: 74px;
            margin-left: 6px;
          }
          .img-tips {
            width: 70px;
            height: 28px;
            position: absolute;
            transform: translate3d(0, 0, 0);
            top: -10px;
            right: 20px;
          }
        }
        .desc {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20px;
          color: #000;
          img {
            margin-right: 5px;
            width: 30px;
            height: 30px;
          }
        }
        .add-award {
          font-size: 20px;
          text-align: center;
          color: #9f752a;
          white-space: nowrap;
          font-weight: 400;
          height: 34px;
          line-height: 34px;
        }
        &.empty {
          background: none;
        }
      }
    }
    .more {
      height: 30px;
      background: rgba(42, 69, 137, 1);
      border-radius: 15px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      color: #ffffff;
      font-size: 20px;
      img {
        margin-left: 10px;
        vertical-align: top;
        width: 20px;
        height: 20px;
      }
    }
  }
}
.game-gift-content {
  font-size: 24px;
  color: #888888;
  text-align: center;
  line-height: 30px;
}
@keyframes lightchange {
  0% {
    bottom: -50px;
  }
  100% {
    bottom: 170px;
  }
}
</style>

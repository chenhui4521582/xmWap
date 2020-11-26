<template>
  <div class="gift">
    <!-- 重新支付 & 优惠券 -->
    <reset-pay @openMallPop="openMallPop" />
    <!-- 活动推荐 -->
    <div class="activeties  border-bottom" v-if="showBanner||showOnePay">
      <!-- 轮播图 -->
      <div class="item" v-if="showBanner">
        <slider :list="sliderList" />
      </div>
      <!-- 一元首冲 -->
      <div class="firstPay-one item" v-if="showOnePay" @click="onePay(onePayData)">
        <img v-if="hasLotteryTimes" src="../images/hasLottery1.png" alt="">
        <img v-else :src="onePayData.productIcon | httpImg" alt="">
      </div>
    </div>
    <!-- 充值回馈 -->
    <div class="preference border-bottom" v-if="showPreference">
      <div class="wrap">
        <!-- <div class="icon">
            <img src="../images/feedback-icon.png" alt="">
          </div> -->
        <div class="items">
          <div class="item-wrap" v-for="(item, index) in preferenceAwardsList" :key="index"
            @click="feedbackGoToPay(item,preferenceList, 2)">
            <div class="item">
              <div class="img">
                <img :src="item.awardsImage | filter" alt="" v-if="item.awardsType" />
                <img :src="item.awardsImage" alt="" v-else />
              </div>
              <P v-if="item.awardsNum">{{countAwardName(item)}}<br>x{{countAwardNum(item)}}</P>
              <P v-else-if="item.awardsName==='通用礼包转盘'">VIP转盘<br>x30天</P>
              <p v-else>{{countAwardName(item)}}</p>
            </div>
            <div class="add-icon-wrap">
              <img class="add-icon" v-if="index!==preferenceAwardsList.length-1"
                src="../images/add-icon.png" alt="" />
            </div>
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
    </div>
    <!-- 超值推荐 -->
    <div class="hot-card border-bottom" v-if="showHotCard">
      <p class="title">超值礼包</p>
      <p class="btc-title" v-if="showBtc" @click="goBtc">超值礼包有折扣了<i class="iconfont icon-next"></i>
      </p>
      <div class="items">
        <div class="item" v-for="(item, index) in leaguePacksList" :key="index"
          @click="toPay(item, 4)">
          <div class="img">
            <img :src="item.productIcon | httpImg" alt="">
          </div>
          <div class="content">
            {{ item.content | split('+', 0) }}
            <div class="give-detail"><span>{{ item.content | split('+', 1) }}</span></div>
          </div>
          <div class="btn">
            ￥{{item.price}}
          </div>
        </div>
      </div>
    </div>
    <!--推荐单品-->
    <recommend-card v-if="isTestVersion" @toPay="toPay" @goMore="$emit('goMore')"></recommend-card>
    <!--优惠券包-->
    <coupon-bag type="landscape" @toPay="toPay" />
    <!-- 周卡 -->
    <week-card :weeksCard="weeksCard" :monthCard="monthCard" @toPay="toPay" @openPop="openPop">
    </week-card>
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
  name: 'gift',
  data: () => ({
    sliderList: [],
    leaguePacksList: [],
    preferenceList: {},
    weeksCard: null,
    oneFirstPay: [],
    bettingTimes: 0,
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
  props: {
    isTestVersion: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    showBanner () {
      if (this.sliderList instanceof Array) {
        return this.sliderList.length
      }
      return false
    },
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
    }
  },
  filters: {
    split (item, type, num) {
      return item.split(type)[num]
    },
    httpImg (item) {
      let img = item.split(';')[0]
      if (img && !img.includes('http')) {
        return '//file.beeplaying.com/' + img
      } else {
        return img
      }
    },
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
    _getSlider () {
      Services.getSlider().then(res => {
        let { code, message, data } = _get(res, 'data')
        if (code == 200) {
          let list = _get(res, 'data.data', [])
          if (list.length) {
            this.sliderList.push(list[0])
          }
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
        parent.location.href = `https://wap.beeplaying.com/xmWap/#/mall/onePay?channel=${localStorage.getItem('APP_CHANNEL')}&token=${localStorage.getItem('ACCESS_TOKEN')}`
        return
      }
      this.toPay(item)
    },
    toPay (item, type) {
      localStorage.setItem('JDD_PARAM', JSON.stringify(item))
      switch (type) {
        case 1:
          /** 六元首冲 **/
          this.$marchSetsPoint('P_H5PT0058', { edition: 'landScopeMall' })
          break
        case 2:
          /** 充值回馈 **/
          this.$marchSetsPoint('A_H5PT0058000525', { edition: 'landScopeMall' })
          break
        case 3:
          /** 周卡 **/
          this.$marchSetsPoint('A_H5PT0058000528', { edition: 'landScopeMall' })
          break
        case 4:
          /** 超值推荐 **/
          this.$marchSetsPoint('A_H5PT0058000526', { edition: 'landScopeMall' })
          break
        case 5:
          /** 热门单品 **/
          this.$marchSetsPoint('A_H5PT0058004068', { product_id: item.bizId, product_name: item.name, edition: 'landScopeMall', project_id: parent.SDK.getGameType() })
          break
        case 6:
          /** 优惠券包点击 **/
          this.$marchSetsPoint('A_H5PT0058004092', { product_price: item.price, product_id: item.bizId, product_name: item.name, edition: 'landScopeMall' })
          break
        case 7:
          /** 月卡 **/
          this.$marchSetsPoint('A_H5PT0058004147', {
            product_price: item.price, product_id: item.bizId, product_name: item.name, edition: 'portrait', recharge_rmb: item.price, project_id: parent.SDK.getGameType()
          })
          break
      }
      this.$router.push({
        name: 'GPList'
      })
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
      let element = document.querySelector('.gift')
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
    openPop (type) {
      if (type) {
        this.$emit('showMonthTips', this.monthCard)
      } else {
        this.$emit('showWeekTips', this.weeksCard)
      }
    },
  },
  mounted () {
    this._getSlider()
    this._getGift()
    this._getBtcActive()
    // this.scroll()
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
* {
  line-height: 1;
}
.gift {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  .border-bottom {
    border-bottom: 2px dashed #e6ad5d;
  }
  .activeties {
    padding: 0 0 15px;
    display: flex;
    justify-content: space-between;
    .item {
      width: 360px;
      height: 102px;
      border-radius: 20px;
      img {
        vertical-align: top;
        width: 100%;
        height: 105px;
        border-radius: 20px;
      }
    }
  }
  .preference {
    padding: 15px 0;
    width: 100%;
    .wrap {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 140px;
      border-radius: 35px;
    }
    // .icon {
    //   position: absolute;
    //   left: -5px;
    //   top: -5px;
    //   width: 81px;
    //   height: 83px;
    //   img {
    //     vertical-align: top;
    //     width: 100%;
    //     height: 100%;
    //   }
    // }
    .items {
      flex: 1;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .item-wrap {
        flex: 1;
        display: flex;
        justify-content: space-around;
        align-items: center;
        font-size: 0;
        .add-icon-wrap {
          width: 21px;
          height: 20px;
          .add-icon {
            width: 100%;
            height: 100%;
          }
        }
      }
      .item {
        position: relative;
        text-align: center;
        .img {
          margin: 0 auto 5px;
          width: 90px;
          height: 90px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        p {
          white-space: nowrap;
          color: #000;
          font-size: 20px;
          font-weight: bold;
        }
      }
    }
    .btns {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      min-width: 106px;
      max-width: 106px;
      .preference-name {
        color: #9f752a;
        font-size: 26px;
        font-weight: bold;
        margin: 10px auto;
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

  .weeks-card {
    padding: 20px 0;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    .weeks-card-icon {
      margin-right: 20px;
      width: 120px;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #c4c4c4;
      border-radius: 10px;
      img {
        width: 112px;
        height: 114px;
      }
      &.actived {
        background: #aedaff;
        opacity: 1;
        border-radius: 10px;
        position: relative;
        &:before {
          content: '';
          width: 120px;
          height: 50px;
          background: url('../images/cardlight.png');
          background-size: 100% 100%;
          position: absolute;
          bottom: -50px;
          animation: lightchange 2s infinite ease-in-out;
        }
      }
    }
    .weeks-content {
      flex: 1;
      .weeks-content-title {
        font-size: 26px;
        font-weight: bold;
        color: #9f752a;
        display: flex;
        align-items: center;
        margin-bottom: 6px;
      }
      .items {
        .item {
          line-height: 24px;
          font-size: 18px;
          color: #9f752a;
        }
        .prize {
          color: #000;
          font-size: 20px;
          margin-top: 12px;
        }
        .num {
          color: #d7484c;
        }
      }
    }
    .btn {
      &.actived {
        .bg-center('../images/week-disable.png');
      }
    }
    .old-price {
      color: #c4c4c4;
      font-size: 18px;
      text-align: center;
      text-decoration: line-through;
      margin-top: 8px;
    }
  }
  .hot-card {
    position: relative;
    font-size: 26px;
    color: #9f752a;
    padding: 15px 0;
    .title {
      margin-bottom: 10px;
      height: 30px;
      line-height: 30px;
    }
    .btc-title {
      position: absolute;
      right: 0;
      top: 15px;
      height: 30px;
      line-height: 30px;
      font-size: 22px;
      font-weight: bold;
    }
    .items {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 50%;
        box-sizing: border-box;
        .img {
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
          width: 130px;
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
        &:nth-child(1) {
          padding-right: 12px;
        }
        &:nth-child(2) {
          padding-left: 12px;
          border-left: 2px solid #ffd78f;
        }
        &:nth-child(3) {
          padding-right: 12px;
        }
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
</style>

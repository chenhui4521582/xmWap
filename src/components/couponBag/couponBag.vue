<template>
  <article class="coupon-bag" :class="`coupon-bag-${type}`" v-if="couponInfo&&couponInfo.buyFlag">
    <section class="icon-wrapper">
      <img src="./img/game-coupon-icon.png" alt="" v-if="type">
      <img src="./img/coupon-icon.png" alt="" v-else>
    </section>
    <section class="info-wrapper">
      <h4>{{couponInfo.name}}</h4>
      <ul class="content-list">
        <li v-for="(item,index) in contentList" :key="index">
          满<span>{{item[0]}}</span>券{{item[1]}}
        </li>
      </ul>
    </section>
    <section class="countdown-time">
      {{countdownTime|countDown}}后消失
    </section>
    <section class="btn" @click="toPay">
      <span>¥{{couponInfo.price||0}}</span>
    </section>
  </article>
</template>

<script>
import { getCouponBag } from '@/services/global.js'
import _get from 'lodash.get'
export default {
  name: '',
  components: {

  },
  data () {
    return {
      couponInfo: null,
      countdownTime: 0,
      timer: null
    }
  },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  filters: {
    countDown (data) {
      if (data && data > 0) {
        let date = data / 1000
        let day = Math.floor(date / 86400)
        let hour = Math.floor(parseInt(date / 60 / 60) % 24)
        let minute = Math.floor(parseInt(date / 60) % 60)
        let second = Math.floor(date % 60)
        let countDay = day >= 10 ? day : '0' + day
        let countHour = hour >= 10 ? hour : '0' + hour
        let countMinute = minute >= 10 ? minute : '0' + minute
        if (day > 0) {
          return `${countDay}天${countHour}时${countMinute}分`
        } else {
          return `${countHour}时${countMinute}分`
        }
      } else {
        return ''
      }
    },
  },
  computed: {
    contentList () {
      let list = []
      this.couponInfo.content.split(';').forEach(items => {
        if (items && items.split('满').length > 0) {
          let item = items.split('满')[1] && items.split('满')[1].split('券')
          if (!item[1]) item[1] = ''
          list.push(item)
        }
      })
      return list
    }
  },
  mounted () {
    this._getCouponBag()
  },
  methods: {
    async _getCouponBag () {
      const res = await getCouponBag(254)
      const code = _get(res, 'data.code', 0)
      const data = _get(res, 'data.data.mallBizConfigs[0]', null)
      if (code === 200) {
        this.couponInfo = data
        this.countdownTime = new Date(this.couponInfo.endTime.replace(/-/g, '/')).getTime() - new Date().getTime()
      }
    },
    toPay () {
      this.$emit('toPay', this.couponInfo, 6)
    }
  }
}
</script>

<style lang="less" scoped>
.coupon-bag {
  height: 210px;
  background: #ffffff;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
  opacity: 1;
  border-radius: 16px;
  margin-top: 21px;
  box-sizing: border-box;
  padding: 20px;
  position: relative;
  display: flex;
  align-items: center;
  .icon-wrapper {
    width: 180px;
    height: 180px;
    border-radius: 10px;
    background: #f7f7f7;
    text-align: center;
    img {
      width: 160px;
      height: 160px;
    }
  }
  .info-wrapper {
    margin-left: 28px;
    h4 {
      font-size: 32px;
      font-weight: bold;
      line-height: 48px;
      color: #000;
    }
    .content-list {
      font-size: 24px;
      font-weight: 400;
      line-height: 36px;
      color: #888;
      span {
        color: #ff7800;
      }
    }
  }
  .countdown-time {
    position: absolute;
    right: 30px;
    top: 32px;
    font-size: 24px;
    font-weight: 400;
    line-height: 36px;
    color: #ff7800;
  }
  .btn {
    position: absolute;
    right: 30px;
    bottom: 30px;
    width: 110px;
    height: 42px;
    background: #ff4141;
    font-size: 24px;
    font-weight: 500;
    line-height: 42px;
    color: #fff;
    text-align: center;
    border-radius: 10px;
  }
  &.coupon-bag-landscape,
  &.coupon-bag-portrait {
    box-shadow: none;
    background: none;
    border-bottom: 2px dashed #e6ad5d;
    height: 184px;
    padding: 32px 0;
    margin: 0;
    .icon-wrapper {
      background: #c4c4c4;
      height: 120px;
      width: 120px;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
    .info-wrapper {
      margin-left: 20px;
      h4 {
        font-size: 26px;
        line-height: 30px;
        color: #9f752a;
        font-weight: bold;
      }
      .content-list {
        font-size: 18px;
        line-height: 26px;
        color: #9f752a;
        font-weight: bold;
        span {
          color: #d7484c;
        }
      }
    }
    .countdown-time {
      font-size: 18px;
      color: #ff5347;
      right: 0;
    }
    .btn {
      right: 0;
      width: 110px;
      height: 60px;
      text-align: center;
      line-height: 60px;
      color: #fff;
      font-size: 20px;
      font-weight: bold;
      background: url('./img/buy-btn.png') no-repeat center center;
      background-size: 100% 100%;
      top: 50%;
      margin-top: -30px;
      bottom: initial;
    }
  }
}
</style>

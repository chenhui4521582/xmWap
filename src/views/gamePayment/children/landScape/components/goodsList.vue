<template>
  <div class="goods-list">
    <!-- 重新支付 & 优惠券 -->
    <reset-pay @openMallPop="openMallPop" />
    <ul>
      <li v-for="(item, index) in goodsList" :key="index" @click.stop="toPay(item)">
        <div class="icon" v-if="item.dailyLimitPerUser">
          <img src="../images/pay1.png" alt="" v-if="item.buyFlag" />
          <img src="../images/pay2.png" alt="" v-else />
        </div>
        <div class="desc">
          <img src="../images/leaf.png" alt="">
          <span>{{ item.amount}}</span>
        </div>
        <p class="add-award" v-if="isTestVersion">
          <span v-if="item.awardsList&&item.awardsList.length&&item.awardsList[0].awardsNum">
            {{item.awardsList|awardFilter}}
          </span>
        </p>
        <div class="img">
          <img :src="item.icon | filter" alt="" />
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
</template>
<script>
import ResetPay from './resetPay'
import { payCommomMixin } from '../../../mixin/payCommomMixin'
import Services from '@/services/payment'
import _get from 'lodash.get'
export default {
  name: 'goodsList',
  filters: {
    split (item, type, num) {
      if (item) {
        return item.split(type)[num]
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
  props: {
    goodsList: {
      type: Array,
      default: () => ([])
    },
    isTestVersion: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ResetPay
  },
  computed: {
    showGoodList () {
      return this.goodsList.length
    },
    emptyLiNumber () {
      if (this.showGoodList && this.goodsList.length && this.goodsList.length % 4) {
        return 4 - this.goodsList.length % 4
      }
      return 0
    }
  },
  mixins: [payCommomMixin],
  methods: {
    toPay (item) {
      if (item.dailyLimitPerUser && !item.buyFlag) {
        this.$Toast('该商品每日限购一次哦')
        return
      }
      localStorage.setItem('JDD_PARAM', JSON.stringify(item))
      this.$marchSetsPoint('A_H5PT0058000527', { edition: 'landScopeMall' })
      this.$router.push({
        name: 'GPList'
      })
    },
    openMallPop (type) {
      this.$emit('openMallPop', type)
    },
    scroll () {
      let scrollTop = null
      let scrollTopStart = null
      let element = document.querySelector('.goods-list')
      element.addEventListener('touchstart', () => {
        scrollTopStart = element.scrollTop
        scrollTop = null
      })
      element.addEventListener('touchmove', () => {
        scrollTop = element.scrollTop
        if (scrollTop) {
          scrollTopStart = null
        }
      })
      element.addEventListener('touchend', () => {
        if (element.scrollTop <= 0 && scrollTop === 0 && scrollTopStart === 0) {
          scrollTop = null
          scrollTopStart = null
          this.$emit('nav-change')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
* {
  line-height: 1;
}
.bg-center(@url) {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url(@url);
}
.goods-list {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  color: #9f752a;
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  box-sizing: border-box;
  ul {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 6px;
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
          top: -6px;
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
          font-size: 0;
          display: block;
        }
        span {
          display: block;
          line-height: 30px;
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
}
</style>

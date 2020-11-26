<template>
  <section class="cat-prop-List">
    <!-- 重新支付 & 优惠券 -->
    <reset-pay @openMallPop="openMallPop" />
    <ul>
      <li v-for="(item, index) in catPropList" :key="index" @click.stop="toPay(item)">
        <div class="tips" v-if="item.dailyLimitPerUser != null">
          <img src="../images/pay1.png" alt=""
            v-if="item.dailyLimitPerUser > item.singlePurchasedTimes" />
          <img src="../images/pay2.png" alt="" v-else />
        </div>
        <p class="amount">
          <img src="../images/give-icon.png" alt="" />
          <span>{{ item.amount }}</span>
        </p>
        <div class="img">
          <img :src="item.icon | filter" alt="" />
        </div>
        <div class="name">
          {{item.name}}({{item.awardsList&&item.awardsList[0]&&item.awardsList[0].awardsNum}}天)
        </div>
        <div class="params">{{item.awardsList&&item.awardsList[0]&&item.awardsList[0].params}}</div>
        <div class="btn">
          <span class="code">￥</span>
          <span>{{ item.price || '' }}</span>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import Services from '@/services/payment'
import _get from 'lodash.get'
import ResetPay from './resetPay'
export default {
  name: 'catPropList',
  components: {
    ResetPay
  },
  data () {
    return {
      catPropList: []
    }
  },
  mounted () {
    this.getData()
    // this.scroll()
  },
  methods: {
    getData () {
      Services.getCatPropList().then(res => {
        let arr = _get(res, 'data.data.catPropList', [])
        this.catPropList = arr.sort((a, b) => {
          return a.price - b.price
        })
      })
    },
    toPay (item, type) {
      localStorage.setItem('JDD_PARAM', JSON.stringify(item))
      this.$router.push({
        name: 'GPList'
      })
    },
    openMallPop (type) {
      this.$emit('openMallPop', type)
    },
    scroll () {
      let scrollStart = false
      let scrollEnd = false
      let scrollTop = null
      let scrollTopStart = null
      let element = document.querySelector('.cat-prop-List')
      element.addEventListener('touchstart', () => {
        scrollTopStart = element.scrollTop
        scrollTop = null
        if (element.offsetHeight + element.scrollTop === element.scrollHeight) {
          scrollStart = true
        } else {
          scrollStart = false
        }
      })
      element.addEventListener('touchmove', () => {
        scrollTop = element.scrollTop
        if (element.offsetHeight + element.scrollTop === element.scrollHeight) {
          scrollEnd = true
        } else {
          scrollEnd = false
        }
        if (scrollTop) {
          scrollTopStart = null
        }
      })
      element.addEventListener('touchend', () => {
        if (element.scrollTop <= 0 && scrollTop === 0 && scrollTopStart === 0) {
          this.$emit('nav-change')
        } else if (element.offsetHeight + element.scrollTop >= element.scrollHeight && scrollStart && scrollEnd) {
          this.$emit('nav-change', 1)
        }
        scrollEnd = false
        scrollTop = null
        scrollTopStart = null
      })
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
.cat-prop-List {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  ul {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin: 0 -9px;
    li {
      width: 180px;
      height: 280px;
      box-sizing: border-box;
      background: #f4e5d1;
      border-radius: 16px;
      margin: 6px 6px;
      padding: 14px 0;
      font-size: 20px;
      text-align: center;
      color: #000;
      position: relative;
      .tips {
        position: absolute;
        top: -6px;
        left: -6px;
        width: 108px;
        height: 100px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .amount {
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 22px;
          height: 22px;
          margin-right: 8px;
        }
      }
      .img {
        width: 84px;
        height: 84px;
        margin: 0 auto 10px;
        img {
          height: 100%;
        }
      }
      .params {
        font-size: 18px;
        color: #9f752a;
        margin: 0 0 6px;
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

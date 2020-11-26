<template>
  <section class="mall-pop" v-if="value">
    <div class="pop-mask-rule" v-if="value" @touchmove.prevent></div>
    <div class="wrap">
      <template v-if="value===2">
        <div class="name">
          优惠券
        </div>
        <ul class="detail">
          <li v-for="(item,index) in couponList" :key="index">
            <p class="coupon-name">{{item.name}}</p>
            <p class="coupon-detail">
              <span>
                {{item.instructions}}
              </span><br>
              <span>
                有效期至{{item.effectiveEndTime.replace(/-/g, '.')}}
              </span><br>
              <span v-if="item.status === 3">
                您有订单正在使用优惠券结算，若30分钟内未使用，则此券可重新使用。
              </span>
            </p>
          </li>
        </ul>
      </template>
      <template v-if="value===1">
        <div class="name">
          商城说明
        </div>
        <div class="detail">
          <p>
            1.游戏商城是提供您在游戏中购买虚拟货币道具的虚拟商城，购买的商品可用于特定游戏消耗。
          </p>
          <p>
            2.您在游戏商城中选购商品且购买成功后，货币直接到账，道具可在【背包】中查看。
          </p>
          <p>
            3.因为网络波动或者系统系统原因，商品未到账，可联系客服处理，一经核实，马上为您补发商品。
          </p>
          <p>
            说明：下单前请慎重考虑，商品购买后，不予退款。
          </p>
        </div>
      </template>
      <div class="close-icon" @click="hideRule"></div>
    </div>
  </section>
</template>

<script>
import { getCouponList } from '@/services/user'
import _get from 'lodash.get'
export default {
  name: 'mallPop',
  props: {
    value: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      couponList: []
    }
  },
  methods: {
    hideRule () {
      this.$emit('input', 0)
    },
    // 获取优惠券信息
    async _getCouponList () {
      const res = await getCouponList()
      let data = _get(res, 'data', [])
      this.couponList = data && data.filter(item => {
        return item.status == 1 || item.status == 3 || item.status == 4 || item.status == 6
      })
    },
  },
  watch: {
    value (val) {
      if (val === 2) {
        this._getCouponList()
      }
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
.mall-pop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  .pop-mask-rule {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.55);
  }
  .wrap {
    padding: 0 35px;
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    transform: translate(-50%, -50%);
    width: 532px;
    height: 460px;
    box-sizing: border-box;
    .bg-center('../images/rule-bg.png');
    padding: 60px 50px 0;
    .name {
      font-size: 32px;
      color: #fff;
      line-height: 36px;
      text-shadow: 0px 3px 3px rgba(21, 90, 147, 0.86);
      margin-bottom: 16px;
      text-align: center;
    }
    .detail {
      height: 285px;
      overflow-x: hidden;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
    }
    li {
      padding: 10px 0;
      border-bottom: 2px solid #4495e0;
      &:first-child {
        padding-top: 0;
      }
      &:last-child {
        border-bottom: none;
      }
    }
    p {
      font-size: 20px;
      color: #fff;
      line-height: 30px;
      text-align: justify;
    }
    .coupon-detail {
      color: #88c0ff;
      font-size: 18px;
    }
  }
  .close-icon {
    position: absolute;
    width: 70px;
    height: 70px;
    .bg-center('../images/btn-close.png');
    top: -10px;
    right: -8px;
  }
}
</style>

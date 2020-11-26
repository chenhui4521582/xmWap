<template>
  <section class="n-u-tips">
    <div class="top-tip" :class="{'no-header':!$moduleConfig.isShowHeader}" v-if="type===1">
      * 恭喜你获得{{info.amount}}金叶子，返利{{info.multiple}}倍
    </div>
    <div class="tips-tag" :class="{'pay-error':type===2}" v-else>
      <div class="text-content" v-if="type">
        80%机会支付可得<br><span>大于6000金叶子</span><br><span>最高60000金叶子</span>
      </div>
      <div class="text-content" v-else>
        支付成功即可得
        <span>
          6000~60000金叶子
        </span>
      </div>
    </div>
  </section>
</template>

<script>
import Services from '@/services/payment'
export default {
  name: 'NUTips',
  props: {
    type: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      info: {},
      orderNumber: localStorage.getItem('ORDER_NUMBER')
    }
  },
  mounted () {
    if (this.type === 1) {
      this.init()
    }
  },
  methods: {
    async init () {
      const res = await Services.newUserFirstRechargeReturnResult({ 'value': this.orderNumber })
      let { data, code } = res.data
      if (code === 200) {
        this.info = data
      }
    }
  }
}
</script>

<style lang="less" scoped>
.n-u-tips {
  .top-tip {
    font-size: 24px;
    font-weight: 400;
    line-height: 36px;
    color: #ff4141;
    margin: 16px 0 28px;
    &.no-header {
      position: absolute;
      top: 16px;
    }
  }
  .tips-tag {
    position: absolute;
    bottom: 110px;
    right: 24px;
    width: 226px;
    height: 139px;
    z-index: 100;
    background-image: url('./img/new-user-tips.png');
    background-size: 100% 100%;
    font-size: 20px;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    line-height: 28px;
    text-align: right;
    display: flex;
    flex-direction: column;
    padding: 58px 20px 20px;
    box-sizing: border-box;
    color: #fff;
    animation: toggleTip 1.2s linear infinite;
    .text-content {
      height: 210px;
      display: block;
      line-height: 30px;
    }
    span {
      font-weight: 800;
    }
    &.pay-error {
      width: 216px;
      height: 168px;
      background-image: url('./img/new-user-tips-2.png');
    }
  }

  @keyframes toggleTip {
    0% {
      bottom: 110px;
    }

    50% {
      bottom: 106px;
    }

    100% {
      bottom: 110px;
    }
  }
}
</style>

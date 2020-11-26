<template>
  <section class="g-p-tips">
    <template v-if="type==='success'">
      <p v-if="bonusdata&&bonusdata.show&&bonusdata.state==1">
        * 奖池瓜分活动报名成功！{{bonusdata.timeline}}准时开奖哟~
        <a class="bonus1" @click="toBonusdata">前往活动页查看></a>
      </p>
      <p v-if="bonusdata&&bonusdata.show&&bonusdata.state==2">
        * 奖池瓜分活动已开启，立即<a @click="toBonusdata">前往报名</a>即有机会瓜分每日千元大奖哦~
      </p>
      <!--<p v-else>* 恭喜你获得{{giftInfo.amount}}金叶子，返利{{giftInfo.multiple}}倍</p>-->
    </template>
    <template v-if="type==='error'">
      <p v-if="openGratis">* 支付成功100%中大奖！</p>
      <p v-if="bonusdata&&bonusdata.show">* 奖池瓜分活动已开启，支付成功即有机会瓜分千元大奖！</p>
      <p v-if="order.bizType===230">* 支付成功即可得6000~60000金叶子</p>
    </template>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { localStorage, jumpUrl } from '@/utils/utils'
import Services from '@/services/payment'
export default {
  name: 'GPTips',
  data () {
    return {
      bonusdata: {},
      giftInfo: {}
    }
  },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState(['openGratis']),
    order () {
      return localStorage.get('JDD_PARAM')
    },
    orderNumber () {
      return localStorage.getString('ORDER_NUMBER')
    }
  },
  mounted () {
    this.getJackpotState()
    this.getNewUserGift()
    this._getGratis(this.orderNumber)
  },
  methods: {
    ...mapActions({ _getGratis: 'GET_GRATIS' }),
    getJackpotState () {
      Services.getJackpotState().then(res => {
        const { code, data } = res.data
        if (code === 200) {
          this.bonusdata = data
        }
      })
    },
    getNewUserGift () {
      if (this.order.bizType !== 230 || this.type === 'error') {
        return
      }
      Services.newUserFirstRechargeReturnResult({ 'value': this.orderNumber }).then(res => {
        const { data, code } = res.data
        if (code === 200) {
          this.giftInfo = data
        }
      })
    },
    toBonusdata () {
      jumpUrl({ url: '/activities/bonuspoolact.html' }, 'SDK')
    }
  }
}
</script>

<style lang="less" scoped>
.g-p-tips {
  font-size: 24px;
  line-height: 30px;
  color: #ffea02;
  font-weight: bold;
  p {
    a {
      color: #fff;
      white-space: nowrap;
      &.bonus1 {
        margin-left: 24px;
      }
    }
  }
}

@media screen and (orientation: portrait) {
  /*竖屏 css*/
  .g-p-tips {
    height: 60px;
  }
}
@media screen and (orientation: landscape) {
  /*横屏 css*/
  .g-p-tips {
    height: 30px;
    white-space: nowrap;
    &.no-show {
      height: 0;
    }
  }
}
</style>

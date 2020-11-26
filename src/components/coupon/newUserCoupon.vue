<template>
  <article class="new-user-coupon">
    <sdk-popup v-if="type" :isSDK="false" v-model="show" title="恭喜获得" :show-cancel="false"
      :center-scroll="true" confirm-text="朕收下了" @on-confirm="confirm">
      <div class="content-wrapper game-payment">
        小多赠送您{{couponShowList.length}}张优惠券，请笑纳
        <ul>
          <li v-for="(item,index) in couponShowList">
            {{index+1}}.{{item.title}}
          </li>
        </ul>
      </div>
    </sdk-popup>
    <Modal v-else v-model="show" title="恭喜获得" :type="1" :closeButtonShow=false :centerScroll=true
      saveText="我收下了" @on-save="confirm">
      <div class="content-wrapper">
        小多赠送您{{couponShowList.length}}张优惠券，请笑纳
        <ul>
          <li v-for="(item,index) in couponShowList">
            {{index+1}}.{{item.title}}
          </li>
        </ul>
      </div>
    </Modal>
  </article>
</template>

<script>
import Services from '@/services/payment.js'
import _get from 'lodash.get'
export default {
  name: '',
  components: {

  },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      show: false,
      couponShowList: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      const res = await Services.getNewUserCoupon()
      const code = _get(res, 'data.code', 0)
      if (code === 200) {
        this.show = true
        this.couponShowList = _get(res, 'data.data.couponShowList', [])
        if (this.type) {
          this.$marchSetsPoint("A_H5PT0058004438")// 游戏内-商城-游戏支付成功页-券包加赚弹窗加载完成
        } else {
          this.$marchSetsPoint("A_H5PT0023004434")// H5平台-商城-平台支付成功页-券包加赚弹窗加载完成
        }
      }
    },
    confirm () {
      this.show = false
    }
  }
}
</script>

<style lang="less" scoped>
.new-user-coupon {
  .content-wrapper {
    font-size: 24px;
    ul {
      margin-top: 10px;
      color: #ff7800;
      min-height: 40px;
      max-height: 120px;
      overflow-x: hidden;
      overflow-y: scroll;
    }
    &.game-payment {
      padding: 16px 50px;
      font-size: 22px;
      color: #fff;
      ul {
        color: #ff7069;
      }
    }
  }
}
</style>

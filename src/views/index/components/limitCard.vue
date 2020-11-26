<template>
  <div class="limit-card" v-if="showLimitCard">
    <div class="items">
      <div class="item" v-if="showLimitCard" @click="handleClick('hf')">
        <img :src="awardsImage | filter" alt="" v-if="awardsImage">
        <img src="../img/limit-card/limit-card.png" alt="" v-else>
      </div>
      <div class="item" @click="handleClick('jdk')">
        <img src="../img/limit-card/limit-card2.png" alt="">
      </div>
      <div class="item last" @click="handleClick('iphone')">
        <img src="../img/limit-card/limit-card1.png" alt="">
      </div>
    </div>
    <!-- 兑换弹框 -->
    <modal 
      v-model="exchangeModal.open"
      :title="exchangeModal.title" 
      :closeButtonShow="exchangeModal.closeButtonShow"
      :saveText="exchangeModal.saveText"
      @on-close="closedExchangeModal"
    > 
      <div class="exchange-modal">
        <div class="img">
          <img src="../img/limit-card/limit-tips.png" alt="">
        </div>
        <div class="name">
          仅需 <span>{{cardAwards}}</span>
        </div>
        <div class="tips" v-if="exchangeModal.showTips">
          您金叶子不足，可参与游戏赢取金叶子
        </div>
      </div>
      <wf-button slot="footer" :long=true @click="exchangeLimitCard" >{{exchangeModal.saveText}}</wf-button>
    </modal>
    <!-- 兑换成功弹框 -->
    <modal 
      v-model="exchangeStatus.open" 
      :title="exchangeStatus.title" 
      :type="exchangeStatus.type"
      :closeButtonShow="exchangeStatus.closeButtonShow"
      :saveText="exchangeStatus.saveText"
      :closeText="exchangeStatus.closeText"
      @on-save="goGet"
      @on-close="hideCheckStatusModal"
    >
      <div class="exchange-success-modal">
        <div class="img">
          <img src="../img/limit-card/exchange-success.png" alt="">
        </div>
        <div class="name">
          <p>换取成功</p>
          <p>快去领取吧</p>
        </div>
      </div>
    </modal>
  </div>
</template>
<script>
import {mapMutations, mapState} from 'vuex'
import Services from '@/services/index'
import _get from 'lodash.get'
import {newUtils, bottomBarJump} from '@/utils/utils'
export default {
  name: 'limitCard',
  data: () =>({
    showLimitCard: 0,
    counteTime: 0,
    payment: {},
    exchangeModal: {
      open: false,
      title: '兑换话费',
      saveText: '兑换',
      closeButtonShow: false,
      showTips: false,
    },
    exchangeStatus: {
      open: false,
      type: 2,
      title: '温馨提示',
      saveText: '去领取',
      closeText: '返回'
    }
  }),
  computed: {
    ...mapState(['userInfo']),
    cardAwards() {
      if(this.payment && this.payment.amount && this.payment.price) {
        return `${this.payment.amount}金叶子+${this.payment.price}元`
      }
      return ''
    },
    awardsImage() {
      if(this.payment && this.payment.awardsList && this.payment.awardsList[0] && this.payment.awardsList[0].awardsImage) {
        return this.payment.awardsList[0].awardsImage
      }
      return ''
      
    },
    isExchange() {
      return this.payment.amount > this.userInfo.amount
    }
  },
  methods: {
    ...mapMutations({'removeLimitCard': 'REMOVE_LIMIT_CARD'}),
    handleClick(url) {
      if(url === 'iphone') {
        this.$marchSetsPoint('A_H5PT0019001651', {
          task_id: '441',
          task_name: 'iPhone11'
        })
        bottomBarJump(`#/mall/details?accountBalance=4.4&phyAwardsType=9&phyAwardsId=510&name=iPhone11%20`,'productDetails',this.$router,{
            accountBalance: '4.4',
            phyAwardsType: 9,
            phyAwardsId: 510,
            name: 'iPhone11',
          })
      }
      if(url === 'jdk') {
        this.$marchSetsPoint('A_H5PT0019001650', {
          task_id: '90',
          task_name: '京东E卡'
        })
        bottomBarJump(`#/mall/details?accountBalance=0.8&phyAwardsType=4&phyAwardsId=90&name=京东E卡`,'productDetails',this.$router,{
            accountBalance: '0.8',
            phyAwardsType: 4,
            phyAwardsId: 90,
            name: '京东E卡',
          })
      }
      if(url === 'hf') {
        this.$marchSetsPoint('A_H5PT0019001649', {
          task_id: this.payment.bizId,
          task_name: this.payment.name
        })
        this.$marchSetsPoint('A_H5PT0019001652', {
          status: this.isExchange,
        })
        if(this.isExchange) {
          this.exchangeModal.showTips = true
          this.exchangeModal.saveText = '玩游戏赚金叶子'
        }else {
          this.exchangeModal.showTips = false
          this.exchangeModal.saveText = '兑换'
        }
        this.exchangeModal.open = true
      }
    },
    /** 获取限时礼包 **/
    _getLimitCard() {
      Services.getLimitCard().then(res => {
        let {code, data, message} = _get(res, 'data', {})
        if(code === 200) {
          this.payment = _get(res, 'data.data.list', {})[0]
          this.counteTime = data.countDown
          /** 通知父级是否开启限时礼包活动 **/
          this.showLimitCard = _get(res, 'data.data.status', 0)
          this.$emit('callback', this.showLimitCard)
        }
      })
    },
    /** 去兑换 **/
    exchangeLimitCard() {
      /** 金叶子不够 **/
      if(this.isExchange) {
        this.$marchSetsPoint('A_H5PT0019001654')
        this.exchangeModal.open = false
      }else {
        this.$marchSetsPoint('A_H5PT0019001653')
        localStorage.setItem('payment', JSON.stringify(this.payment))
        bottomBarJump('#/payment/paymentlist','paymentList',this.$router)
      }
    },
    /** 关闭去兑换弹框 **/
    closedExchangeModal() {
      this.$marchSetsPoint('A_H5PT0019001655')
    },
    /** 展示兑换状态 **/
    checkLimitCardStatus() {
      let limitCardPayStatus = JSON.parse(localStorage.getItem('limitCardPayStatus'))
      if(limitCardPayStatus && limitCardPayStatus.type) {
        this.$marchSetsPoint('A_H5PT0019001656')
        this.exchangeStatus.open = true
        localStorage.removeItem('limitCardPayStatus')
      }
    },
    /** 去领取 **/
    goGet() {
      this.$marchSetsPoint('A_H5PT0019001657')
      bottomBarJump('#/my/prize','myPrize',this.$router)
    },
    /** 关闭 **/
    hideCheckStatusModal() {
      this.$marchSetsPoint('A_H5PT0019001659')
    }
  },
  created() {
    // this._getLimitCard()
    this.checkLimitCardStatus()
  }
}
</script>
<style scoped lang="less">
.limit-card {
  margin-top: 40px;
  padding: 0 24px;
  .items {
    overflow: hidden;
    .item {
      position: relative;
      float: left;
      margin-right: 24px;
      width: 204px;
      height: 110px;
      &.last {
        margin-right: 0;
      }
      img {
        vertical-align: top;
        width: 100%;
      }
      .icon1,.icon2,.icon3 {
        position: absolute;
        right: 0;
        top: 0;
        padding: 0 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 0 12px 0 12px;
        font-size: 20px;
        color: #fff;
      }
      .icon1 {
        background: #FF9A3B;
      }
      .icon2 {
        background: #FF9FB3;
      }
      .icon3 {
        background: #6AD3F2;
      }
    }
  }
  .exchange-modal {
    .img {
      margin: 0 auto 10px;
      width: 256px;
      height: 160px;
      img {
        width: 100%;
        vertical-align: top;
      }
    }
    .name {
      text-align: center;
      color: #BBBBBB;
      font-size: 20px;
      span {
        font-size: 24px;
        color: #888888;
      }
    }
    .tips {
      margin-top: 5px;
      text-align: center;
      color: #FF4141;
      font-size: 20px;
    }
  }
  .exchange-success-modal {
    .img {
      margin: 0 auto 10px;
      width: 294px;
      height: 166px;
      img {
        width: 100%;
        vertical-align: top;
      }
    }
    .name {
      text-align: center;
      color: #888888;
      font-size: 24px;
    }
  }
}
</style>
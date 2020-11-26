<template>
  <div class="goods-meg" v-if="showResetPay && list.resetPayType">
    <div class="title">商品详情</div>
    <div class="detail">
      {{list.content}}
      <!-- <div class="leaf">{{list.content.split('+')[0]}}</div>
      <div class="goods-list">
        <div class="icon">加赠</div>
        <template v-if="list.resetPayType == 101 || list.resetPayType == 106">
          <div class="item">
            {{list.content}}
          </div>
        </template>
        <template v-else>
          <div class="item" v-for="(item, index) in list.awardsList" :key="index">
            <span v-if="index != 0">+</span>{{item.awardsNum}}{{item.awardsName}}
          </div>
        </template>
      </div> -->
    </div>
  </div>
</template>
<script>
import Services from '@/services/payment'
import _get from 'lodash.get'
export default {
  name: 'resetPay',
  data: () => ({
    showResetPay: false,
    list: []
  }),
  methods: {
    _checkUserPayError() {
      Services.checkUserPayError().then(res=> {
        let {code, data, message} = _get(res, 'data')
        if(code == 200) {
          this.showResetPay = true
        }
      })
    }
  },
  created() {
    this._checkUserPayError()
    let payment = localStorage.getItem('payment')
    this.list = (payment && JSON.parse(payment))
  }
}
</script>
<style scoped lang="less">
  .goods-meg {
    margin: 0 0 30px;
    padding-top: 10px;
    .title {
      margin-bottom: 13px;
      font-size: 24px;
      color: #fff;
      font-weight: bold;
    }
    .detail {
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
      line-height: 60px;
      border-radius: 10px;
      font-size: 22px;
      color: #FFFFFF;
      background: #2B468D;
      .leaf {
      }
      .goods-list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .icon {
          margin-right: 10px;
          width: 50px;
          height: 28px;
          line-height: 28px;
          text-align: center;
          border-radius:6px;
          background: #FF7800;
          font-size: 20px;
          color: #fff;
        }
        .item {
          font-size: 20px;
          color: #888888;
        }

      }
    }
  }
</style>
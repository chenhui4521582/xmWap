<template>
  <div class="often-buy" v-if="buyData.length">
    <span class="often-buy-item">经常购买</span>
    <div class="often-buy-item">
      <div class="list-item" v-for="(item,index) in buyData" :key="index" @click="toPay(item,0)">
        <img :src="item.productIcon|filter" alt="" class="product-icon">
        <div class="product-name">{{item.name}}</div>
        <div class="product-btn">￥ {{item.price}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import Services from '@/services/payment'
  import _get from 'lodash.get'
  export default {
    name: 'oftenBuy',
    props:{
      buyData:{
        type:Array,
        default:()=>[]
      }
    },
    methods:{
      toPay (item, type) {
        this.$emit('toPay', item, type)
      }
    }
  }
</script>

<style scoped lang="less">
  .often-buy {
    width: 672px;
    height: 290px;
    background: rgba(255, 250, 212, 1);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
    border-radius: 16px;
    margin-bottom: 20px;
    padding: 10px 20px 23px;
    box-sizing: border-box;
    .often-buy-item {
      &:nth-child(1) {
        font-size: 32px;
        font-weight: bold;
        line-height: 48px;
        color: rgba(0, 0, 0, 1);
        position: relative;
        &:after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          margin: auto;
          bottom: 0;
          height: 0.2rem;
          background: #ffe41a;
        }
      }
      &:nth-child(2) {
        margin-top: 12px;
        display: flex;
        margin-right: 13px;
        .list-item {
          width: 148px;
          height: 200px;
          background: rgba(255, 255, 255, 1);
          border-radius: 10px;
          margin-right: 13px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          &:nth-child(4) {
            margin-right: 0;
          }
          .product-icon {
            width: 80px;
            height: 80px;
          }
          .product-name {
            font-size: 20px;
            font-weight: 500;
            line-height: 30px;
            color: rgba(0, 0, 0, 0.68);
            margin-bottom: 10px;
          }
          .product-btn {
            width: 110px;
            height: 42px;
            background: rgba(255, 65, 65, 1);
            border-radius: 10px;
            font-size: 24px;
            font-weight: 500;
            text-align: center;
            line-height: 42px;
            color: rgba(255, 255, 255, 1);
          }
        }
      }
    }
  }
</style>

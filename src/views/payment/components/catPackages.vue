<template>
  <div class="catPackages">
    <div class="title">
      <span class="line"></span>
      <span class="name">招财猫礼包</span>
    </div>
    <ul>
      <li v-for="(item, index) in catPackages" :key="index" :class="{ active: index % 3 === 2 }"
        @click="toPay(item, 0)">
        <div class="tips" v-if="item.dailyLimitPerUser != null">
          <img src="../img/pay1.png" alt=""
            v-if="item.dailyLimitPerUser > item.singlePurchasedTimes" />
          <img src="../img/pay2.png" alt="" v-else />
        </div>
        <p class="amount">
          <img src="../img/leaf-icon.png" alt="" />
          {{ item.amount }}
        </p>
        <div class="img">
          <img :src="item.icon | filter" alt="" />
        </div>
        <div class="name">
          {{item.name}}({{item.awardsList&&item.awardsList[0]&&item.awardsList[0].awardsNum}}天)
        </div>
        <div class="params">{{item.awardsList&&item.awardsList[0]&&item.awardsList[0].params}}</div>
        <div class="price">
          <span class="code">￥</span>
          <span>{{ item.price || '' }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Services from '@/services/payment'
import _get from 'lodash.get'

export default {
  name: 'catPackages',
  data () {
    return {
      catPackages: []
    }
  },
  methods: {
    getData () {
      Services.getCatPropList().then(res => {
        this.catPackages = _get(res, 'data.data.catPropList', [])
      })
    },
    toPay (item, type) {
      this.$emit('toPay', item, type)
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped lang="less">
.catPackages {
  margin-top: 50px;
  display: flex;
  flex-wrap: wrap;
  .title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 40px;
    text-align: center;
    .line {
      margin-right: 10px;
      width: 6px;
      height: 32px;
      background: #ff7800;
      border-radius: 20px;
    }
    .name {
      font-size: 32px;
      color: #252525;
      font-weight: bold;
      line-height: 1.1;
    }
  }
  /*.catPackages-item{*/
  /*width:216px;*/
  /*height:340px;*/
  /*background:rgba(255,255,255,1);*/
  /*box-shadow:0px 3px 6px rgba(0,0,0,0.08);*/
  /*border-radius:16px;*/
  /*}*/
  ul {
    margin-top: 14px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    li {
      position: relative;
      margin-right: 12px;
      margin-bottom: 15px;
      width: 216px;
      text-align: center;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
      .amount {
        margin-top: 18px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          margin-right: 5px;
          vertical-align: top;
          width: 30px;
          height: 30px;
        }
      }
      .img {
        margin: 14px 0;
        height: 106px;
        img {
          vertical-align: top;
          height: 100%;
        }
      }
      .price {
        margin: 0 auto 20px;
        width: 110px;
        height: 42px;
        background: rgba(255, 65, 65, 1);
        border-radius: 10px;
        font-size: 24px;
        font-weight: 500;
        text-align: center;
        line-height: 42px;
        color: rgba(255, 255, 255, 1);
        .code {
          margin-top: 3px;
          font-size: 20px;
        }
      }
      .name {
        font-size: 24px;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
        margin-bottom: 3px;
      }
      .params {
        font-size: 20px;
        font-weight: 500;
        color: rgba(255, 120, 0, 1);
        margin-bottom: 15px;
      }
      .tips {
        position: absolute;
        top: -6px;
        left: -6px;
        width: 98px;
        height: 98px;
        img {
          vertical-align: top;
          width: 100%;
          height: 100%;
        }
      }
      &.active {
        margin-right: 0;
      }
    }
  }
}
</style>

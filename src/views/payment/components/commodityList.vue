<template>
  <div class="commodity-list" v-if="mallList.length">
    <div class="title">
      <span class="line"></span>
      <span class="name">热门单品</span>
      <span class="sub-title" v-if="isTestVersion">限时升级</span>
    </div>
    <ul>
      <li v-for="(item, index) in mallList" :key="index" :class="{ active: index % 3 === 2 }"
        @click="toPay(item, 4)">
        <div class="tips" v-if="item.dailyLimitPerUser">
          <img src="../img/pay1.png" alt="" v-if="item.buyFlag" />
          <img src="../img/pay2.png" alt="" v-else />
        </div>
        <p class="amount">
          <img src="../img/leaf-icon.png" alt="" />
          {{ item.amount }}
        </p>
        <p class="add-award" v-if="isTestVersion">
          <span v-if="item.awardsList&&item.awardsList.length&&item.awardsList[0].awardsNum">
            {{item.awardsList|awardFilter}}
          </span>
        </p>
        <div class="img">
          <img :src="item.icon | filter" alt="" />
          <img class="img-tips" :src="item.awardsList|awardImgFilter|filter" alt=""
            v-if="isTestVersion&&item.awardsList&&item.awardsList[0]&&item.awardsList[0].awardsImage">
        </div>
        <div class="price">
          <span class="code">￥</span>
          <span>{{ item.price || '' }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'commodityList',
  props: {
    mallList: {
      type: Array,
      default: () => []
    },
    isTestVersion: {
      type: Boolean,
      default: false
    }
  },
  filters: {
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
  methods: {
    toPay (item, type) {
      this.$emit('toPay', item, type)
    }
  },
}
</script>

<style scoped lang="less">
.commodity-list {
  margin-top: 35px !important;
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
    .sub-title {
      font-size: 24px;
      color: #ff4141;
      margin-left: 10px;
      display: inline-block;
    }
  }
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
      .add-award {
        color: #888;
        font-size: 20px;
        height: 34px;
        line-height: 34px;
      }
      .img {
        margin: 15px auto 17px;
        height: 106px;
        position: relative;
        img {
          vertical-align: top;
          height: 100%;
        }
        .img-tips {
          width: 70px;
          height: 28px;
          position: absolute;
          transform: translate3d(0, 0, 0);
          top: -10px;
          right: 20px;
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

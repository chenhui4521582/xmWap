<template>
  <div class="preferencenew">
    <div class="preference-item">
      <div class="item">
        <span class="preference-title">充值回馈</span>
      </div>
      <div class="item" @click="toPay(preferenceList, 2,true,null)" style="margin-right:0.33333rem">
        ￥{{ preferenceList.price || '' }}
      </div>
    </div>
    <div class="preference-item">
      <template v-for="(item,index) in preferenceAwardsList">
        <div class="preferenceAwardsList-item" :key="index"
          @click="toPay(preferenceList, 2,false,item)" v-if="item">
          <img :src="item.awardsImage|filter" alt="" class="product-icon" v-if="item.awardsType">
          <img :src="item.awardsImage" alt="" class="product-icon" v-else>
          <div class="product-name">{{getDesc(item).name}}</div>
          <div class="product-desc">x{{getDesc(item).desc}}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'preference',
  props: {
    //:gameGift="gameGift" :preferenceList="preferenceList"
    gameGift: {
      type: Array,
      default: () => ([])
    },
    preferenceList: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {}
  },
  computed: {
    preferenceAwardsList () {
      if (this.gameGift.length > 1) {
        let giftitem = {
          awardsName: '游戏礼包',
          awardsImage: `${require('../img/gamegift.png')}`,
          awardsNum: 1,
          awardsType: 0,
          phyAwardsId: 0,
          remark: '',
          params: null
        }
        let arr = this.preferenceList.awardsList.filter(item => ![20, 21, 40, 41, 6, 49].includes(item.awardsType)).sort((a, b) => a.awardsType + '' - b.awardsType + '')
        arr.splice(2, 0, giftitem)
        return [arr[0], arr[3], arr[2], arr[1]]
      } else {
        let arr = this.preferenceList.awardsList
        return [arr[0], arr[3], arr[1], arr[2]]
      }
    }
  },
  methods: {
    toPay (item, type, isBtn, awardItem) {
      if (isBtn || awardItem.awardsType) {
        this.$emit('toPay', item, type)
      } else {
        this.$emit('openPop', 'gift')
      }
    },
    getDesc (item) {
      //金叶子 awardsType: 1
      //话费券 awardsType: 10
      //欢乐套圈 awardsType: 6
      //VIP转盘 awardsType: 7
      const descData = {
        0: {
          name: '游戏礼包',
          unit: '1个'
        },
        1: {
          name: '金叶子',
          unit: ''
        },
        6: {
          name: '欢乐套圈',
          unit: '次'
        },
        7: {
          name: 'VIP转盘',
          unit: '30天'
        },
        10: {
          name: '话费券',
          unit: '元'
        }
      }
      return {
        name: descData[item.awardsType] && descData[item.awardsType].name || item.awardsName,
        desc: [0, 7].includes(item.awardsType) ? descData[item.awardsType].unit : (item.awardsType == 10 ? (item.awardsNum * 0.1) : item.awardsNum) + (descData[item.awardsType] && descData[item.awardsType].unit || '')
      }
    }
  }
}
</script>

<style scoped lang="less">
.preferencenew {
  position: relative;
  overflow: hidden;
  margin-top: 20px;
  height: 310px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .preference-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &:nth-child(1) {
      .item {
        &:nth-child(1) {
          .preference-title {
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
          .preference-info {
            margin-left: 16px;
            font-size: 24px;
            font-weight: 400;
            color: rgba(136, 136, 136, 1);
          }
        }
        &:nth-child(2) {
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
    &:nth-child(2) {
      margin-top: 15px;
      .preferenceAwardsList-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 148px;
        height: 200px;
        background: rgba(247, 247, 247, 1);
        border-radius: 10px;
        margin-right: 13px;
        .product-icon {
          height: 100px;
        }
        .product-name {
          margin-top: 3px;
          font-size: 24px;
          font-weight: bold;
          color: rgba(0, 0, 0, 1);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
          text-align: center;
        }
        .product-desc {
          font-size: 24px;
          font-weight: 400;
          color: rgba(0, 0, 0, 1);
        }
        &:nth-child(4) {
          margin-right: 0;
        }
        &.gt1 {
          position: relative;
          &:after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 50px;
            height: 30px;
            background: url('../img/index/billplus.png');
            background-size: 100% 100%;
            opacity: 1;
            border-radius: 2px 10px 2px 8px;
            font-size: 20px;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            z-index: 1;
          }
        }
      }
    }
  }
}
</style>

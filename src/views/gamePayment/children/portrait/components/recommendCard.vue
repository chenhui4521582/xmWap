<template>
  <section class="recommend-card border-bottom" v-if="recommendCard.length">
    <p class="title">推荐单品</p>
    <p class="btc-title" @click="goMore">更多<i class="iconfont icon-next"></i></p>
    <div class="items">
      <div class="left-wrapper">
        <template v-for="(item, index) in recommendCard">
          <div class="item" :key="index" @click="toPay(item, 5)" v-if="index<1">
            <div class="icon">
              <img :src="item.icon | httpImg" alt="" />
              <img class="img-tips left" :src="item.awardsList|awardImgFilter|filter" alt=""
                   v-if="item.awardsList&&item.awardsList[0]&&item.awardsList[0].awardsImage">
            </div>
            <div class="content">
             <div class="info"><img src="../images/leaf.png" alt="">{{ item.amount}}</div>
              <p class="add-award">
                <span v-if="item.awardsList&&item.awardsList.length&&item.awardsList[0].awardsNum">
                  {{item.awardsList|awardFilter}}
                </span>
              </p>
            </div>
            <div class="btn">
              ￥{{item.price}}
            </div>
          </div>
        </template>
      </div>
      <div class="right-wrapper">
        <template v-for="(item, index) in recommendCard">
          <div class="item" @click="toPay(item, 5)" :key="index" v-if="index>0">
            <div class="icon right">
              <img :src="item.icon | httpImg" alt="" />
              <img class="img-tips" :src="item.awardsList|awardImgFilter|filter" alt=""
                   v-if="item.awardsList&&item.awardsList[0]&&item.awardsList[0].awardsImage">
            </div>
            <div class="content">
              <div class="info"><img src="../images/leaf.png" alt="">{{ item.amount}}</div>
              <p class="add-award">
                <span v-if="item.awardsList&&item.awardsList.length&&item.awardsList[0].awardsNum">
                  {{item.awardsList|awardFilter}}
                </span>
              </p>
            </div>
            <div class="btn">
              ￥{{item.price}}
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script>
  import Services from '@/services/payment'
  import _get from 'lodash.get'

  export default {
    name: 'recommendCard',
    data() {
      return {
        recommendCard: []
      }
    },
    filters: {
      split(item, type, num) {
        return item.split(type)[num]
      },
      httpImg(item) {
        let img = item.split(';')[0]
        if (img && !img.includes('http')) {
          return process.env.VUE_APP_FILE_HOST + img
        } else {
          return img
        }
      },
      awardFilter(list) {
        let info = list[0]
        if (info.awardsNum >= 10000) {
          return `赠${Math.floor(info.awardsNum / 1000) / 10}万金叶`
        }
        return `赠${info.awardsNum || 0}金叶`
      },
      awardImgFilter(list) {
        let info = list[0]
        return info.awardsImage
      }
    },
    methods: {
      toPay(item, type) {
        this.$emit('toPay', item, type)
      },
      getData() {
        Services.getRecommendPackageList().then(res => {
          this.recommendCard = _get(res, 'data.data.mallBizConfigs', [])
        })
      },
      goMore() {
        this.$emit('goMore')
      }
    },
    mounted() {
      this.getData()
    }
  }
</script>

<style scoped lang="less">
  .bg-center(@url) {
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url(@url);
  }

  .btn {
    margin: 0 auto;
    width: 110px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    .bg-center('../images/buy-btn.png');
  }

  .recommend-card {
    position: relative;
    overflow: hidden;
    padding: 20px 0;
    color: #9f752a;
    font-weight: bold;
    font-size: 26px;
    .title {
      margin-bottom: 10px;
      height: 30px;
      line-height: 30px;
    }
    .btc-title {
      position: absolute;
      right: 0;
      top: 20px;
      height: 30px;
      line-height: 30px;
      font-size: 22px;
      font-weight: bold;
    }
    .items {
      display: flex;
      align-items: center;
      .item {
        padding: 14px 0;
        .icon {
          width: 100px;
          min-height: 90px;
          margin: auto;
          position: relative;
          display: flex;
          align-items: center;
          &:not(.right){
            justify-content: center;
          }
          img {
            height: 74px;
          }
          .img-tips {
            width: 70px;
            height: 28px;
            position: absolute;
            transform: translate3d(0, 0, 0);
            top: 0;
            right: 0;
            &.left{
              right: -20px;
            }
          }
        }
        .content {
          font-size: 20px;
          line-height: 26px;
          font-weight:bold;
          color:rgba(0,0,0,1);
          img{
            width: 30px;
          }
          .info{
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
        .add-award {
          font-size: 20px;
          text-align: center;
          color: #9f752a;
          white-space: nowrap;
          font-weight: 400;
          height: 34px;
          line-height: 34px;
        }
      }
      .left-wrapper {
        width: 200px;
        text-align: center;
        .give-detail {
          justify-content: center;
        }
        .btn {
          margin-top: 10px;
        }
      }
      .right-wrapper {
        flex: 1;
        border-left: 2px solid #ffd78f;
        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          &:first-child {
            border-bottom: 2px solid #ffd78f;
          }
        }
      }
    }
  }
</style>

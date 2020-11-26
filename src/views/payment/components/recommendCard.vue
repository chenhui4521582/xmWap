<template>
  <div class="recommendCard" v-if="recommendCard.length">
    <span class="host-card-title">推荐单品</span>
    <span class="host-card-title1" @click="goMore">
      更多<i class="iconfont icon-next"></i>
    </span>
    <ul>
      <li v-for="(item, index) in recommendCard" :key="index" @click="toPay(item, 5)">
        <div class="img">
          <img :src="item.icon | filter" alt="" />
          <img class="img-tips" :src="item.awardsList|awardImgFilter|filter" alt=""
               v-if="item.awardsList&&item.awardsList[0]&&item.awardsList[0].awardsImage">
        </div>
        <div class="desc">
          <p class="amount">
            <img src="../img/leaf-icon.png" alt=""/>
            {{ item.amount }}
          </p>
          <p class="add-award">
            <span v-if="item.awardsList&&item.awardsList.length&&item.awardsList[0].awardsNum">
              {{item.awardsList|awardFilter}}
            </span>
          </p>
          <div class="btn">
            <span class="code">￥</span>
            <span>{{ item.price }}</span>
          </div>
        </div>
        <div class="line"></div>
      </li>
    </ul>
  </div>
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
  .recommendCard {
    margin-top: 20px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
    background: #fff;
    border-radius: 16px;
    height: 404px;
    position: relative;
    .host-card-title {
      position: absolute;
      top: 16px;
      left: 20px;
      font-size: 32px;
      font-weight: bold;
      line-height: 48px;
      color: rgba(0, 0, 0, 1);
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
    .host-card-title1 {
      position: absolute;
      top: 16px;
      right: 20px;
      font-size: 24px;
      line-height: 48px;
      color: rgba(136, 136, 136, 1);
    }
    ul {
      li {
        position: absolute;
        border-radius: 16px;
        .btn {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 110px;
          height: 42px;
          background: rgba(255, 65, 65, 1);
          font-size: 24px;
          font-weight: 500;
          border-radius: 10px;
          color: rgba(255, 255, 255, 1);
          margin: 14px auto 0;
          span {
            line-height: 1;
          }
          .code {
            margin-top: 3px;
            font-size: 20px;
          }
        }
        .amount {
          margin: 0;
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
          text-align: center;
        }
        .img {
          margin: 15px auto 17px;
          height: 106px;
          position: absolute;
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
            right: -50px;
          }
        }
        &:nth-child(1) {
          left: 46px;
          top: 80px;
          padding-right: 40px;
          width: 227px;
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
            text-align: center;
          }
          .img {
            margin: 15px auto 17px;
            height: 106px;
            position: relative;
            display: flex;
            justify-content: center;
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
          .line {
            position: absolute;
            right: 0;
            top: 26px;
            width: 2px;
            height: 273px;
            background: #eee;
          }
          .btn{
            margin: 17px auto 0;
          }
        }
        &:nth-child(2) {
          left: 302px;
          top: 79px;
          width: 380px;
          height: 150px;
          .desc {
            position: absolute;
            left: 156px;
            top: 0;
          }
          .amount {
            margin:0;
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
          .line {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 348px;
            height: 2px;
            background: #eee;
          }
        }
        &:nth-child(3) {
          left: 302px;
          top: 234px;
          width: 380px;
          height: 150px;
          .desc {
            position: absolute;
            left: 156px;
            top: 20px;
          }
        }
      }
    }
  }
</style>

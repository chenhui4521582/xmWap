<template>
  <div class="hotCard" v-if="hotCard.length">
    <span class="host-card-title">超值礼包</span>
    <span class="host-card-title1" v-if="showBtc" @click="goBtc">
      超值礼包有折扣了<i class="iconfont icon-next"></i>
    </span>
    <ul>
      <li v-for="(item, index) in hotCard" :key="index" @click="toPay(item, 1)">
        <div class="icon">
          <i v-if="item.discount" class="discount">{{item.discount}}折</i>
          <img :src="item.productIcon | httpImg" alt="" />
        </div>
        <div class="desc">
          <p class="name">
            {{ item.content | split('+', 0) }}
          </p>
          <p class="presented">
            <span class="give-icon">赠</span>
            {{ item.content | split('+', 1) }}
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
  name: 'hotCard',
  data () {
    return {
      hotCard: [],
      showBtc: false
    }
  },
  filters: {
    split (item, type, num) {
      return item.split(type)[num]
    },
    httpImg (item) {
      let img = item.split(';')[0]
      if (img && !img.includes('http')) {
        return process.env.VUE_APP_FILE_HOST + img
      } else {
        return img
      }
    }
  },
  methods: {
    toPay (item, type) {
      this.$emit('toPay', item, type)
    },
    getData () {
      Services.getGreatPackageList().then(res => {
        this.hotCard = _get(res, 'data.data', [])
      })
    },
    goBtc () {
      this.$marchSetsPoint('A_H5PT0023003897')
      window.location.href = `https://wap.beeplaying.com/activities/valuepackages.html`
    },
    _getBtcActive () {
      Services.getBtcActive().then(res => {
        const { code, data, message } = _get(res, 'data')
        if (code == 200) {
          if (data.state == 1) {
            this.showBtc = true
          }
        }
      })
    }
  },
  mounted () {
    this.getData()
    this._getBtcActive()
  }
}
</script>

<style scoped lang="less">
.hotCard {
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
    color: #ff4141;
  }
  ul {
    li {
      position: absolute;
      border-radius: 16px;

      .icon {
        position: relative;
        .discount {
          position: absolute;
          top: 10px;
          right: -15px;
          width: 60px;
          height: 30px;
          text-align: center;
          font-size: 20px;
          text-align: center;
          color: #fff;
          background: rgba(255, 120, 0, 1);
          border-radius: 6px;
        }
      }

      .name {
        line-height: 1;
        font-size: 28px;
        color: #333;
        font-weight: bold;
      }
      .presented {
        font-size: 24px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: #acacac;
        .give-icon {
          margin-right: 6px;
          width: 30px;
          height: 30px;
          background: #32c9fe;
          color: #fff;
          font-size: 18px;
          font-weight: bold;
          line-height: 30px;
          text-align: center;
          border-radius: 50%;
        }
      }
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
        margin: 20px auto 0;
        span {
          line-height: 1;
        }
        .code {
          margin-top: 3px;
          font-size: 20px;
        }
      }
      &:nth-child(1) {
        left: 46px;
        top: 70px;
        padding-right: 40px;
        width: 227px;
        .icon {
          margin-bottom: 8px;
          width: 160px;
          height: 160px;
          img {
            vertical-align: top;
            width: 100%;
            height: 100%;
          }
        }
        .desc {
          margin-bottom: 20px;
          .name {
            margin-bottom: 6px;
            text-align: center;
          }
          .presented {
            white-space: nowrap;
            text-align: center;
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
      }
      &:nth-child(2) {
        left: 302px;
        top: 79px;
        /*padding: 0 0 14px 45px;*/
        width: 380px;
        height: 150px;
        .desc {
          position: absolute;
          left: 156px;
          top: 0;
        }
        .name {
          margin-bottom: 6px;
        }
        .presented {
          text-align: left;
          .give-icon {
            background: #5186ca;
          }
        }
        .icon {
          width: 120px;
          height: 120px;
          position: absolute;
          img {
            vertical-align: top;
            width: 100%;
            height: 100%;
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
        /*padding: 20px 0 0 45px;*/
        width: 380px;
        height: 150px;
        .desc {
          position: absolute;
          left: 156px;
          top: 20px;
        }
        .name {
          margin-bottom: 6px;
        }
        .presented {
          text-align: left;
          .give-icon {
            background: #f126d4;
          }
        }
        .icon {
          width: 120px;
          height: 120px;
          position: absolute;
          top: 15px;
          img {
            vertical-align: top;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>

<template>
  <div class="inexpensive-card">
    <!-- 首页弹框 -->
    <div class="in-index" v-if="showType == 1">
      <div class="mask"></div>
      <div class="body">
        <div class="bg1"></div>
        <div class="bg2"></div>
        <!-- 倒计时 -->
        <CountDonw :time="time" @coundownOver="coundownOver"/>
        <!-- 奖品 -->
        <div class="award-list">
          <div class="award-info" v-for="(item, index) in awardList " :key="index">
            <div class="awrad-img">
              <img :src="item.awardsImage | filter" alt="">  
            </div>
            <p v-if="item.awardsType == 1">{{item.awardsNum}}{{item.awardsName}}</p>
            <p v-else-if="item.awardsType == 20">{{item.awardsName}}*{{item.awardsNum}}</p>
            <p v-else>{{item.awardsName}}</p>
          </div>  
        </div>
        <!-- 购买按钮 -->
        <div class="btn" @click="topay(1)">
          <div class="price">特价{{inexpensiveCardInfo.price}}元</div>
          <div class="origin-price">原价{{inexpensiveCardInfo.originPrice}}元</div>
        </div>
        <div class="close" @click="hide"></div>
      </div>
    </div>
    <!-- 话费券商城 -->
    <div class="in-payment" v-if="showType == 2">
      <!-- 倒计时 -->
      <CountDonw :time="time" class="countdown" @coundownOver="coundownOver"/>
      <div class="award-list">
        <div class="award-info" v-for="(item, index) in awardList " :key="index">
          <div class="awrad-img">
            <img :src="item.awardsImage | filter" alt="">  
          </div>
          <p v-if="item.awardsType == 1">{{item.awardsNum}}{{item.awardsName}}</p>
          <p v-else-if="item.awardsType == 20">{{item.awardsName}}*{{item.awardsNum}}</p>
          <p v-else>{{item.awardsName}}</p>
        </div>  
      </div>
      <div class="btn" @click="topay(2)">
        <div class="price">特价{{inexpensiveCardInfo.price}}元</div>
        <div class="origin-price">原价{{inexpensiveCardInfo.originPrice}}元</div>
      </div>
    </div>
  </div>
</template>
<script>
import CountDonw from './components/countdown'
import AwardInfo from './components/awardInfo'
import Services from '@/services/index'
import _get from 'lodash.get'
export default {
  name: "inexpensiveCard",
  data: () => ({
    showType: null,
    time: 0,
    awardList: [],
    inexpensiveCardInfo: {}
  }),
  components: {
    CountDonw,
    AwardInfo
  },
  methods: {
    hide () {
      this.showType = null
      this.$parent.initDialog()
      this.$marchSetsPoint('A_H5PT0019004340')
    },
    topay (staus) {
      localStorage.setItem('payment', JSON.stringify(this.inexpensiveCardInfo))
      localStorage.removeItem('originDeffer')
      this.$router.replace({ name: 'paymentList' })
      if(staus == 1) {
        this.$marchSetsPoint('A_H5PT0019004341', {
          product_price: this.inexpensiveCardInfo.price,
          product_id: this.inexpensiveCardInfo.bizId,
          product_name: this.inexpensiveCardInfo.name
        })
      }
      if(staus == 2) {
        this.$marchSetsPoint('A_H5PT0023004342', {
          product_price: this.inexpensiveCardInfo.price,
          product_id: this.inexpensiveCardInfo.bizId,
          product_name: this.inexpensiveCardInfo.name
        })
      }
    },
    _getInexpensiveCard (callback) {
      Services.getInexpensiveCard().then(res => {
        const { code, data } = _get(res, 'data')
        if(code == 200) {
          if(data) {
            this.inexpensiveCardInfo = _get(res, 'data.data.welfare', {})
            this.awardList = _get(res, 'data.data.welfare.awardsList', [])  
            this.time = _get(res, 'data.data.leftTime', 0)
            const { name } = this.$route
            if(name == 'index') {
              let endTime = this.endTime()
              let cacheTime = localStorage.getItem('inexpensiveTime')
              this.$marchSetsPoint('A_H5PT0019004339')
              /** 假如缓存时间小于当前时间, 打开弹框更新缓存**/
              if (cacheTime) {
                if(endTime != cacheTime){
                  localStorage.setItem('inexpensiveTime', endTime)
                  this.showType = 1
                  callback && callback({isShow: true})
                }else {
                  callback && callback({isShow: false})
                }
              } else {
                localStorage.setItem('inexpensiveTime', endTime)
                this.showType = 1
                callback && callback({isShow: true})
              }
            }
            if(name == 'payment') {
              this.showType = 2
            }
          }else {
            callback && callback({isShow: false})
          }
        }
      })
    },
    endTime () {
      let date = new Date()
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      let d = date.getDate()
      return new Date(`${y}/${m}/${d}`).getTime()
    },
    coundownOver () {
      this.showType = null
    },
    init (callback) {
      this._getInexpensiveCard(callback)
    }
  }
}
</script>
<style lang="less" scoped>
  .in-payment {
    position: relative;
    height: 188px;
    background: url(./img/payment-bg.png) no-repeat center top;
    background-size: 100% 100%;
    .countdown {
      position: absolute;
      right: 0;
      top: 19px;
      width: 178px;
      height: 33px;
      text-align: center;
    }
    .award-list {
      position: absolute;
      left: 80px;
      top: 70px;
      display: flex;
      justify-content: center;
      .award-info {
        width: 130px;
        .awrad-img {
          margin: 0 auto;
          width: 73px;
          height: 73px;
          background: url(./img/item-bg.png) no-repeat center top;
          background-size: 100% 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            max-width: 50px;
            max-height: 50px;
          }
        }
        p {
          white-space: nowrap;
          font-size: 22px;
          font-weight: bold;
          color: #4030A1;
          text-align: center;
        }
      }
    }
    .btn {
      position: absolute;
      right: 14px;
      top: 72px;
      width: 198px;
      height: 73px;
      background: url(./img/buy-btn.png) no-repeat center top;
      background-size: 100% 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .price {  
        font-size: 24px;
        color: #FFFEEC;
        font-weight: bold;
        text-align: center;
        line-height: 1.1;
      }
      .origin-price {
        font-size: 20px;
        color: #BD6F34;
        text-align: center;
        line-height: 1.1;
        text-decoration:line-through
      }
    }
  }
  .in-index {
    position: fixed;
    z-index: 11;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    .mask {
      position: absolute;
      z-index: 1;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(0,0,0,.6);
    }
    .body {
      position: absolute;
      z-index: 2;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 668px;
      height: 551px;
      .bg1 {
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 3;
        width: 637px;
        height: 513px;
        background: url(./img/popup-bg1.png) no-repeat center bottom;
        background-size: 100% 100%;
      }
      .bg2 {
        position: absolute;
        right: 0;
        bottom: -20px;
        z-index: 1;
        width: 562px;
        height: 551px;
        background: url(./img/popup-bg2.png) no-repeat center top;
        background-size: 100% 100%;
      }
      .countdown {
        position: absolute;
        right: 44px;
        bottom: 102px;
        z-index: 5;
        width: 178px;
        height: 65px;
        text-align: center;
        line-height: 50px;
        background: url(./img/count-down.png) no-repeat center top;
        background-size: 100% 100%;
      }
      .award-list {
        position: absolute;
        left: 170px;
        top: 230px;
        z-index: 2;
        display: flex;
        justify-content: center;
        .award-info {
          width: 130px;
          .awrad-img {
            margin: 0 auto;
            width: 110px;
            height: 110px;
            background: url(./img/item-bg.png) no-repeat center top;
            background-size: 100% 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              max-width: 70px;
              max-height: 70px;
            }
          }
          p {
            white-space: nowrap;
            font-size: 22px;
            font-weight: bold;
            color: #4030A1;
            text-align: center;
          }
        }
      }
      .btn {
        position: absolute;
        right: 162px;
        bottom: 40px;
        z-index: 4;
        width: 262px;
        height: 93px;
        background: url(./img/buy-btn.png) no-repeat center top;
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .price {  
          margin-bottom: 5px;
          font-size: 30px;
          color: #FFFEEC;
          font-weight: bold;
          text-align: center;
          line-height: 1.1;
        }
        .origin-price {
          font-size: 20px;
          color: #BD6F34;
          text-align: center;
          line-height: 1.1;
          text-decoration:line-through
        }
      }
      .close {
        position: absolute;
        left: 50%;
        bottom: -80px;
        transform: translate(-50%, -50%);
        width: 60px;
        height: 60px;
        background: url(./img/close-btn.png) no-repeat center top;
        background-size: 100% 100%;
      }
    }
  }
</style>
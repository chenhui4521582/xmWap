<template>
  <div class="wrap">
    <template v-if="isBroswer">
      <div class="pop-mask"></div>
      <div class="content-wrap">
        <p>请确认支付结果</p>
        <p>
          <span @click="close">完成支付</span>
          <span @click="gotoPay">重新支付</span>
        </p>
      </div>
    </template>
    <template v-else>
      <div class="backToApp">
        <img src="../img/success_icon1.png" alt="">
        <h1>
          查询支付状态
        </h1>
        <p>
          请返回<span>{{appName}}</span>查看支付结果
        </p>
        <div v-if="appName==='好看视频'||appName==='全民小视频'||appName==='懂球帝'" @click="backHome">
          返回<span>{{appName}}</span>查看</div>
      </div>
    </template>
  </div>
</template>

<script>
import { getUrlParams, newUtils, specialChannelJump } from '@/utils/utils'
export default {
  name: 'wechatMiddle',
  computed: {
    appName () {
      if (getUrlParams('appName')) {
        return decodeURI(getUrlParams('appName'))
      } else {
        return 'APP'
      }
    },
    isBroswer () {
      let ACCESS_TOKEN = localStorage.getItem('ACCESS_TOKEN')
      if (!ACCESS_TOKEN) {
        return false
      }
      return true
    }
  },
  methods: {
    _jump (url) {
      localStorage.removeItem('wechatPayStatus')
      let originUrl = localStorage.getItem('originDeffer')
      let originGame = localStorage.getItem('originGame')
      if (originUrl && originUrl.includes('blindBox')) {
        this.$router.replace({ name: url })
        return
      }
      localStorage.removeItem('originDeffer')
      /** 游戏内支付,直接返回游戏 **/
      if (originUrl && originUrl.includes('time')) {
        specialChannelJump(originUrl)
      } else {
        this.$router.replace({ name: url })
      }
    },
    gotoPay () {
      this._jump('paymentList')
    },
    close () {
      this._jump('paymentCallback')
    },
    init () {
      let wechatPayStatus = localStorage.getItem('wechatPayStatus')
      let { url } = this.$route.query
      if (!wechatPayStatus && url) {
        localStorage.setItem('wechatPayStatus', 'true')
        specialChannelJump(url)
      }
    },
    backHome () {
      let url = 'https://wap.beeplaying.com/xmWap/#/payment/paymentcallback'
      if (localStorage.originDeffer) {
        url = localStorage.originDeffer
      }
      switch (this.appName) {
        case '好看视频':
          location.href = 'baiduhaokan://'
          break
        case '全民小视频':
          location.href = 'bdminivideo://'
          break
        case '懂球帝':
          location.href = 'dongqiudi://'
          break
        default:
          break
      }
    }
  },
  mounted () {
    this.init()
  },
  beforeDestroy () {
    localStorage.removeItem('wechatPayStatus')
  }
}
</script>

<style scoped lang="less">
.pop-mask {
  position: fixed;
  z-index: 12;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
}
.content-wrap {
  z-index: 13;
  width: 80%;
  text-align: center;
  position: absolute;
  top: 400px;
  left: 50%;
  transform: translate(-50%, 0);
  background: #fff;
  border-radius: 20px;
  p {
    margin: 40px;
    font-size: 25px;
    color: #000;
    &:last-child {
      margin: 0;
      display: flex;
      display: -webkit-flex;
      font-size: 30px;
      border-top: 1px solid #ddd;
      span {
        flex: 1;
        display: inline-block;
        text-align: center;
        line-height: 90px;
        &:first-child {
          color: #666;
          &:after {
            content: '';
            float: right;
            height: 90px;
            border-right: 1px solid #ddd;
          }
        }
        &:last-child {
          color: #5f73c5;
        }
      }
    }
  }
}
.backToApp {
  text-align: center;
  letter-spacing: 1px;
  img {
    width: 150px;
    height: 150px;
    margin-top: 300px;
  }
  h1 {
    font-size: 28px;
    margin: 50px auto 22px;
    color: #252525;
  }
  p {
    font-size: 24px;
    color: #888;
    span {
      color: #ff4141;
    }
  }
  div {
    margin: 60px auto;
    color: #252525;
    font-weight: bold;
    font-size: 22px;
    height: 60px;
    width: 300px;
    box-sizing: border-box;
    line-height: 58px;
    border-radius: 30px;
    border: 1px solid #252525;
    span {
      color: #ff0000;
    }
  }
}

@media screen and (orientation: portrait) {
  /*竖屏 css*/
  .content-wrap {
    top: 400px;
  }
}
@media screen and (orientation: landscape) {
  /*横屏 css*/
  .content-wrap {
    top: 72px;
  }
}
</style>

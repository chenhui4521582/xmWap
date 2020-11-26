<template>
  <div class="scanpay">
    <div class="header">
      <div class="icon" @click="back"></div>
      立即支付
    </div>
    <div class="html" v-if="!saveImg">
      <div class="scan-img" id="qrcode" style="width: 140px;height:140px;padding: 10px"></div>
      <div class="desc">
        <div class="iswechat" v-if="isWeiXin">
          长按识别二维码进行支付
        </div>
        <div class="isbrowser" v-if="!isWeiXin">
          <p>请保存图片，打开微信【扫一扫】识别</p>
          <p>二维码支付</p>
        </div>
      </div>
    </div>
    <img class="saveImg" :src="saveImg" alt="" v-else>
    <div class="check-status" @click="back">
      已支付？查询支付状态 >
    </div>
  </div>
</template>
<script>
import utils from '@/utils/utils'
import QRCode from 'qrcodejs2'
import html2canvas from 'html2canvas'
export default {
  name: 'scanpay',
  data: () => ({
    isWeiXin: utils.isWechat(),
    saveImg: ''
  }),
  methods: {
    qrcode () {
      let url = decodeURIComponent(this.$route.query.img)
      let qrcode = new QRCode('qrcode', {
        width: 120,
        height: 120,
        text: url, // 二维码地址
        colorDark: "#000",
        colorLight: "#fff",
      })
    },
    toImg () {
      html2canvas(document.querySelector('.scanpay')).then(canvas => {
        this.saveImg = canvas.toDataURL('image/png')
      })
    },
    back () {
      window.history.back()
    }
  },
  mounted () {
    this.qrcode()
    setTimeout(() => {
      this.toImg()
    }, 2000)
  }
}
</script>
<style lang="less" scoped>
.scanpay {
  position: relative;
  overflow: hidden;
  height: 100vh;
  background: #0f1726;
  .header {
    position: fixed;
    width: 100%;
    overflow: hidden;
    line-height: 86px;
    text-align: center;
    font-size: 32px;
    font-weight: bold;
    color: #fff;
    background: #0f1726;
    .icon {
      position: absolute;
      left: 30px;
      top: 30px;
      width: 30px;
      height: 30px;
      background: url(./img/back.png) no-repeat center center;
      background-size: 100% 100%;
    }
  }
  .html {
    padding-top: 86px;
    overflow: hidden;
    background: #0f1726;
  }
  .scan-img {
    margin: 170px auto 43px;
    width: 227px;
    height: 227px;
    padding: 10px;
    background: #fff;
    border-radius: 20px;
  }
  .desc {
    text-align: center;
    font-size: 28px;
    font-weight: 400;
    color: #fff;
    line-height: 38px;
  }
  .check-status {
    position: absolute;
    height: 100px;
    background: #0f1726;
    bottom: 113px;
    width: 100%;
    text-align: center;
    color: #e39b25;
    font-size: 22px;
  }
  .saveImg {
    width: 100%;
  }
}
</style>

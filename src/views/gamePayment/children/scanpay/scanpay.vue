<template>
  <main class="scanpay">
    <section class="header">
      <img @click="back" src="./img/back.png" alt="">
    </section>
    <article class="html2img" v-if="!saveImg">
      <section>
        <article class="content">
          <section class="content__section">
              <p class="tip">推荐使用<span>微信官方扫码支付</span></p>
              <section id="qrcode" class="code-wrapper">
                <img class="code-logo" src="./img/icon.png" alt="">
              </section>
              <div class="save">
                <p>请长按或截屏保存图片，打开微信</p>
                <p>选择【扫一扫】识别二维码支付</p>
              </div>
          </section>
        </article>
      </section>
      <section class="logo">
        <img src="./img/pay.png" alt="">
        微信支付
      </section>
    </article>
    <img class="saveImg" :src="saveImg" alt="" v-else>
    <section class="footer">
      <p @click="back" class="pay-status">已支付，<span>查询支付状态</span><img src="./img/arrow2.png" alt=""></p>
      <p class="service"><span>* 二维码仅携带订单信息，不获取任何个人信息，请放心使用。如有疑问，请联系</span><span class="service__span" @click="$router.push({name:'customerService'})">平台客服</span><img @click="$router.push({name:'customerService'})" class="service__img" src="./img/arrow.png" alt=""></p>
    </section>
  </main>
</template>
<script>
import QRCode from 'qrcodejs2'
import html2canvas from 'html2canvas'
export default {
  name: 'scanpay',
  data: ()=> ({
    saveImg: ''
  }),
  methods: {
    qrcode () {
      let url = decodeURIComponent(this.$route.query.img)
      let qrcode = new QRCode('qrcode', {
        width: 150,
        height: 150,
        text: url, // 二维码地址
        colorDark : "#000",
        colorLight : "#fff",
      })
    },
    toImg () {
      html2canvas(document.querySelector('.html2img')).then(canvas=> {
        this.saveImg = canvas.toDataURL('image/png')
      })
    },
    back () {
      window.history.back()
    }
  },
  mounted() {
    this.qrcode()
    setTimeout(() => {
      this.toImg()
    }, 2000)
  }
}
</script>
<style lang="less" scoped>
.scanpay{
  position: relative;
  overflow: hidden;
  height: 100vh;
  font-size: 24px;
  color: #fff;
  background: #fff;
  .saveImg {
    width: 100%;
  }
  .header {
    position: fixed;
    background: #2FAA28;
    z-index: 99;
    width: 100%;
    height: 70px;
    font-size: 34px;
    color: #202020;
    font-weight: bold;
    padding-top: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      width: 57px;
    }
  }
  .content {
    background: #2FAA28;
    padding: 0px 28px 0 24px;
    .code-wrapper {
      margin: 0 auto;
      width: 380px;
      border-radius: 10px;
      padding: 40px;
      background: #F7F7F7;
      box-sizing: border-box;
      display: flex;
      position: relative;
      align-items: center;
      justify-content: center;
      .code-logo {
        width: 42px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%,-50%,0);
      }
    }
    &__section {
      padding: 70px 0;
      .tip {
        font-size: 48px;
        text-align: center;
        padding-bottom: 32px;
        span {
          font-weight: bold;
        }
      }
      .save {
        padding-top: 36px;
        text-align: center;
      }
    }
  }
  .service {
    color: #888;
    padding: 20px 24px 0 28px;
    &__span {
      border-bottom:1px solid #888;
    }
    &__img {
      width: 12px;
    }
  }
  .footer {
    position: fixed;
    z-index: 99;
    top: 942px;
    // bottom: 86px;
    width: 100%;
  }
  .logo {
    font-size: 62px;
    color: #000;
    padding: 63px 0 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 92px;
      margin-right: 15px;
    }
  }
  .pay-status {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888;
    span {
      color: #FF7800;
    }
    img {
      width: 12px;
      margin-left: 5px;
    }
  }
}
</style>

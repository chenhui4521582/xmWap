<template>
  <main class="pc-scanpay">
    <wfHeader bgColor="#f8f8f8" title="扫码充值"></wfHeader>
    <article class="html2img" v-if="!saveImg">
      <section>
        <article class="content">
          <section class="content__section">
            <div class="tip">
              <p>本订单号：<span>{{orderNumber}}</span></p>
              <p>请扫描下方【二维码】完成付款，</p>
              <p>完成后点击按钮查看订单是否支付成功</p>
            </div>
            <section id="qrcode" class="code-wrapper"></section>
          </section>
        </article>
      </section>
    </article>
    <section class="footer">
      <p @click="back" class="pay-status">我已支付成功</p>
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
    saveImg: '',
    orderNumber: '',
  }),
  methods: {
    qrcode () {
      let url = window.sessionStorage.getItem('pcSancode')
      let qrcode = new QRCode('qrcode', {
        text: url, // 二维码地址
        colorDark : "#000",
        colorLight : "#fff",
      })
    },
    back () {
      window.history.back()
    }
  },
  mounted() {
    this.qrcode()
    this.orderNumber = localStorage.getItem('ORDER_NUMBER')
  }
}
</script>
<style lang="less">
.content__section {
  img {
    width: 100%;
  }
}
</style>
<style lang="less" scoped>
.pc-scanpay{
  padding-top: 104px;
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
    padding: 0px 20px 0 20px;
    .code-wrapper {
      width: 80%;
      margin: 40px auto;
      border-radius: 10px;
      box-sizing: border-box;
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &__section {
      padding-top: 70px;
      text-align: center;
      .tip {
        font-size: 28px;
        text-align: center;
        color: #888;
        p {
          margin-bottom: 5px;
        }
        span {
          color:#ff4141;
        }
      }
      img {
        width: 100%;
      }
      .save {
        padding-top: 36px;
        text-align: center;
      }
    }
  }
  .service {
    color: #888;
    padding: 40px 24px 0 28px;
    &__span {
      border-bottom:1px solid #888;
    }
    &__img {
      width: 12px;
    }
  }
  .footer {
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
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: #b62929;
    width: 380px;
    height: 70px;
    font-size: 30px;
    border-radius: 5px;
  }
}
</style>

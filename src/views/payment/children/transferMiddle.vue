<template>
  <section class="transfer-middle">
    <wf-header :title="bankCard?'支付':'流程说明'" bg-color="#fff"></wf-header>
    <section v-show="bankCard">
      <input v-if="isIOS" ref="hiddenInput" @focus="$refs.hiddenInput.blur()" class="hiddenInput"
        type="text">
      <div class="content" :class="{'showHeader': $moduleConfig.isShowHeader}">
        <div class="top" :class="{step2:step===2}">
          <div class="top-main">
            <i class="iconfont icon-right-simply red-right"></i>
            {{step===2 ? '转账信息已提交' : '下单成功'}}
          </div>
          <p v-if="step===1" class="desc">请仔细阅读以下步骤安全转账</p>
        </div>
        <div class="have-star">
          <p v-if="step===1" class="desc">
            转账处理时间为每天：09:00-22:00<template>，非工作时间转账需等待工作日处理，具体到账信息请以站内信为准。</template></p>
          <p class="desc" v-if="step===1">此页面为官方唯一转账方式，请使用手机银行进行转账。</p>
          <p class="default-title" v-if="step===1">请输入转账银行卡账号，以核实转账信息</p>
          <div class="input-wrapper" v-if="step===1">
            <input type="text" @blur="changeFocus" v-model="bankCardNum" placeholder="请输入银行卡号">
          </div>
          <p class="desc" v-if="step===1">银行卡号码仅用于核实账号信息，不做任何其他用途。</p>
        </div>
        <div v-if="step===2" class="success__div--tip">
          <p class="step">请仔细阅读以下步骤安全转账</p>
          <p class="information">* 请通过手机银行进行转账操作，转账信息如下：</p>
        </div>
        <ul class="info">
          <li v-if="step===1" class="default-title">收款方信息：</li>
          <li class="desc">
            <span>收款人：{{collectData.name}}</span>
            <wf-button class="copy-btn" v-clipboard:copy="collectData.name"
              v-clipboard:success="onCopy" v-clipboard:error="onError">复制
            </wf-button>
          </li>
          <li class="desc">
            <span>开户行：{{collectData.bank}}</span>
            <span></span>
          </li>
          <li class="desc">
            <span>银行账号：{{collectData.idCard|bankCardFilter}}</span>
            <wf-button class="copy-btn" v-clipboard:copy="collectData.idCard"
              v-clipboard:success="onCopy" v-clipboard:error="onError">复制
            </wf-button>
          </li>
        </ul>
        <div v-if="step===2" class="success-amount">
          <p class="price">
            <span>转账金额</span>
            <span class="price__span">{{this.$route.query.price}}元</span>
          </p>
          <p>温馨提示：通过手机银行转账时，请转入<span
              class="service_color">上方所展示的转账金额</span>，切勿多转或少转，否则客服无法核实订单，导致到账延迟或无法到账。</p>
          <p> * 到账说明：若您已通过手机银行成功转账，客服在线（09：00-23：00）时，会尽快到账，若有其他需求，可以<span @click="$router.push({
            name: 'customerService'
          })" class="service">点击联系客服。</span></p>
        </div>
      </div>
      <div class="bottom-btn" @click="showModal" v-if="step===1">提交订单</div>
      <div class="bottom-btn" @click="closeAll" v-if="step===2">完成</div>
    </section>
    <PayGuide v-if="!bankCard" @submit="showModal">
      <input v-if="isIOS" ref="hiddenInput" @focus="$refs.hiddenInput.blur()" class="hiddenInput"
        type="text">
      <input type="text" @blur="changeFocus" v-model="bankCardNum" placeholder="请输入银行卡号">
    </PayGuide>
    <Modal v-model="show" :type="2" title="信息确认" close-text="返回修改" save-text="提交订单"
      @on-save="submit">
      <div style="text-align:center">
        <p class="desc">
          请核实您填写的银行卡号
        </p>
        <p>
          {{bankCardNum|bankCardFilter}}
        </p>
      </div>
    </Modal>
    <!-- loading -->
    <loading :mask="true" v-if="showLoading" />
  </section>
</template>

<script>
import Services from '@/services/payment'
import PayGuide from './pay-guide'
import { localStorage } from '@/utils/utils'

export default {
  name: 'transferMiddle',
  components: {
    PayGuide
  },
  data () {
    return {
      collectData: {
        idCard: '206610100100554267',
        bank: '兴业银行苏州分行营业部',
        name: '苏州玩蜂软件科技有限公司'
      },
      bankCard: null,
      show: false,
      bankCardNum: '',
      showLoading: false,
      step: 1
    }
  },
  mounted () {
    this.$marchSetsPoint('P_H5PT0210', {
      recharge_rmb: this.$route.query.price,
      pay_type: 14,
      product_id: this.payData.value,
      marketing_id: this.payData.coupon
    })
    this.getUserBankCard()
  },
  filters: {
    bankCardFilter (val) {
      if (!val) return val
      return val.replace(/(.{4})/g, '$1 ')
    }
  },
  computed: {
    isCardRight () {
      return this.bankCardNum.length > 10 && /^[0-9]+$/.test(this.bankCardNum)
    },
    payData () {
      let obj = JSON.parse(this.$route.query.payData)
      obj = Object.assign(obj, { account: this.bankCardNum })
      return obj
    },
    isIOS () {
      let ua = navigator.userAgent.toLowerCase()
      return ua.indexOf('mac') !== -1
    }
  },
  methods: {
    /** 头部返回 **/
    back () {
      this.$router.go(-1)
    },
    // 获取用户上一次转账银行卡号
    async getUserBankCard () {
      const data = await Services.getUserBankCard()
      this.bankCard = data.data.data
      if (this.bankCard) this.bankCardNum = this.bankCard
      if (!this.bankCard) this.$marchSetsPoint('A_H5PT0210002701')
      // this.bankCardNum = '206610100100554267'
      // this.bankCard = '206610100100554267'
    },
    onCopy () {
      this.$Toast('复制成功')
    },
    onError () {
      this.$Toast('当前浏览器不支持此功能，请手动复制。')
    },
    showModal () {
      if (this.isCardRight) {
        this.show = true
      } else {
        this.$Toast('银行卡号码填写有误，请核对后输入')
      }
    },
    async submit () {
      this.showLoading = true
      this.show = false
      try {
        const res = await Services.submitPay(this.payData)
        this.showLoading = false
        let { code, data, message } = res.data
        if (code === 200) {
          this.bankCard = this.bankCardNum
          this.step = 2
          this.$marchSetsPoint('A_H5PT0210002702')
          localStorage.set('orderData', data)
        } else {
          this.$Toast(message)
        }
      } catch (error) {
        this.showLoading = false
      }
    },
    closeAll () {
      let originUrl = localStorage.getString('originDeffer')
      if (originUrl) {
        location.replace(originUrl)
        return
      }
      this.$router.push({ name: 'index' })
    },
    changeFocus () {
      if (this.isIOS) {
        this.$refs.hiddenInput.focus()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.transfer-middle {
  min-height: 100vh;
  background: #fff;
  .content {
    padding: 46px 26px 0;
    &.showHeader {
      padding: 146px 26px 0;
    }
    .top {
      font-size: 32px;
      font-weight: bold;
      line-height: 48px;
      color: #000;
      text-align: center;
      margin-bottom: 38px;
      .top-main {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 12px;
      }
      &.step2 {
        margin-bottom: 15px;
      }
    }
    .have-star {
      .desc {
        display: flex;
        &::before {
          content: '*';
          display: block;
          min-width: 24px;
        }
      }
      .input-wrapper {
        display: flex;
      }
      input {
        padding: 28px 20px;
        font-size: 24px;
        background: #f7f7f7;
        border-radius: 16px;
        margin: 15px 0 10px;
        color: #5e6c85;
        width: 100%;
        color: #000;
        &::placeholder {
          color: #bbbbbb;
        }
      }
    }
    .info {
      li {
        display: flex;
        justify-content: space-between;
        line-height: 42px;
        color: #000;
        padding: 10px 0;
      }
    }
    .default-title {
      font-size: 24px;
      font-weight: 400;
      line-height: 36px;
      margin-top: 30px;
    }
  }
  .red-right {
    background-color: #ff4141;
    color: #fff;
    font-size: 12px;
    display: inline-flex;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    margin-right: 14px;
  }
  .desc {
    font-size: 24px;
    font-weight: 400;
    line-height: 36px;
    color: #888;
  }
  .copy-btn {
    width: 120px;
    height: 42px;
    line-height: 42px;
    border-radius: 10px;
  }
  .bottom-btn {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 90px;
    line-height: 90px;
    text-align: center;
    background-color: #ff4141;
    font-size: 24px;
    color: #ffffff;
    &.close {
      background-color: #f0f0f0;
      color: #ff4141;
    }
  }

  .hiddenInput {
    width: 0;
    height: 0;
    z-index: -1;
    position: absolute;
    left: 0;
    top: 0;
    background: transparent;
  }
}
</style>

<style lang="less" scoped>
.success__div--tip {
  font-size: 24px;
  color: #888888;
  .step {
    padding: 3px 0 50px;
    text-align: center;
  }
  .information {
    text-align: left;
    padding-bottom: 5px;
  }
}
.success-amount {
  font-size: 24px;
  color: #888888;
  .price {
    padding: 40px 0 22px;
    display: flex;
    justify-content: space-between;
    font-size: 28px;
    font-weight: bold;
    color: #000;
    &__span {
      color: #ff4141;
    }
  }
  .service_color {
    color: #ff7800;
  }
  .service {
    color: #ff7800;
    border-bottom: 1px solid #ff7800;
  }
}
</style>

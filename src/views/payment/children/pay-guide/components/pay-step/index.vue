<template>
  <section>
    <p v-if="step===1"
      class="step-info">步骤一：下载对应的手机银行APP，以中国建设银行手机银行APP为例（点击<span @click="toBank">查看支持银行列表</span>）</p>
    <p v-if="step===2"
      class="step-info">步骤二：打开手机银行，在首页选择【转账】或【转账汇款】，进入转账流程。</p>
    <p v-if="step===3"
      class="step-info">步骤三：输入转账银行卡信息，以核实到账信息，此信息仅用作核实账户，不做其他任何用途。</p>
    <div class="content active">
      <img @click="step--"
        v-if="step > 1"
        class="arrow arrow-left"
        src="./assets/left.png"
        alt="">
      <img @click="step++"
        v-if="step < 3"
        class="arrow arrow-right"
        src="./assets/right.png"
        alt="">
      <img v-if="step===1"
        class="step-img"
        src="./assets/step1.png"
        alt="">
      <img v-if="step===2"
        class="step-img"
        src="./assets/step2.gif"
        alt="">
      <div v-if="step===3">
        <p class="bank-card">银行卡号</p>
        <slot />
      </div>
    </div>
    <div v-if="step===3"
      @click="$emit('submit')"
      class="button">提交</div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      step: 1
    }
  },
  methods: {
    toBank () {
      this.$router.push('/payment/toSupportBankPage')
    }
  },
}
</script>

<style lang="less" scoped>
.step-info {
  font-size: 24px;
  padding-bottom: 10px;
  line-height: 36px;
  span {
    color: #ff7800;
    border-bottom: 1px solid #ff7800;
  }
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
.content {
  background: #fff;
  border-radius: 16px;
  padding: 36px 117px;
  position: relative;
  min-height: 800px;
  text-align: center;
  &.active {
    padding: 26px 21px;
  }
  .arrow {
    width: 60px;
    position: absolute;
    top: 325px;
    &-left {
      left: 20px;
    }
    &-right {
      right: 20px;
    }
  }
  .step-img {
    width: 437px;
    height: 778px;
  }
  .bank-card {
    font-size: 24px;
    padding-bottom: 15px;
    text-align: left;
  }
}
.button {
  background: #ff4141;
  color: #fff;
  font-size: 24px;
  line-height: 90px;
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>

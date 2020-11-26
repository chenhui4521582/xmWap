<template>
  <section>
    <section class="first-pop step1" v-if="step === 1">
      <div class="wrap"></div>
      <div class="arrow"></div>
      <div class="text"></div>
      <div class="btn" @click="handleStep()">下一步</div>
    </section>
    <section class="first-pop step2" v-if="step === 2">
      <div class="wrap"></div>
      <div class="arrow"></div>
      <div class="text"></div>
      <div class="btn" @click="finish()">完成</div>
    </section>
  </section>
</template>

<script>
export default {
  name: 'firstPop',
  components: {

  },
  data () {
    return {
      step: 1
    }
  },
  mounted () {
  },
  methods: {
    handleStep () {
      this.$marchSetsPoint('A_H5PT0025001731')
      this.step = 2
    },
    finish () {
      this.$marchSetsPoint('A_H5PT0025001732')
      localStorage.setItem('newCatList', 1)
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.first-pop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
}
.wrap {
  top: 400px;
  box-shadow: 0 0 0 1500px rgba(0, 0, 0, 0.55);
  position: absolute;
  border-radius: 10px;
}
.arrow {
  width: 40px;
  height: 80px;
  background: url('../img/arrow.png') no-repeat center center ;
  background-size: 100% 100%;
  position: absolute;
  top: 480px;
}
.text {
  position: absolute;
  top: 580px;
}
.btn {
  position: absolute;
  width: 250px;
  height: 70px;
  line-height: 70px;
  font-size: 24px;
  border-radius: 16px;
  text-align: center;
  background: #ff4141;
  color: #fff;
  font-weight: bold;
  top: 700px;
}
.step1 {
  .wrap {
    width: 320px;
    height: 141px;
    left: 030px;
  }
  .arrow {
    left: 360px;
  }
  .text {
    background: url('../img/catFirstPop/text-1.png') no-repeat center center;
    background-size: 100% 100%;
    width: 354px;
    height: 106px;
    left: 260px;
  }
  .btn {
    left: 320px;
  }
}
.step2 {
  .wrap {
    width: 140px;
    height: 150px;
    left: 354px;
  }
  .arrow {
    left: 300px;
    transform: rotateY(180deg);
  }
  .text {
    background: url('../img/catFirstPop/text-2.png') no-repeat center center;
    background-size: 100% 100%;
    width: 430px;
    height: 106px;
    left: 130px;
  }
  .btn {
    left: 230px;
  }
}
</style>

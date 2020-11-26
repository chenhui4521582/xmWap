<template>
  <div class="hotline-warp">
    <h2 class="title">客服热线</h2>
    <div class="time">在线时间：周一至周日 09:00~23:00</div>
    <div class="open-call">
      <p>400-873-5311</p>
      <a href="javascript:;" class="button" @click="clickTel()">拨打</a>
    </div>
    <div class="directions">提示：客服热线可能因咨询高峰而占线，推荐使用在线客服及时
      帮您解决问题。 </div>
  </div>
</template>
<script>
export default {
  name: 'hotline',
  props: {
    source: {
      type: [Number, String],
      default: 0
    }
  },
  methods: {
    clickTel () {
      if (this.source) {
        this.$marchSetsPoint('A_H5PT0155001753')
      } else {
        this.$marchSetsPoint('A_H5PT0030001749')
      }
      location.href = 'tel:400-873-5311'
    }
  }
}
</script>
<style lang="less" scoped>
.hotline-warp {
  color: #333;
  padding: 0 24px;
  .title {
    font-weight: bold;
    font-size: 28px;
  }
  .time {
    font-size: 24px;
    margin-bottom: 30px;
  }
  .open-call {
    background-color: #ffffff;
    padding: 22px;
    display: flex;
    align-items: center;
    position: relative;
    border-radius: 16px;
    p {
      flex: 1;
      font-size: 32px;
      font-weight: bold;
    }
    .button {
      width: 120px;
      height: 42px;
      text-align: center;
      background-color: #ff4141;
      border-radius: 10px;
      line-height: 42px;
      font-size: 24px;
      color: #fff;
    }
  }
  .directions {
    font-size: 24px;
    margin-top: 18px;
    color: #888;
    line-height: 36px;
  }
}
</style>



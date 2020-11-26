<template>
  <article class="no-day-task">
    <section class="title">每日任务</section>
    <div class="nolist">
      <img src="../../img/no-message.png" alt="">
    </div>
    <p>今日该游戏无每日任务</p>
    <p class="btn" @click="showPop">何时会有</p>
  </article>
</template>

<script>
export default {
  name: 'noDayTask',
  mounted () {

  },
  methods: {
    showPop () {
      this.$emit('show-desc-pop', 'desc')
    }
  }
}
</script>

<style lang="less" scoped>
.bg-center(@url) {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url(@url);
}
.no-day-task {
  margin: 20px auto 0;
  padding: 20px 12px;
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  .title {
    text-align: center;
    font-size: 26px;
    font-weight: bold;
    color: #9f752a;
    display: flex;
    align-items: center;
    justify-content: center;
    &::before,
    &::after {
      content: '';
      display: block;
      width: 32px;
      height: 36px;
    }
    &::before {
      .bg-center('../../img/left-handle.png');
      margin-right: 10px;
    }
    &::after {
      .bg-center('../../img/right-handle.png');
      margin-left: 10px;
    }
  }
  .nolist {
    margin: 42px auto 30px;
    width: 338px;
    height: 226px;
    img {
      vertical-align: top;
      width: 100%;
    }
  }
  .btn {
    margin: 15px auto 0;
    width: 96px;
    font-size: 20px;
    font-weight: 500;
    color: #fd7b12;
    border-bottom: 1px solid #fd7b12;
  }
}
</style>

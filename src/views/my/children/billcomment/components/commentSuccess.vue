<template>
  <div class="comment-success">
    <wf-header :customize="true" title="评价晒单" @on-back="back" @on-click="back"/>
    <div class="comment-success-container">
      <img src="../../../image/commentSuccess.png" alt="">
      <div class="comment-success-txt">评价成功</div>
      <div class="comment-success-info">坚持写评价，更多奖品等你拿</div>
    </div>
    <div class="comment-success-footer">
      <div class="item" @click="back">返回</div>
      <div class="item" @click="checkComment">查看评价</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'commentSuccess',
    methods:{
      back(){
        this.$emit('back')
      },
      checkComment(){
        this.$emit('checkComment')
      }
    }
  }
</script>

<style lang="less" scoped>
  .comment-success {
    position: fixed;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 11;
    min-height: 100vh;
    background-color: #f7f7f7;
    overflow-x: hidden;
    .comment-success-container {
      position: absolute;
      top:400px;
      left: 0;
      right: 0;
      margin: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        width: 150px;
        height: 150px;
        margin-bottom: 46px;
      }
      .comment-success-txt {
        font-size: 32px;
        font-weight: bold;
        color: rgba(0, 0, 0, 1);
        margin-bottom: 9px;
      }
      .comment-success-info {
        font-size: 24px;
        font-weight: 400;
        color: rgba(136, 136, 136, 1);
      }
    }
    .comment-success-footer {
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
      bottom: 0;
      display: flex;
      .item {
        flex: 1;
        height: 90px;
        line-height: 90px;
        text-align: center;
        font-size: 24px;
        font-weight: 500;
        &:nth-child(1) {
          color: rgba(255, 65, 65, 1);
          background: rgba(255, 255, 255, 1);
        }
        &:nth-child(2) {
          color: rgba(255, 255, 255, 1);
          background: rgba(255, 65, 65, 1);
        }
      }
    }
  }
</style>

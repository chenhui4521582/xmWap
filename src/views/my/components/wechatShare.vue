<template>
<div class="wechat-share" v-if="showModule">
  <li class="list-item" @click="showGuide()">
    <div class="title">
      <img src="../image/wechat-icon.png" alt="">
    </div>
    <div class="content">
      <h3>分享微信好友</h3>
      <div class="content-description">
        <span>去分享</span>
        <span class="iconfont icon-next"></span>
      </div>
    </div>
  </li>
  <div class="guide" v-if="isShowGuide">
    <div class="mask"></div>
    <div class="center">
      <img class="text" src="../image/share-text.png" alt="">
      <img class="hand" src="../image/share-hand.png" alt="">
    </div>
  </div>
</div>
</template>
<script>
export default {
  name: 'wechatShare',
  data: () => ({
    isShowGuide: false,
    showModule: false
  }),
  methods: {
    showGuide () {
      this.isShowGuide = true
      this.hide()
    },
    hide () {
      setTimeout(() => {
        this.isShowGuide = false
      }, 4000)
    }
  },
  mounted() {
    let channel = localStorage.getItem('APP_CHANNEL')
    if(['110002001', '110002002', '110002007'].indexOf(channel) > -1) {
      this.showModule = true
    }
  }
}
</script>
<style lang="less" scoped>
  .list-item {
    height: 90px;
    display: flex;
    align-items: center;
    .title {
      width: 42px;
      height: 90px;
      padding: 30px 0;
      position: relative;
      display: flex;
      align-items: center;
      img {
        width: 30px;
      }
      .message-red {
        height: 20px;
        width: 20px;
        border-radius: 10px;
        background-color: #e8382b;
        border: 3px solid #fff;
        position: absolute;
        top: 23px;
        right: 32px;
      }
    }
    
    .content {
      flex: 1;
      height: 90px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e6e6e6;
      position: relative;
      h3 {
        font-size: 28px;
        font-weight: Bold;
        color: #000000;
      }
      .content-description {
        display: flex;
        align-items: center;
        text-align: right;
        font-size: 24px;

        color: #FF4141;
        .iconfont {

          color: #FF4141;
          margin-left: 10px;
        }
      }
    }
  }
  .guide {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 11;
    .mask {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      background: rgba(0,0,0,.5)
    }
    .center { 
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      z-index: 2;
      .text,.hand {
        position: absolute;
        z-index: 3;
      }
      .text {
        top: 103px;
        right: 12px;
        width: 152px;
        height: 70px;
      }
      .hand {
        top: 0;
        right: 21px;
        width: 82px;
        height: 122px;
        animation: top 1s infinite ;
      }
    }
  }
  @keyframes top {
    0% {
      top: 0;
    }
    50% {
      top: 30px;
    }
    100% {
      top: 0;
    }
  }
</style>
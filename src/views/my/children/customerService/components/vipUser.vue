<template>
  <div class="vip-warp">
    <p class="title-tips" v-if="rechargeLevel">平台已为您升级专属VIP客服服务，首次添加专属客服微信还能领取<i>{{rechargeLevel==1?50000:100000}}金叶子</i>见面礼~</p>
    <div class="vip-title">
      <h3 class="title">Hi 尊敬的{{(userInfo&&userInfo.nickname||name)||'玩家'}}</h3>
      <div v-if="weChatNo" class="wx-wrapper">
        <div class="wx-text">
          <h4>您的专属客服微信号：<i style="color: #FF7800 ">{{weChatNo}}</i></h4>
        </div>
        <p class="btn copy" v-clipboard:copy="weChatNo" v-clipboard:success="copyCode"
          v-clipboard:error="onError">复制</p>
      </div>
      <div v-else class="wx-wrapper">
        <div class="wx-text">
          <h4>小多竭诚为您服务，用心聆听您的声音</h4>
        </div>
      </div>
      <span v-if="weChatNo" class="wx-other">复制微信号至微信添加，验证信息填写游戏ID即可</span>
      <div class="merit-warp">
        <div class="item">
          <img src="../image/horn.png" alt="">
          <p>
            每周朋友圈<br>
            专属活动
          </p>
        </div>
        <div class="item">
          <img src="../image/diamonds.png" alt="">
          <p>
            VIP奖励审核<br>
            加速通道
          </p>
        </div>
        <div class="item">
          <img src="../image/gift.png" alt="">
          <p>
            最新活动<br>
            抢先知道
          </p>
        </div>
        <div class="item">
          <img src="../image/service.png" alt="">
          <p>
            不定期<br>
            发放优惠券
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'vipUser',
  props: {
    userInfo: {
      type: Object,
      default: () => { return {} }
    },
    weChatNo: {
      type: String,
      default: ''
    },
    rechargeLevel: {
      type: Number,
      default: 0
    }
  },
  methods: {
    copyCode () {
      this.$marchSetsPoint('A_H5PT0155001751') // H5平台-专属客服页-专属客服微信号复制点击
      this.$Toast('复制成功')
    },
    onError () {
      this.$marchSetsPoint('A_H5PT0155001751') // H5平台-专属客服页-专属客服微信号复制点击
      this.$Toast('当前浏览器不支持此功能，请手动复制。')
    }
  },
  mounted () {
    this.$marchSetsPoint('P_H5PT0155') // H5平台-专属客服页-页面加载完成
  }
}
</script>
<style lang="less" scoped>
* {
  box-sizing: border-box;
}
.vip-warp {
  width: 100%;
  padding: 10px 24px;
  margin-bottom: 44px;
}
.vip-title {
  text-align: left;
  border-radius: 16px;
  background-color: #fffad4;
  color: #333;
  padding: 24px 22px;
  .title {
    font-size: 28px;
    font-weight: 600;
    font-weight: bold;
  }

  .wx-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    margin: 0px auto 24px;
    height: 42px;
    line-height: 42px;
    .wx-text {
      color: #333;
      line-height: 22px;
      font-size: 24px;
      font-weight: 500;
      flex: 1;
    }
    .btn {
      width: 120px;
      height: 42px;
      text-align: center;
      background-color: #ff4141;
      border-radius: 16px;
      line-height: 42px;
      font-size: 24px;
      color: #fff;
    }
  }
  p {
    font-size: 24px;
  }
  .merit-warp {
    display: flex;
    text-align: center;
    align-items: center;
    justify-items: center;
    justify-content: flex-start;
    align-content: center;
    .item {
      flex: 1;
      position: relative;
      text-align: center;
    }
    img {
      width: 72px;
    }
    p {
      font-size: 20px;
      color: #888;
    }
  }
  .wx-other {
    color: #888;
    font-size: 20px;
    line-height: 30px;
    font-weight: normal;
    display: block;
    margin-bottom: 18px;
  }
  .message {
    width: 260px;
    height: 60px;
    margin: 40px auto;
    border-radius: 30px;
    background-color: #141f33;
    color: #ffe417;
    font-size: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 34px;
      margin-right: 10px;
    }
  }
}
.title-tips{
  font-size: 24px;
  font-weight: 400;
  line-height: 36px;
  color: #888888;
  margin-bottom: 16px;
  i{
    color: #FF7800;
  }
}
</style>



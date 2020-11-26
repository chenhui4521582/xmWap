<template>
  <div class="ordinary-warp">
    <!-- 专属一对一客服 -->
    <div class="title">
      <span>招财猫Lv.66可享专属客服</span>
      <div class="button" @click="goCat()">去开启</div>
    </div>
    <ul class="vip-6">
      <li class="item">
        <img src="../image/horn.png" alt="">
        <p>
          每周朋友圈<br>
          专属活动
        </p>
      </li>
      <li class="item">
        <img src="../image/diamonds.png" alt="">
        <p>
          VIP奖励审核<br>
          加速通道
        </p>
      </li>
      <li class="item">
        <img src="../image/gift.png" alt="">
        <p>
          最新活动<br>
          抢先知道
        </p>
      </li>
      <li class="item">
        <img src="../image/service.png" alt="">
        <p>
          不定期<br>
          发放优惠券
        </p>
      </li>
    </ul>
  </div>
</template>
<script>
import { jumpUrl } from '@/utils/utils'
export default {
  name: 'ordinary',
  methods: {
    goCat () {
      this.$marchSetsPoint('A_H5PT0030001750') // H5平台-普通客服页-专属客服去开启点击
      jumpUrl({ url: '/petcat/' }, null, '&catright=1')
    }
  },
  mounted () {
    this.$marchSetsPoint('P_H5PT0030') // H5平台-普通客服页-页面加载完成
  }
}
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}
.ordinary-warp {
  padding: 10px 24px;
  color: #333;
  margin-top: 24px;
  .title {
    font-size: 28px;
    font-weight: bold;
    display: flex;
    align-items: center;
    span {
      flex: 1;
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
      margin-right: 22px;
      font-weight: normal;
    }
  }
}
.vip-6 {
  display: flex;
  margin-top: 48px;
  font-size: 24px;
  flex-wrap: wrap;
  .item {
    flex: 0 0 33.33%;
    text-align: center;
    position: relative;
    margin-bottom: 40px;
    img {
      width: 72px;
    }
    p {
      color: #000;
      margin-top: 8px;
      line-height: 34px;
    }
    &:not(:nth-child(3n)):not(:last-child)::after {
      content: '';
      display: block;
      width: 2px;
      height: 120px;
      background: #E6E6E6;
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
    }
  }
}
</style>



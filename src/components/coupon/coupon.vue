<template>
  <article class="coupon-pop" :class="`coupon-${type||'normal'}`">
    <div id="coupon-icon-wrapper" class="coupon-icon-wrapper" @click="showCoupons">
      <img class="coupon-icon" src="./img/coupon-icon.png" alt="">
      <!-- 可使用优惠券 tips -->
      <img class="coupon-tips" v-if="couponTips.status == 1" src="./img/coupon-tips1.png" alt="">
      <!-- 即将过期优惠券 tips -->
      <img class="coupon-tips" v-if="couponTips.status == 6" src="./img/coupon-tips2.png" alt="">
      <!-- 优惠券名称 -->
      <div class="coupon-num">
        <template v-if="couponTipsText">
          <p v-for="item in couponTipsText" :key="item">
            {{item}}
          </p>
        </template>
        <p v-else class="none">暂无</p>
      </div>
      <!-- 即刻下单 -->
      <div class="to-buy" v-if="couponTips.productDto" @click.stop="toPay()">
        即刻下单
      </div>
      <!-- 去领取 -->
      <div class="to-buy animation" v-else-if="showWechatSendCdkOpen">
        去领取
      </div>
    </div>
    <template v-if="isShowCoupons">
      <div class="mask"></div>
      <div class="coupon-wrap-all">
        <!-- 头部 -->
        <div class="header-wap">
          <div class="title-switch">
            <div class="tab-item" v-for="(tab, index) in tabList"
              :class="{ 'tab-item-active': index === tabIndex }" @click.stop="clickCoupons(index)"
              :key="index">
              <span>{{ tab }}</span>
              <p v-show="index === tabIndex && !type" class="tab-line"></p>
            </div>
          </div>
        </div>
        <div class="close" @click="closeCoupons">
          <img v-if="type" src="./img/close-icon.png" alt="">
          <i v-else class="iconfont icon-close"></i>
        </div>
        <!-- 内容区 -->
        <section class="coupon-wrap">
          <section class="coupon-content" v-if="isListShow">
            <!-- status （1未使用，2已使用，3使用中，4未生效（虚拟状态）,5已过期（虚拟状态）,6即将过期（虚拟状态）） -->
            <template v-if="tabIndex == 0">
              <template v-for="(item, index) in ableList">
                <section class="list-item" :key="index">
                  <effective :item="item" :type="type" @close="toUse" />
                </section>
              </template>
            </template>
            <!-- 过期的优惠劵 -->
            <template v-else>
              <template v-for="(item, index) in enabledList">
                <section class="list-item" :key="index">
                  <invalid :item="item" :type="type" />
                </section>
              </template>
            </template>
          </section>
          <!-- 没有优惠券展示 -->
          <template v-else>
            <no-list message="暂时没有优惠券" />
          </template>
        </section>
        <div class="rule-wrapper">
          <p @click="showRulesFn">关于优惠券>></p>
          <p class="wetchatact" @click="goToAct" v-if="showWechatSendCdkOpen">点这里，领取优惠券 <i class="iconfont icon-next"></i></p>
        </div>
        <!-- 规则 -->
        <rulse v-model="rulseShow" :type="type" @on-close="rulseShow = false" />
      </div>
    </template>
  </article>
</template>
<script>
import rulse from './components/rules'
import effective from './components/effective'
import invalid from './components/invalid'
import Services from '@/services/payment'
import { getCouponList } from '@/services/user'
import _get from 'lodash.get'
export default {
  name: 'couponPop',
  data () {
    return {
      tabList: ['有效券', '失效券'],
      tabIndex: 0,
      rulseShow: false,
      enabledList: [], // 不可用列表
      ableList: [], // 可用列表
      isShowTips: false,
      isShowCoupons: false,
      couponTips: {},
      showWechatSendCdkOpen:false,//关注公众号领取优惠券活动是否开启
    }
  },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  components: {
    rulse,
    effective,
    invalid,
  },
  computed: {
    isListShow () {
      const list = this.tabIndex === 0 ? this.ableList : this.enabledList
      return list.length > 0 ? true : false
    },
    couponTipsText () {
      let text = _get(this.couponTips, 'title', '')
      if (text.indexOf(';') != -1) {
        return text.split(';')
      }
      return text ? [text] : ''
    }
  },
  mounted () {
    this.showTips()
    this.wechatSendCdkOpen()
  },
  methods: {

    /** 图标动画 **/
    iconAnimation () {
      window.addEventListener('touchstart', event => {
        let touch = event.touches[0]
        this.startY = touch.pageY
      })
      window.addEventListener('touchend', event => {
        let element = document.getElementById('coupon-icon-wrapper')
        let touch = event.changedTouches[0]
        let endY = this.startY - touch.pageY
        // 上滑
        if (endY > 5) {
          element && element.classList.add('hide')
          element && element.classList.remove('show')
        } else {
          element && element.classList.add('show')
          element && element.classList.remove('hide')
        }
      })
    },
    /** 商城头部是否展示优惠券 **/
    async showTips () {
      const res = await Services.getShowCoupons()
      this.couponTips = _get(res, 'data.data')
      this.iconAnimation()
      this.$emit("setOutCoupon", this.couponTips)
    },
    showCoupons () {
      this.isShowCoupons = true
      if (this.type) {
        this.$marchSetsPoint('A_H5PT0058003983', { source_address: this.type })// 游戏内-商城-优惠券点击
      } else {
        this.$marchSetsPoint('A_H5PT0023003975')// H5平台-商城-优惠券点击
      }
      this.pageInit()
    },
    closeCoupons () {
      this.isShowCoupons = false
      if (this.type) {
        this.$marchSetsPoint('A_H5PT0058003985', { source_address: this.type })// 游戏内-商城-优惠券弹窗-关闭点击
      } else {
        this.$marchSetsPoint('A_H5PT0023003977')// H5平台-商城-优惠券弹窗-关闭点击
      }
    },
    toUse (item) {
      this.isShowCoupons = false
      if (this.type) {
        this.$marchSetsPoint('A_H5PT0058003989', { source_address: this.type, coupon_id: item.id, coupon_name: item.name })// 游戏内-商城-优惠券弹窗-优惠券立即使用点击
      } else {
        this.$marchSetsPoint('A_H5PT0023003981', { coupon_id: item.id, coupon_name: item.name })// H5平台-商城-优惠券弹窗-优惠券立即使用点击
      }
    },
    // 页面初始化
    async pageInit () {
      const ableList = await getCouponList()
      const enabledList = await getCouponList({ page: 1, pageSize: 100, params: false })
      if (enabledList.code === 200 && enabledList.data) {
        this.enabledList = enabledList.data
      }
      if (ableList.code === 200) {
        this.ableList = ableList.data.filter(item => {
          return item.status == 1 || item.status == 3 || item.status == 4 || item.status == 6 || item.status == 7
        })
      }
      if (this.type) {
        // 游戏内-商城-优惠券弹窗加载完成
        this.$marchSetsPoint('A_H5PT0058003984', {
          coupon_is: this.ableList.length,
          source_address: this.type
        })
      } else {
        // H5平台-商城-优惠券弹窗加载完成
        this.$marchSetsPoint('A_H5PT0023003976', {
          coupon_is: this.ableList.length
        })
      }
    },
    // 打开规则
    showRulesFn () {
      this.rulseShow = true
      if (this.type) {
        this.$marchSetsPoint('A_H5PT0058003987', { source_address: this.type })// 游戏内-商城-优惠券弹窗-资产说明点击
      } else {
        this.$marchSetsPoint('A_H5PT0023003979')// H5平台-商城-优惠券弹窗-资产说明点击
      }
    },
    // 标题切换
    async clickCoupons (index) {
      this.tabIndex = index
      this.noUseCoupons = false
      let array = index == 0 ? this.ableList : this.enabledList
      array.map(item => {
        this.$set(item, '__check', false)
      })
      if (this.type) {
        this.$marchSetsPoint('A_H5PT0058003986', { source_address: this.type, coupon_tab: this.tabList[index] })// 游戏内-商城-优惠券弹窗-TAB点击
      } else {
        this.$marchSetsPoint('A_H5PT0023003978', {
          coupon_tab: this.tabList[index]
        })// H5平台-商城-优惠券弹窗-TAB点击
      }
    },
    toPay () {
      localStorage.setItem('JDD_PARAM', JSON.stringify(this.couponTips.productDto))
      localStorage.setItem('payment', JSON.stringify(this.couponTips.productDto))
      if (this.type) {
        this.$marchSetsPoint("A_H5PT0058004441")// 游戏内-商城-优惠券icon-即刻下单点击
        this.$router.push({
          name: 'GPList'
        })
      } else {
        this.$marchSetsPoint("A_H5PT0023004437")// H5平台-商城-优惠券icon-即刻下单点击
        this.$emit('toPay', this.couponTips.productDto, 8)
      }
    },
    /** 关注公众号领取优惠券活动是否开启 **/
    async wechatSendCdkOpen () {
      const res = await Services.wechatSendCdkOpen()
      this.showWechatSendCdkOpen = _get(res, 'data.data')
    },
    // 跳转到关注公众号领取优惠券活动
    goToAct(){
      this.$marchSetsPoint("A_H5PT0023004484")// H5平台-商城-优惠券弹窗-关注公众号领取优惠券入口点击
      if(this.type){
        parent.location.href='https://wap.beeplaying.com/activities/wxInvitation.html?vt='+new Date().getTime()
      }else{
        location.href='https://wap.beeplaying.com/activities/wxInvitation.html?vt='+new Date().getTime()
      }
    }
  }
}
</script>
<style lang="less" scoped>
* {
  box-sizing: border-box;
}
.bg-center(@url) {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url(@url);
}
.coupon-icon-wrapper {
  position: fixed;
  bottom: 500px;
  right: 0;
  width: 138px;
  height: 114px;
  z-index: 10;

  &.show {
    transition: all 0.2s;
    transform: translate(0, 0);
    opacity: 1;
  }
  &.hide {
    transition: all 0.2s;
    transform: translate(100%, 0);
    opacity: 0;
  }
  .coupon-icon {
    position: absolute;
    bottom: 0;
    width: 138px;
    height: 114px;
    left: 50%;
    margin-left: -69px;
  }
  .coupon-tips {
    position: absolute;
    height: 41px;
    right: 12px;
    top: -41px;
    text-align: right;
    animation: upDown 1.5s infinite;
  }
  .coupon-num {
    position: absolute;
    left: 36px;
    top: 18px;
    z-index: 2;
    height: 37px;
    width: 76px;
    font-size: 18px;
    color: #b70012;
    font-weight: 600;
    display: flex;
    flex-direction: column;
    justify-content: center;
    p {
      white-space: nowrap;
      line-height: 1.2;
      text-align: center;
    }
    .none {
      color: #989898;
      font-size: 18px;
    }
  }
  .to-buy {
    position: absolute;
    top: 106px;
    height: 40px;
    width: 100px;
    left: 50%;
    margin-left: -42px;
    line-height: 40px;
    color: #fff80b;
    background: #bf11ff;
    border: 2px solid #fff;
    border-radius: 20px;
    box-sizing: border-box;
    font-size: 20px;
    text-align: center;
    &.animation{
      animation: huxi 3s infinite ease-in-out;
    }
  }
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 99;
}
.coupon-wrap-all {
  position: fixed;
  z-index: 99;
  .header-wap {
    position: absolute;
    box-sizing: border-box;
    padding: 0 30px;
    color: #888;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    .title {
      text-align: center;
      font-size: 28px;
      font-weight: bold;
    }
  }
  .close {
    position: absolute;
    right: 0;
    top: 0;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .title-switch {
    position: relative;
    width: 100%;
    text-align: center;
    font-size: 32px;
    .tab-item {
      width: 110px;
      margin: 0 20px;
      position: relative;
    }
    .tab-item-active {
      color: #000;
      font-weight: bold;
    }
    .tab-line {
      width: 32px;
      height: 6px;
      background-color: #ff4141;
      position: absolute;
      bottom: -3px;
      left: 39px;
      border-radius: 3px;
    }
  }
  .coupon-wrap {
    margin-top: 90px;
    height: 480px;
    padding: 0 15px;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    .list-item:not(:last-child) {
      margin-bottom: 14px;
    }
  }
  .rule-wrapper {
    color: #888;
    font-size: 20px;
    position: absolute;
    left: 0;
    width: 100%;
    p {
      margin: auto;
      /*width: 144px;*/
      line-height: 28px;
      text-align: center;
      &.wetchatact{
        margin-top: 10px;
        font-weight: 500;
        color: #FF4141;
      }
    }
  }
  .no-list {
    text-align: center;
    font-size: 20px;
    img {
      width: 152px;
      margin-top: 400px;
      margin-bottom: 20px;
    }
  }
}
.coupon-pop.coupon-normal {
  .coupon-wrap-all {
    width: 470px;
    height: 648px;
    top: 50%;
    left: 50%;
    margin-left: -235px;
    margin-top: -324px;
    background: #fff;
    border-radius: 32px;
    transform: scale(1.2);
  }
  .header-wap {
    width: 100%;
    height: 100px;
    top: 0;
    left: 0;
    .title-switch {
      display: flex;
      justify-content: center;
    }
  }
}
.coupon-pop.coupon-portrait {
  .coupon-icon-wrapper {
    right: 30px;
  }
  .coupon-wrap-all {
    width: 550px;
    top: 50%;
    left: 50%;
    margin-left: -275px;
    margin-top: -380px;
  }
  .coupon-wrap-all {
    .header-wap {
      width: 100%;
      .title-switch {
        width: 100%;
        display: flex;
        justify-content: center;
        .tab-item {
          width: 180px;
          height: 110px;
          margin: 0;
          .bg-center('./img/portrait-normal-tag-bg.png');
          display: flex;
          align-items: center;
          justify-content: center;
          color: #be9957;
          font-size: 24px;
          box-sizing: border-box;
          padding-top: 20px;
        }
        .tab-item-active {
          width: 216px;
          color: #fff;
          .bg-center('./img/portrait-activated-tag-bg.png');
        }
      }
    }
    .close {
      width: 70px;
      height: 70px;
      right: -10px;
      top: 60px;
      z-index: 3;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .coupon-wrap {
      position: relative;
      margin-top: 80px;
      width: 550px;
      height: 734px;
      background: url('./img/portrait-bg.png') no-repeat center center;
      background-size: 100% 100%;
      padding: 50px 40px 120px;
      z-index: 2;
      .coupon-content {
        height: 100%;
        width: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
      }
    }
    .rule-wrapper {
      bottom: 50px;
      height: 68px;
      font-size: 22px;
      color: #3dd8ec;
      z-index: 3;
    }
  }
}
.coupon-pop.coupon-landscape {
  .coupon-icon-wrapper {
    bottom: 200px;
    right: 150px;
    z-index: 10;
  }
  .coupon-wrap-all {
    height: 580px;
    top: 50%;
    left: 50%;
    margin-left: -516px;
    margin-top: -290px;
  }
  .coupon-wrap-all {
    .header-wap {
      z-index: 1;
      left: 0;
      top: 100px;
      .title-switch {
        width: 180px;
        .tab-item {
          width: 180px;
          height: 80px;
          line-height: 80px;
          text-align: center;
          color: #be9957;
          font-size: 24px;
          font-weight: bold;
          margin-top: -10px;
          box-sizing: border-box;
          padding-left: 20px;
          position: relative;
          .bg-center('./img/landscape-normal-tag-bg.png');
        }
        .tab-item-active {
          height: 90px;
          line-height: 90px;
          color: #fff;
          font-size: 28px;
          .bg-center('./img/landscape-activated-tag-bg.png');
        }
      }
    }
    .close {
      width: 70px;
      height: 70px;
      right: -10px;
      top: -10px;
      z-index: 3;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .coupon-wrap {
      position: relative;
      margin-top: 0;
      margin-left: 200px;
      width: 792px;
      height: 580px;
      background: url('./img/landscape-bg.png') no-repeat center center;
      background-size: 100% 100%;
      padding: 60px 60px 120px;
      z-index: 2;
      .coupon-content {
        height: 100%;
        width: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
      }
    }
    .rule-wrapper {
      bottom: 50px;
      height: 68px;
      font-size: 22px;
      color: #3dd8ec;
      z-index: 3;
      margin-left: 100px;
    }
  }
}
@keyframes upDown {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0, -0.2rem);
  }
  100% {
    transform: translate(0, 0);
  }
}
@keyframes huxi {
  0% {
    transform: scale(0.9);
  }
  10% {
    transform: scale(1);
  }
  20% {
    transform: scale(0.9);
  }
  30% {
    transform: scale(1);
  }
  40% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1);
  }
  60% {
    transform: scale(0.9);
  }
  70% {
    transform: scale(1);
  }
  80% {
    transform: scale(0.9);
  }
  90% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.9);
  }
}
</style>
<style scoped>
.no-list >>> p {
  color: #fff;
}
.coupon-pop.coupon-normal .no-list >>> p {
  color: #acacac;
}
</style>
<style scoped>
.coupon-pop.coupon-normal
  >>> .coupon-wrapper
  .coupon-content
  .coupon-info
  .coupon-desc
  .coupon-price {
  font-size: 36px;
}
</style>

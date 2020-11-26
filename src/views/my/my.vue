<template>
  <div class="my-warp" :style="bgWrapper" :class="$moduleConfig.plantVersion">
    <my-header ref="child" :isMessageUnread="isMessageUnread" />
    <div class="my-content">
      <!-- 资产 -->
      <div class="my-assets">
        <div class="header-bg">
          <div class="center" :style="bgTheme"></div>
          <div class="bottom" :style="bgTheme"></div>
        </div>
        <div class="assets-warp">
          <!-- 金叶子 -->
          <div class="item" @click="assetsClick('payment')">
            <div class="direction">我的金叶子</div>
            <div class="title" v-html="moneyComputed(userInfo.amount)"></div>
          </div>
          <!-- 话费券 -->
          <div class="item" @click="assetsClick('mall')">
            <div class="direction">我的话费券</div>
            <div class="title" v-html="moneyComputed(JDCartCall.call,'call')"></div>
          </div>
          <!-- 京东卡 -->
          <div class="item" @click="JDAssets">
            <div class="direction">我的京东卡</div>
            <div class="title" v-html="moneyComputed(JDCartCall.JDCart,'call')"></div>
          </div>
        </div>
      </div>
      <div class="my-mall my-assets">
        <div class="mall-content assets-warp">
          <div class="mall-item" v-for="(mall,index) in assetsList" :key="index"
            @click="openPage(mall.key)">
            <img :src="mall.img" alt="">
            <div class="direction">{{mall.name}}</div>
            <p class="tag-name"
              v-if="mall.showTag && (mall.key ==='pay'||mall.key ==='mall'||mall.key ==='schedule'&&redDot.myPrize)">
              {{mall.tagName}}</p>
            <p class="tag-name" v-if="mall.showTag && mall.key ==='cat' && isDriedFish">
              {{mall.tagName}}</p>
          </div>
          <!-- 返回首页 -->
          <div class="mall-item" v-if="$moduleConfig.plantVersion == 'red'"
            @click="openPage(backIndex.key)">
            <img :src="backIndex.img" alt="">
            <div class="direction">{{backIndex.name}}</div>
          </div>
        </div>
      </div>
      <!-- 轮播图 -->
      <slider v-if="showBanner" :list="bannerList" />
      <!-- 其他列表 -->
      <ul class="list-warp">
        <!-- 微信分享引导 -->
        <wechatShare />
        <li class="list-item" v-for="(item,index) in list" :key="index" @click="openPage(item.key)">
          <div class="title">
            <img :src="item.img" alt="">
          </div>
          <div class="content">
            <h3
              :class="{reddot:item.redDot||(item.key=='contact'&&getEcRedDot&&getEcRedDot.showEcRedDot)}">
              {{item.name}}</h3>
            <div class="content-description">
              <span v-if="item.descriptionShow">{{item.description}}</span>
              <span class="iconfont icon-next"></span>
            </div>
          </div>
        </li>
      </ul>
      <button class="btn_changeAccount" v-if="isShowChangeAccount"
        @click="changeAccount">切换账号</button>
    </div>
    <!-- 公共底部 -->
    <base-footer />
    <!-- 新手引导 -->
    <new-user-guide />
    <!-- 领取京东卡 -->
    <receive-JD-cart v-model="receiveJDCartShow" :cart="JDCartCall.JDCart"
      @on-success="JDCartCallFun" />
    <!-- 没有实名认证,提示用户去实名认证 -->
    <un-athentication ref="unAthentication" />
    <Modal v-model="showEcTip" :title="'专属客服为您服务'" :saveText="'去看看'" @on-save="goToContact">
      <div class="close_content" style="padding: 0">
        <div class="content-text" style="text-align: left">尊贵的{{userInfo.nickname}}：<br>
          <template v-if="rechargeLevel==1">
            您已获得专属VIP客服服务，添加客服微信即可获得专属福利。若您已添加过，请多多关注专属活动哦，我们会不定期发放优惠券~
          </template>
          <template v-else>
            为了更好地为您提供游戏服务，您可以添加<i
              style="color: #FF7800">{{weChatNo}}</i>客服微信号，我们将会为您提供更丰富的福利活动和游戏奖励。
          </template>
        </div>
      </div>
    </Modal>
    <!-- cdkey的新手引导一段时间后删除 -->
    <div class="cdkey-guide-wrapper" v-if="isShowCDKeyGuide" @click.stop="closeCDKeyGuide()">
      <div class="box"></div>
      <p class="text">游戏礼包兑换功能上线<br />输入兑换码立即得奖励</p>
      <img class="arrow" src="./image/arrow.png" alt="">
      <div class="btn">我知道了</div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import myHeader from './components/header'
import baseFooter from '@/components/baseFooter/baseFooter'
import { richAndconvertList, getMessageUnread, getCouponList, getMyBannerList, getExclusiveCustomerServiceInfo } from '../../services/user'
import { saveNewUserTask } from '@/services/global'
import { getRingServerStatus } from '@/services/shop'
import Services from '@/services/profit'
import { jumpUrl } from '@/utils/utils'
import newUserGuide from '@/components/newUserGuide/page2'
import UnAthentication from '@/components/unAuthentication/unAuthentication'
import receiveJDCart from './components/receiveJDCart' // 领取京东卡
import wechatShare from './components/wechatShare'
import slider from './components/slider'
import _get from 'lodash.get'

export default {
  name: 'my',
  components: {
    myHeader,
    baseFooter,
    newUserGuide,
    receiveJDCart,
    slider,
    UnAthentication,
    wechatShare
  },
  data () {
    return {
      assetsList: [
        { name: '充值', key: 'pay', img: require('./image/recharge.png'), showTag: true, tagName: '领金叶' },
        { name: '换好礼', key: 'mall', img: require('./image/mall.png'), showTag: true, tagName: '上新' },
        { name: '发现', key: 'find', img: require('./image/find.png'), showTag: false, tagName: '' },
        { name: '喂猫', key: 'cat', img: require('./image/cat.png'), showTag: true, tagName: '有鱼干' },
        { name: '奖品领取', key: 'schedule', img: require('./image/schedule.png'), showTag: true, tagName: '待领取' },
      ],
      backIndex: { name: '游戏', key: 'back', img: require('./image/back-game.png'), showTag: true, tagName: '' },
      list: [
        { name: '我的高光时刻', key: 'lsVideo', img: require('./image/ls-icon.png'), description: '', descriptionShow: true, routerName: '' },
        { name: '任务中心', key: 'task', img: require('./image/task.png'), description: '做任务，100%赚话费', descriptionShow: true, routerName: '' },
        { name: '优惠券', key: 'coupon', img: require('./image/coupon.png'), description: '有优惠未使用', descriptionShow: false, routerName: '' },
        { name: '碎片明细', key: 'chip', img: require('./image/chip-icon.png'), description: '', descriptionShow: false, routerName: '' },
        { name: '问题反馈', key: 'issues', img: require('./image/feedback.png'), description: '', descriptionShow: false, routerName: '' },
        { name: '游戏礼包兑换', key: 'cdkey', img: require('./image/cdkey.png'), description: '', descriptionShow: false, routerName: '' },
        { name: '联系客服', key: 'contact', img: require('./image/service.png'), description: '', descriptionShow: false, routerName: '' },
        { name: '用户协议', key: 'agreement', img: require('./image/agreement.png'), description: '', descriptionShow: false, routerName: '' }
      ],
      newShards: [],// 优惠劵列表
      JDCartCall: {},// 京东卡和话费劵
      messageUnread: 0, // 判断是否有未读消息
      couponList: [],// 优惠卷列表
      showViolation: window.localStorage.getItem('closeRules') ? false : true,// 违规的弹框
      receiveJDCartShow: false,// 领取京东卡
      bannerList: [],
      showEcTip: false,
      rechargeLevel: 0,
      weChatNo: '',
      isShowCDKeyGuide: false
    }
  },
  computed: {
    ...mapState(['userInfo', 'redDot', 'getEcRedDot']),
    isShowChangeAccount () {
      return ['100000', '100061', '100086','100086001','100086002', '100030', '100095', '100099', '100096', '100097', '100098', '100031'].indexOf(localStorage['APP_CHANNEL']) > -1
    },
    // 是否显示有鱼干
    isDriedFish () {
      return false
      // const { catDriedFish, catOwnCat } = this.userInfo
      // if (!catOwnCat) {
      //   return false
      // } else {
      //   return catDriedFish > 0 ? true : false
      // }
    },
    bgWrapper () {
      let signBg = _get(this, '$moduleConfig.my.bgImg', '')
      if (signBg) {
        return {
          'background-image': 'url(' + signBg + ')',
          'background-size': 'contain',
          'background-repeat': 'no-repeat'
        }
      }
      return {}
    },
    bgTheme () {
      return {
        background: _get(this, '$moduleConfig.my.bgColor', '#ff4141')
      }
    },
    // 是否显示有消息未读
    isMessageUnread () {
      if (this.messageUnread === 0) {
        return false
      } else {
        const extraUnreadCountData = localStorage.getItem('extraUnreadCountData')
          ? JSON.parse(localStorage.getItem('extraUnreadCountData'))
          : null
        if (extraUnreadCountData) {
          let allNumb = 0
          Object.keys(extraUnreadCountData).forEach(item => {
            allNumb += extraUnreadCountData[item]
          })
          if (this.messageUnread > allNumb) {
            return true
          } else {
            return false
          }
        } else {
          return true
        }
      }
    },
    // 是否显示轮播
    showBanner () {
      return this.bannerList.length
    }
  },
  methods: {
    ...mapActions({
      _getMyprizeRedDot: 'GET_MYPRIZE_REDDOT',
      _getEcRedDot: 'GET_EC_REDDOT'//个人中心专属客服红点、副标题
    }),
    ...mapMutations({
      _setEcRedDot: 'SET_EC_REDDOT'
    }),
    changeAccount () {
      localStorage.removeItem('ACCESS_TOKEN')
      this.$AppCall.switchAccount()
      if (['100030', '100096', '100095', '100099'].indexOf(localStorage['APP_CHANNEL']) > -1) {
        location.href = 'https://wap.beeplaying.com/loginPages/newDDWlogin.html?channel=' + localStorage['APP_CHANNEL'] + '&time=' + new Date().getTime() + '#/'
      }
      else {
        location.href = 'https://wap.beeplaying.com/publicWap/loginPage.html?channel=' + localStorage['APP_CHANNEL'] + '&from=plat&time=' + new Date().getTime() + '#/'
      }
    },
    // 页面初始化
    async pageInit () {
      this.$marchSetsPoint('P_H5PT0021')
      this.JDCartCallFun()
      // 消息提示
      const messageData = await getMessageUnread()
      if (messageData.code === 200) {
        this.messageUnread = messageData.data.quantity
      }
      if (!this.getEcRedDot) {
        await this._getEcRedDot()
      }
      this.getWxInfo()
      // 设置联系客服
      let contactIndex = this.list.findIndex(element => element.key === 'contact')
      this.$set(this.list[contactIndex], 'descriptionShow', true)
      this.$set(this.list[contactIndex], 'description', this.getEcRedDot.subTitle)
      const couponList = await getCouponList()
      if (couponList.code === 200 && couponList.data) {
        let length = couponList.data.filter(item => {
          return item.status == 1 || item.status == 3 || item.status == 4 || item.status == 6
        }).length
        if (length > 0) {
          // 设置优惠券
          let couponIndex = this.list.findIndex(element => element.key === 'coupon')
          this.$set(this.list[couponIndex], 'descriptionShow', true)
          this.$set(this.list[couponIndex], 'description', `您有${length}张优惠券待使用`)
        }
      }
      this._saveNewUserTask()
      this._getMyBannerList()
      this._getRingServerStatus()
      this._getMyprizeRedDot()
      this.$refs.unAthentication.init(function () { })
    },
    // 花费卷和京东卡数据换算
    async JDCartCallFun () {
      const { data, code } = await richAndconvertList()
      if (code === 200) {
        this.newShards = data
        let obj = {}
        data.forEach(item => {
          if (item['fragmentId'] === 7) {
            obj.call = item.fragmentNum
          }
          if (item['fragmentId'] === 8) {
            obj.JDCart = item.fragmentNum
          }
        })
        this.JDCartCall = obj
      }
    },
    // 数字计算
    moneyComputed (val, type) {
      if (!val) { return '0' }
      if (type === 'call') {
        val = val / 10
      }
      if (val < 10000) {
        return val
      } else {
        return (val / 10000).toFixed(2) + '<span style="font-size:0.8rem">万</span>'
      }
    },
    // 我的页面打开别页面
    async openPage (key) {
      switch (key) {
        case 'pay':
          this.$marchSetsPoint('A_H5PT0021000223') // H5平台-我的-金叶子-去充值
          this.$router.push({
            name: 'payment'
          })
          break
        case 'mall':
          this.$marchSetsPoint('A_H5PT0021001306')
          this.$router.push({ name: 'mall' })
          break
        case 'cat':
          await this.$marchSetsPoint('A_H5PT0021000227') // H5平台-我的-猫鱼干-去喂养
          jumpUrl({ url: '/petcat/' })
          break
        case 'chip': // 碎片
          this.$marchSetsPoint('A_H5PT0021000232')
          this.$router.push({ name: 'costLog' })
          break
        case 'message':
          this.$marchSetsPoint('A_H5PT0021001308') // H5平台-首页-消息气泡
          this.$router.push({ name: 'message' })
          break
        case 'task':
          this.$marchSetsPoint('A_H5PT0021001307')
          this.$router.push('task')
          break
        case 'schedule':
          this.$marchSetsPoint('A_H5PT0021000230')
          this.$router.push({ name: 'myPrize' })
          break
        case 'coupon':
          this.$marchSetsPoint('A_H5PT0021000228')
          this.$router.push({ name: 'myCoupon' })
          break
        case 'fish':
          this.$marchSetsPoint('A_H5PT0021000231')
          break
        case 'issues':
          this.$marchSetsPoint('A_H5PT0021000233')
          this.$router.push({ name: 'issues' })
          break
        case 'contact':
          this.$marchSetsPoint('A_H5PT0021001123')
          this.$router.push({ name: 'customerService' })
          this.getEcRedDot.showEcRedDot = false
          this._setEcRedDot(this.getEcRedDot)
          break
        case 'announcement':
          this.$marchSetsPoint('A_H5PT0021001120')
          this.$router.push({ name: 'issues' })
          break
        case 'ring':
          this.$marchSetsPoint('A_H5PT0021002355')
          this.goRing()
          break
        case 'back':
          window.location.href = 'baiduhaokan://action/goback'
          break
        case 'agreement':
          this.$marchSetsPoint('A_H5PT0021002675')
          this.$router.push({ name: 'userAgreement' })
          break
        case 'catright':
          await this.$marchSetsPoint('A_H5PT0021000227') // H5平台-我的-猫鱼干-去喂养
          this.$router.push({ name: 'catright' })
          break
        case 'find':
          this.$router.push({ name: 'find' })
          break
        case 'lsVideo':
          this.$marchSetsPoint('A_H5PT0021003287', {
            from_project_id: 'platFrom'
          })
          window.location.href = '//wap.beeplaying.com/activities/lsVideo.html#/my'
          break
        case 'cdkey':
          this.$marchSetsPoint('A_H5PT0021004367')// H5平台-我的-CDK礼包兑换按钮点击
          this.$router.push({ name: 'cdkey' })
          break
        default:
          break
      }
    },
    // 点击关闭公告
    async closeRules () {
      this.$marchSetsPoint('A_H5PT0021001305')
      localStorage.setItem('closeRules', 1)
      this.showViolation = false
    },
    // 资产点击
    assetsClick (key) {
      switch (key) {
        case 'payment':
          this.$router.push({
            name: 'payment'
          })
          break
        case 'mall':
          this.$router.push({ name: 'mall' })
          break
        default:
          break
      }
    },
    // 保存新手任务进入我的页面
    _saveNewUserTask () {
      saveNewUserTask({ value: 4 })
    },
    // 点击京东卡
    async JDAssets () {
      const { JDCart } = this.JDCartCall
      const JDCartNumber = JDCart / 10
      this.$marchSetsPoint('A_H5PT0021000225', { residual_jingdong: JDCart }) // H5平台-我的-京东卡-兑换
      if (!JDCartNumber || JDCartNumber < 50) {
        this.$Toast('还差一点点就可以提现')
      } else {
        this.receiveJDCartShow = true
      }
    },
    /** 获取banner图 **/
    _getMyBannerList () {
      getMyBannerList().then(res => {
        this.bannerList = res.data
      })
    },
    _getRingServerStatus () {
      getRingServerStatus().then(res => {
        let { data, code } = res.data
        if (code === 200) {
          if (data.type === '1' || (data.distanceStop < 0 && data.distanceStart >= 0)) {
            this.ringData = data
          }
        }
      })
    },
    goRing () {
      let url = this.ringData.type == 2 ? '/ring2/' : '/ring/'
      jumpUrl({ url })
    },
    async getWxInfo () {
      const { code, data } = await getExclusiveCustomerServiceInfo()
      if (code === 200) {
        this.weChatNo = data.weChatNo
        this.showEcTip = !!(data.showEcPopup && data.rechargeLevel)
        this.rechargeLevel = data.rechargeLevel//0 累充<1万 1 累充>=1万 2 累充>=10万
        if (this.showEcTip) {
          this.$marchSetsPoint(this.rechargeLevel == 1 ? 'A_H5PT0021004282' : 'A_H5PT0021004280')
        }
      }
    },
    goToContact () {
      this.$marchSetsPoint(this.rechargeLevel == 1 ? 'A_H5PT0021004283' : 'A_H5PT0021004281')
      this.showEcTip = false
      this.$router.push({ name: 'customerService' })
    },
    closeCDKeyGuide () {
      this.isShowCDKeyGuide = false
      localStorage.setItem('isShowCDKeyGuide', true)
    }
  },
  mounted () {
    this.pageInit()
    localStorage['isHideTip_my_find'] = 1 //隐藏tip的显示
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i)
      if (key.includes('isHideTip_my') && key !== 'isHideTip_my_find') {
        localStorage.removeItem(key)
      }
    }
    this.isShowCDKeyGuide = !localStorage.getItem('isShowCDKeyGuide')
  }
}
</script>
<style lang="less" scoped>
* {
  box-sizing: border-box;
}
.btn_changeAccount {
  background: #fff;
  width: 672px;
  height: 70px;
  line-height: 70px;
  border: none;
  font-size: 24px;
  color: #ff4141;
  margin-top: 120px;
  margin-left: 20px;
  border-radius: 16px;
}
.my-warp {
  position: relative;
  padding-top: 144px;
  padding-bottom: 170px;
  min-height: 100vh;
  overflow: hidden;
  background: #f7f7f7;
  color: #333;
  &.red {
    padding-bottom: 0;
  }
}
.my-header {
  .header-message {
    height: 80px;
    padding: 30px 30px 20px 30px;
    background-color: #ff4141;
    color: #ffffff;
    .message-warp {
      height: 60px;
      border-radius: 30px;
      width: 100%;
      background-color: rgba(194, 133, 1, 0.44);
      display: flex;
      position: relative;
      z-index: 1;
    }
    .img-warp {
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      img {
        width: 20px;
      }
    }
    .text-warp {
      flex: 1;
      line-height: 60px;
      font-size: 24px;
    }
    .open-buttom {
      width: 110px;
      height: 40px;
      text-align: center;
      border-radius: 20px;
      border: 2px solid #ffffff;
      line-height: 40px;
      margin-top: 10px;
      margin-right: 10px;
      font-size: 20px;
    }
  }
}
.my-assets {
  width: 100%;
  position: relative;
  padding: 4px 24px 0;
  .header-bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 150px;
    width: 100%;
    .center {
      height: 24px;
    }
    .bottom {
      height: 60px;
      width: 100%;
      border-bottom-left-radius: 100%;
      border-bottom-right-radius: 100%;
    }
  }
  .assets-warp {
    overflow: hidden;
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 100%;
    background-color: #ffffff;
    box-shadow: 0 0 10px rgba(208, 208, 208, 0.2);
    border-radius: 16px;
    .item {
      flex: 1;
      margin: 40px 0;
      text-align: center;
      border-right: 1px solid #e6e6e6;
      color: #000;
      &:last-child {
        border-right: none;
      }
      .title {
        font-size: 42px;
        font-weight: 700;
        line-height: 1;
      }
      .direction {
        margin-bottom: 15px;
        font-size: 24px;
      }
      span {
        font-size: 2px;
      }
    }
  }
}
.my-mall {
  height: 182px;
  margin-top: 16px;
  .mall-item {
    flex: 1;
    padding: 34px 0 28px;
    text-align: center;
    position: relative;
    img {
      margin-bottom: 12px;
      width: 72px;
    }
    .direction {
      line-height: 1;
      color: #000000;
      font-size: 24px;
    }
    .tag-name {
      position: absolute;
      top: 15px;
      left: 52%;
      z-index: 2;
      display: inline-block;
      border-radius: 18px;
      padding: 0 6px;
      height: 36px;
      line-height: 32px;
      font-size: 18px;
      color: #ffffff;
      border: 2px solid #ffffff;
      white-space: nowrap;
      background: linear-gradient(
        167deg,
        rgba(254, 92, 77, 1),
        rgba(249, 129, 53, 1)
      );
    }
  }
}
.list-warp {
  padding: 0 24px;
  margin-top: 30px;
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
        &.reddot {
          position: relative;
          &:after {
            content: '';
            position: absolute;
            right: -20px;
            top: -5px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #ff0000;
          }
        }
      }
      .content-description {
        display: flex;
        align-items: center;
        text-align: right;
        font-size: 24px;
        color: #888888;
        .iconfont {
          margin-left: 10px;
        }
      }
    }
    &:last-child .content {
      border-bottom: none;
    }
  }
}
.cdkey-guide-wrapper {
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .box {
    width: 70px;
    height: 70px;
    border-radius: 20px;
    box-shadow: 0 0 0 1800px rgba(0, 0, 0, 0.58);
    position: absolute;
    top: 43px;
    right: 72px;
  }
  .text {
    position: absolute;
    color: #fff;
    font-size: 24px;
    top: 140px;
    right: 150px;
  }
  .arrow {
    position: absolute;
    width: 83px;
    height: 74px;
    right: 80px;
    top: 110px;
  }
  .btn {
    position: absolute;
    width: 170px;
    height: 56px;
    border: 1px solid #fff;
    border-radius: 16px;
    color: #fff;
    text-align: center;
    line-height: 52px;
    font-size: 24px;
    top: 220px;
    right: 186px;
  }
}
</style>



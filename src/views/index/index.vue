<template>
  <div class="index" :class="$moduleConfig.plantVersion">
    <!--首页飘花-->
    <flowerDown />
    <base-header />
    <div class="index-container">
      <!-- banner -->
      <banner @callback="openPopup" />
      <!--排行榜，转盘，活动中心，招财猫-->
      <div class="operation"
        :class="{operationsBg:$moduleConfig.themes&&$moduleConfig.operationsBg}">
        <img :src="$moduleConfig.operationsBg" alt="" class="operationsBg_img"
          v-if="$moduleConfig.themes&&$moduleConfig.operationsBg">
        <ul>
          <li v-for="item in operations" :key="item.name" @click="doOperations(item.click)">
            <!-- 排行榜 -->
            <div class="dynamic-rank" v-if="item.id == 2 && !$moduleConfig.themes">
              <template v-if="dynamicRankStep == 0">
                <img class="step-0" src="./img/step0.png" alt="" />
              </template>
              <!-- 监听用户排名数据动画 -->
              <template v-if="dynamicRankStep == 1">
                <!-- 排名上升下降（字体） -->
                <img v-if="dynamicRank.curIndex < dynamicRank.lastIndex" class="step1-1"
                  src="./img/step1-2.png" alt="" />
                <img v-else class="step1-1" src="./img/step1-3.png" alt="" />
                <!-- 排名上身下降（箭头） -->
                <img v-if="dynamicRank.curIndex < dynamicRank.lastIndex" class="step1-2"
                  src="./img/step1-1.png" alt="" />
                <img v-else class="step1-3" src="./img/step1-1.png" alt="" />
              </template>
              <template v-if="dynamicRankStep == 2">
                <img class="step2" src="./img/step2.png" alt="" />
              </template>
              <template v-if="dynamicRankStep == 3">
                <div class="step3">{{ countDynamicRank }}</div>
              </template>
            </div>
            <!-- 金刚位图标 -->
            <img v-else :src="item.img" alt :class="{noanimation:$moduleConfig.themes}" />
            <!-- 倒计时 -->
            <count-down v-if="item.countDown" :time="item.countDown" @refresh="countDownCallback" />
            <!-- 金刚位名字 -->
            <p v-else>{{ item.name }}</p>
            <span class="label" v-if="item.label">{{ item.label }}</span>
            <span class="turntable_open" v-if="redDot.turntable && item.id === 3">
              <div class="item">转盘已开启</div>
            </span>
            <!--猫生病状态气泡-展腾飞-->
            <div class="catsick" v-if="item.id == 5 && [1, 2, 3].includes(catSickSate)">
              <div class="item" v-if="catSickSate == 1">
                <img src="./img/catsick/catsick_iconwarn.png" alt="" class="catsick_icon" />猫生病了
              </div>
              <div class="item" v-else-if="catSickSate == 2">猫快生病了</div>
              <div class="item" v-else>
                <img src="./img/catsick/catsick_iconhealthy.png" alt="" class="catsick_icon" />猫健康了
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!-- 限时礼包 -->
      <limit-card v-if="showExchangeCard" @callback="limitCardCallback" />
      <!-- 兑换接口增强 -->
      <exchange-enter @callback="exchangeEnterCallback" />
      <!-- 重新支付入口 -->
      <reset-pay />
      <!-- 游戏列表 -->
      <game-list @show-btc="showTurntableBTC" />
      <!--打开时自动弹框 start-->
      <!-- 新手礼包 -->
      <new-user-card ref="newUserCard" />
      <!-- 13点 21点发榜 -->
      <ranking-awards ref="rankingAwards" />
      <!-- 发优惠券 -->
      <confirm-coupon ref="confirmCoupon" />
      <!-- 周卡弹框 -->
      <weeks-awards ref="weekCard" />
      <!-- 转盘夺宝 根据url参数判断是否要弹-->
      <turntable ref="turntable" @openPreference="_getOneLottery" />
      <!-- 活动强广位 -->
      <activity-recommend ref="activityRecommend" @callback="openPopup" />
      <!-- 新手任务限时提醒 -->
      <new-user-task-pop ref="newUserTaskPop" />
      <!-- 没有实名认证,提示用户去实名认证 -->
      <un-athentication ref="unAthentication" />
      <!-- 精细化优惠券推送 -->
      <coupon-list ref="couponList" />
      <!-- 双十一礼包活动-->
      <week-package ref="weekPackage" />
      <!-- 活动中心弹框 -->
      <a-center v-if="newUserEntryType === 2" ref="aCenter" @callback="openPopup"></a-center>
      <renren-turntable-enter ref="renrenTurntableEnter"></renren-turntable-enter>
      <!-- 老虎机活动-->
      <slot-machine ref="slotMachine" />
      <!--打开时自动弹框 end-->
      <!-- 一元破冰 -->
      <one-lottery ref="oneLottery" />
      <!-- 充值特惠 -->
      <preference ref="preference" />
      <!-- 夺宝礼包 -->
      <cardLottery ref="cardLottery" @againpay="openPopup" />
      <!-- 活动中心入口 -->
      <acitvity-entry v-if="$moduleConfig.activityEntry" :user-type="newUserEntryType"
        @callback="openPopup" />
      <!-- ********* 活动（弹框， 功能， 放首页的） 下线删除 *********-->
      <!-- 玩游戏瓜分奖池 -->
      <play-game />
      <!-- ********* 活动（弹框， 功能， 放首页的） 下线删除 *********-->
      <!--侧边栏浮动砸蛋图标-->
      <egg-icon />
      <!--wap站提示添加多多玩到桌面-->
      <wap-addTip />
      <!-- 大户召回 -->
      <big-user-callback />
      <!-- 小户召回 -->
      <small-user-callback ref="smallUserReturn" />
      <!-- 探宝狂欢 返利卡倒计时-->
      <treasureHunt />
      <!-- 奇遇任务活动-->
      <adventure-task ref="adventureTask" />
      <!--回流礼包-->
      <return-bag ref="returnBags"></return-bag>
      <!--锦鲤许愿-->
      <koi-wish ref="koiWish"></koi-wish>
      <!--火拼三小时-->
      <three-hours ref="threeHours"></three-hours>
      <!--火拼三小时入口 -->
      <three-hours-entry />
      <!-- 转盘btc -->
      <turntable-btc ref="turntableBtc" />
      <!-- b2c充值加赠C端弹窗 -->
      <b2c-recharge-gift ref="b2cRechargeGift" />
      <!-- 优惠券btc -->
      <coupon-btc />
      <!-- 首页弹框超划算礼包 -->
      <inexpensive-card ref="InexpensiveCard" />
      <pool-jackpot />
      <minors-pop ref="noAdultNoPlayGame" />
      <!-- 连续七天签到 -->
      <seven-days-sign-entry/>
    </div>
    <div class="footer">
      <p>健康游戏忠告：</p>
      <p>抵制不良游戏，拒绝盗版游戏；</p>
      <p>注意自我保护，谨防受骗上当；</p>
      <p>适度游戏益脑，沉迷游戏伤身；</p>
      <p>合理安排时间，享受健康生活。</p>
      <br />
      <p>提供问题反馈请<a @click="goService">咨询客服</a>了解</p>
      <br />
      <p>版权所有©️{{ $companyInfo.copyright_company }}</p>
      <p>icp备案号：{{ $companyInfo.icp }}</p>
    </div>
    <base-footer />
  </div>
</template>
<script>
/**
 *   活动（弹框， 功能， 放首页的） 下线删除
 *   import bonusOpen from '@/components/popup/bonusOpen'
 **/
import BaseHeader from '@/components/baseHeader/baseHeader'
import BaseFooter from '@/components/baseFooter/baseFooter'
import OneLottery from '@/components/popup/oneLottery'
import Preference from '@/components/popup/preference'
import Turntable from '@/components/popup/turntable'
import CardLottery from '@/components/popup/treasureGift1908'
import weekPackage from '@/components/popup/weekPackage'
import shufflingGame from '@/components/popup/shufflingGame'
import ACenter from '@/components/popup/ACenter'
import renrenTurntableEnter from '@/components/popup/turntableEnter'
import UnAthentication from '@/components/unAuthentication/unAuthentication'
import Banner from './components/slider'
import HornList from './components/hornList'
import LimitCard from './components/limitCard'
import GameList from './components/gameList'
import RankingAwards from './components/rankingAwards'
import NewUserCard from './components/newUserCard'
import NewUserTaskPop from './components/newUserTaskPop'
import ConfirmCoupon from './components/confirmCoupon'
import WeeksAwards from './components/weeksAwards'
import ActivityRecommend from './components/activityRecommend'
import AcitvityEntry from './components/activityEntry'
import NewUserEgg from './components/newUserEgg'
import CountDown from './components/countDown'
import SlotMachine from './components/slotMachine'
import CouponList from './components/couponList'
import EggIcon from './components/eggIcon'
import TreasureHunt from './components/treasureHunt'
import FlowerDown from './components/flowerDown'
import ExchangeEnter from './components/exchangeEnter'
import ResetPay from './components/resetPay'
import PlayGame from './components/playGame'
import wapAddTip from './components/wapAddTip'
import TurntableBtc from './components/turntableBtc/btc'
import b2cRechargeGift from './components/b2cRechargeGift/index'
import CouponBtc from './components/couponBtc/btc'
import bigUserCallback from '@/components/bigUserCallback/bigUserCallback'
import smallUserCallback from '@/components/smallUserCallback/smallUserCallback'
import { mapState, mapActions } from 'vuex'
import newUtils, { jumpUrl, getUrlParams } from '@/utils/utils'
import Services from '@/services/activity'
import indexServices from '@/services/index'
import { saveNewUserTask } from '@/services/global'
import _get from 'lodash.get'
import _clonedeep from 'lodash.clonedeep'
import adventureTask from '@/components/popup/adventureTask'
import returnBag from '@/components/popup/returnBag'
import koiWish from '@/components/popup/koiwish'
import threeHours from '@/components/popup/threeHours'
import threeHoursEntry from './components/threeHoursEntry'
import poolJackpot from './components/poolJackpot/poolJackpot'
import MinorsPop from './components/minors/minors'
import InexpensiveCard from '@/components/inexpensiveCard/inexpensiveCard'
import SevenDaysSignEntry from './components/sevenDaysSignEntry'
export default {
  name: 'index',
  data () {
    return {
      dialogInfo: {
        num: 2,
        dialogCount: 0,
        dialogIndex: 0,
        labels: [
          'newUserCard',
          'NewUserTaskPop',
          'rankingAwards',
          'confirmCoupon',
          'weekCard',
          'activityRecommend',
          'unAthentication',
          'couponList',
          'weekPackage',
          'adventureTask',
          'returnbags',
          'koiWish',
          'smallUserReturn',
          'threeHours',
          'noAdultNoPlayGame',
          'InexpensiveCard',
          'turntableBtc',
          'b2cRechargeGift'
        ]
      },
      countTime: '',
      /** 限时礼包活动  下线请删除 **/
      showLimitCard: false,
      /** 限时金叶 不需的时候删除 **/
      showExchangeCard: false,
      /** 监听用户排名数据 **/
      dynamicRank: {},
      /* 监听用户排名数据动画 */
      dynamicRankStep: 0,
      catSickSate: 0, //猫身体状态 0:正常，1：生病, 2:濒临生病，3：恢复健康
      newUserEntryType: 0, // 0 请求未完成 1 新用户 2 老用户
      isShowTurntableBtc: false,
    }
  },
  components: {
    BaseHeader,
    BaseFooter,
    Banner,
    HornList,
    LimitCard,
    GameList,
    NewUserCard,
    NewUserTaskPop,
    RankingAwards,
    ConfirmCoupon,
    WeeksAwards,
    OneLottery,
    Preference,
    Turntable,
    CardLottery,
    weekPackage,
    ActivityRecommend,
    AcitvityEntry,
    shufflingGame,
    NewUserEgg,
    UnAthentication,
    CountDown,
    SlotMachine,
    CouponList,
    EggIcon,
    TreasureHunt,
    ExchangeEnter,
    PlayGame,
    ACenter,
    FlowerDown,
    renrenTurntableEnter,
    ResetPay,
    wapAddTip,
    bigUserCallback,
    smallUserCallback,
    adventureTask,
    TurntableBtc,
    b2cRechargeGift,
    CouponBtc,
    returnBag,
    koiWish,
    threeHours,
    threeHoursEntry,
    poolJackpot,
    /**
     *   活动（弹框， 功能， 放首页的） 下线删除
     *   bonusOpen
     **/
    MinorsPop,
    InexpensiveCard,
    SevenDaysSignEntry
  },
  computed: {
    ...mapState(['redDot', 'userInfo']),
    operations () {
      let operations = _clonedeep(this.$moduleConfig.operations)
      if (this.dynamicRank && this.dynamicRank.countDown) {
        operations[1].countDown = this.dynamicRank.countDown
      }
      return operations
    },
    countDynamicRank () {
      if (this.dynamicRank.curIndex > 1100) {
        return '1100+'
      }
      return this.dynamicRank.curIndex
    },
    /** 排行榜排名变化动画开关**/
    dynamicAnimationShow () {
      return (
        this.dynamicRank &&
        this.dynamicRank.curIndex != this.dynamicRank.lastIndex
      )
    },
  },
  methods: {
    initDialog () {
      let dialog = this.dialogInfo.labels[this.dialogInfo.dialogIndex]
      //新手引导打开转盘
      if (getUrlParams('openturntable') === 'open') {
        this.$refs.turntable.init()
        this.$router.replace('/')
      } else if (this.dialogInfo.dialogCount < this.dialogInfo.num && dialog) {
        if (this.$refs[dialog]) {
          this.$refs[dialog].init((data) => {
            this.dialogInfo.dialogIndex++
            if (data.isShow) {
              this.dialogInfo.dialogCount++
            } else {
              this.initDialog()
            }
          })
        }
      }
    },
    /** 抽免单活动 不需的时候删除 **/
    ...mapActions({
      _getUserInfo: 'GET_USERINFO', // 获取用户信息
    }),
    doOperations (func) {
      func(this)
    },
    /** 获取一元夺宝数据 **/
    _getOneLottery () {
      Services.getOneLottery().then((res) => {
        let { code } = _get(res, 'data', '')
        if (code === 200) {
          let { bettingTimes, newUserFeedbackList } = _get(
            res,
            'data.data',
            null
          )

          if (
            newUserFeedbackList[0] &&
            newUserFeedbackList[0].buyStatus === 0
          ) {
            // this.$refs.oneLottery.init()
            this.$router.push({
              name: 'onePay',
            })
          } else if (bettingTimes > 0) {
            // this.$refs.oneLottery.init()
            this.$router.push({
              name: 'onePay',
            })
          } else {
            this.openPopup('popup_getPreference')
          }
        }
        this.$refs.turntable.hideTurntable()
      })
    },
    /** 弹框, 集中处理 **/
    openPopup (url) {
      if (!url) {
        return false
      }
      let popupArray = {
        /** 一元夺宝 **/
        popup_oneLottery: 'oneLottery',
        /** 充值特惠 **/
        popup_getPreference: 'preference',
        /** 夺宝礼包 **/
        popup_getCardLottery: 'cardLottery',
        /** 转盘夺宝 **/
        popup_getTurntable: 'turntable',
        /** 底Bar 兼容打开弹框,统一版本后删除 **/
        openOneLottery: 'oneLottery',
        treasureCeremony: 'cardLottery',
        feedback: 'preference',
        open_payTurntable: 'turntable',
        treasureCeremony1908: 'cardLottery',
        /** 充值特惠 **/
        popup_acenter: 'aCenter',
      }
      for (let i in popupArray) {
        if (i === url) {
          this.$refs[popupArray[i]].init()
        }
      }
    },
    /** 兑换入口增强 **/
    exchangeEnterCallback (status) {
      if (status) {
        this.showExchangeCard = false
      } else {
        this.showExchangeCard = true
      }
    },
    /** 限时礼包 不需的时候删除 **/
    limitCardCallback (status) {
      if (status === 1) {
        this.showLimitCard = false
      } else {
        this.showLimitCard = true
      }
    },
    /** 排行榜排名变化**/
    _getDynamicRank () {
      Services.getDynamicRank().then((res) => {
        let { code, message } = _get(res, 'data', {})
        if (code === 200) {
          this.dynamicRank = _get(res, 'data.data', {})
          this.dynamicRankAnimation()
        }
      })
    },
    /** 排行榜变化动画 **/
    dynamicRankAnimation () {
      this.dynamicTimer = setTimeout(() => {
        this.dynamicRankStep++
        /** 排名没有发生变化显示的动画 **/
        if (
          this.dynamicRank.curIndex == this.dynamicRank.lastIndex &&
          this.dynamicRankStep == 1
        ) {
          this.dynamicRankStep = 3
          this.dynamicRankAnimation()
          return
        }
        if (this.dynamicRankStep == 4) {
          this.dynamicRankStep = 0
        }
        this.dynamicRankAnimation()
      }, 1300)
    },
    /** 排行榜倒计时回调 **/
    countDownCallback (item) {
      this.dynamicRank.countDown = false
    },
    /** 跳转客服 **/
    goService () {
      this.$router.push({
        name: 'customerService',
      })
    },
    init () {
      /** 排行榜排名变化**/
      this._getDynamicRank()
      this.getCatSickState()
      indexServices.getHomePopupList().then((res) => {
        let data = _get(res, 'data.data', null)
        if (data) {
          this.dialogInfo.labels = data.labels
          this.dialogInfo.num = data.num
          this.initDialog()
        }
      })
      //100030调一下verify接口，延长下登陆时间，奇葩的设计
      if (['100030', '100086', '100086001', '100086002'].indexOf(localStorage['APP_CHANNEL']) > -1) {
        indexServices.tokenVerify()
      }
      if (this.$moduleConfig.isClientC) {
        indexServices.getOpenToken().then((res) => {
          let openToken = _get(res, 'data.data.token', '')
          if (openToken) {
            localStorage.setItem('OPEN_ACCESS_TOKEN', openToken)
          }
        })
      }
      let userId = _get(this, 'userInfo.userId', '')
      this.$AppCall.bindPushAlias(userId.toString())
      this.$AppCall.saveToken(localStorage.getItem('ACCESS_TOKEN'))
    },
    async getCatSickState () {
      try {
        let { code, data } = (await indexServices.getCatSickState()).data
        if (code == 200) {
          this.catSickSate = data
        }
      } catch (e) { }
    },
    // 保存新手任务进入我的页面
    _saveNewUserTask () {
      saveNewUserTask({ value: 1 })
    },
    async _upgradeWheelActivityIcon () {
      try {
        const res = await indexServices.upgradeWheelActivityIcon()
        const code = _get(res, 'data.code', 0)
        const data = _get(res, 'data.data', false)
        if (code === 200) {
          this.newUserEntryType = data ? 1 : 2 // 1 新用户 2 老用户
        } else {
          this.newUserEntryType = 2
        }
      } catch (e) {
        this.newUserEntryType = 2
      }
    },
    showTurntableBTC () {
      this.$refs.turntableBtc._getTurntable()
    },
  },
  mounted () {
    this._upgradeWheelActivityIcon()
    this.init()
    this._saveNewUserTask()
    this.$marchSetsPoint('P_H5PT0019')
  },
}
</script>
<style scoped lang="less">
.turntable_open {
  position: absolute;
  width: 138px;
  height: 70.25px;
  background: url('./img/catsick/catsick_tipsbg.png');
  background-size: 100% 100%;
  top: -77px;
  left: 0;
  z-index: 10;
  animation: toggleTip 1s infinite ease-in-out;

  .item {
    display: inline-table;
    vertical-align: middle;
    font-size: 20px;
    font-weight: 500;
    color: #fff;
  }
}

/** 限时金叶 不需的时候删除 **/
.getIcon {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  height: 32px;
  border-radius: 20px;
  background: #fb4a0c;
  font-size: 20px;
  color: #fff;
}
/** 限时金叶 不需的时候删除 **/
img {
  max-width: 100%;
  vertical-align: top;
}
.index {
  padding: 70px 0 110px 0;
  background-color: #f7f7f7;
  min-height: 100vh;
  &.red {
    padding: 170px 0 0 0;
  }
  .index-container {
    .operation {
      padding: 17px 24px 0;
      &.operationsBg {
        position: relative;
        .operationsBg_img {
          height: 109px;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
        }
      }
      ul {
        display: flex;
        // justify-content: space-between;
        li {
          flex: 1;
          position: relative;
          text-align: center;
          img:not(.catsick_icon) {
            margin-bottom: 20px;
            vertical-align: top;
            width: 72px;
            height: 72px;
          }
          p {
            color: #000;
            font-size: 24px;
            font-weight: 400;
          }
          .label {
            position: absolute;
            right: -17px;
            top: -16px;
            padding: 0 6px;
            white-space: nowrap;
            border-radius: 32px;
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
          .red {
            position: absolute;
            right: 28px;
            top: 4px;
            width: 20px;
            height: 20px;
            border: 2px solid #fff;
            border-radius: 50%;
            background: #e8382b;
          }
          &:nth-child(1) {
            img {
              &:not(.noanimation) {
                animation: animation 2s infinite ease-in-out;
              }
            }
          }
          .dynamic-rank {
            position: relative;
            margin: 0 auto 20px;
            width: 72px;
            height: 72px;
            background: #ff7800;
            border-radius: 50%;
            .step-0 {
              margin: 0;
              position: absolute;
              top: 0;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              width: 48px;
              height: 45px;
            }
            .step1-1 {
              margin: 0;
              position: absolute;
              top: 0;
              left: 50%;
              transform: translate(-50%, 0);
              width: 47px;
              height: 21px;
              animation: rankUp1 1s 1 forwards;
            }
            .step1-2 {
              margin: 0;
              position: absolute;
              bottom: 0;
              left: 50%;
              transform: translate(-50%, 0);
              width: 23px;
              height: 23px;
              animation: rankUp2 1s 1 forwards;
            }
            .step1-3 {
              margin: 0;
              position: absolute;
              bottom: 0;
              left: 50%;
              transform: translate(-50%, 0) rotate(180deg);
              width: 23px;
              height: 23px;
              animation: rankUp2-1 1s 1 forwards;
            }
            .step2 {
              margin-top: 14px;
              width: 48px;
              height: 45px;
              transform: scale(0);
              animation: rankUp3 1s 1 forwards;
            }
            .step3 {
              width: 100%;
              height: 100%;
              line-height: 72px;
              text-align: center;
              font-size: 20px;
              color: #fff;
              white-space: nowrap;
              transform: scale(0);
              animation: rankUp3 1s 1 forwards;
            }
          }
        }
      }
    }
  }
  .catsick {
    width: 138px;
    height: 70.25px;
    background: url('./img/catsick/catsick_tipsbg.png');
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -77px;
    z-index: 1;
    padding-bottom: 10px;
    box-sizing: border-box;
    animation: toggleTip 1s infinite ease-in-out;
    .item {
      font-size: 20px;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      display: flex;
      justify-content: center;
      align-items: center;
      .catsick_icon {
        margin-right: 3px;
        display: inline-block;
        width: 30px !important;
        height: 30px !important;
      }
    }
  }
  .footer {
    text-align: center;
    font-size: 20px;
    color: #bbb;
    margin-bottom: 1rem;
    a {
      color: #f67804;
      text-decoration: underline;
    }
  }
}
@keyframes animation {
  0% {
  }
  10% {
  }
  20% {
  }
  30% {
  }
  40% {
  }
  50% {
    transform: scale(0.9);
  }
  60% {
    transform: scale(1);
  }
  70% {
    transform: scale(0.9);
  }
  80% {
    transform: scale(1);
  }
  90% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes toggleTip {
  0% {
    top: -77px;
  }

  50% {
    top: -85px;
  }

  100% {
    top: -77px;
  }
}

@keyframes rankUp1 {
  0% {
  }
  60% {
    transform: translate(-50%, 0.4rem);
  }
  70% {
    transform: translate(-50%, 0.2rem);
  }
  80% {
    transform: translate(-50%, 0.4rem);
  }
  90% {
    transform: translate(-50%, 0.2rem);
  }
  100% {
    transform: translate(-50%, 0.4rem);
  }
}
@keyframes rankUp2 {
  0% {
  }
  60% {
    transform: translate(-50%, -0.4rem);
  }
  70% {
    transform: translate(-50%, -0.2rem);
  }
  80% {
    transform: translate(-50%, -0.4rem);
  }
  90% {
    transform: translate(-50%, -0.2rem);
  }
  100% {
    transform: translate(-50%, -0.4rem);
  }
}
@keyframes rankUp2-1 {
  0% {
  }
  60% {
    transform: translate(-50%, -0.4rem) rotate(180deg);
  }
  70% {
    transform: translate(-50%, -0.2rem) rotate(180deg);
  }
  80% {
    transform: translate(-50%, -0.4rem) rotate(180deg);
  }
  90% {
    transform: translate(-50%, -0.2rem) rotate(180deg);
  }
  100% {
    transform: translate(-50%, -0.4rem) rotate(180deg);
  }
}
@keyframes rankUp3 {
  0% {
  }
  60% {
    transform: scale(1);
  }
  70% {
    transform: scale(0.8);
  }
  80% {
    transform: scale(1);
  }
  90% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(1);
  }
}
</style>

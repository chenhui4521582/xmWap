<template>
  <transition :name="hideAnimation">
    <div class="pop-window" style="z-index: 12;" v-if="showCardLottery">
      <div class="pop-mask-1908"></div>
      <div class="gift-wrap" v-if="!showResult">
        <div class="gift-content midautumn">
          <img class="bg" src="../img/treasureGift1908/bg.png" alt="">
          <div class="btn-rule" @click.stop="openRules"></div>
          <div class="gift-box">
            <div class="gift-list" v-if="leaguePacksList">
              <template v-for="(item,index) in leaguePacksList">
                <div class="g-container"
                  :style="{background:getImgUrl(item.price,index)+' no-repeat',backgroundSize:'100% 100%'}"
                  v-if="item.buyFlag == 1" @click="goToPay(item)">
                  <template v-if="item.phyAwardsId">
                    <p>
                      <span>{{item.shortTimes|shortTimesFilter}}</span>加赠{{getExtDes(item.extraAwardAmount,item.extraAwardType)}}
                    </p>
                  </template>
                </div>
                <div class="g-container"
                  :style="{background:getImgUrl(item.price,index)+' no-repeat',backgroundSize:'100% 100%'}"
                  v-else>
                  <template v-if="item.phyAwardsId">
                    <p>
                      <span>{{item.shortTimes|shortTimesFilter}}</span>加赠{{getExtDes(item.extraAwardAmount,item.extraAwardType)}}
                    </p>
                  </template>
                </div>
              </template>
            </div>
          </div>
          <div class="close-btn jd" @click="closePop"></div>
        </div>
      </div>
      <div class="result-pop" v-else>
        <div class="result-wrap" :class="prizingList.num==dataList.hitNum?'lucky':'failed'">
          <template v-if="prizingList.haveExtra">
            <div class="ext-award">
              <div class="ext-title">
                特别爱给特别的你
              </div>
              <div class="ext-img">
                <img :src="prizingList.awardUrl|filter" alt="额外奖励">
                <span>{{prizingList.extraAwardName}}</span>
              </div>
              <p class="ext-other">再购买三次礼包仍可以获得额外加赠</p>
            </div>
          </template>
          <template v-else>
            <div class="man-icon" @click="againpay"></div>
          </template>
          <p class="number-show">
            <span>指定号码：{{dataList.hitNum}}</span><br>
            <i>获得号码：{{prizingList.num}}</i>
          </p>
          <div class="more-btn" @click="againpay"></div>
          <p class="desc" v-if="prizingList.num==dataList.hitNum||prizingList.haveExtra">
            奖励已发放,可至“我的”-“我的资产”查看</p>
        </div>
        <div class="close-btn" @click="closePop"></div>
      </div>
      <!-- 规则弹窗 -->
      <div class="rule-modal" v-if="isPopRules">
        <div class="pop-mask-1908"></div>
        <div class="modal-bg">
          <div class="rule-header">
            <img src="../img/treasureGift1908/rule-text.png" alt="">
          </div>
          <div class="rule-main">
            <ul>
              <li>
                活动时间:<br>
                {{dataList.showTime}}
              </li>
              <li>玩家通过购买礼包可以获得随机号码一个;随机号码在1-10直接产生;</li>
              <li>如随机号码为“8” ,则代表中奖，可获得对应礼包的京东卡和金叶子奖励;</li>
              <li>不同的礼包获得不同面额的京东卡和金叶子。</li>
              <li>活动期间单日购买88或888礼包每达3次，可获得额外加赠奖励，加赠奖励以礼包类型而定。</li>
            </ul>
          </div>
          <a href="javascript:" class="closeRule" @click="closeRule"></a>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { bottomBarJump, newUtils } from '@/utils/utils'
import Services from '@/services/activity'
import _get from 'lodash.get'
export default {
  props: {
    animation: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataList: null,
      prizingList: null,
      leaguePacksList: null,
      flag: -1,
      lamp: '',
      timer: null,
      isMove: false,
      isPopRules: false,
      isJDDChannel: false,
      extraInfos: [],
      showCardLottery: false,
      showLeaguePacksList: null
    }
  },
  filters: {
    shortTimesFilter (val) {
      let des = ''
      switch (val) {
        case 3:
          des = '购买三次'
          break
        case 2:
          des = '再购两次'
          break
        case 1:
          des = '再购一次'
          break
        default:
          break
      }
      return des
    }
  },
  computed: {
    giftLevel () {
      //  bagLevel 1:8;2:88;3:888
      let data = this.prizingList.bagLevel
      if (data == 1) {
        return 18
      } else if (data == 2) {
        return 88
      } else {
        return 888
      }
    },
    leftChance () {
      let data = this.leaguePacksList.map(item => {
        if (item.price == this.giftLevel) {
          return item.limitTimes
        }
      })
      return data[0]
    },
    hideAnimation () {
      return this.animation ? 'hide' : ''
    },
    showResult () {
      return this.dataList.getBag
    },
  },
  async mounted () {
    //判断当前是否是首页
    if (this.$route.name != 'index') {
      this._getCardLotteryResult()
    }
  },
  methods: {
    closeRule () {
      this.isPopRules = false
    },
    // 跑马灯滚动
    scroll () {
      this.isMove = true
      setTimeout(() => {
        this.lamp.push(this.lamp[0])
        this.lamp.shift()
        this.isMove = false
      }, 1000)
    },
    getBagNotice () {
      Services.getBagNotice({
        num: 20
      }).then(response => {
        if (response.data.code == 200) {
          this.lamp = response.data.data
        }
      })
    },
    getExtraInfo () {
      Services.getExtraInfo().then(response => {
        if (response.data.code == 200) {
          this.extraInfos = response.data.data.extraInfos
          this.leaguePacksList = this.showLeaguePacksList && this.showLeaguePacksList.leaguePacksList && this.showLeaguePacksList.leaguePacksList.map(element => {
            let index = this.extraInfos.findIndex(item => {
              return item.phyAwardsId === element.awardsList[0].phyAwardsId
            })
            if (index > -1) {
              element = { ...element, ...this.extraInfos[index] }
            }
            return element
          })
        }
      })
    },
    getExtDes (extraAwardAmount, extraAwardType) {
      let des = ''
      switch (extraAwardType) {
        case 1:
          des = extraAwardAmount + '金叶'
          break
        case 10:
          des = extraAwardAmount / 10 + '元京东卡'
          break

        default:
          break
      }
      return des
    },
    openRules () {
      this.$marchSetsPoint('A_H5PT0147001705')
      this.isPopRules = true
    },
    async goToPay (item) {
      this.$marchSetsPoint('A_H5PT0147001610', {
        task_name: item.name,
        task_id: item.bizId,
        recharge_rmb: item.price,
        plat_version: localStorage.getItem('APP_VERSION') || '1.0.0',
        product_id: item.bizId
      })
      localStorage.setItem('paidMaidian', 9)
      localStorage.setItem('paidPrice', item.price)
      this.showCardLottery = false
      localStorage.setItem('treasureGift', '2019081501')
      if (item.buyFlag == 1 && item.totalNum > 0) {
        localStorage.setItem('payment', JSON.stringify(item))
        bottomBarJump('#/payment/paymentlist', 'paymentList', this.$router)
      }
    },
    closePop () {
      this.showCardLottery = false
    },
    getImgUrl (price, index) {
      let url = require(`../img/treasureGift1908/${price}-${index > 2 ? 'leaf' : 'jd'}.png`)

      return `url(${url})`
    },
    againpay () {
      // 埋点
      this.closePop()
      this.$marchSetsPoint('A_H5PT0147001706')
      this.$emit('againpay', 'treasureCeremony1908')
    },
    async init () {
      this._getCardLotteryResult()
      let { data } = await Services.getCardLottery('2019081501')
      if (data.code === 200) {
        this.showLeaguePacksList = data.data
        this.showCardLottery = true
      }
      // 轮播
      // this.getBagNotice()
      this.getExtraInfo()
      this.$marchSetsPoint('P_H5PT0147')
    },
    /** 获取夺宝礼包是否支付 **/
    _getCardLotteryResult () {
      Services.getCardLotteryResult().then(res => {
        this.dataList = _get(res, 'data.data', {})
        if (this.dataList.getBag != null) {
          this.showCardLottery = true
          this.prizingList = this.dataList.getBag
        }
      })
    },
  },
  watch: {
    showCardLottery (value) {
      if (value) {
        newUtils.ScrollNoMove()
      } else {
        newUtils.ScrollMove()
      }
    }
  }
}

</script>
<style lang="less" scoped>
@import './index';
</style>

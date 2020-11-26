<template>
  <div class="new-sign">
    <div class="wrapper" :class="{'closed': signToggle }" :style="bgTheme">
      <div class="sign-header">
        <div class="day">
          <img src="../img/sign/sign-icon.png" alt="" class="sign-icon">
          <i>已连续签到 </i>
          <span>{{ currDay }}</span>
          <i> 天</i>
        </div>
        <div class="tips">
          <span>连续签到7天可领神秘大礼</span>
          <span class="toggle" :class="{'closed': signToggle }" @click="signToggleClick">
          </span>
        </div>
      </div>
      <div class="s-items" v-show="signToggle">
        <ul>
          <li :class="{ active: needAnimation && index == signinDay - 1 }"
            v-for="(item, index) in newList && newList.awardsList" :key="index">
            <div class="box">
              <div class="sign-icon" v-show="item.status == 0" @click="checkPrice(index)">
                <img :src="item.showIcon | filter" class="icon" />
              </div>
              <div class="signed-icon" v-show="item.status == 1">
                <img :src="item.showSignedIcon | filter" class="icon" />
              </div>
              <div class="line">
                <div class="inline" :class="{
                    active:
                      item.status == 1 ||
                      (needAnimation && index == signinDay - 1)
                  }"></div>
              </div>
              <div class="tips" v-if="!is7Day">
                <img src="../img/sign/tips.png" alt />
              </div>
            </div>
            <span class="s-time">第{{ item.day }}天</span>
          </li>
        </ul>
        <div class="sign-btn" :class="{gray:isSign}" @click="getUserSign">签到领奖励</div>
      </div>
      <transition name="scalc">
        <div class="new-sign-box" v-show="showDialog">
          <div class="dialog-1" v-show="dialogStatus == 1">
            <div class="content" :class="{'no-border':hasRecommend}">
              <div class="title">
                <img src="../img/sign/title.png" alt />
              </div>
              <div class="sign-text">
                <div class="t">恭喜你签到成功获得</div>
                <template v-if="!showAwardsDialog">
                  <div class="award"
                    v-for="(item, index) in curAwardCon.signAwards && curAwardCon.signAwards.awardsDesc"
                    :key="index">
                    <img :src="item.awardIcon | filter" class="award-img" />
                    <p>{{ item.awardsNumDesc }}</p>
                  </div>
                </template>
                <template v-if="showAwardsDialog">
                  <div class="awards">
                    <div class="item"
                      v-for="(item, index) in curAwardCon.signAwards && curAwardCon.signAwards.awardsDesc"
                      :key="index">
                      <img :src="item.awardIcon | filter" class="award-img" />
                      <span>{{ item.awardsNumDesc }}</span>
                    </div>
                  </div>
                </template>
              </div>
              <div class="check-price">
                <span v-show="signinDay != 7">连续签到7天可获得神秘大礼</span>
                <span v-show="signinDay == 7">哇偶！您已经连续签到7天，获得神秘大礼</span>
              </div>
              <div class="select-btn">
                <!-- 如果是优惠券则显示立即使用 -->
                <template
                  v-if="curAwardCon.signAwards && curAwardCon.signAwards.awardsDesc && !showAwardsDialog && curAwardCon.signAwards.awardsDesc[0] && Number(curAwardCon.signAwards.awardsDesc[0].awardsType) === 32">
                  <div class="btn go-task" @click="toUseCoupons">立即使用</div>
                </template>
                <template v-else>
                  <div class="btn go-task" @click="closeSignPop">做任务赚话费</div>
                  <div class="go-index" @click="goIndex">玩游戏赚话费 <span
                      class="iconfont icon-next"></span></div>
                </template>
              </div>
              <div class="sign-btn iconfont icon-close" @click="closeSignPop"></div>
            </div>
            <div class="sign-recommend" v-if="hasRecommend" @click="clickRecommend">
              <a href="javascript:">
                <img :src="curAwardCon.operation.cdnImage | filter" alt />
              </a>
            </div>
          </div>
          <div class="dialog-4" v-show="dialogStatus == 4">
            <div class="bg">
              <img src="../img/sign/click-7.png" alt />
            </div>
            <div class="sign-btn iconfont icon-close" @click="hidePrice"></div>
          </div>
        </div>
      </transition>
    </div>

    <Modal v-model="showModal" title="看视频 领双倍签到金叶子" saveText="点我领取奖励" @on-save="readAds()">
      <div class="remove-wrap">
        <img src="../img/sign/read-ads-icon.png" alt="">
        <div>看完广告才能获得奖励哦</div>
      </div>
    </Modal>
  </div>
</template>
<script type="text/javascript">
import { mapState, mapActions } from 'vuex'
import Services from '@/services/task'
import { jumpUrl, getUrlParams, newUtils, bdAdsInit } from '@/utils/utils'
import { ifError } from 'assert'
import _get from 'lodash.get'

export default {
  name: 'sign',
  data: () => ({
    newList: {},
    isCurDaySign: false,
    curAwardCon: {},
    curAwardConFinish: null,
    isAdver: false,
    isFrame: false,
    isAdverStatus: false,
    signinDay: 0,
    needAnimation: false,
    dialogStatus: 0,
    signBtn: false,
    signToggle: true,
    showModal: false,
  }),
  computed: {
    ...mapState({
      isSign: 'userSign',
      userInfo: 'userInfo'
    }),
    bgTheme () {
      let signBg = _get(this, '$moduleConfig.task.signBg', '')
      if (signBg) {
        return {
          'background-image': 'url(' + signBg + ')',
          'background-size': 'cover'
        }
      }
      return {
        background: '#fff'
      }
    },
    currDay () {
      let currDay =
        this.newList &&
        this.newList.awardsList &&
        this.newList.awardsList.filter(item => {
          return item.status == 1
        }).length
      return currDay
    },
    is7Day () {
      return this.currDay == 7
    },
    hasRecommend () {
      return (
        this.curAwardCon &&
        this.curAwardCon.operation &&
        Object.keys(this.curAwardCon.operation).length
      )
    },
    showDialog () {
      return (
        (this.isCurDaySign &&
          this.curAwardCon &&
          this.curAwardCon.signAwards) ||
        this.isCurDaySign
      )
    },
    curChannel () {
      return localStorage.getItem('APP_CHANNEL') ? localStorage.getItem('APP_CHANNEL') : getUrlParams('channel')
    },
    showAwardsDialog () {
      return this.curAwardCon.signAwards && this.curAwardCon.signAwards.awardsDesc && this.curAwardCon.signAwards.awardsDesc.length > 1
    },
    needReadAds () {
      return (this.curChannel.indexOf('100039') > -1 || this.curChannel.indexOf('100042') > -1) && this.userInfo && this.userInfo.userType === 1
    }
  },
  methods: {
    ...mapActions({
      updateUserInfo: 'GET_USERINFO'
    }),
    _getSignList () {
      Services.getSignList().then(res => {
        if (res.data.code == 200) {
          this.newList = res.data.data
        }
      })
    },
    getReward () {
      if (this.needReadAds) {

        let adsData = {
          sourceType: 1,
          entrance: '签到',
        }
        bdAdsInit()
        localStorage.setItem('adsData', JSON.stringify(adsData))
        window.closeAdver = this._getReward
        this.showModal = true
        return
      }
      this._getReward()
    },
    _getReward () {
      this.$marchSetsPoint('A_H5PT0022000239')
      Services.getReward().then(res => {
        if (res.data.code == 200) {
          this.curAwardCon = res.data.data
          if (this.curAwardCon.signAwards && this.curAwardCon.signAwards.awardsDesc && this.curAwardCon.signAwards.awardsDesc[0] && this.curAwardCon.signAwards.awardsDesc[0].jumpUrl) {
            this.$marchSetsPoint('A_H5PT0225003045')
          }
          let { day = 0 } = this.curAwardCon.signAwards
          this.signinDay = day
          this.dialogStatus = 1
          this.isCurDaySign = true
          this.needAnimation = false
          this.signBtn = true
          this.updateUserInfo()
          this.$emit('getReward', false)
        }
      })
    },
    animation () {
      this.updateUserInfo()
      this.isCurDaySign = false
      this.isAdverStatus = false
      this.needAnimation = true
      setTimeout(() => {
        this.newList.awardsList[this.signinDay - 1].status = 1
      }, 400)
      setTimeout(() => {
        this.needAnimation = false
        this.signBtn = false
        this.signToggle = false
        this.init()
      }, 1000)
    },
    toUseCoupons () {
      // debugger
      if (this.curAwardCon.signAwards && this.curAwardCon.signAwards.awardsDesc && this.curAwardCon.signAwards.awardsDesc[0] && this.curAwardCon.signAwards.awardsDesc[0].jumpUrl) {
        this.$marchSetsPoint('A_H5PT0225003046')
        location.href = this.curAwardCon.signAwards.awardsDesc[0].jumpUrl
      }
      this.$router.push({ path: '/payment/' })
    },
    closeSignPop () {
      this.$marchSetsPoint('A_H5PT0022001315')
      this.animation()
    },
    checkPrice (index) {
      if (index == 6) {
        this.isCurDaySign = true
        this.dialogStatus = 4
      }
    },
    hidePrice () {
      this.isCurDaySign = false
    },
    async clickRecommend () {
      await this.$marchSetsPoint('A_H5PT0022001137')
      jumpUrl({ url: this.curAwardCon.operation.url })
    },
    goIndex () {
      this.$marchSetsPoint('A_H5PT0022001316')
      this.$router.push({ path: '/' })
    },
    signToggleClick () {
      this.signToggle = !this.signToggle
      if (this.signToggle === false) {
        this.$marchSetsPoint('A_H5PT0022001686')
      } else {
        this.$marchSetsPoint('A_H5PT0022001687')
      }
    },
    toggleClosed () {
      this.$marchSetsPoint('A_H5PT0022001686')
      this.signToggle = false
    },
    init () {
      this._getSignList()
    },
    readAds () {
      this.showModal = false

      let lastWatchTime = localStorage['cache_lastWatchAds']

        if(lastWatchTime){
          //检测看广告时间距离上次是否超过30s
          let range = Date.now()-lastWatchTime;
          if(range<30*1000){
            this.$Toast('广告准备中请'+parseInt(30-range/1000)+'秒后再试')
            return false;
          }
        }

      try {
        rewardVideo.show()
      } catch (error) {
        this.$Toast('广告加载失败')
        this._getReward()
      }
    },
    getUserSign () {
      this.$emit('getUserSign', true)
    }
  },
  created () {
    this.init()
  },
  watch: {
    showDialog (value) {
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
.new-sign-box {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 12;
  text-align: center;
  .dialog-1 {
    position: absolute;
    width: 470px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .content {
      position: relative;
      z-index: 2;
      background: #fff;
      border-radius: 32px;
      padding: 92px 0 26px;
      &.no-border {
        border-radius: 32px 32px 0 0;
      }
      .title {
        position: absolute;
        width: 275px;
        height: 155px;
        left: 50%;
        top: -78px;
        transform: translate(-50%, 0);
        img {
          width: 100%;
          height: 100%;
          vertical-align: top;
        }
      }
      .sign-text {
        margin: 0 auto;
        .t {
          font-size: 28px;
          color: #000;
          font-weight: bold;
          line-height: 1.1;
        }
        .award {
          margin: 24px 24px 0;
          .award-img {
            display: block;
            margin: 0 auto 22px;
            width: 150px;
            height: 110px;
          }
          p {
            color: #ff4141;
            font-size: 24px;
            text-align: center;
          }
        }
        .awards {
          margin: 15px 0;
          display: flex;
          justify-content: center;
          align-items: center;
          .item {
            margin-right: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            .award-img {
              margin-right: 5px;
              display: block;
              width: 30px;
              height: 30px;
            }
            span {
              line-height: 1;
              color: #ff4141;
              font-size: 24px;
            }
          }
        }
      }
      .check-price {
        margin: 6px auto 0;
        font-size: 20px;
        text-align: center;
        span {
          color: #bbbbbb;
        }
      }

      .sign-btn {
        position: absolute;
        right: 10px;
        top: 13px;
        width: 60px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        color: #acacac;
        background-color: rgba(255, 255, 255, 0);
        font-size: 22px;
      }
      .select-btn {
        margin-top: 26px;
        text-align: center;
        font-size: 24px;
        .btn {
          margin: 0 auto;
          width: 250px;
          height: 70px;
          line-height: 70px;
          overflow: hidden;
          border-radius: 16px;
        }
        .go-task {
          margin-bottom: 17px;
          background-color: #ff4141;
          color: #fff;
        }
        .go-index {
          color: #5186ca;
        }
        &.recommend {
          margin-top: 40px;
        }
      }
    }
    .sign-recommend {
      width: 100%;
      border-radius: 28px;
      overflow: hidden;
      position: relative;
      z-index: 2;
      border-radius: 0 0 32px 32px;
      background: #fff;
      top: -3px;
      padding: 20px;
      border-top: 1px #eee solid;
      img {
        vertical-align: top;
        width: 430px;
        height: 140px;
      }
    }
  }
  .dialog-4 {
    position: absolute;
    width: 470px;
    height: 575px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .bg {
      width: 100%;
      height: 100%;
      img {
        vertical-align: top;
        width: 100%;
        height: 100%;
      }
    }
    .sign-btn {
      position: absolute;
      left: 215px;
      bottom: -80px;
      width: 50px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      color: #fff;
      background: #959595;
      border-radius: 50%;
      font-size: 20px;
    }
  }
}
.btn-adver-top {
  margin-top: 20px;
  margin-left: 0 !important;
}
.new-sign {
  font-size: 22px;
  margin: 0 24px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
  overflow: hidden;

  .wrapper {
    padding: 0 20px;
    &.closed {
      padding: 0 20px 20px;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      padding-bottom: 23px;
    }
    li {
      flex: 1;
      text-align: center;
      position: relative;

      &:first-child {
        flex: 80px 0 0;

        .box {
          .sign-icon,
          .signed-icon {
            float: left;
            margin: 0;
          }

          .signed-icon {
            .icon {
              vertical-align: top;
              width: 68px;
              height: 68px;
            }
          }
        }

        .s-time {
          text-indent: 1px;
          display: block;
          width: 68px;
        }
      }

      &:last-child {
        flex: 80px 0 0;

        .box {
          .sign-icon,
          .signed-icon {
            float: right;
            margin: 0;

            .icon {
              width: 100%;
              height: 100%;
            }
          }

          .signed-icon {
            .icon {
              vertical-align: top;
              width: 68px;
              height: 68px;
            }
          }

          .tips {
            display: block;
          }
        }

        .s-time {
          float: right;
          display: block;
          width: 68px;
        }
      }

      &:nth-child(2) {
        .box {
          .sign-icon,
          .signed-icon {
            .icon {
              width: 100%;
              height: 100%;
            }
          }

          .signed-icon {
            .icon {
              vertical-align: top;
              width: 68px;
              height: 68px;
            }
          }
        }
      }

      .box {
        height: 68px;
        width: 100%;
        display: block;
        position: relative;

        .sign-icon,
        .signed-icon {
          margin: 0 auto;
          height: 68px;
          width: 68px;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          border-radius: 50%;
          position: relative;
          z-index: 2;
          .icon {
            width: 100%;
            height: 100%;
          }
        }

        .signed-icon {
          .icon {
            vertical-align: top;
            width: 68px;
            height: 68px;
          }
        }

        .line {
          position: absolute;
          left: 0;
          top: 50%;
          height: 6px;
          background: #fff2d0;
          margin-top: -3px;
          width: 100%;
          z-index: 1;
          .inline {
            width: 0;
            height: 100%;
            background-color: #ffbc00;
            &.active {
              width: 100%;
            }
          }
        }

        .tips {
          display: none;
          position: absolute;
          top: -10px;
          left: 30px;
          width: 64px;
          height: 20px;
          z-index: 9;

          img {
            width: 100%;
            vertical-align: top;
          }
        }
      }

      .s-time {
        display: block;
        width: 100%;
        font-size: 24px;
        color: #252525;
        margin-top: 14px;
      }
    }
    li.active {
      .box {
        .sign-icon {
          background: #ff4141;
          .icon {
            animation: fadeout 0.4s forwards;
          }
        }

        .signed-icon {
          .icon {
            animation: fadein 0.6s ease-out;
          }
        }
        .line {
          .inline {
            transition: all 1s;
          }
        }
      }
    }
    .btn-sign-container {
      position: absolute;
      top: 100px;
      right: 30px;
      text-align: center;
      z-index: 11;
      .btn {
        min-width: 160px;
        display: inline-block;
        padding: 0 23px;
        height: 54px;
        line-height: 54px;
        background: rgba(238, 111, 11, 1);
        border-radius: 3px;
        font-size: 24px;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        &.btn-gray {
          background: #4e5666;
          color: #0f1726;
        }
      }
      &.hide {
        visibility: hidden;
      }
    }
  }
  .remove-wrap {
    img {
      width: 256px;
      height: 160px;
      display: block;
      margin: 0 auto;
    }
    div {
      text-align: center;
      margin: 16px 0 0;
      color: #bbb;
      font-size: 20px;
      line-height: 30px;
    }
  }
}

.sign-header {
  padding: 22px 0 23px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .day {
    font-size: 28px;
    color: #000000;
    .sign-icon {
      vertical-align: top;
      margin-right: 10px;
      width: 35px;
      height: 36px;
    }
    span {
      font-weight: bold;
      line-height: 1;
      font-size: 28px;
      color: #e8382b;
    }
    i {
      line-height: 1;
    }
  }
  .tips {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    line-height: 1;
    color: #ff9200;
    height: 36px;
    .toggle {
      display: inline-block;
      margin-left: 10px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: #f4f4f4;
      transition: all 0.3s;
      background: url('../img/sign/toggle.png') no-repeat center center;
      background-size: 100% 100%;
      &.closed {
        transform: rotate(180deg);
      }
    }
  }
}
.sign-btn {
  width: 210px;
  height: 56px;
  background: rgba(255, 65, 65, 1);
  opacity: 1;
  border-radius: 16px;
  font-size: 24px;
  font-weight: 500;
  line-height: 36px;
  color: rgba(255, 255, 255, 1);
  text-align: center;
  line-height: 56px;
  margin: 0 auto;
  &.gray {
    background: rgba(240, 240, 240, 1);
    color: rgba(255, 65, 65, 0.5);
  }
}
.scalc-enter-active {
  animation: fadeAnimation 0.3s ease-in-out;
}
@keyframes fadeout {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes fadein {
  0% {
    transform: scale(0);
  }
  33% {
    transform: scale(1);
  }
  66% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes fadeAnimation {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

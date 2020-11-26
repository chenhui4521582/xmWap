<template>
  <div class="big-user-callback">
    <div class="recall-icon" id="recall-icon" v-if="showIcon" :class="{ hasunread: showRedDot }"
      @click="goActivity">
      <img src="./images/recall_light.png" alt="" class="light" />
      <div class="task-guide" v-if="showTips">
        <span>{{ showText }}</span>
      </div>
    </div>
    <!--奖品弹窗-->
    <awards-dialog v-model="showAwardPop" :awards="AwardsData&&AwardsData.awards"
      :explainText="AwardsData.explainText" @callback="showAwardPop=false" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import indexServices from '@/services/index'
import $axios from '@/services/http/http'

export default {
  name: 'bigUserCallback',
  data: () => ({
    bigUserCallbackInfo: {},
    /** 弹框参数 1.签到送叶子 2.加赠送叶子 3.任务积分领红包 4.游戏任务领积分 **/
    awardType: '',
    AwardsData: {
      awards: {
        awardsImage: '',
        awardsName: '',
        nofilter: true
      },
      explainText: {
        html: ''
      }
    },
    showAwardPop: false
  }),
  methods: {
    ...mapActions({
      getUserInfo: 'GET_USERINFO'
    }),
    /** 图标动画 **/
    iconAnimation () {
      window.addEventListener('touchstart', event => {
        let touch = event.touches[0]
        this.startY = touch.pageY
      })
      window.addEventListener('touchend', event => {
        let element = document.getElementById('recall-icon')
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
    /** 用户入口关闭在首页弹出获取金叶子 **/
    async _getIsShowAwards () {
      let res = await $axios.post(
        '//shop-api.beeplaying.com/shop/api/bigCustomer/needSend'
      )
      let { data } = res.data
      if (data) {
        this._getAwards()
      }
    },
    /** 获取礼包数据 **/
    async _getAwards () {
      const { data: dataA } = await $axios.post(
        '//shop-api.beeplaying.com/shop/api/bigCustomer/sendBigCustomerAdditionalRewards'
      )
      if (dataA.code == 200) {
        this.AwardsData.awards.awardsImage = require('./images/leaf.png')
        this.AwardsData.awards.awardsName = this.conversion(dataA.data.dailyAmount) + '金叶'
        if (dataA.data.receiveCount && dataA.data.continueDay) {
          this.AwardsData.explainText.html = `<p style="background: #EEE;width: 12rem;margin: 0.7rem auto;border-radius: 0.5rem;padding: 0.43rem 0 0.3rem;"><span style="font-size: 0.8rem;color: #FF7800;font-weight: 500;">已领${dataA.data.receiveCount
            }次</span> <br /><span style="font-size: 0.67rem;color: #888;font-weight: 500;">(今日为第${dataA.data.continueDay}天)</span></p> <p style="font-size:0.67rem;color:#888;"><span style="color:#FF7800">${dataA.data.dateRange}</span>连续登录<br />可领完全部<span style="color:#FF7800">${this.conversion(dataA.data.amount)}</span>金叶</p>`
        } else {
          this.AwardsData.explainText.html = `<p style="font-size:0.67rem;color:#888;"><span style="color:#FF7800">${dataA.data.dateRange}</span>连续登录<br />可领完全部<span style="color:#FF7800">${this.conversion(dataA.data.amount)}</span>金叶</p>`
        }
        this.showAwardPop = true
        /** 更新用户的金叶子 **/
        this.getUserInfo()
      }
    },
    /** 是否显示入口 **/
    async _getBigUserInfo () {
      let res = await indexServices.getBigUserInfo()
      let { code, data } = res.data
      if (code === 200) {
        this.bigUserCallbackInfo = data
      }
      if (data && data.showFlag) {
        this.$marchSetsPoint('A_H5PT0019001430')
      }
      this._getIsShowAwards()
      /** 是否是第一次进入 **/
      if (data && data.firstLogin) {
        this.goActivity()
      }
      /** 活动入口关闭，是否有奖励尚未领取 **/
    },
    /** 进入活动 **/
    async goActivity () {
      localStorage.setItem('alreadyRecallClick', this.todayString) //点击icon标识 tips将不再显示
      await this.$marchSetsPoint('A_H5PT0019001431')
      location.href =
        'https://wap.beeplaying.com/activities/returnPackage.html'
    },
    /** 关闭弹框 **/
    closeAwardPop () {
      this.showAwardPop = false
    },
    conversion (value) {
      if (value >= 10000) {
        return `${Math.floor(value / 1000) / 10} 万`
      } else {
        return value
      }
    },
    init () {
      this._getBigUserInfo()
      this.iconAnimation()
    }
  },
  computed: {
    showIcon () {
      return this.bigUserCallbackInfo.showFlag
    },
    showText () {
      return this.bigUserCallbackInfo.activityEndFlag
        ? '奖励限今日领完'
        : '福利天天送'
    },
    showRedDot () {
      return this.bigUserCallbackInfo.showRedDot
    },
    todayString () {
      return new Date().toDateString()
    },
    showTips () {
      return (
        !localStorage.getItem('alreadyRecallClick') ||
        this.todayString !== localStorage.getItem('alreadyRecallClick')
      )
    }
  },
  mounted () {
    this.init()
  }
};
</script>

<style scoped lang="less">
.big-user-callback {
  .recall-icon {
    width: 182px;
    height: 173px;
    position: fixed;
    bottom: 500px;
    z-index: 10;
    right: 0;
    &:before {
      content: '';
      position: absolute;
      width: 115px;
      height: 124px;
      background: url('./images/recall_icon.png') no-repeat center center;
      background-size: 100% 100%;
      z-index: 10;
      top: 50%;
      left: 46%;
      transform: translate(-50%, -50%);
    }
    &.hasunread:after {
      content: '';
      position: absolute;
      top: 50px;
      right: 30px;
      width: 20px;
      height: 20px;
      background: url('./images/reddot.png') no-repeat;
      background-size: 100% 100%;
      z-index: 11;
    }
    .light {
      width: 182px;
      height: 173px;
      animation: imgRotate 2s linear infinite;
    }
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
  }
  .task-guide {
    position: absolute;
    top: -30px;
    right: 27%;
    font-size: 18px;
    width: 160px;
    height: 56px;
    line-height: 46px;
    background: url('./images/recall_tips.png') no-repeat center center;
    background-size: 100% 100%;
    border-radius: 4px;
    animation: toggle 1.2s linear infinite;
    text-align: center;
    font-size: 20px;
    span {
      color: #7d3e2d;
    }
    i {
      color: #faff6d;
    }
    .sign-tip {
      width: 175px;
      height: 51px;
    }
    .lq-sign {
      width: 145px;
      height: 51px;
    }
  }
}
@keyframes toggle {
  0% {
    top: -30px;
  }
  50% {
    top: -40px;
  }
  100% {
    top: -30px;
  }
}
@keyframes imgRotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

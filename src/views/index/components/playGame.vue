<template>
  <div class="play-game" v-if="showModal">
    <div class="mask"></div>
    <div class="center" v-if="userInfo.type == 1">
      <div class="title"></div>
      <div class="explain">
        <p>玩{{userInfo.gameTimes}}局游戏即可</p>
        <p>瓜分大红包</p>
      </div>
      <div class="btn" @click="toActivices">
        参与瓜分
      </div>
      <div class="close" @click="hidModal"></div>
    </div>
    <div class="finish-center" v-if="userInfo.type == 2">
      <div class="title"></div>
      <div class="explain">
        <p>在红包瓜分活动中</p>
        <p>获得{{hfcount}}元话费券</p>
      </div>
      <div class="btn" @click="hidModal">
        朕知道了
      </div>
      <div class="people">
        已经有{{userInfo.divideNum}}人参与瓜分
      </div>
      <div class="close" @click="hidModal"></div>
    </div>
  </div>
</template>
<script>
import axios from '@/services/http/http'
import _get from 'lodash.get'
export default {
  name: 'playGame',
  data: ()=> ({
    showModal: false,
    userInfo: {}
  }),
  computed: {
    hfcount() {
      if(this.userInfo.awardsAmount) {
        return this.userInfo.awardsAmount / 10
      }
    }
  },
  methods: {
    hidModal() {
      this.showModal = false
    },
    toActivices() {
      this.$marchSetsPoint('A_H5PT0019002599')
      let APP_CHANNEL = localStorage.getItem('APP_CHANNEL')
      let time = new Date().getTime()
      window.location.href = `https://wap.beeplaying.com/activities/playGame.html?channel=${APP_CHANNEL}&time=${time}`
    },
    _getPopup() {
      let url = '//ops-api.beeplaying.com/ops/api/play-game-jackpot/popup'
      axios.post(url).then(res=> {
        let {code, data, message} = _get(res, 'data')
        if(code == 200) {
          this.userInfo = _get(res, 'data.data', {})
          this.showModal = _get(res, 'data.data.show')
          if(this.showModal && this.userInfo.type == 1) {
            this.$marchSetsPoint('A_H5PT0019002598')
          }
          if(this.showModal && this.userInfo.type == 2) {
            this.$marchSetsPoint('A_H5PT0019002600')
          }
        }
      })
    }
  },
  mounted() {
    this._getPopup()
  }
}
</script>
<style scoped lang="less">
.play-game {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 12;
  .mask {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 2;
    background: rgba(0,0,0,.5)
  }
  .center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    width: 553px;
    height: 667px;
    background: url(../img/playGame/bg.png) no-repeat center top;
    background-size: 100% 100%;
    .title {
      margin: 54px auto 163px;
      width: 355px;
      height: 199px;
      background: url(../img/playGame/title.png) no-repeat center top;
      background-size: 100% 100%;
    }
    .explain {
      margin-bottom: 37px;
      text-align: center;
      font-size:36px;
      font-weight:bold;
      color:rgba(255,227,148,1);
      line-height: 50px;
    }
    .btn {
      margin: 0 auto;
      width: 298px;
      height: 95px;
      background:  url(../img/playGame/btn.png) no-repeat center top;
      background-size: 100% 100%;
      font-size:36px;
      font-weight:bold;
      color:#AA490D;
      text-align: center;
      line-height: 75px;
    }
    .close {
      position: absolute;
      bottom: -80px;
      left: 50%;
      transform: translate(-50%, 0);
      width: 60px;
      height: 60px;
      background: url(../img/playGame/close.png) no-repeat center top ;
      background-size: 100% 100%;
    }
  }
  .finish-center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    width: 553px;
    height: 667px;
    background: url(../img/playGame/bg.png) no-repeat center top;
    background-size: 100% 100%;
    .title {
      margin: 58px auto 27px;
      width: 266px;
      height: 39px;
      background: url(../img/playGame/finish-title.png) no-repeat center top ;
      background-size: 100% 100%;
    }
    .explain {
      margin-bottom: 228px;
      text-align: center;
      font-size: 32px;
      font-weight: bold;
      color:#E43011;
      line-height: 50px;
    }
    .btn {
      margin: 0 auto 30px;
      width: 298px;
      height: 95px;
      background:  url(../img/playGame/btn.png) no-repeat center top;
      background-size: 100% 100%;
      font-size:36px;
      font-weight:bold;
      color:#AA490D;
      text-align: center;
      line-height: 75px;
    }
    .people {
      margin: 0 auto;
      width: 393px;
      height: 44px;
      background: #8D120B;
      line-height: 44px;
      text-align: center;
      font-size: 24px;
      color: #FFE497;
      border-radius:22px;
    }
    .close {
      position: absolute;
      bottom: -80px;
      left: 50%;
      transform: translate(-50%, 0);
      width: 60px;
      height: 60px;
      background: url(../img/playGame/close.png) no-repeat center top;
      background-size: 100% 100%;
    }
  }
}
</style>
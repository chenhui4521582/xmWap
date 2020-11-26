<template>
  <div class="wrap">
    <!-- 转盘 -->
    <div class="turntable" v-if="showTurntable">
      <div class="mask"></div>
      <div class="content">
        <div class="wrapper">
          <img class="bg" src="../../img/btc/bg.png" alt />
          <ul class="awards" ref="awards">
            <li v-for="(item, index) in turntableData.awards" :key="index" :style="domSort(index)">
              <div class="award-name">
                <p style="font-weight: bold;">{{ item.description.split(':')[0] }}</p>
                <p style="font-weight: 400;">{{ item.description.split(':')[1] }}</p>
              </div>
              <div class="award-img">
                <img :src="item.awardsImage | filter" alt />
              </div>
            </li>
          </ul>
          <div class="awards-btn run" @click="_getBindPhone"></div>
          <div class="explain">
            <p>免费、免费、免费，壕无人性</p>
            <p class="time">
              活动时间：{{turntableData.startDate | formatTime('y.m.d')}}~{{turntableData.endDate | formatTime('m.d')}}
            </p>
          </div>
        </div>
        <div class="turntable-closed" @click="openPopup(1)"></div>
      </div>
    </div>
    <!-- 弹框 -->
    <popup v-model="showPopup"
      :popupType="popupType"
      :awards="awards"
      @hideTurntable="hideTurntable"
      @detention="openPopup(2)"
      @detentionConfirm="openPopup(4)"
      @bindSuccess="runLottery"
      @openCopy="openPopup(5)"
    />
  </div>
</template>
<script type="text/javascript">
import popup from './btcPopup'
import { mapActions, mapMutations } from 'vuex'
import { newUtils } from '@/utils/utils'
import Services from '@/services/index'
import { getPhoneBindInfo } from '@/services/user'
import _get from 'lodash.get'
export default {
  name: 'TurntableBtc',
  props: {
    animation: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    /** 用户绑定手机数据 **/
    userPhoneInfo: {},
    /** 是否显示 **/
    showTurntable: false,
    /** 转盘列表 **/
    turntableData: {},
    /** 抽到的奖品 **/
    awards: {

    },
    showPopup: false,
    popupType: 0
  }),
  components: {
    popup
  },
  computed: {
    isGameGift () {
      let giftArray = [40, 41, 43, 32]
      return giftArray.indexOf(this.awards.awardsType) > -1
    },
    hideAnimation () {
      return this.animation ? 'hide' : ''
    }
  },
  methods: {
    ...mapActions({
      _getUserInfo: 'GET_USERINFO', // 获取用户信息
    }),
    ...mapMutations({
      _setTurntableRefresh: 'SET_TURNTABLEREFRESH'
    }),
    /** 关闭转盘 **/
    hideTurntable () {
      this.showTurntable = false
      this._setTurntableRefresh(1)
      this.$parent.initDialog()
    },
    /** 打开弹框 **/
    openPopup (type) {
      this.popupType = type
      this.showPopup = true
      switch (type) {
        case 1:
          this.$marchSetsPoint('A_H5PT0281003361')
          this.$marchSetsPoint('A_H5PT0281003365')
          break
        case 2:
          this.$marchSetsPoint('A_H5PT0281003371')
          break
        case 3:
          this.$marchSetsPoint('A_H5PT0281003362')
          break
        case 4:
          this.$marchSetsPoint('A_H5PT0281003368')
          break
        case 5:
          this.$marchSetsPoint('A_H5PT0281003374')
          break
        case 6:
          this.$marchSetsPoint('A_H5PT0281003377')
          break
      }
    },
    /** 计算转盘奖品角度 **/
    domSort (index) {
      let mean = Math.floor(360 / this.turntableData.awards.length)
      return `transform: rotate(${Math.floor(mean * (index))}deg)`
    },
    /** 转盘转动 **/
    runLottery () {
      Services.btcGetLotteryAward().then(res => {
        let { code, data, message } = _get(res, 'data', {})
        if (code === 200) {
          this.awards = data
          let dom = this.$refs.awards
          let current =
            this.turntableData.awards &&
            this.turntableData.awards.find((item, index) => {
              return this.awards.sort === item.sort
            })
          /** 打开动画 **/
          this.turntableAnimation(dom, current.sort, () => {
            /** 通知父级打开奖励弹框 **/
            this.openPopup(4)
          })
        } else {
          this.$Toast(message)
        }
      })
      this.$marchSetsPoint('A_H5PT0281003360')
    },
    /** 转盘动画 **/
    turntableAnimation (dom, index, callback) {
      /** 动画没有执行完的时候 不可以再次点击**/
      if (this.animationLock) {
        return false
      }
      this.animationLock = true
      /** 当前转了几次了 **/
      this.newNumber = this.newNumber === undefined ? 0 : this.newNumber
      /** 动画默认圈数 **/
      this.animationRoate = 9 * 360
      /** 旋转次数+1 **/
      this.newNumber += 1
      /** 停止位置大于奖品个数，旋转角度=0 **/
      if (index >= dom.childNodes.length) {
        index = 0
      }
      /** 上次度数 **/
      let provDeg = this.newNumber * this.animationRoate
      /** 奖品所在位置角度 **/
      let awardDeg = index * Math.ceil(360 / dom.childNodes.length)
      /** 最终旋转度数 = 上次度数  + 奖品所在位置角度  **/
      dom.style.transition = 'all 3.2s ease-in-out'
      dom.style.transform = `rotate(-${provDeg + awardDeg}deg)`
      /** 动画运行完成解锁并且运行回调 **/
      setTimeout(() => {
        this.animationLock = false
        if (callback) {
          callback && callback.call(this)
        }
      }, 3200)
    },
    /** 获取转盘夺宝 **/
    _getTurntable (callback) {
      this.showLoading = true
      Services.btcGetTurntable().then(res => {
        let { code, data, message } = _get(res, 'data')
        if (code === 200) {
          this.turntableData = data
          /** 有奖品列表显示转盘 **/
          if (this.turntableData.awards) {
            this.showTurntable = true
            this.turntableData = data
            callback && callback({
              isShow: true
            })
            this.$marchSetsPoint('P_H5PT0281', {
              source_address: document.referrer
            })
            return
          }
          /** 没有奖品有领取次数显示C端领奖 **/
          if (!this.turntableData.awards && this.turntableData.bettingTimes > 0) {
            this._btcGetReceive()
            return
          }
        }
        else if (code == 102) {
          this.$Toast('您尚未绑定手机号')
        }else {
          callback && callback({name: 'turntableBtc',isShow: false})
        }
      })
    },
    /** 获取绑定手机数据 **/
    _getBindPhone () {
      getPhoneBindInfo().then(res => {
        const { code, data } = res
        if (code == 200) {
          /** 没有绑定手机号的时候打开弹框 **/
          const { existsFlag } = data
          if (existsFlag) {
            this.runLottery()
          } else {
            this.openPopup(3)
          }
        }
      })
    },
    /** 获取C端奖品 **/
    _btcGetReceive () {
      Services.btcGetReceive().then(res => {
        let { code, data, message } = _get(res, 'data', {})
        if (code === 200) {
          this.awards = data
          this.$marchSetsPoint('A_H5PT0019003705') // H5平台-首页-迁移转盘领奖提示弹窗加载完成
          this.openPopup(6)
          this._getUserInfo()
        }
      })
    },
    endTime () {
      let date = new Date()
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      let d = date.getDate()
      return new Date(`${y}/${m}/${d}`).getTime()
    },
    init (callback) {
      let endTime = this.endTime()
      let cacheTime = localStorage.getItem('turntableBtcTime')
      this.$marchSetsPoint('A_H5PT0019004339')
      /** 假如缓存时间小于当前时间, 打开弹框更新缓存**/
      if (cacheTime) {
        if(endTime != cacheTime){
          localStorage.setItem('turntableBtcTime', endTime)
          this._getTurntable(callback)
        }else {
          callback && callback({name: 'turntableBtc',isShow: false})
        }
      } else {
        localStorage.setItem('turntableBtcTime', endTime)
        this._getTurntable(callback)
      }
    }
  },
  watch: {
    showTurntable (value) {
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
.turntable {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 13;
  .mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
  }
  .content {
    position: absolute;
    top: 47%;
    left: 50%;
    transform: translate(-50%, -50%);
    .wrapper {
      position: relative;
      width: 703px;
      height: 816px;
      .bg {
        vertical-align: top;
        width: 100%;
        height: 100%;
      }
      .awards {
        position: absolute;
        left: 78px;
        top: 142px;
        width: 550px;
        height: 550px;
        background: url('../../img/btc/split_bg.png') no-repeat top center;
        background-size: 100% 100%;
        li {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          right: 0;
          padding-top: 20px;
          .award-name {
            padding-bottom: 15px;
            text-align: center;
            font-size: 24px;
            color: #fff;
            p {
              line-height: 1.1;
            }
          }
          .award-img {
            margin: 0 auto;
            width: 64px;
            height: 40px;
            img {
              vertical-align: top;
              width: 100%;
            }
          }
        }
      }
      .awards-btn {
        position: absolute;
        left: 257px;
        top: 312px;
        width: 188px;
        height: 198px;
        &.run {
          background: url('../../img/btc/enabled.png') no-repeat top center;
          background-size: 100% 100%;
          animation: btnScale 2s infinite;
          span {
            position: absolute;
            bottom: 55px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 22px;
            color: #fff;
            -webkit-text-stroke: 2px #854528;
            font-weight: bold;
          }
        }
      }
      .explain {
        position: absolute;
        top: 712px;
        left: 0px;
        width: 100%;
        text-align: center;
        font-size: 20px;
        color: #ECD7B8;
        font-weight: bold;
        .time {
          font-size: 18px;
          color: #FEEE8C;
          font-weight: 400;
        }
      }
    }
    .turntable-closed {
      position: absolute;
      left: 50%;
      bottom: -93px;
      z-index: 2;
      display: flex;
      justify-content: center;
      width: 60px;
      height: 60px;
      transform: translate(-50%, 0);
      color: #fff;
      background: url('../../img/btc/close.png') no-repeat center center;
      background-size: 60px 60px;
    }
  }
}
@keyframes btnScale {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.1);
  }

  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
.hide-leave-active {
  animation: hideAnimation 1s ease-in-out;
}
@keyframes hideAnimation {
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(0.1);
  }
  100% {
    transform-origin: 675px 685px;
    transform: scale(0);
  }
}
</style>

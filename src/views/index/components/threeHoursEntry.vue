<template>
  <div class="threeHours-activity-entry" id="threeHours-activity-entry" @click="headerClick"
       v-if="acenterIconData&&acenterIconData.showState">
    {{acenterIconData.showStateshowState}}
    <img :src="`${require(`../img/threeHours/${acenterIconData.showState}.png`)}`" alt=""
         v-if="[1,3,4].includes(acenterIconData.showState)">
    <div v-else class="threeHours-percent">
      <div class="threeHours-percent-iconbg" :class="{zero:acenterIconData.stageCurrentAmount==0}">
        <div class="loop-pie-line loop-pie-r">
          <div class="loop-pie-c loop-pie-rm" id="loop-rc" :class="{zero:acenterIconData.stageCurrentAmount==0}"></div>
        </div>
        <div class="loop-pie-line loop-pie-l">
          <div class="loop-pie-c loop-pie-lm" id="loop-lc" :class="{zero:acenterIconData.stageCurrentAmount==0}"></div>
        </div>
        <div class="txt"><i>{{acenterIconData.stageCurrentAmount|conversion}}</i>/<br>{{acenterIconData.stageTotalAmount|conversion}}
        </div>
      </div>
      <img src="../img/threeHours/countdown.png" alt="">
      <span>{{countTime}}</span>
    </div>
  </div>
</template>
<script>
  import { mapState, mapMutations } from 'vuex'
  import { jumpUrl } from '@/utils/utils'
  import Services from '@/services/activity'
  import _get from 'lodash.get'

  export default {
    name: 'ThreeHoursActivityEntry',
    filters: {
      conversion(value) {
        if (value >= 10000) {
          return `${Math.floor(value / 1000) / 10}万`
        } else {
          return value
        }
      }
    },
    props: {
      userType: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        acenterIconData: null,
        countTime: ''
      }
    },
    computed: {
      ...mapState(['showThreeHoursEntrance'])
    },
    methods: {
      ...mapMutations(['SET_THREEHOURS_ENTRANCE']),
      /** 图标点击 **/
      headerClick() {
        this.$marchSetsPoint('A_H5PT0019003921')
        jumpUrl({ url: '/activities/fighthours.html?from=activityEntry' })
      },
      /** 图标动画 **/
      iconAnimation() {
        window.addEventListener('touchstart', event => {
          let touch = event.touches[0]
          this.startY = touch.pageY
        })
        window.addEventListener('touchend', event => {
          let element = document.getElementById('threeHours-activity-entry')
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
      /** 是否显示入口 **/
      async _getThreeHoursInfo() {
        let res = await Services.getThreeHoursInfo()
        let { code, data } = res.data
        if (code === 200) {
          this.SET_THREEHOURS_ENTRANCE(data)
          this.acenterIconData = data
          if (this.acenterIconData.showState) {
            this.$marchSetsPoint('A_H5PT0019003920')
          }
          if (this.acenterIconData.showState == 2) {
            if (this.acenterIconData.stageCountdown) {
              !this.countTime && this.countDown(this.acenterIconData.stageCountdown)
            }
            if (this.acenterIconData.stageCurrentAmount) {
              this.$nextTick(() => {
                this.loadPercent(this.acenterIconData.stageCurrentAmount > this.acenterIconData.stageTotalAmount ? this.acenterIconData.stageTotalAmount : this.acenterIconData.stageCurrentAmount, this.acenterIconData.stageTotalAmount)
              })
            }
          }
        }
      },
      loadPercent(x, y) {
        let rotate = (x / y) * 360
        let rotateRight = 0
        let rotateLeft = 0
        if (rotate < 180) {
          rotateRight = rotate + (-45)

        } else {
          rotateRight = 135
          rotateLeft = (rotate - 180 - 45)
          document.getElementById('loop-lc').style['-webkit-transform'] = 'rotate(' + rotateLeft + 'deg)'
        }
        document.getElementById('loop-rc').style['-webkit-transform'] = 'rotate(' + rotateRight + 'deg)'
      },
      countDown(item) {
        if (!item) return false
        let date = item / 1000
        this.timer = setInterval(() => {
          date = date - 1
          if (date <= 0) {
            date = 0
            clearInterval(this.timer)
            this.countTime = ''
            return
          }
          let day = Math.floor(date / 86400)
          let hour = Math.floor(parseInt(date / 60 / 60) % 24)
          let minute = Math.floor(parseInt(date / 60) % 60)
          let second = Math.floor(date % 60)
          // let countDay = day >= 10 ? day : '0' + day
          let countDay = day >= 10 ? day : '0' + day
          let countHour = hour >= 10 ? hour : '0' + hour
          let countMinute = minute >= 10 ? minute : '0' + minute
          let countSecond = second >= 10 ? second : '0' + second
          if (day >= 2) {
            this.countTime = 0
          } else if (day > 0) {
            this.countTime = `${day}天${countHour}:${countMinute}:${countSecond}`
          } else {
            this.countTime = `${hour ? countHour + ':' : ''}${countMinute}:${countSecond}`
          }
        }, 1000)
      }
    },
    mounted() {
      /** 是否显示入口 **/
      //this._getThreeHoursInfo()
    },
    watch: {
      showThreeHoursEntrance(val) {
        if (val) {
          this.acenterIconData = val
          this.iconAnimation()
          if (this.acenterIconData.showState) {
            this.$marchSetsPoint('A_H5PT0019003920')
          }
          if (this.acenterIconData.showState == 2) {
            if (this.acenterIconData.stageCountdown) {
              !this.countTime && this.countDown(this.acenterIconData.stageCountdown)
            }
            if (this.acenterIconData.stageCurrentAmount) {
              this.$nextTick(() => {
                this.loadPercent(this.acenterIconData.stageCurrentAmount > this.acenterIconData.stageTotalAmount ? this.acenterIconData.stageTotalAmount : this.acenterIconData.stageCurrentAmount, this.acenterIconData.stageTotalAmount)
              })
            }
          }
        }
      },
      countTime(val) {
        if (!val) {
          this._getThreeHoursInfo()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .threeHours-activity-entry {
    position: fixed;
    z-index: 9;
    right: 0px;
    bottom: 185px;
    width: 122px;
    img {
      vertical-align: top;
      width: 100%;
      height: 100%;
    }
    .threeHours-percent {
      display: flex;
      flex-direction: column;
      align-items: center;
      .threeHours-percent-iconbg {
        width: 122px;
        height: 122px;
        position: relative;
        font-size: 20px;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        &.zero {
          width: 115px;
          height: 115px;
        }
        .loop-pie-line {
          position: absolute;
          width: 50%;
          height: 100%;
          top: 0;
          overflow: hidden;
        }
        .loop-pie-l {
          top: 0px;
          left: 0px;
        }
        .loop-pie-r {
          top: 0px;
          -webkit-transform: rotate(180deg);
          right: 0px
        }
        .loop-pie-c {
          width: 200%;
          height: 100%;
          border: 8px solid transparent;
          border-radius: 50%;
          position: absolute;
          box-sizing: border-box;
          top: 0;
          transform: rotate(-45deg);
        }
        .loop-pie-rm {
          border-top: 8px solid transparent;
          border-left: 8px solid transparent;
          border-bottom: 8px solid #5A0DDA;
          border-right: 8px solid #5A0DDA;
          &.zero {
            border-bottom: 8px solid transparent;
            border-right: 8px solid transparent;
          }
        }
        .loop-pie-lm {
          border-top: 8px solid transparent;
          border-left: 8px solid transparent;
          border-bottom: 8px solid #5A0DDA;
          border-right: 8px solid #5A0DDA;
          &.zero {
            border-bottom: 8px solid transparent;
            border-right: 8px solid transparent;
          }
        }
        &:before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          width: 115px;
          height: 115px;
          background: url("../img/threeHours/2.png");
          background-size: 100% 100%;
        }
        .txt {
          position: absolute;
          i {
            color: rgba(254, 181, 42, 1);
          }
        }
      }
      img {
        width: 113px;
        height: 33px;
      }
      span {
        font-size: 30px;
        font-weight: bold;
        color: rgba(90, 13, 218, 1);
        line-height: 1;
      }
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
</style>

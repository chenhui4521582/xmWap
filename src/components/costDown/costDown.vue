<template>
  <div class="cost-down" v-if="showFlag">
    <div class="task" v-if="!isSdk" @click.stop="openRule">
      <span class="count-down">
        成就任务升级倒计时: {{countdownTime}}
      </span>
      <span class="rule-icon"></span>
    </div>
    <div class="sdk" v-else @click.stop="openRule">
      <span class="count-down">
        成就任务升级倒计时: {{countdownTime}}
      </span>
      <!-- <span class="rule-icon"></span> -->
    </div>
    <Modal v-model="showRule" title="温馨提示" :closeButtonShow=false :saveText="'知道了'" :type="2"
      @on-save="hideRule">
      <div class="text">
        成就任务将在<span>{{countdownTime}}</span>之后进行升级，请及时领取奖励。如有不便，敬请谅解。<br>
        新版成就任务参与资格：累计充值大于20元。
      </div>
    </Modal>
  </div>
</template>
<script>
import { getUrlParams } from '@/utils/utils'
import Axios from 'axios'
import _get from 'lodash.get'
export default {
  name: 'costDown',
  data: () => ({
    countDownNum: '',
    countdownTime: '00:00:00',
    showRule: false,
    showFlag: false
  }),
  computed: {
    routerName () {
      return this.$route.name
    },
    isSdk () {
      return this.routerName === 'sdkTask'
    }
  },
  methods: {
    _getCostDown () {
      let url = '//platform-api.beeplaying.com/task/api/achievement/hide'
      Axios.post(url).then(res => {
        let { code, data, message } = _get(res, 'data')
        if (code === 200) {
          this.countDownNum = _get(res, 'data.data.countdown')
          let showFlag = _get(res, 'data.data.showFlag')
          if (!showFlag) {
            if (this.countDownNum > 0) {
              this.countDown(this.countDownNum)
              this.$emit('masterTaskStatus', true)
              this.showFlag = true
              if (this.routerName == 'sdkTask') {
                this.$marchSetsPoint('A_H5PT0061002220', {
                  from_project_id: getUrlParams('gametype')
                })
              } else if (this.routerName == 'achievement') {
                this.$marchSetsPoint('A_H5PT0033002224')
              } else {
                this.$marchSetsPoint('A_H5PT0022002222')
              }
            } else {
              this.$emit('masterTaskStatus', false)
              this.showFlag = false
            }
          } else {
            this.$emit('masterTaskStatus', true)
          }
        }
      })
    },
    countDown (data) {
      if (!data) return false
      let date = data / 1000
      this.timer = setInterval(() => {
        date = date - 1
        if (date <= 0) {
          date = 0
          clearInterval(this.timer)
          this.showFlag = false
          this.$emit('masterTaskStatus', false)
        }
        let day = Math.floor(date / 86400)
        let hour = Math.floor(parseInt(date / 60 / 60) % 24)
        let minute = Math.floor(parseInt(date / 60) % 60)
        let second = Math.floor(date % 60)
        let countDay = day >= 10 ? day : '0' + day
        let countHour = hour >= 10 ? hour : '0' + hour
        let countMinute = minute >= 10 ? minute : '0' + minute
        let countSecond = second >= 10 ? second : '0' + second
        if (day > 0) {
          this.countdownTime = `${countDay}天${countHour}:${countMinute}:${countSecond}`
        } else {
          this.countdownTime = `${countHour}:${countMinute}:${countSecond}`
        }
      }, 1000)
    },
    openRule () {
      if (this.routerName == 'sdkTask') {
        this.$emit('show-rule', `<p style="text-align: justify;padding: 1.2rem 1.4rem;">成就任务将在<span>${this.countdownTime}</span>之后进行升级，请及时领取奖励。如有不便，敬请谅解。新版成就任务参与资格：累计充值大于20元。</p>`)
        this.$marchSetsPoint('A_H5PT0061002219', {
          from_project_id: getUrlParams('gametype')
        })
      } else if (this.routerName == 'achievement') {
        this.showRule = true
        this.$marchSetsPoint('A_H5PT0033002223')
      } else {
        this.showRule = true
        this.$marchSetsPoint('A_H5PT0022002221')
      }
    },
    hideRule () {
      this.showRule = false
    }
  },
  mounted () {
    this._getCostDown()
  }
}
</script>
<style scoped lang="less">
.cost-down {
  .sdk {
    margin: 0 auto 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    text-align: center;
    .count-down {
      border-radius: 13px;
      padding: .1rem .2rem;
      background: #fff;
      font-size: 20px;
      color: #ff6664;
      white-space: nowrap;
    }
    // .rule-icon {
    //   margin-left: 10px;
    //   width: 25px;
    //   height: 25px;
    //   background: url(./img/rule-icon1.png) no-repeat center center / 24px 24px;
    // }
  }
  .task {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 78px;
    padding-bottom: 6px;
    background: url(./img/cost-down.png) no-repeat center top;
    background-size: 100% 100%;
    .count-down {
      margin-right: 10px;
      white-space: nowrap;
      font-size: 24px;
      color: #ff4141;
      line-height: 1;
    }
    .rule-icon {
      width: 30px;
      height: 30px;
      background: url(./img/rule-icon.png) no-repeat center center;
      background-size: 28px 28px;
    }
  }

  .text {
    font-size: 24px;
    color: #888888;
    span {
      color: #ff4141;
    }
  }
}
</style>
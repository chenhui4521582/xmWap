<template>
  <section class="adventure-task-wrap" v-if="info">
    <div class="title">
      <span>{{countTime}}后结束</span>
    </div>
    <div class="master-task-list">
      <div class="description" :class="{opacitying:info.taskStatus == 2}">
        <div class="head-img">
          <img :src="info.taskImg | filter" alt="">
        </div>
        <div class="content">
          <p class="task_title">奇遇任务{{info.taskId}}/{{info.totalTaskNum}}</p>
          <p class="task_name" v-html="info.taskName"></p>
          <div class="progress">
            <div class="progress-bg">
              <div class="progress-bar" :style="{width:info.finishNum/info.taskGoal * 100 + '%'}">
              </div>
              <span>{{transUint(info.finishNum,info.taskGoal)}}</span>
            </div>
            <div class="num">
              <span>{{info.awardsName}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="btn" v-if="info.taskStatus == 1" @click="receive">领取</div>
      <div class="btn play" v-if="info.taskStatus == 0" @click="goFinish">去完成</div>
    </div>
    <!-- 领取弹出框 -->
    <Awards-Dialog v-model="isPop" :awards="info" tips-txt="恭喜您获得" @callback="closePopLog"
      @closedCallback="closePopLog">
    </Awards-Dialog>
  </section>
</template>

<script>
import { getWarningTask, receive } from './api'
import AwardsDialog from '@/components/awardsDialog/awardsDialog'
import { mapActions } from 'vuex'
export default {
  name: '',
  data () {
    return {
      info: null,
      countTime: '',
      isPop: false
    }
  },
  components: {
    AwardsDialog
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      updateUserInfo: 'GET_USERINFO'
    }),
    async init () {
      const { data, code } = await getWarningTask()
      if (code === 200) {
        this.$marchSetsPoint('A_H5PT0022003192')
        this.info = data
        this.countDown(this.info.countdown)
      } else {
        this.info = null
      }
    },
    transUint (finishNum, taskOps) {
      let finish = finishNum > 10000 ? (Math.floor(finishNum / 100) / 100) + '万' : finishNum,
        ops = taskOps > 10000 ? (Math.floor(finishNum / 100) / 100) + '万' : taskOps
      return finish + '/' + ops
    },
    countDown (info) {
      if (!info) return false
      let date = info / 1000
      this.timer = setInterval(() => {
        date = date - 1
        if (date <= 0) {
          date = 0
          clearInterval(this.timer)
          this.$router.replace('/')
        }
        let day = Math.floor(date / 86400)
        let hour = Math.floor(parseInt(date / 60 / 60) % 24)
        let minute = Math.floor(parseInt(date / 60) % 60)
        let second = Math.floor(date % 60)
        // let countDay = day >= 10 ? day : '0' + day
        let countHour = hour >= 10 ? hour : '0' + hour
        let countMinute = minute >= 10 ? minute : '0' + minute
        let countSecond = second >= 10 ? second : '0' + second
        if (day > 0) {
          this.countTime = `${day}天${countHour}小时`
        } else if (hour > 0) {
          this.countTime = `${countHour}小时${countMinute}分钟`
        } else {
          this.countTime = `${countMinute}分钟${countSecond}秒`
        }
      }, 1000)
    },
    goFinish () {
      this.$marchSetsPoint('A_H5PT0022003193', {
        task_id: this.info.taskId,
        task_name: this.info.taskName
      }) // H5平台-大户流失挽留(奇遇任务)-任务去完成点击
      if (this.info.url === 'shop') {
        this.$router.push('/payment')
      } else {
        this.$router.push('/')
      }
    },
    async receive () {
      this.$marchSetsPoint('A_H5PT0022003194', {
        task_id: this.info.taskId,
        task_name: this.info.taskName
      }) // H5平台-大户流失挽留(奇遇任务)-任务领取点击
      const { data, code } = await receive({ order: this.info.taskId })
      if (code === 200) {
        this.isPop = true
        /** 更新头部我的信息 **/
        this.updateUserInfo()
      }
    },
    closePopLog () {
      this.isPop = false
      this.init()
    }
  }
}
</script>
<style  lang="less" scoped>
.adventure-task-wrap {
  position: relative;
  margin: 24px 24px;
  height: 161px;
  background: url(./img/title-bg.png) no-repeat center center / 100% 100%;
  .title {
    position: absolute;
    right: 0;
    left: 476px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    font-size: 18px;
    font-weight: 400;
    color: rgba(255, 209, 86, 1);
  }
  .master-task-list {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .description {
      display: flex;
      align-items: center;
      .head-img {
        width: 90px;
        height: 90px;
        margin-right: 20px;
        img {
          width: 90px;
          height: 90px;
        }
      }
      .content {
        height: 161px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .task_title {
          font-size: 36px;
          font-weight: 400;
          color: rgba(120, 2, 7, 1);
        }
        .task_name {
          font-size: 18px;
          font-weight: 400;
          color: rgba(120, 2, 7, 1);
          margin: 10px 0;
        }
        .progress {
          display: flex;
          align-items: center;
          .progress-bg {
            width: 224px;
            height: 24px;
            background: rgba(255, 255, 255, 1);
            border-radius: 12px;
            margin-right: 12px;
            position: relative;
            overflow: hidden;
            .progress-bar {
              background: #feed5c;
              position: absolute;
              height: 100%;
              left: 0;
            }
            span {
              position: absolute;
              width: 100%;
              height: 100%;
              color: #cf6228;
              font-size: 18px;
              left: 0;
              line-height: 24px;
              font-weight: 400;
              text-align: center;
            }
          }
          .num {
            font-size: 18px;
            font-weight: 400;
            color: rgba(120, 2, 7, 1);
          }
        }
      }
    }
    .btn {
      width: 151px;
      height: 56px;
      line-height: 58px;
      text-align: center;
      background: rgba(255, 209, 85, 1);
      border-radius: 12px;
      font-size: 24px;
      font-weight: 400;
      color: rgba(254, 74, 79, 1);
      margin-top: 30px;
      &.play {
        background: rgba(255, 255, 255, 1);
      }
    }
  }
}
div {
  box-sizing: border-box;
}
</style>

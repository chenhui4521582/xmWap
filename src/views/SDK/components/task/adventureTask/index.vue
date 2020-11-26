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
              <div class="progress-bar" :style="{width:info.finishNum/info.taskGoal * 100 + '%'}"></div>
              <span>{{transUint(info.finishNum,info.taskGoal)}}</span>
            </div>
            <div class="num">
              <span>{{info.awardsName}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="btn btn-finish" v-if="info.taskStatus == 1" @click="receive">领取</div>
      <div class="btn btn-go" v-if="info.taskStatus == 0" @click="goFinish">去完成</div>
    </div>
  </section>
</template>

<script>
import { getWarningTask, receive } from './api'
import { jumpUrl } from '../../../../../utils/utils'
import {mapActions } from 'vuex'
export default {
  name: '',
  data () {
    return {
      info: null,
      countTime: '',
      isPop: false
    }
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
      let finish = finishNum > 10000 ? (finishNum / 10000).toFixed(2) + '万' : finishNum,
        ops = taskOps > 10000 ? taskOps / 10000 + '万' : taskOps
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
        jumpUrl({ url: '/xmWap/#/payment' }, 'SDK')
      } else {
        jumpUrl({ url: '/xmWap' }, 'SDK')
      }
    },
    async receive () {
      this.$marchSetsPoint('A_H5PT0022003194', {
        task_id: this.info.taskId,
        task_name: this.info.taskName
      }) // H5平台-大户流失挽留(奇遇任务)-任务领取点击
      const { data, code } = await receive({ order: this.info.taskId })
      if (code === 200) {
        this.$emit('open-awards', this.info.awardsImage, this.info.awardsName, 5)
        /** 更新头部我的信息 **/
        this.updateUserInfo()
      }
    }
  }
}
</script>
<style  lang="less" scoped>
  .bg-center(@url) {
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url(@url);
  }
.adventure-task-wrap {
  position: relative;
  margin: 24px 0;
  height: 161px;
  background:rgba(248,201,203,1);
  .title {
    position: absolute;
    right: 0;
    width: 209px;
    height: 32px;
    text-align: center;
    line-height:32px;
    font-size: 18px;
    font-weight:400;
    color:rgba(255,209,86,1);
    background:rgba(208,77,83,1);
    border-radius:0 0 0 20px;
  }
  .master-task-list {
    position: absolute;
    left: 0;
    right: 0;
    top:0;
    bottom: 0;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .description{
      display: flex;
      align-items: center;
      .head-img{
        width: 90px;
        height: 90px;
        margin-right: 20px;
        img{
          width: 90px;
          height: 90px;
        }
      }
      .content{
        height:161px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .task_title{
          font-size:36px;
          font-weight:400;
          color:rgba(0,0,0,1);
        }
        .task_name{
          font-size:18px;
          font-weight:400;
          color:rgba(116,94,95,1);
          margin: 10px 0;
        }
        .progress{
          display: flex;
          align-items: center;
          .progress-bg {
            width:224px;
            height:24px;
            background:rgba(206,182,139,1);
            border-radius:12px;
            margin-right: 8px;
            position: relative;
            overflow: hidden;
            .progress-bar {
              background:rgba(254,117,6,1);
              position: absolute;
              height: 100%;
              left: 0;
            }
            span {
              position: absolute;
              width: 100%;
              height: 100%;
              color:rgba(255,255,255,1);
              font-size: 18px;
              left: 0;
              line-height: 24px;
              font-weight:400;
              text-align: center;
            }
          }
          .num{
            font-size:18px;
            font-weight:400;
            color:rgba(221,82,55,1);
          }
        }
      }
    }
    .btn{
      min-width: 90px;
      max-width: 90px;
      height: 60px;
      text-align: center;
      line-height: 60px;
      font-size: 20px;
      color: #fff;
      font-weight: bold;
      margin-top: 30px;
      &.btn-finish {
        .bg-center('../../../img/orange-small-btn-bg.png');
      }
      &.btn-go {
        .bg-center('../../../img/blue-small-btn-bg.png');
      }
      &.btn-finished {
        .bg-center('../../../img/grey-small-btn-bg.png');
      }
    }
  }
}
div {
  box-sizing: border-box;
}
</style>

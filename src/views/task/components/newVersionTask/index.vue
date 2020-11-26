<template>
  <section class="new-version-task" :class="$moduleConfig.plantVersion">
    <n-v-t-header />
    <article class="task-content">
      <h1 class="title">
        <p>累计可得<em>50</em>元话费</p>
        <p class="count-down">
          <img src="../../img/newVersionTask/countdown-icon.png" alt="">
          <em>{{countdownTime}}</em>
        </p>
      </h1>
      <ul class="task-list">
        <template v-for="(item,index) in task.taskList">
          <li class="list-item" :key="index" :class="{'no-border':index===(task.taskList.length-1)}"
            v-if="index < pageSize">
            <div class="icon-wrap">
              <img :src="item.icon|filter" alt="">
            </div>
            <div class="content-wrap">
              <div class="name">{{item.taskName}}</div>
              <div class="other">
                <p class="desc">{{item.taskDescShow}}</p>
                <div class="awards">
                  <div class="icon"><img :src="item.awardsImage|filter" alt=""></div>
                  <p>{{item.awardsName}}</p>
                </div>
              </div>
              <div class="percent">
                <div class="percent-wrap">
                  <div class="percent" :style="{width:item.finishNum/item.taskOps * 100 + '%'}">
                  </div>
                </div>
                <div class="text-percent">(<span>{{item.finishNum}}</span>/{{item.taskOps}})</div>
              </div>
            </div>
            <div class="btn-wrap" @click="handClick(item,index)">
              <div class="btn receive" v-if="item.taskStatus===0"> 立即领取</div>
              <div class="btn undone" v-else-if="item.taskStatus===1">去做任务</div>
              <div class="btn done" v-else>已完成</div>
            </div>
          </li>
        </template>
      </ul>
      <!-- 点击加载更多 -->
      <div class="more" @click="showMoreList()"
        v-if="task.taskList&&task.taskList.length&&pageSize < task.taskList.length">
        <img src="../../img/newVersionTask/more-text.png" alt="">
      </div>
      <!-- 底线 -->
      <div v-else class="bottomLine">
        <bottom-line></bottom-line>
      </div>
    </article>
    <base-footer />
    <!-- 领取弹出框 -->
    <awards-dialog v-model="showAwards" tips-txt="恭喜你成功完成" :awards="awardsData.awards"
      :explainText="awardsData.explainText" confirmBtnText="继续做任务"
      :tipsOtherText="awardsData.awards.taskName" @callback="awardsCallback"
      @closedCallback="awardsCallback" />
    <first v-if="firstFlag" />
    <!-- 每日任务开启弹窗 -->
    <div class="open-daily" v-if="showOpenFlag">
      <div class="mask"></div>
      <img class="shine" src="../../img/shine.png" alt="">
      <div class="content-box">
        <img class="open-gift" src="../../img/open-gift.gif" alt="">
        <img class="open-text" src="../../img/open-text.png" alt="">
        <div class="open-btn" @click="unlockOtherTask">解锁升级到进阶任务</div>
      </div>
    </div>
  </section>
</template>

<script>
import NVTHeader from './header'
import first from './first'
import BaseFooter from '@/components/baseFooter/baseFooter'
import Services from '@/services/task'
import _get from 'lodash.get'
import { jumpUrl } from '@/utils/utils'
import { mapActions } from 'vuex'
export default {
  name: 'newVersionTask',// 新版新手任务
  components: {
    NVTHeader,
    BaseFooter,
    first
  },
  data () {
    return {
      showAwards: false,
      awardsData: {
        awards: {
          awardsImage: '',
          awardsName: '388金叶子'
        },
        recommend: {
          cdnImage: '',
          url: ''
        },
        explainText: {
          text: '可在【我的】页面中查看',
          color: '#ACACAC'
        }
      },
      showOpenFlag: false,
      countdownTime: '',
      timer: null
    }
  },
  props: {
    task: {
      type: Object,
      default: () => ({})
    },
    pageSize: {
      type: Number,
      default: 5
    }
  },
  computed: {
    firstFlag () {
      return localStorage.getItem('newVersionTaskOpened') ? false : true
    },
    isLastTask () {
      let doneArr = this.task.taskList.filter(element => {
        return element.taskStatus === 2
      })
      return this.task.taskList.length - doneArr.length === 1
    }
  },
  mounted () {
    Services.firstLoad()
  },
  methods: {
    ...mapActions({
      'getUserInfo': 'GET_USERINFO'
    }),
    awardsCallback () {
      this.showAwards = false
      /** 通知父组件 重新获取数据 **/
      if (this.isLastTask) {
        this.showOpenFlag = true
        this.$marchSetsPoint('A_H5PT0022002256') // H5平台-任务-新手任务-完成全部新手任务弹窗加载完成
        return
      }
      this.$marchSetsPoint('A_H5PT0022002255') // H5平台-任务-新手任务-领取任务奖励后弹窗-继续做任务点击
      this.$emit('newUserTaskRefresh')
    },
    unlockOtherTask () {
      this.showOpenFlag = false
      this.$marchSetsPoint('A_H5PT0022002257') // H5平台-任务-新手任务-完成全部新手任务弹窗-解锁升级到进阶任务点击
      this.$emit('newUserTaskRefresh')
    },
    showMoreList () {
      this.$emit('showMoreList')
    },
    handClick (item, index) {
      if (item.taskStatus == 1 || item.taskStatus == 2) {
        this.goFinish(item, index)
      }
      if (item.taskStatus == 0) {
        this._taskFinish(item, index)
      }
    },
    goFinish (item, index) {
      let { gameType, url, action, taskId, taskName, taskStatus } = item
      if (taskStatus === 1) {
        this.$marchSetsPoint('A_H5PT0022002252', {
          position_id: index + 1,
          target_project_id: gameType,
          task_id: taskId,
          task_name: taskName
        }) // H5平台-任务-新手任务-任务去完成点击
      }
      /** 百度底bar 跳转地址转发,统一一版本后删除 **/
      if (this.$moduleConfig.urlReword && this.$moduleConfig.urlReword[url]) {
        window.location.href = this.$moduleConfig.urlReword[url]
        return false
      }
      jumpUrl(item)
    },
    _taskFinish (item, index) {
      let { taskId, taskLogId, awardsImage, awardsName, gameType, taskName } = item
      this.$marchSetsPoint('A_H5PT0022002253', {
        position_id: index + 1,
        target_project_id: gameType,
        task_id: taskId,
        task_name: taskName
      }) // H5平台-任务-新手任务-任务完成后立即领取点击
      Services.taskFinish({ taskId, taskLogId }).then(res => {
        let { code, message, data } = res.data
        if (code == 200) {
          // 打开弹出框
          this.openAwards(awardsImage, awardsName, taskName)
        } else {
          this.$Toast(message)
        }
      })
    },
    openAwards (awardsImage, awardsName, taskName) {
      this.showAwards = true
      this.$marchSetsPoint('A_H5PT0022002254') // H5平台-任务-新手任务-领取任务奖励后弹窗加载完成
      this.awardsData.awards.awardsImage = require('../../img/newVersionTask/hfquan-icon.png')
      this.awardsData.awards.awardsName = awardsName
      this.awardsData.awards.taskName = taskName
      this.awardsData.awards.nofilter = true
    },

    countDown (time) {
      if (!time) return false
      let date = time / 1000
      this.timer = setInterval(() => {
        date = date - 1
        if (date <= 0) {
          date = 0
          clearInterval(this.timer)
        }
        let day = Math.floor(date / 86400)
        let hour = Math.floor(parseInt(date / 60 / 60) % 24)
        let minute = Math.floor(parseInt(date / 60) % 60)
        let second = Math.floor(date % 60)
        let countHour = hour >= 10 ? hour : '0' + hour
        let countMinute = minute >= 10 ? minute : '0' + minute
        let countSecond = second >= 10 ? second : '0' + second
        if (day > 0) {
          this.countdownTime = `${day}天${countHour}:${countMinute}:${countSecond}`
        } else {
          this.countdownTime = `${countHour}:${countMinute}:${countSecond}`
        }
      }, 1000)
    }
  },
  destroyed () {
    clearInterval(this.timer)
  },
  watch: {
    task: {
      handler (newVal) {
        this.countDown(newVal.countDown)
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.new-version-task {
  .task-content {
    padding: 30px 24px;
    .title {
      font-size: 32px;
      font-weight: bold;
      line-height: 50px;
      color: #000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      p {
        line-height: 50px;
        font-weight: 500;
        display: flex;
        align-items: center;
        em {
          color: #ff4141;
          font-weight: bold;
        }
        img {
          width: 30px;
          height: 30px;
          margin-right: 10px;
        }
      }
      .count-down {
        font-size: 24px;
      }
    }
    .task-list {
      .list-item {
        display: flex;
        align-items: center;
        position: relative;
        box-sizing: border-box;
        height: 156px;
        justify-content: space-between;
        border-bottom: 1px solid #eeeeee;
        &.no-border {
          border: none;
        }
        .icon-wrap {
          width: 75px;
          height: 75px;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .content-wrap {
          flex: 1;
          margin-left: 20px;
          margin-right: 24px;
          .name {
            height: 42px;
            font-size: 30px;
            font-weight: bold;
            line-height: 42px;
            color: #000;
            width: 100%;
            overflow: hidden; //超出的文本隐藏
            text-overflow: ellipsis; //溢出用省略号显示
            white-space: nowrap; //溢出不换行
          }
          .other {
            display: flex;
            align-items: center;
            height: 34px;
            font-size: 24px;
            font-weight: 400;
            line-height: 34px;
            color: #888;
            justify-content: space-between;
            .desc {
              width: 240px;
              overflow: hidden; //超出的文本隐藏
              text-overflow: ellipsis; //溢出用省略号显示
              white-space: nowrap; //溢出不换行
            }
            .awards {
              display: flex;
              align-items: center;
              color: #ff5e00;
              font-size: 24px;
              font-weight: bold;
              .icon {
                width: 24px;
                height: 24px;
                margin-right: 6px;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
            }
          }
          .percent {
            display: flex;
            align-items: center;
            .percent-wrap {
              position: relative;
              width: 135px;
              height: 18px;
              background: #f0f0f0;
              border-radius: 9px;
              overflow: hidden;
              .percent {
                background: #ffbc00;
                height: 100%;
              }
            }
            .text-percent {
              height: 30px;
              line-height: 30px;
              font-size: 20px;
              color: #000;
              text-align: center;
              margin-left: 20px;
              span {
                color: #ff4141;
              }
            }
          }
        }
        .btn-wrap {
          .btn {
            width: 156px;
            height: 58px;
            text-align: center;
            line-height: 58px;
            font-size: 24px;
            font-weight: bold;
            border-radius: 16px;
            color: #fff;
          }
          .receive {
            background: #ff7600;
          }
          .undone {
            background: #ff4141;
          }
          .done {
            background: rgba(255, 65, 65, 0.4);
            color: rgba(255, 255, 255, 0.5);
          }
        }
      }
    }
    .more {
      text-align: center;
      margin: 24px 0;
      img {
        width: 254px;
        height: 40px;
      }
    }
  }
  &.yellow {
    .task-content {
      .more {
        margin-bottom: 100px;
      }
    }
  }
  .bottomLine {
    padding: 1rem 0;
  }

  .open-daily {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 11;
    .mask {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      background: #000;
      opacity: 0.6;
    }
    .shine {
      width: 588px;
      display: block;
      margin: 200px auto 0;
      animation: rotate 2s linear infinite;
      opacity: 0.8;
    }
    .content-box {
      position: fixed;
      left: 0;
      right: 0;
      top: 366px;
      .open-gift {
        display: block;
        width: 288px;
        margin: auto;
      }
      .open-text {
        display: block;
        width: 228px;
        margin: 9px auto 40px;
      }
      .open-btn {
        margin: auto;
        width: 292px;
        height: 72px;
        background: #ff4141;
        border-radius: 16px;
        text-align: center;
        font-size: 24px;
        font-weight: 500;
        line-height: 72px;
        color: #fff;
      }
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>

<template>
  <article class="master-task-wrapper" v-if="masterCostDown"
    :class="{king:taskInfo.achievementType==2}">
    <cost-down @masterTaskStatus="masterTaskStatus" @show-rule="showRule"></cost-down>
    <master-task-maintain :info="taskInfo" @masterTaskMaintain="masterTaskMaintain"
      @show-rule="showRule"></master-task-maintain>
    <king-overtime :task-info="taskInfo" from="game"></king-overtime>
    <div class="master-task">
      <div class="info_wrapper">
        <div class="icon_medal" :class="{'icon_medal_locked':isTaskLocked}">
          <img :src="taskInfo.gameIcon | filter" />
        </div>
        <div class="info">
          <div class="title">
            {{taskInfo.gameName}}
            <img class="icon_level" :src="levelImg" alt="" />
            <span class="text_award" v-if="finishRate<100">
              完成共得<span class="awardCount">{{taskInfo.reward | conversion }}</span>奖励
            </span>
          </div>
          <div class="medals">
            <template v-for="(medal, index) in taskInfo.list">
              <div :key="'img'+index" class="icon_state_medal"
                :class="{'has-red-arrow':currentTaskInfo.taskId===medal.parentTask.taskId,'opacity-40':index-taskInfo.currentRank>=0}">
                <img :src="medal.statusIcon | filter" @click.stop="chooseMedal(medal)" />
              </div>
              <i :key="'i'+index" class="iconfont icon-next"></i>
            </template>
          </div>
        </div>
      </div>
      <div class="progress-wrapper">
        <div class="pregress">
          <div class="pregress-center" :style="{width: finishRate+'%'}">
          </div>
          <p class="text">
            {{currentTaskInfo.hasFinishedTask+'/'+currentTaskInfo.totakTaskNum}}
          </p>
        </div>
        <div class="progress-desc">
          <div class="text">
            {{currentTaskInfo.taskName}}进度
          </div>
          <div class="desc" v-if="finishRate < 100">
            完成当前进度 <span class="award_info">加赠{{ currentTaskInfo.awardsName}}</span>
          </div>
          <div class="desc" v-else>已完成当前进度</div>
        </div>
      </div>
      <div class="task_list" v-if="!taskInfo.showMedalDetail && !isTaskLocked">
        <ul>
          <li v-for="(subTask,index) in parentTask.subTasks" :key="index">
            <div>
              <div class="title">{{subTask.taskDescShow}}</div>
              <div class="task_detail">
                <div class="process_task_item">
                  <div class="process" :style="{width: countWidth(subTask)}"></div>
                  <span
                    class="count">{{subTask.finishNum | conversion}}/{{subTask.taskOps | conversion}}</span>
                </div>
                <span class="award_count">
                  <img class="icon" :src="subTask.awardsImage | filter" />
                  <span class="award_count_content"> +{{subTask.awardsName}}</span>
                </span>
              </div>
            </div>
            <div class="btn">
              <div class="btn-finish" v-if="subTask.taskStatus == 0" @click.stop="doTask(subTask)">
                领取
              </div>
              <div class="btn-go" v-if="subTask.taskStatus == 1" @click.stop="doTask(subTask)">去完成
              </div>
              <div class="btn-finished" v-if="subTask.taskStatus == 2">已领取</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="success_award" v-if="taskInfo.showMedalDetail && !isTaskLocked">
        <div class="title" v-if="taskInfo.medalInfo.parentTask.taskStatus == 4">徽章未解锁</div>
        <div class="title active" v-if="taskInfo.medalInfo.parentTask.taskStatus == 2">恭喜已获得
        </div>
        <div class="img_wrapper"
          :class="{'opacity-40':taskInfo.medalInfo.parentTask.taskStatus == 4}">
          <img :src="taskInfo.medalInfo.medalIcon | filter" />
        </div>
        <div class="date" v-if="taskInfo.medalInfo.parentTask.taskStatus == 2">
          获得日期<br />{{taskInfo.medalInfo.finishTime}}</div>
        <div class="date" v-if="taskInfo.medalInfo.parentTask.taskStatus == 4">
          解锁前提条件<br />获得”{{taskInfo.medalInfo.unlockCondition}}“称号</div>
      </div>
    </div>
  </article>
</template>
<script>
import CostDown from '@/components/costDown/costDown'
import MasterTaskMaintain from '@/components/masterTaskMaintain/masterTaskMaintain'
import KingOvertime from '@/components/kingOvertime'
import Services from '@/services/SDK'
import _get from 'lodash.get'
import _concat from 'lodash.concat'
import _clone from 'lodash.clone'
import { jumpUrl } from '@/utils/utils'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'masterTask',
  props: {
    masterTaskInfo: {
      type: Object,
      default: () => ({})
    },
    gameType: {
      type: [Number, String],
      default: 0
    }
  },
  data: () => ({
    taskInfo: {},
    award: {},
    countDown: 5000,
    masterCostDown: true,
    showAddGift: false,
    addGift: {}
  }),
  components: {
    CostDown,
    KingOvertime,
    MasterTaskMaintain
  },
  filters: {
    conversion (value) {
      if (!value && value != 0) return ''
      let unit = ''
      let number = 0
      if (value.toString().includes('元')) {
        value = Number(value.split('元')[0])
        unit = '元'
      }
      if (value >= 100000000) {
        unit = '亿' + unit
        number = Math.floor(value / 1000000) / 100
      } else if (value >= 10000) {
        unit = '万' + unit
        number = Math.floor(value / 100) / 100
      } else {
        number = Math.floor(value * 10) / 10
      }
      let numberArr = number.toString().split('.')
      if (Number(numberArr[1]) === 0) {
        return numberArr[0] + unit
      } else if (numberArr[1] && numberArr[1].split('')[1] === '0') {
        numberArr[1] = numberArr[1].split('')[0]
      }
      return numberArr.join('.') + unit
    },
  },
  computed: {
    ...mapState(['userInfo','agreementPopType']),
    finishRate () {
      return (this.currentTaskInfo.hasFinishedTask / this.currentTaskInfo.totakTaskNum) * 100
    },
    levelImg () {
      let rank = this.taskInfo.currentRank
      if (!rank) {
        return ''
      }
      if (rank > 4) rank = 4
      if (this.taskInfo.achievementType == 2) {
        return require('../../img/icon_level_king_' + rank + '.png')
      }
      return require('../../img/icon_level_' + rank + '.png')
    },
    parentTask () {
      let subTasks = []
      let task = null
      //拿到第一个taskStatus不是0的任务
      let list = _get(this.taskInfo, 'list', [])
      for (var info of list) {
        //显示完成与未完成的task
        if ([0, 1].indexOf(info.parentTask.taskStatus) > -1) {
          task = info
          break
        }
      }
      if (task) {
        subTasks = _concat(task.subListA, task.subListB)
      }
      return {
        subTasks,
        task: _get(task, 'parentTask', [])
      }
    },
    unReceiveParentTask () {
      var tasks = []
      for (let item of this.taskInfo.list) {
        if (item.parentTask.taskStatus == 0) {
          tasks.push({
            ...item.parentTask,
            gameName: this.taskInfo.gameName,
            medalName: item.medalName,
            medalIcon: item.medalIcon,
            finishedMedalIcon: item.finishedMedalIcon
          })
        }
      }
      return tasks
    },
    isTaskLocked () {
      return this.taskInfo.taskBatchIsEndTime && this.taskInfo.taskBatchIsOverdue
    },
    currentTaskInfo () {
      return this.taskInfo.showMedalDetail ? this.taskInfo.medalInfo.parentTask : this.parentTask.task
    }
  },
  methods: {
    ...mapActions({
      _getTaskRedDot: 'GET_TASK_REDDOT',
    }),
    countWidth (item) {
      if (item.finishNum && item.taskOps) {
        let count = (item.finishNum / item.taskOps) > 1 ? 1 : (item.finishNum / item.taskOps)
        return count * 100 + '%'
      } else {
        return '0%'
      }
    },
    chooseMedal (medal) {
      if (!medal) {
        //未指定显示哪个勋章时，默认显示拿到的最高级别的勋章
        for (var i = this.taskInfo.list.length - 1; i > -1; i--) {
          let info = this.taskInfo.list[i]
          if (info.parentTask.taskStatus == 2) {
            medal = info
            break
          }
        }
      } else {
        this.$marchSetsPoint('A_H5PT0061000539')
      }
      //task_status   ,  0:已完成，1：未完成，2：已领取 4：未解锁
      //已领取和未解锁的显示勋章，别的就显示当前任务
      if ([2, 4].indexOf(medal.parentTask.taskStatus) > -1) {
        this.taskInfo.medalInfo = medal
        this.taskInfo.showMedalDetail = true
      } else {
        this.taskInfo.showMedalDetail = false
      }
      this.taskInfo = _clone(this.taskInfo)
    },
    async doTask (task) {
      if (task.taskStatus == 1) {
        this.$marchSetsPoint('A_H5PT0061000537')
        jumpUrl({ url: task.url }, 'SDK')
      } else if (task.taskStatus == 0) {
        if(this.agreementPopType==1){//需要弹窗
          this.$emit('showAgreementPop')
          return
        }
        this.$marchSetsPoint('A_H5PT0061000538')
        //已完成的去领取
        Services.finishMasterTask({ taskId: task.taskId }).then(res => {
          this.award = {
            awardsImage: task.showAwardsImage,
            awardsName: task.awardsName
          }
          this.$emit('open-awards', this.award.awardsImage, this.award.awardsName, 3)
        })
      }
    },
    confirmAwardDialog () {
      if (this.award.awardsName.includes('黄金套装')) {
        try {
          parent.location.reload()
          return
        } catch (error) {

        }
      }
      if (this.showAddGift) {
        this.$nextTick(() => {
          this.showAddGift = false
          this.award = this.addGift
          this.$emit('open-awards', this.award.awardsImage, this.award.awardsName, 3)
        })
        return
      }
      this.getData()
    },
    getData () {
      Services.getMasterTasks({ value: this.taskInfo.batchId, source: 1 }).then(res => {
        this.taskInfo = res.data.data[0]
        this.receiveTask()
        if (this.parentTask.subTasks.length == 0) {
          this.chooseMedal()
        }
        this._getTaskRedDot()
      })
    },
    receiveTask () {
      //如果有未领取的勋章，自动领取
      for (let task of this.unReceiveParentTask) {
        this.showAddGift = true
        this.addGift = {
          awardsImage: task.showAwardsImage || task.awardsImage,
          awardsName: task.awardsName
        }
        this.award = {
          awardsImage: task.finishedMedalIcon,
          awardsName: task.medalName + '勋章'
        }
        this.$emit('open-awards', this.award.awardsImage, this.award.awardsName, 3)
        if (task.awardsName.includes('黄金套装')) {
          localStorage.setItem(`SKIN_TYPE_${this.userInfo.userId}_${task.gameType}`, 'KING')
        }
        Services.finishMasterTask({
          taskId: task.taskId,
          taskLogId: task.taskLogId
        })
      }
    },
    masterTaskStatus (status) {
      this.masterCostDown = status
    },
    masterTaskMaintain (status) {
      this.masterCostDown = status
    },
    showRule (string) {
      this.$emit('show-rule', string)
    }
  },
  mounted () {
    this.$marchSetsPoint('S_00000000000009')
    this.taskInfo = this.masterTaskInfo
    //如果没有子任务了，显示拿到的最高级别勋章
    if (this.parentTask.subTasks.length == 0) {
      this.chooseMedal()
    }
    this.receiveTask()
  },
  watch: {
    masterTaskInfo: {
      handler (newValue, oldValue) {
        this.taskInfo = newValue
        //如果没有子任务了，显示拿到的最高级别勋章
        if (this.parentTask.subTasks.length == 0) {
          this.chooseMedal()
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
.bg-center(@url) {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url(@url);
}
.master-task-wrapper {
  background: #ffeec4;
  padding: 30px 12px 0;
  border-radius: 1rem 1rem 0 0;
  &.king {
    background: #ffe2bc;
  }
  .opacity-40 {
    img {
      opacity: 0.4;
      filter: alpha(opacity=40);
    }
  }
  .master-task {
    background-repeat: no-repeat;
    background-position: center top;
    background-size: 100% 100%;
    .info_wrapper {
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      padding: 0 9px;
      .icon_medal {
        margin-right: 10px;
        width: 86px;
        height: 86px;
        border-radius: 20px;
        overflow: hidden;
        position: relative;
        img {
          width: 100%;
          height: 100%;
        }
        &.icon_medal_locked::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background-image: url(../../img/locked-icon.png);
          background-repeat: no-repeat;
          background-position: center center;
          background-size: auto 100%;
        }
      }
      .info {
        flex: 1;
        .title {
          margin-bottom: 12px;
          position: relative;
          font-size: 26px;
          color: #000;
          font-weight: bold;
          display: flex;
          align-items: flex-end;
          height: 22px;
          line-height: 22px;
          .icon_level {
            width: 39px;
            height: 22px;
          }
          .text_award {
            position: absolute;
            right: 0;
            top: 0;
            height: 22px;
            line-height: 22px;
            font-size: 18px;
            color: #e8382b;
            span {
              color: #e8382b;
              font-size: 26px;
              font-weight: bold;
            }
          }
        }
        .medals {
          display: flex;
          justify-content: space-around;
          align-items: center;
          .icon_state_medal {
            float: left;
            width: 78px;
            height: 62px;
            text-align: center;
            position: relative;
            img {
              height: 100%;
              max-width: 100%;
            }
            &.has-red-arrow {
              &::after {
                content: '';
                position: absolute;
                bottom: -6px;
                left: 0;
                height: 6px;
                width: 100%;
                background-image: url(../../img/red-arrow.png);
                background-repeat: no-repeat;
                background-position: center center;
                background-size: auto 100%;
              }
            }
          }
          i {
            transform: scale(0.7);
            font-size: 12px;
            color: #ffb100;
            &:last-child {
              display: none;
            }
          }
        }
      }
    }
    .progress-wrapper {
      padding: 0 9px 10px;
      border-bottom: 3px dashed #e6ad5d;
      font-weight: bold;
      .pregress {
        position: relative;
        margin-bottom: 6px;
        width: 100%;
        background: #ceb68b;
        border-radius: 8px;
        height: 24px;
        .pregress-center {
          position: absolute;
          left: 0;
          top: 0;
          width: 20%;
          height: 100%;
          background: #fe7506;
          border-radius: 28px;
        }
        .text {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          color: #fff;
          font-size: 16px;
          line-height: 24px;
          text-align: center;
        }
      }
      .progress-desc {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .text {
          font-size: 16px;
          color: #be9957;
        }
        .desc {
          font-size: 16px;
          color: #be9957;
          .award_info {
            color: #ff4141;
          }
        }
      }
    }
    .task_list {
      li {
        box-sizing: border-box;
        height: 100px;
        padding: 0 20px 0 9px;
        border-bottom: 3px dashed #e6ad5d;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title {
          font-size: 22px;
          color: #000;
          font-weight: bold;
        }
        .task_detail {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .process_task_item {
            width: 167px;
            height: 24px;
            background: #ceb68b;
            border-radius: 8px;
            position: relative;
            margin-right: 24px;
            .process {
              height: 100%;
              background: #fe7506;
              border-radius: 8px;
            }
          }
          .count {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            font-size: 16px;
            line-height: 24px;
            color: #fff;
            text-align: center;
          }
          .award_count {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 30px;
            .icon {
              margin-right: 5px;
              vertical-align: top;
              width: 30px;
              height: 30px;
            }
            .award_count_content {
              font-size: 20px;
              color: #dd5237;
              font-weight: bold;
            }
          }
        }
        .btn {
          min-width: 3rem;
          max-width: 3rem;
          height: 2rem;
          text-align: center;
          line-height: 2rem;
          font-size: 0.66667rem;
          color: #fff;
          font-weight: bold;
          .btn-finish {
            width: 100%;
            height: 100%;
            .bg-center('../../img/orange-small-btn-bg.png');
          }
          .btn-go {
            width: 100%;
            height: 100%;
            .bg-center('../../img/blue-small-btn-bg.png');
          }
          .btn-finished {
            width: 100%;
            height: 100%;
            .bg-center('../../img/grey-small-btn-bg.png');
          }
        }
      }
    }
    .success_award {
      position: relative;
      padding-top: 11px;
      box-sizing: border;
      height: 200px;
      border-bottom: 3px dashed #e6ad5d;
      .title {
        font-size: 18px;
        color: #acacac;
        font-weight: bold;
        &.active {
          color: #ff9b3d;
        }
      }
      .img_wrapper {
        width: 122px;
        margin: -27px auto 0;
        img {
          width: 100%;
        }
      }
      .date {
        position: absolute;
        top: 120px;
        right: 0;
        text-align: right;
        font-size: 18px;
        color: #ff9b3d;
        font-weight: bold;
      }
    }
  }
  .text {
    .award-bg {
      width: 420px;
      height: 350px;
      margin: -30px auto 0;
      display: flex;
      align-items: center;
      justify-content: center;
      .bg-center('../../img/award-bg.png');
      img {
        max-height: 160px;
      }
    }
    p {
      font-size: 20px;
      font-weight: bold;
      color: #fff;
      line-height: 30px;
      text-align: center;
      margin-top: -42px;
      i {
        font-size: 24px;
        color: #ffed5e;
      }
    }
  }
}
</style>

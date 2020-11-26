<template>
  <div v-if="showAchievement">
    <!-- 成就任务维护倒计时 -->
    <master-task-maintain :info="taskInfo" @masterTaskMaintain="masterTaskMaintain">
    </master-task-maintain>
    <overtime-task :game-type="gameType"></overtime-task>
    <king-overtime :task-info="taskInfo" :game-type="gameType"></king-overtime>
    <li class="item_medal" :class="{isOpen:isOpen,king:type=='王者成就'}" v-if="!taskInfo.lock">
      <div class="info_wrapper">
        <div class="icon_medal" :class="{'icon_medal_locked':isTaskLocked}">
          <img :src="taskInfo.gameIcon | filter" />
        </div>
        <div class="info">
          <div class="title">{{taskInfo.gameName}}
            <img class="icon_level" :src="levelImg" />
            <span class="text_award">
              完成共得<span class="awardCount">{{taskInfo.reward | tenThousand}}</span>奖励
            </span>
          </div>
          <div class="medals">
            <template v-for="(medal,index) in taskInfo.list">
              <div :key="'img'+index" class="icon_state_medal"
                :class="{'has-red-arrow':currentTaskInfo.taskId===medal.parentTask.taskId,'opacity-60':index-taskInfo.currentRank>=0}">
                <img :src="medal.statusIcon | filter" @click="chooseMedal(medal)" />
              </div>
              <i :key="'i'+index" class="iconfont icon-next"></i>
            </template>
          </div>
        </div>
      </div>
      <div class="process_task_wrap">
        <div class="process_task">
          <div class="process" v-bind:style="{width: finishRate+'%'}"></div>
          <div class="count">
            {{currentTaskInfo.hasFinishedTask+'/'+currentTaskInfo.totakTaskNum}}
          </div>
        </div>
        <div class="title">{{currentTaskInfo.taskName}}进度</div>
        <div class="award" v-if="finishRate<100">
          完成当前进度 <span class="award_info">加赠{{ currentTaskInfo.awardsName}}</span>
        </div>
        <div class="award" v-else>
          已完成当前进度
        </div>
      </div>

      <span v-show="isOpen">
        <div class="task_list" v-if="!taskInfo.showMedalDetail">
          <ul v-if="!isTaskLocked">
            <li v-for="(subTask,index) in parentTask.subTasks" :key="index">
              <div class="title">{{subTask.taskDescShow}}</div>
              <div class="task_detail">
                <div class="process_task_item">
                  <div class="process"
                    :style="{width: (subTask.finishNum/subTask.taskOps*100)+'%'}"></div>
                  <span
                    class="count">{{subTask.finishNum | tenThousand}}/{{subTask.taskOps | tenThousand}}</span>
                </div>
                <span class="award_count">
                  <img class="icon" :src="subTask.awardsImage | filter" />
                  <span class="award_count_content">
                    +{{subTask.awardsName}}
                  </span>
                </span>
              </div>
              <div class="btn"
                :class="{isFinish:subTask.taskStatus==2,isRecieve:subTask.taskStatus==0}"
                @click="doTask(subTask)">
                {{getStatusText(subTask.taskStatus)}}</div>
            </li>
          </ul>
        </div>
        <div class="task_list" v-if="taskInfo.showMedalDetail">
          <div class="success_award" v-if="!isTaskLocked">
            <div class="title" v-if="taskInfo.medalInfo.parentTask.taskStatus == 4">徽章未解锁</div>
            <div class="title active" v-if="taskInfo.medalInfo.parentTask.taskStatus == 2">恭喜已获得
            </div>
            <div class="img_wrapper">
              <img :src="taskInfo.medalInfo.medalIcon | filter" />
            </div>
            <div class="date" v-if="taskInfo.medalInfo.parentTask.taskStatus == 2">
              获得日期<br />{{taskInfo.medalInfo.finishTime}}</div>
            <div class="date" v-if="taskInfo.medalInfo.parentTask.taskStatus == 4">
              解锁前提条件<br />获得”{{taskInfo.medalInfo.unlockCondition}}“称号</div>
          </div>
        </div>
      </span>
      <div class="btn_switch" @click="toggle()" :class="{down:!isOpen,up:isOpen}">
        <i class="iconfont icon-down" :class="{'isOpen':isOpen,'isFinish':finishRate==100}"></i>
      </div>
      <Awards-Dialog v-model="awardDialogShow" :awards="awardInfo" @callback="confirmAwardDialog">
      </Awards-Dialog>
    </li>
    <li class="item_locked"
      :style="{backgroundImage:`url(${taskInfo.lockBgIcon&&taskInfo.lockBgIcon.includes('//')?taskInfo.lockBgIcon:`//file.beeplaying.com${taskInfo.lockBgIcon}`})`}"
      @click="openGamePop()" v-else>
    </li>
    <Modal v-model="showPop" title="温馨提示" :closeIconShow=true :saveText="gameText" :type="2"
      @on-save="toGame()">
      <div
        style="font-size:0.8rem;font-weight:400;line-height:1.2rem;color:#888;text-align:center;">
        获得{{taskInfo.gameName.split('王者')[0]}}大师勋章<br>
        即可解锁
      </div>
    </Modal>
    <Modal v-model="showAgreementPop" title="用户协议提示" close-text="暂不同意" save-text="同意" :type="2"
           @on-save="closeAgreementModal">
      <div class="modal-center agreement">
        欢迎使用多多玩，为了更好地保护您的隐私和个人信息，多多玩根据国家相关法律拟定了<i @click="goUserAgreement">《多多玩用户协议》</i>，请您在继续使用多多玩服务之前，仔细阅读并同意。
      </div>
    </Modal>
  </div>
</template>
<script>
import MasterTaskMaintain from '@/components/masterTaskMaintain/masterTaskMaintain'
import AwardsDialog from '@/components/awardsDialog/awardsDialog'
import overtimeTask from '@/components/overtimeTask'
import kingOvertime from '@/components/kingOvertime'
import Services from '@/services/achievement'
import { mapState,mapActions } from 'vuex'
import { debuglog } from 'util'
import { jumpUrl } from '@/utils/utils'
import _clone from 'lodash.clone'
import _get from 'lodash.get'
import _concat from 'lodash.concat'

export default {
  name: 'task',
  data () {
    return {
      awardDialogShow: false,
      taskInfo: this.info,
      awardInfo: {},
      isOpen: this.index == 0,
      showPop: false,
      showAddGift: false,
      addGift: {},
      showAchievement: true,
      showAgreementPop:false,
    }
  },
  props: {
    index: {
      type: [Number, String],
      default: 0
    },
    info: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: [String, Number],
      default: ''
    }
  },
  components: {
    AwardsDialog,
    overtimeTask,
    kingOvertime,
    MasterTaskMaintain
  },
  watch: {
    info: {
      handler (newValue, oldValue) {
        this.taskInfo = newValue
      },
      deep: true
    }
  },
  computed: {
    ...mapState(['userInfo','agreementPopType']),
    //未领取的勋章
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
    levelImg () {
      let rank = this.taskInfo.currentRank
      if (rank > 4) rank = 4
      if (this.type == '王者成就') {
        return require('../images/icon_level_king_' + rank + '.png')
      }
      return require('../images/icon_level_' + rank + '.png')
    },
    finishRate () {
      return (this.currentTaskInfo.hasFinishedTask / this.currentTaskInfo.totakTaskNum) * 100
    },
    parentTask () {
      let subTasks = []
      let task = null
      //拿到第一个taskStatus不是0的任务
      for (var info of this.taskInfo.list) {
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

    gameType () {
      let batchId = this.info.batchId.split('-')[0].toLowerCase() || 'default'
      let gameType = {
        billiards: 2,
        ball: 2,
        ring: 3,
        ring2: 3,
        legion: 4,
        fish: 10,
        crush: 12,
        crush2: 12,
        kingdom2: 13,
        landlord: 15,
        square: 18,
        gofish: 20,
        marbles: 21,
        bird: 26,
        default: 0
      }
      return gameType[batchId]
    },
    isTaskLocked () {
      return this.taskInfo.taskBatchIsEndTime && this.taskInfo.taskBatchIsOverdue
    },
    gameText () {
      return `去${this.taskInfo.gameName.split('王者')[0]}游戏`
    },
    currentTaskInfo () {
      return this.taskInfo.showMedalDetail ? this.taskInfo.medalInfo.parentTask : this.parentTask.task
    }
  },
  methods: {
    ...mapActions({
      judgeAddAgreement:'JUDGE_ADD_AGREEMENT',
      closeAgreementPop:'CLOSE_AGREEMENT_POP'
    }),
    showAwardDialog ({ awardsImage = '', awardsName = '' }) {
      this.awardInfo = {
        awardsName,
        awardsImage
      }
      this.awardDialogShow = true
    },
    confirmAwardDialog () {
      this.awardDialogShow = false
      if (this.showAddGift) {
        this.$nextTick(() => {
          this.showAddGift = false
          this.awardInfo = this.addGift
          this.awardDialogShow = true
        })
        return
      }
      this.getData()
    },
    getData () {
      Services.getTaskInfo(this.taskInfo.batchId).then(res => {
        this.taskInfo = res.data.data[0]
        this.receiveTask()
        if (this.parentTask.subTasks.length == 0) {
          this.chooseMedal()
        }
      })
    },
    receiveTask () {
      //如果有未领取的勋章，自动领取
      for (let task of this.unReceiveParentTask) {
        this.awardDialogShow = true
        this.showAddGift = true
        this.addGift = {
          awardsImage: task.awardsImage,
          awardsName: task.awardsName
        }
        this.awardInfo = {
          awardsImage: task.finishedMedalIcon,
          awardsName: task.medalName + '勋章'
        }
        if (task.awardsName.includes('黄金套装')) {
          localStorage.setItem(`SKIN_TYPE_${this.userInfo.userId}_${task.gameType}`, 'KING')
        }
        Services.finishTask({
          taskId: task.taskId,
          taskLogId: task.taskLogId
        })
      }
    },
    async doTask (task) {
      if (task.taskStatus == 1) {
        this.$marchSetsPoint('A_H5PT0122001168', {
          target_project_name: task.gameType,
          task_id: task.taskId,
          task_name: task.taskName
        })
        await Services.cacheGameType({ value: this.info.batchId })
        location.href = `//wap.beeplaying.com${
          task.url
          }?channel=${localStorage.getItem('APP_CHANNEL')}`
      } else if (task.taskStatus == 0) {
        if(this.agreementPopType==1){//需要弹窗
          this.showAgreementPop=true
          return
        }
        this.$marchSetsPoint('A_H5PT0122001169', {
          target_project_name: task.gameType,
          task_id: task.taskId,
          task_name: task.taskName
        })
        //已完成的去领取
        Services.finishTask({
          taskId: task.taskId
        }).then(res => {
          this.showAwardDialog({
            awardsImage: task.showAwardsImage || task.awardsImage,
            awardsName: task.awardsName
          })
        })
      }
    },
    getStatusText (statusCode) {
      if (statusCode == 0) {
        return '领取'
      } else if (statusCode == 2) {
        return '已领取'
      }
      return '去完成'
    },
    toggle () {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.$marchSetsPoint('A_H5PT0122001167')
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
        this.$marchSetsPoint('A_H5PT0022000243')
        this.isOpen = true
      }
      if (this.isTaskLocked) {
        this.isOpen = false
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
    openGamePop () {
      this.showPop = true
    },
    toGame () {
      this.showPop = false
      jumpUrl({ url: this.parentTask.subTasks[0].url })
    },
    /** 接收成就任务维护 **/
    masterTaskMaintain (status) {
      this.showAchievement = status
    },
    closeAgreementModal(){
      this.closeAgreementPop()
      this.showAgreementPop=false
    },
    goUserAgreement () {
      this.showAgreementPop=false
      this.$router.push({ name: 'userAgreement' })
    }
  },
  mounted () {
    if(this.agreementPopType==0){
      this.judgeAddAgreement()
    }
    //如果没有子任务了，显示拿到的最高级别勋章
    if (this.parentTask.subTasks.length == 0) {
      this.chooseMedal()
    }
  }
}
</script>
<style lang="less" scoped>
.item_locked {
  position: relative;
  width: 100%;
  height: 240px;
  background-repeat: no-repeat;
  background-size: cover;
  margin-bottom: 40px;
  .text_award {
    position: absolute;
    top: 20px;
    right: 30px;
    color: #acacac;
    font-size: 22px;
    font-weight: 400;
    .awardCount {
      font-size: 32px;
      font-weight: bold;
    }
  }
}
.item_medal {
  position: relative;
  width: 100%;
  min-height: 240px;
  background: #fffad4;
  border-radius: 16px;
  margin-bottom: 40px;
  padding: 30px 30px 0;
  &.king {
    background: #ffebc3;
    .process_task_item,
    .process_task {
      background: #fff !important;
    }
    .btn_switch {
      background: #ffebc3;
    }
    .task_list {
      li {
        border-top: 1px solid #fff;
        &:last-child {
          border-bottom: 1px solid #fff;
        }
      }
    }
    .success_award {
      border-top: 1px solid #fff;
    }
  }
  .info_wrapper {
    display: flex;
    .icon_medal {
      margin-top: 4px;
      width: 104px;
      height: 104px;
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
        background-image: url(../images/locked-icon.png);
        background-repeat: no-repeat;
        background-position: center center;
        background-size: auto 100%;
      }
    }
    .info {
      position: relative;
      margin-left: 9px;
      flex: 1;
      .title {
        color: #000000;
        font-size: 28px;
        font-weight: bold;
        margin-top: -4px;
        .icon_level {
          position: relative;
          width: 48px;
          height: 26px;
          margin-left: 2px;
          top: 3px;
        }
        .text_award {
          position: absolute;
          right: 0;
          top: -10px;
          display: inline-block;
          color: #c27a00;
          font-size: 24px;
          .awardCount {
            font-size: 32px;
            font-weight: bold;
          }
        }
        .text_award_finish {
          position: absolute;
          right: -30px;
          top: 0;
          font-size: 22px;
          color: #252525;
          width: 104px;
          height: 36px;
          line-height: 36px;
          background-color: #ff4141;
          border-radius: 16px 0px 0px 16px;
          text-align: center;
        }
      }
      .medals {
        margin-top: 7px;
        .icon_state_medal {
          float: left;
          width: 96px;
          height: 76px;
          text-align: center;
          position: relative;
          margin-right: 0.35rem;
          img {
            height: 100%;
            max-width: 100%;
          }
          &.has-red-arrow {
            &::after {
              content: '';
              position: absolute;
              bottom: -10px;
              left: 0;
              height: 8px;
              width: 100%;
              background-image: url(../images/red-arrow.png);
              background-repeat: no-repeat;
              background-position: center center;
              background-size: auto 100%;
            }
          }
          &.opacity-60 {
            img {
              opacity: 0.3;
            }
          }
        }
        .icon-next {
          float: left;
          margin-top: 25px;
          color: #ffbc00;
          font-size: 12px;
          transform: scale(0.7);

          &:last-child {
            display: none;
          }
        }
      }
    }
    &:after {
      content: '';
      display: block;
      clear: both;
    }
  }

  .success_award {
    border-top: 1px solid #f2f2f2;
    padding: 20px 10px;
    position: relative;
    min-height: 250px;
    font-weight: bold;

    .title {
      color: #acacac;
      font-size: 20px;
      &.active {
        color: #ff9b3d;
      }
    }
    .img_wrapper {
      text-align: center;
      img {
        height: 198px;
      }
    }
    .date {
      text-align: right;
      position: absolute;
      color: #ff9b3d;
      font-size: 20px;
      line-height: 30px;
      right: 0;
      bottom: 0;
    }
  }

  .task_list {
    margin-top: 17px;
    li {
      position: relative;
      padding: 20px 0;
      border-top: 1px solid #e6e6e6;
      .title {
        font-size: 28px;
        font-weight: bold;
        color: #000;
      }
      .btn {
        position: absolute;
        width: 150px;
        height: 56px;
        border-radius: 16px;
        line-height: 56px;
        text-align: center;
        color: #fff;
        background-color: #ff4141;
        font-size: 24px;
        top: 36px;
        right: 0;
        &.isFinish {
          background: #e0e0e0;
          color: #ff4141;
        }
        &.isRecieve {
          background: #ff7800;
        }
      }
      .task_detail {
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .process_task_item {
          margin-right: 20px;
          position: relative;
          display: inline-block;
          width: 200px;
          height: 24px;
          border-radius: 8px;
          background: #ffffff;
          .process {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;
            height: 24px;
            border-radius: 8px;
            background-color: #ffbc00;
          }
          .count {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 2;
            width: 100%;
            height: 24px;
            line-height: 24px;
            text-align: center;
            color: #575757;
            font-size: 20px;
          }
        }
        .award_count {
          display: inline-block;
          position: relative;
          .icon {
            position: absolute;
            vertical-align: top;
            width: 30px;
            height: 30px;
            top: 0;
            left: 0;
          }

          .award_count_content {
            margin-left: 15px;
            padding: 0 5px 0 15px;
            display: block;
            overflow: hidden;
            width: 96px;
            height: 30px;
            line-height: 30px;
            color: #b9601f;
            font-size: 20px;
            text-align: center;
            border-radius: 0px 15px 15px 0px;
            background: #f8e1b4;
          }
        }
      }
    }
  }

  .process_task_wrap {
    margin-top: 20px;
    .process_task {
      position: relative;
      width: 100%;
      height: 24px;
      background: #fff;
      border-radius: 8px;
      .process {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        height: 24px;
        border-radius: 8px;
        background-color: #ffbc00;
      }
      .count {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 2;
        width: 100%;
        height: 24px;
        line-height: 24px;
        text-align: center;
        font-size: 20px;
        color: #575757;
      }
    }
    .title {
      float: left;
      margin-top: 7px;
      font-size: 20px;
      color: #bbbbbb;
    }
    .award {
      float: right;
      margin-top: 7px;
      font-size: 20px;
      color: #888888;
      .award_info {
        color: #ff4141;
      }
    }
    &:after {
      content: '';
      display: block;
      clear: both;
    }
  }

  .btn_switch {
    position: absolute;
    bottom: -15px;
    left: calc(50% - 40px);
    width: 80px;
    height: 15px;
    background: #fffdef;
    border-radius: 0 0 15px 15px;
    text-align: center;
    .icon-down {
      display: inline-block;
      transition: all 0.5s;
      transform: scale(0.5);
      color: #ff7800;
    }
    .isOpen {
      transform: rotate(180deg) scale(0.5);
      transition: all 0.5s;
      color: #ff4141;
    }

    // &.up {
    //   .icon-up {
    //     //transform: rotate(180deg) scale(0.5);
    //     transition: all 0.5s;
    //     display: inline-block;
    //   }
    // }

    i {
      display: none;
      font-size: 12px;
      transform: scale(0.8);
      position: relative;
      color: #ffb017;
      top: -20px;

      &.isFinish {
        color: #e0e0e0;
      }
    }
  }
}
</style>


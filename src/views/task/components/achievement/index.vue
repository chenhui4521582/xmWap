<template>
  <div class="achievement" v-if="showAchievement">
    <div class="body">
      <div class="list_medals_wrapper">
        <!-- 羊毛用户 成就任务 不显示 -->
        <cost-down @masterTaskStatus="masterTaskStatus"></cost-down>
        <!-- 成就任务维护倒计时 -->
        <master-task-maintain :info="dataList[0]" @masterTaskMaintain="masterTaskMaintain" />
        <ul class="list_medals">
          <Task v-for="(item,index) in dataList" :info="item" :key="index" :index="index"
            :type="item.achievementType" @refreshtask="getTasks" @showAgreementPop="$emit('showAgreementPop')"/>
        </ul>
      </div>
    </div>
    <Dialog v-model="dialogShow" :tasks="unReceiveParentTask"></Dialog>
    <Awards-Dialog v-model="awardDialogShow" :awards="awardInfo" tips-txt="恭喜您获得"
      @callback="confirmAwardDialog" @closedCallback="confirmAwardDialog">
    </Awards-Dialog>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import AwardsDialog from '@/components/awardsDialog/awardsDialog'
import CostDown from '@/components/costDown/costDown'
import MasterTaskMaintain from '@/components/masterTaskMaintain/masterTaskMaintain'
import Task from './components/task'
import Dialog from './components/dialog'
import Services from '@/services/achievement'
import _get from 'lodash.get'

export default {
  name: 'achievement',
  data () {
    return {
      dialogShow: false,
      awardDialogShow: false,
      awardInfo: {
        awardsImage: '',
        awardsName: ''
      },
      currentTab: {
        index: 0,
        item: '大师成就'
      },
      dataList: [],
      tabs: ['大师成就', '王者成就'],
      showAddGift: false,
      addGift: {},
      showAchievement: true,
    }
  },
  components: {
    Task,
    Dialog,
    AwardsDialog,
    CostDown,
    MasterTaskMaintain
  },
  computed: {
    ...mapState(['userInfo']),
    //未领取的勋章
    unReceiveParentTask () {
      var tasks = []
      for (let taskInfo of this.dataList) {
        for (let item of taskInfo.list) {
          if (item.parentTask.taskStatus == 0) {
            tasks.push({
              ...item.parentTask,
              gameName: taskInfo.gameName,
              medalName: item.medalName,
              medalIcon: item.medalIcon,
              finishedMedalIcon: item.finishedMedalIcon
            })
          }
        }
      }
      return tasks
    }
  },
  methods: {
    ...mapActions({
      _getTaskRedDot: 'GET_TASK_REDDOT',
    }),
    goBack () {
      this.$marchSetsPoint('A_H5PT0122001166')
      this.$router.go(-1)
    },
    getTasks (showReceiveDialog = true) {
      this.dataList = []
      return Services.getTaskInfo('lastAchievementTask').then(res => {
        this.dataList = _get(res, 'data.data', [])
        //子任务完成后,然后查询是否有未领取的父任务
        this.receiveTask(showReceiveDialog)
      })
    },
    tabSwitch (item, index) {
      this.currentTab = {
        item,
        index
      }

      if (this.currentTab.item == '大师成就') {
        this.$marchSetsPoint('A_H5PT0122001170')
      } else {
        this.$marchSetsPoint('A_H5PT0122001171')
      }

      this.getTasks()
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
      this.getTasks()
    },
    receiveTask (showReceiveDialog = false) {
      //如果有未领取的勋章，自动领取
      for (let task of this.unReceiveParentTask) {
        if (showReceiveDialog) {
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
    /** 接收羊毛用户成就任务维护 **/
    masterTaskStatus (status) {
      this.showAchievement = status
      this.$emit('setMasterCostDown', status)
    },
    /** 接收成就任务维护 **/
    masterTaskMaintain (status) {
      this.showAchievement = status
    }
  },
  async mounted () {
    //如果有未领取的勋章，自动领取
    await this.receiveTask()
    await this.getTasks()
    if (this.dataList.length) {
      this.$marchSetsPoint('S_00000000000013')
    }
  }
}
</script>
<style scoped lang="less">
.head {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #ff4141;
  height: 250px;
  border-radius: 0 0 15% 15%;
  .icon_medal {
    position: absolute;
    right: 20px;
    top: 0;
    width: 179px;
    height: 176px;
  }
}
.body {
  margin: 24px;

  .btn_back {
    position: absolute;
    top: 30px;
    left: 15px;
    font-size: 30px;
  }

  .tabs_wrapper {
    width: 320px;
    margin: 0 auto 40px auto;
  }

  .list_medals_wrapper {
    .nolist_wrap {
      position: absolute;
      top: 500px;
      left: 0;
      right: 0;
      text-align: center;
      .nolist {
        width: 200px;
      }
      .nolist_title {
        font-size: 20px;
        color: #acacac;
      }
    }
  }
}
</style>

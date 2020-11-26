<template>
  <div class="achievement">
    <loading :mask="true" v-if="showLoading" />
    <div class="head">
      <div v-if="$moduleConfig.plantVersion != 'red'&&$moduleConfig.isShowHeader" class="btn_back"
        @click="goBack()">
        <i class="iconfont icon-return"></i>
      </div>
      <div class="tabs_wrapper">
        <div class="item" v-for="(item, index) in tabs"
          :class="{'current': index == currentTab.index}" :key="index"
          @click="tabSwitch(item, index)">
          {{item}}
          <div class="line"></div>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="list_medals_wrapper">
        <cost-down @masterTaskStatus="masterTaskStatus"></cost-down>
        <ul class="list_medals" v-if="MasterCostDown">
          <Task v-for="(item,index) in dataList" :info="item" :key="index" :index="index"
            :type="currentTab.item"></Task>
        </ul>
        <div v-if="!showLoading && dataList.length==0" class="nolist_wrap">
          <img src="@/assets/images/no-data.png" class="nolist" />
          <div class="nolist_title">暂无数据，敬请期待</div>
        </div>
      </div>
    </div>
    <Dialog v-model="dialogShow" :tasks="unReceiveParentTask"></Dialog>
    <Awards-Dialog v-model="awardDialogShow" :awards="awardInfo" tips-txt="恭喜您获得"
      @callback="confirmAwardDialog">
    </Awards-Dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import AwardsDialog from '@/components/awardsDialog/awardsDialog'
import CostDown from '@/components/costDown/costDown'
import Task from './components/task'
import Dialog from './components/dialog'
import json from './data'
import Services from '@/services/achievement'
import _get from 'lodash.get'

export default {
  name: 'achievement',
  data () {
    return {
      showLoading: false,
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
      MasterCostDown: false,
      showAddGift: false,
      addGift: {}
    }
  },
  components: {
    Task,
    Dialog,
    AwardsDialog,
    CostDown
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
    goBack () {
      this.$marchSetsPoint('A_H5PT0122001166')
      this.$router.go(-1)
    },
    getTasks (showReceiveDialog = true) {
      this.dataList = []
      return Services.getTasks(this.currentTab.item == '王者成就').then(res => {
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
      this.showLoading = true

      if (this.currentTab.item == '大师成就') {
        this.$marchSetsPoint('A_H5PT0122001170')
      } else {
        this.$marchSetsPoint('A_H5PT0122001171')
      }

      this.getTasks().then(() => {
        this.showLoading = false
      })
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
    masterTaskStatus (status) {
      this.MasterCostDown = status
      if (!status) {
        this.dataList = []
      }
    }
  },
  mounted () {
    //如果有未领取的勋章，自动领取
    this.receiveTask()
    this.showLoading = true
    this.getTasks().then(() => {
      this.showLoading = false
    })
  }
}
</script>
<style scoped lang="less">
.head {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  background-color: #f7f7f7;
  height: 100px;
  .btn_back {
    position: absolute;
    top: 50%;
    left: 15px;
    transform: translate(0, -50%);
    .iconfont {
      font-size: 30px;
    }
  }
  .tabs_wrapper {
    height: 100px;
    line-height: 100px;
    display: flex;
    justify-content: center;
    .item {
      position: relative;
      margin: 0 30px;
      font-size: 32px;
      font-weight: bold;
      .line {
        position: absolute;
        left: 50%;
        bottom: 15px;
        transform: translate(-50%, 0);
        width: 32px;
        height: 6px;
        background: rgba(255, 65, 65, 1);
        border-radius: 3px;
        display: none;
      }
      &.current {
        .line {
          display: block;
        }
      }
    }
  }
}
.body {
  padding: 100px 24px;
  height: 100vh;
  background: #f7f7f7;
  .list_medals_wrapper {
    height: calc(100vh - 150px);
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
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

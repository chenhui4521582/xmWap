<template>
  <new-version-task v-if="taskVersion===1" :page-size="pageSize" :task="newUserTask"
    @showMoreList="showMoreList" @newUserTaskRefresh="newUserTaskRefresh" />
  <div v-else-if="taskVersion===0" class="task" :class="$moduleConfig.plantVersion">
    <base-header ref="baseHeader" />
    <div class="task-content">
      <!-- 签到 -->
      <sign ref="sign" @getUserSign="_getUserSign" />
      <tjl-task v-if="isShowtjlTask" @refresh="gettjlInfo"></tjl-task>
      <!-- 轮播 -->
      <slider v-if="showBanner" :list="list" />
      <!-- 新手任务 -->
      <new-user-task v-if="isShowNewUserTask" :task="newUserTask"
        @newUserTaskRefresh="newUserTaskRefresh" @showAgreementPop="openAgreementPop"/>
      <!--奇遇任务-->
      <adventure-task></adventure-task>
      <!--&lt;!&ndash; 成就任务 &ndash;&gt;-->
      <achievement-task v-if="showAchievementTask&&!isShowtjl" @setMasterCostDown="setMasterCostDown" @showAgreementPop="openAgreementPop"/>
      <!-- 福利任务 (和每日任务同步显示) -->
      <channel-task v-if="showDayTask && !showWeekBetting" @showAgreementPop="openAgreementPop"></channel-task>
      <limit-time-task></limit-time-task>
      <!-- 每日任务 -->
      <day-task v-if="showDayTask && !showWeekBetting" :task-info="dayTaskInfo"
        @dayTaskRefresh="dayTaskRefresh" @showAgreementPop="openAgreementPop"/>
      <!-- 周投注入口 -->
      <img src="./img/weekbetting.png" alt="" class="weekbetting" v-if="showWeekBetting"
        @click="gotoweekbetting" />
      <!-- 底线 -->
      <div class="bottomLine">
        <bottom-line></bottom-line>
      </div>
    </div>
    <!-- 成就任务图标 -->
    <achievement-entry @goTaskHome="goTaskHome" v-if="MasterCostDown && showAchievementTask&&!isShowtjl">
    </achievement-entry>
    <base-footer />
    <Modal v-model="showModal" title="温馨提示" save-text="继续做任务" :type="2" :close-button-show="false"
      @on-save="closedModal">
      <div class="modal-center">
        未在7天内完成新手任务<br>
        自动为您升级为进阶任务
      </div>
    </Modal>
    <Modal v-model="showAgreementPop" title="用户协议提示" close-text="暂不同意" save-text="同意" :type="2"
           @on-save="closeAgreementModal(1)" @on-close="closeAgreementModal(0)">
      <div class="modal-center agreement">
        欢迎使用多多玩，为了更好地保护您的隐私和个人信息，多多玩根据国家相关法律拟定了<i @click="goUserAgreement">《多多玩用户协议》</i>，请您在继续使用多多玩服务之前，仔细阅读并同意。
      </div>
    </Modal>
  </div>
</template>
<script>
import BaseHeader from '@/components/baseHeader/baseHeader'
import BaseFooter from '@/components/baseFooter/baseFooter'
import sign from './components/sign'
import Slider from './components/slider'
import channelTask from './components/channelTask'
import NewUserTask from './components/newUserTask'
import DayTask from './components/dayTask'
import AchievementTask from './components/achievement'
import AchievementEntry from './components/achievementEntry'
import newVersionTask from './components/newVersionTask'
import { mapState, mapActions } from 'vuex'
import { isShowAdver, getUrlParams } from '@/utils/utils'
import Services from '../../services/task'
import { saveNewUserTask } from '@/services/global'
import _get from 'lodash.get'
import adventureTask from './components/adventureTask'
import limitTimeTask from './components/limitTimeTask'
import tjlTask from './components/tjlTask'
export default {
  name: 'task',
  data: () => ({
    list: [],
    dayTaskInfo: { tasks: [] },
    newUserTask: {},
    snginText: '',
    /** 是否显示周投注入口 显示周投注入口将不再展示每日任务 **/
    showWeekBetting: false,
    taskVersion: null,
    showModal: false,
    pageSize: 5, // 新版新手任务用
    MasterCostDown: false,
    showAgreementPop:false,
    isShowtjl:false,//是否开启了淘金令，开启后将不再展示成就任务
    isShowtjlTask:false,//是否展示淘金令任务
  }),
  components: {
    BaseHeader,
    BaseFooter,
    sign,
    Slider,
    channelTask,
    NewUserTask,
    DayTask,
    AchievementTask,
    newVersionTask,
    AchievementEntry,
    adventureTask,
    limitTimeTask,
    tjlTask
  },
  computed: {
    ...mapState(['userSign','agreementPopType']),
    isShowNewUserTask () {
      return this.newUserTask.isNew && this.isNewUser
    },
    isNewUser () {
      if (localStorage.getItem('user_Info')) {
        let userInfo = JSON.parse(localStorage.getItem('user_Info'))
        if (userInfo.createTime) {
          // 一天的毫秒数
          let oneDay = 86400000
          // 注册天数
          let signInDay = (new Date().setMilliseconds(0) - userInfo.createTime) / oneDay
          // 当前时间减去创建时间
          if (signInDay - 8 <= 0) {
            return true
          } else {
            return false
          }
        } else {
          return true
        }
      } else {
        return true
      }
    },
    showDayTask () {
      if (this.newUserTask.newVersion) {
        return this.dayTaskInfo.tasks.length && this.newUserTask.dayTaskVisibleFlag
      }
      return this.dayTaskInfo.tasks.length
    },
    showAchievementTask () {
      if (this.newUserTask.newVersion) {
        return this.newUserTask.dayTaskVisibleFlag
      }
      return true
    },
    showBanner () {
      return this.list.length
    },
    canReadBdAds () {
      let curChannel = localStorage.getItem('APP_CHANNEL') ? localStorage.getItem('APP_CHANNEL') : getUrlParam('channel')
      return curChannel.indexOf('100039') > -1 || curChannel.indexOf('100042') > -1
    }
  },
  methods: {
    ...mapActions({
      'GET_USER_SIGN': 'GET_USER_SIGN',
      _getTaskRedDot: 'GET_TASK_REDDOT',
      judgeAddAgreement:'JUDGE_ADD_AGREEMENT',
      closeAgreementPop:'CLOSE_AGREEMENT_POP'
    }),
    /** 获取新手任务 **/
    _getNewUserTask () {
      Services.getNewUserTask({ value: 'xiaomiNewUser' }).then(res => {
        let { data } = res.data
        this.newUserTask = data || {}
        this.showModal = data.unfinishPopUp
        if (this.showModal) {
          this.$marchSetsPoint('A_H5PT0022002258') // H5平台-任务-新手任务-未完成新手任务提示弹窗完成
        }
        if (this.newUserTask.isNew && this.newUserTask.newVersion && this.newUserTask.testGroup) {
          this.taskVersion = 1
        } else {
          this.init()
        }
      })
    },
    /** 获取每日任务 **/
    async _getDayTask () {
      const res = await Services.getDayTask({ gameType: 0 })
      this.dayTaskInfo = _get(res, 'data.data', { tasks: [] })
    },
    /** 获取banner图 **/
    _getTaskBannerList () {
      Services.getTaskBannerList().then(res => {
        this.list = _get(res, 'data.data', [])
      })
    },
    /** 获取用户是否签到 **/
    _getUserSign (isClickSign) {
      /** 没有签到才自动签到 **/
      this.GET_USER_SIGN().then(res => {
        if (!res.isSign) {
          if (isClickSign) {
            this.$nextTick(() => {
              this.$refs.sign && this.$refs.sign.getReward()
            })
          }
        } else {
          this.$nextTick(() => {
            this.$refs.sign && this.$refs.sign.toggleClosed()
          })
        }
      })
    },
    /** 重新拉取新手任务 **/
    newUserTaskRefresh () {
      this._getNewUserTask()
      this._getTaskRedDot()//刷新任务红点接口
    },
    /** 重新获取每日任务 **/
    dayTaskRefresh () {
      this._getDayTask()
      this._getTaskRedDot()//刷新任务红点接口
    },
    init () {
      this._getUserSign(false)
      //this._getTaskBannerList()
      this.getWeekBettingInfo()
      this.taskVersion = 0
      this.$marchSetsPoint('P_H5PT0022')
    },
    /** 周投注入口 **/
    async getWeekBettingInfo () {
      let data = (await Services.getWeekBettingInfo()).data
      this.showWeekBetting = data.code == 200 && data.data.show
      !this.showWeekBetting && this._getDayTask()
    },
    gotoweekbetting () {
      location.href = '//wap.beeplaying.com/activities/weekbetting.html?vt=' + new Date().getTime()
    },
    closedModal () {
      this.showModal = false
      this.$marchSetsPoint('A_H5PT0022002259') // H5平台-任务-新手任务-未完成新手任务提示弹窗-继续做任务点击
    },
    showMoreList () {
      this.pageSize += 5
    },
    setMasterCostDown (status) {
      this.MasterCostDown = status
    },
    goTaskHome () {
      // H5平台-任务-成就大厅-按钮点击
      this.$marchSetsPoint('A_H5PT0022001160')
      this.$router.push('/achievement')
    },
    // 保存新手任务进入我的页面
    _saveNewUserTask () {
      saveNewUserTask({ value: 3 })
    },
    closeAgreementModal(flag){
      if(flag==1){
        this.closeAgreementPop()
        this.showAgreementPop=false
      }
      this.$marchSetsPoint(flag?'A_H5PT0331004181':'A_H5PT0331004182',{
        source_addres:'task'
      })
    },
    goUserAgreement () {
      this.showAgreementPop=false
      this.$router.push({ name: 'userAgreement' })
    },
    openAgreementPop(){
      this.showAgreementPop=true
      this.$marchSetsPoint('P_H5PT0331',{
        source_addres:'task'
      })
    },
    async gettjlInfo(){//淘金令入口
      let {code,data}=(await Services.gettjlInlet()).data
      if(code==200){
        this.isShowtjl=!!data.tjlState
        this.isShowtjlTask=this.isShowtjl&&data.userSeasonIsEnd==0
      }
    }
  },
  mounted () {
    try {
      this.gettjlInfo()//淘金令信息包括是否有入口、任务数据
      if(this.agreementPopType==0){
        this.judgeAddAgreement()
      }
      if (this.isNewUser) {
        this._getNewUserTask()
      } else {
        this.init()
      }
      this._saveNewUserTask()
    } catch (error) {
    }
  }
}
</script>
<style scoped lang="less">
@border-padding: 0 28px;
.task {
  height: 100vh;
  padding: 70px 0 110px 0;
  &.red {
    padding: 70px 0 0 0;
  }
  min-height: 100vh;
  background-color: #f7f7f7;
  .task-content {
    background: #f7f7f7;
    overflow: hidden;
    .task-assets {
      position: relative;
      padding: @border-padding;
      .header-bg {
        position: absolute;
        top: 0;
        left: 0;
        height: 150px;
        width: 100%;
        .center {
          height: 20px;
          background-color: #ff4141;
        }
        .bottom {
          height: 60px;
          width: 100%;
          background-color: #ff4141;
          border-bottom-left-radius: 100%;
          border-bottom-right-radius: 100%;
        }
      }
      .assets-warp {
        background-color: #ffffff;
        border-radius: 28px;
        display: flex;
        position: relative;
      }
    }
    .weekbetting {
      display: block;
      width: 672px;
      margin: auto;
    }
  }
  .btn-sign-container {
    position: relative;
    .btn {
      position: absolute;
      height: 65px;
      top: 16px;
      right: 0;
      background-color: #fff7ba;
      padding: 22px;
      border-radius: 32px;
      font-size: 24px;
      color: #ffb017;
      display: flex;
      align-items: center;
      justify-content: center;
      &.btn-sign {
        background: #e8382b;
        color: #ffffff;
      }
      &.btn-gray {
        background: #fff7ba;
        color: #ffb017;
      }
      span {
        padding: 0 16px 0 5px;
      }
      img {
        vertical-align: top;
        width: 36px;
        height: 36px;
      }
    }
  }
  .bottomLine {
    padding: 1rem 0 2rem;
  }
  .modal-center {
    text-align: center;
    font-size: 24px;
    color: #888;
    &.agreement{
      text-align: left;
      line-height: 36px;
      i{
        color: #5186CA;
      }
    }
  }
}
</style>

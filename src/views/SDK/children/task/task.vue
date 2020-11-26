<template>
  <article class="sdk-task-wrapper">
    <div ref="sdkTask" class="sdk-task-container">
      <template
        v-if="wfCurLink&&!showMasterTask&&!showWeekBetting&&!showWelfareTask&&!showMoreTask&&!showDayTask&&!showH5AchievementTask&&!showNewUserTask">
        <div class="nolist">
          <img src="../../img/no-message.png" alt="">
        </div>
      </template>
      <template v-else>
        <section class="sdk-task">
          <template v-if="showNotNewUserTask">
            <master-task ref="masterTask" v-if="showMasterTask" :master-task-info="masterTaskInfo"
              @open-awards="openAwards" @show-rule="showMasterTaskRule"
              @showAgreementPop="openAgreementPop" />
          </template>
          <task-info v-if="showNewUserTask" :game-type="gameType" :task-type="0"
            :task-list="newUserTaskInfo.taskList" :red-title="newUserTaskInfo.countDown"
            :task-info="newUserTaskInfo" @on-click="taskClick" @checkUse="checkUse"
            @show-desc-pop="showTaskDesc" @showAgreementPop="openAgreementPop">
          </task-info>
          <template v-if="showNotNewUserTask">
            <task-info v-if="showH5AchievementTask" :game-type="gameType" title="成长任务"
              :task-type="6" :task-list="h5AchievementTask" @on-click="taskClick"
              @showAgreementPop="openAgreementPop">
            </task-info>
            <adventure-task ref="adventureTask" @open-awards="openAwards"></adventure-task>
            <img src="../../img/weekbetting.png" alt="" class="weekbetting"
              @click.stop="gotoweekbetting" v-if="showWeekBetting">
            <template v-else>
              <task-info v-if="showDayTask" :game-type="gameType" title="每日任务"
                :red-title="needReadAdsText" :task-type="1" :task-list="dayTaskList"
                :point-info="pointInfo" @on-click="taskClick" @point-click="receivePointsAward"
                @show-desc-pop="showTaskDesc" @showAgreementPop="openAgreementPop">
              </task-info>
              <no-day-task v-else @show-desc-pop="showTaskDesc" />
              <task-info v-if="showMoreTask" :game-type="gameType" title="" sub-title="更多每日任务"
                :red-title="needReadAdsText" :task-type="2" :task-list="moreTaskList"
                :point-info="showDayTask?{}:pointInfo" @on-click="taskClick"
                @point-click="receivePointsAward" @show-desc-pop="showTaskDesc"
                @showAgreementPop="openAgreementPop">
              </task-info>
            </template>
            <task-info v-if="showWelfareTask" :game-type="gameType" title="福利任务" :task-type="4"
              :task-list="welfareTaskList" @on-click="taskClick"
              @showAgreementPop="openAgreementPop">
            </task-info>
          </template>
        </section>
      </template>
    </div>
    <sdk-popup v-model="showAwards" title="恭喜获得" :type="2" :showCancel="false" confirmText="朕收下了"
      @on-close="awardsCallback" @on-confirm="awardsCallback">
      <div class="text">
        <div class="award-bg">
          <img :src="award.awardsImage|filter" alt="">
        </div>
        <p>{{award.awardsName}}</p>
      </div>
    </sdk-popup>
    <sdk-popup v-model="isShowMasterTaskRulePop" title="温馨提示" :showConfirm="false"
      cancelText="我知道了">
      <div class="text" v-html="rule">
      </div>
    </sdk-popup>
    <sdk-popup v-model="isShowTaskDescPop" title="说明" :type="popType==='rule'?0:1" :showClose="true"
      :showCancel="false" confirmText="知道了" :centerScroll="true" class="day-task-desc"
      @on-confirm="closeDayTaskDesc">
      <div class="rule-img-wrapper" v-show="popType==='img'">
        <img v-show="ruleImg" :src="ruleImg | filter" alt="">
      </div>
      <div class="text" v-show="popType==='rule'">
        1、完成任务可领积分，积分达到一定数值后可领取奖品；<br>
        2、奖品记得当天及时领取，第二天每日任务将重置，无法领取；<br>
        3、当天获得的积分，第二天将重置清零。
      </div>
      <div class="text" v-html="dayTaskDesc" v-show="popType === 'desc'">
      </div>
    </sdk-popup>
    <sdk-popup v-model="showCheckUse" :type="1" :showCancel="false" :showConfirm="false"
      @on-close="closeCheckuse">
      <div class="checkuse-title title">话费券用法</div>
      <div class="checkuse-text">
        <p>在“领奖”商城中，话费券可换取</p>
        <p> 话费充值、京东卡、iPhone等实物</p>
      </div>
      <div class="checkuse-btns" slot="btns">
        <div class="cancel-btn" @click="hideCheckuse">知道了</div>
        <div class="confirm-btn" @click="confirmCheckuse">去使用话费券</div>
      </div>
    </sdk-popup>
    <sdk-popup v-model="showStep1" :isSDK="false" title="下载多多玩 福利多多" type="downloadDDW"
      :showClose="true" :showCancel="false" confirm-text="立即绑定" @on-confirm="confirmDDW">
      <div class="pnl_ddwDownload">
        <div class="step1">
          <div class="step">
            <img src="../../img/pic_step1.png" />
          </div>
          <input type="number" v-model.trim="phone" placeholder="请输入手机号" id="txtPhone" />
          <div class="pnl_code">
            <input type="number" v-model.trim="code" placeholder="请输入验证码" id="txtCode" />
            <div class="sendCode">
              <div class="btn_getCode" v-if="!countTime" @click="getSMS">获取验证码</div>
              <div class="countdown" v-else>{{countTime}}</div>
            </div>
          </div>
          <div class="tip">
            绑定手机号，优惠券才能发放到账
          </div>
        </div>
      </div>
    </sdk-popup>
    <sdk-popup v-model="showStep2" :isSDK="false" title="下载多多玩 福利多多" type="downloadDDWStep2"
      :showClose="true" :showCancel="false" confirm-text="立即下载" @on-confirm="confirmDDW">
      <div class="pnl_ddwDownload">
        <div class="step2">
          <div class="step">
            <img src="../../img/pic_step2.png" />
          </div>
          <div class="desc">
            用手机号 {{displayPhone}} 登录多多玩，既能领取优惠券。
          </div>
          <a href="javascript:void(0)" class="link_copy" v-clipboard:copy="downLoadAddress"
            v-clipboard:success="copyDownloadLink">复制下载链接</a>
          <div class="tip">
            如点击立即下载，无法正常下载，<br />可点击复制下载链接在浏览器中打开进行下载
          </div>
        </div>
      </div>
    </sdk-popup>
    <sdk-popup v-model="showGame" type="gamelist" :title="titleText" :show-confirm="false"
      cancel-text="其他游戏>" @on-cancel="gamePopCallback('index')" @on-close="gamePopCallback()">
      <ul class="gamelist">
        <li v-for="item in gamelist" :key="item.name" @click="gamePopCallback('game',item)">
          <img :src="item.img" alt="">
          <p>{{item.name}}</p>
        </li>
      </ul>
    </sdk-popup>
    <sdk-popup v-model="showSpecialAward" :type="specialAward.type"
      :show-confirm="specialAward.type==='lastTask'" cancel-text="知道了" confirm-text="现在去用"
      @on-confirm="specialCallback(true)" @on-cancel="specialCallback(false)"
      @on-close="closeSpecialPop">
      <div>
        <div class="icon-img">
          <img src="../../img/yellow-right-title-img.png" alt="">
        </div>
        <template v-if="specialAward.type === 'weekCard-nextDay'">
          <p>明天登录可领<span style="color:#54FFF1">1000金叶</span><br />连续<span
              style="color:#54FFF1">6天</span></p>
        </template>
        <template v-if="specialAward.type === 'turnable'">
          <p class="title">
            您已开启30天抽奖转盘
          </p>
          <div class="img">
            <img src="../../img/find-turnable.png" alt="">
          </div>
          <p>
            每天可抽一次<br />
            自付费开始可抽30天
          </p>
        </template>
        <template v-if="specialAward.type === 'lastTask'">
          <p v-html="specialAward.awardsName"></p>
          <div class="award-bg">
            <img :src="specialAward.awardsImage|filter" alt="">
          </div>
        </template>
      </div>
    </sdk-popup>
    <sdk-popup v-model="showAgreementPop" type="agreementType" cancel-text="暂不同意" confirm-text="同意"
      @on-confirm="closeAgreementModal(1)" @on-cancel="closeAgreementModal(0)">
      <div class="modal-center agreement">
        欢迎使用多多玩，为了更好地保护您的隐私和个人信息，多多玩根据国家相关法律拟定了<i
          @click="goUserAgreement">《多多玩用户协议》</i>，请您在继续使用多多玩服务之前，仔细阅读并同意。
      </div>
    </sdk-popup>
    <form method="get" id="download_form" :action="downLoadAddress"></form>
    <new-user-wheel></new-user-wheel>
    <!-- sdk 新手引导 -->
    <new-user-guide />
    <week-card ref="weekCard" :isSDK="true" />
  </article>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { newUtils, getUrlParams, jumpUrl, bdAdsInit } from '@/utils/utils'
import Services from '@/services/SDK'
import _get from 'lodash.get'
import taskInfo from '../../components/task/taskInfo'
import noDayTask from '../../components/task/noDayTask'
import masterTask from '../../components/task/masterTask'
import newUserWheel from '../../components/task/newUserWheel'
import newUserGuide from '../../components/newUserGuide'
import BScroll from 'better-scroll'
import adventureTask from '../../components/task/adventureTask'
import weekCard from '@/components/popup/weekCard'
import { getPhoneCode, bindMobilePhone, getPhoneBindInfo } from '@/services/user'
export default {
  name: 'sdk-task',
  components: {
    taskInfo,
    noDayTask,
    masterTask,
    newUserWheel,
    newUserGuide,
    adventureTask,
    weekCard
  },
  data () {
    return {
      countTime: false,
      showStep2: false,
      showStep1: false,
      downLoadAddress: '',
      hasBind: false,
      displayPhone: '',
      phone: '',
      code: '',
      newUserTaskInfo: {},
      dayTaskList: [],
      moreTaskList: [],
      welfareTaskList: [],
      showWeekBetting: false,
      masterTaskInfo: {},
      award: {
        awardsName: '',
        awardsImage: '',
        taskType: null
      },
      showAwards: false,
      isShowMasterTaskRulePop: false,
      rule: '',
      selectTaskInfo: {},
      adsError: false,
      pointInfo: {},
      ruleImg: '',
      h5AchievementTask: [],
      showCheckUse: false,
      dayTaskDesc: '',
      isShowTaskDescPop: false,
      popType: '',
      showGame: false,
      titleText: '',
      gamelist: [
        {
          img: require('../../img/gamelist/billiards.png'),
          url: '/billiards',
          name: '欢乐竞技台球',
          id: 2
        },
        {
          img: require('../../img/gamelist/crush.png'),
          url: '/crush',
          name: '糖果萌消消',
          id: 12
        },
        {
          img: require('../../img/gamelist/kingdom2.png'),
          url: '/kingdom2',
          name: '三国大作战',
          id: 13
        },
        {
          img: require('../../img/gamelist/crush3.png'),
          url: '/crush3',
          name: '破晓方块消消乐',
          id: 27
        },
        {
          img: require('../../img/gamelist/square.png'),
          url: '/square',
          name: '众神风云',
          id: 18
        },
        {
          img: require('../../img/gamelist/marbles.png'),
          url: '/Marbles',
          name: '王者弹珠',
          id: 21
        }
      ],
      specialAward: {
        type: '',
        awardsImage: '',
        awardsName: '',
      },
      showSpecialAward: false,
      showAgreementPop: false,
      isShowtjl: false,
    }
  },
  async mounted () {
    if (this.agreementPopType == 0) {
      this.judgeAddAgreement()
    }

    this.init().then(() => {
      this.getWeekLoopRemark()
      new BScroll(this.$refs.sdkTask, { scrollY: true, click: true })
    })
  },
  computed: {
    ...mapState({ userInfo: 'userInfo', shopUrl: 'shopUrl', 'agreementPopType': 'agreementPopType' }),
    showDayTask () {
      return this.dayTaskList.length
    },
    showMoreTask () {
      return this.moreTaskList.length
    },
    showWelfareTask () {
      return this.welfareTaskList.length
    },
    showNewUserTask () {
      return this.newUserTaskInfo.isNew
    },
    showNotNewUserTask () {
      return this.newUserTaskInfo.isNew === false || this.newUserTaskInfo.newVersion && this.newUserTaskInfo.dayTaskVisibleFlag
    },
    showMasterTask () {
      return !newUtils.isEmptyObject(this.masterTaskInfo) && !this.isShowtjl
    },
    showH5AchievementTask () {
      return this.h5AchievementTask.length
    },
    gameType () {
      return getUrlParams('gametype') && parseInt(getUrlParams('gametype')) || getUrlParams('gameType') && parseInt(getUrlParams('gameType'))
    },
    curChannel () {
      return localStorage.getItem('APP_CHANNEL') ? localStorage.getItem('APP_CHANNEL') : getUrlParams('channel')
    },
    needReadAds () {
      return (this.curChannel.indexOf('100039') > -1 || this.curChannel.indexOf('100042') > -1) && this.userInfo && this.userInfo.userType === 1
    },
    needReadAdsText () {
      let arr = []
      if (this.needReadAds) {
        arr.push('领取前需看完视频')
      }
      if (this.pointInfo && this.pointInfo.awardRsps && this.pointInfo.awardRsps.length > 0) {
        arr.unshift('限时升级至' + this.pointInfo.endTime.slice(5))
      }
      return arr
    },
    wfCurLink () {
      return getUrlParams('wf_cur_link') || ''
    },
  },
  methods: {
    ...mapActions({
      _getTaskRedDot: 'GET_TASK_REDDOT',
      updateUserInfo: 'GET_USERINFO',
      judgeAddAgreement: 'JUDGE_ADD_AGREEMENT',
      closeAgreementPop: 'CLOSE_AGREEMENT_POP'
    }),
    downloadAPP () {
      //location.href=this.downLoadAddress;
      document.getElementById('download_form').submit()
    },
    copyDownloadLink () {
      this.$Toast('下载链接已复制')
    },
    confirmDDW () {
      if (this.hasBind) {
        this.downloadAPP()
      }
      else {
        let phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
        if (this.phone === '') {
          this.$Toast('请输入手机号码')
          return
        }
        if (!phoneReg.test(this.phone)) {
          this.$Toast('请输入正确的手机号码')
          return
        }
        if (this.code === '') {
          this.$Toast('请输入短信验证码')
          return
        }
        bindMobilePhone(this.phone, this.code).then(res => {
          const { code, data, message } = res
          if (code === 200) {
            this.$Toast('绑定成功', () => {
              this.getphoneBind()
            })
          } else {
            this.$Toast(message)
          }
        })

      }
    },
    getSMS () {
      let mobileReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if (this.phone === '') {
        this.$Toast('请输入手机号码')
        return
      }
      if (!mobileReg.test(this.phone)) {
        this.$Toast('请输入正确的手机号码')
        return
      }

      getPhoneCode(this.phone).then(res => {

        let { code, data, message } = (res || {})
        if (code === 200) {
          this.$Toast('短信验证码已发送，注意查收')
          this.countDown()
        } else {
          this.$Toast(message)
          clearInterval(this.time)
        }
      })
    },
    /** 倒计时 60 **/
    countDown () {
      let date = 59
      clearInterval(this.timer)
      this.countTime = '60秒后重发'
      this.timer = setInterval(() => {
        date = date - 1
        if (date < 0) {
          date = 0
          clearInterval(this.timer)
          this.countTime = ''
          return false
        }
        this.countTime = date + '秒后重发'
      }, 1000)
    },
    getphoneBind () {
      getPhoneBindInfo().then(res => {
        const { code, data } = res
        if (code == 200) {
          /** 没有绑定手机号的时候打开弹框 **/
          const { existsFlag, phone } = data
          if (existsFlag) {
            this.hasBind = true
            this.displayPhone = phone
            this.showStep1 = false
            this.showStep2 = true
          }
          else {
            this.showStep1 = true
            this.showStep2 = false
          }
        }
      })
    },
    init () {
      this.$marchSetsPoint('P_H5PT0061')
      return this._getNewUserTask()
    },
    adsInit () {
      try {
        if (this.needReadAds) {
          bdAdsInit()
          window.closeAdver = this.taskFinish
          this.adsError = false
        }
      } catch (error) {
        this.adsError = true
      }
    },
    /** 获取每日任务 **/
    async _getDayTask () {
      let gameType = this.gameType
      let params = {
        from: 'sdk',
        gameType: gameType
      }
      this.dayTaskList = []
      this.moreTaskList = []
      if (this.showWeekBetting) {
        return
      }
      let { code, data, message } = (await Services.getDayTask(params)).data
      let tasks = _get(data, 'tasks', [])
      let awardRsps = _get(data, 'awardRsps', [])
      let userPoints = _get(data, 'userPoints', 0)
      let endTime = _get(data, 'endTime', '')
      this.pointInfo = { awardRsps, userPoints, endTime }
      if (tasks.length) {
        this.dayTaskList = [...tasks.filter((item) => {
          return (item.gameType == gameType)
        })]
        this.moreTaskList = tasks.filter((item) => {
          return (item.gameType !== gameType)
        })
      }
      this.adsInit()
    },
    /** H5成长任务 **/
    _platTaskByBatch () {
      return new Promise((resolve, reject) => {
        if (this.wfCurLink) {
          let gameType = this.gameType
          let params = {
            from: 'sdk',
            gameType: gameType,
            value: `${gameType}-achievementTask`
          }

          Services.platTaskByBatch(params).then(res => {
            let { code, data, message } = _get(res, 'data', {})
            if (code === 200) {
              this.h5AchievementTask = data
            }
          }).then(() => {
            resolve()
          })
        }
        else {
          resolve()
        }
      })
    },
    /** 获取新手任务 **/
    async _getNewUserTask () {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await Services.getNewUserTask({ value: 'xiaomiNewUser' })
          const data = _get(res, 'data.data', {})
          this.newUserTaskInfo = data
          if (this.showNotNewUserTask) {
            /** 每日任务解锁提示 **/
            if (this.newUserTaskInfo.dayTaskVisiblePopUp) {
              this.$Toast('恭喜您，每日任务已解锁')
            }
            await this.gettjlInfo()//淘金令入口
            Promise.all([
              this._getMasterTask(),
              this._getWelfareTaskList(),
              this._getWeekBettingInfo(),
              this._platTaskByBatch()]
            ).finally(() => {
              resolve()
            })


          }
        } catch (error) {
          resolve()
        }
      })


    },
    /** 大师新手任务 **/
    /** 大师新手任务 **/
    _getMasterTask () {
      return new Promise((resolve, reject) => {
        let masterList = {
          12: 'crush-king-achievement',
          21: 'marbles-achievement',
          18: 'warrior-achievement',
          13: 'kingdom2-achievement',
          10: 'fish-king-achievement',
          9: 'kingdom-achievement',
          8: 'moto-achievement',
          5: 'samguk-achievement',
          2: 'bill-king-achievement',
          26: 'bird-achievement'
        }
        let value = masterList[this.gameType]
        if (value && !this.isShowtjl) {
          Services.getMasterTasks({ value, source: 1 }).then(res => {
            let { code, data } = _get(res, 'data', {})
            if (code === 200 && data[0]) {
              this.masterTaskInfo = data[0]
              this._getTaskRedDot()
            }
          }).finally(() => {
            resolve()
          })
        } else {
          resolve()
        }
      })
    },
    /** 获取周投注任务 **/
    _getWeekBettingInfo () {
      return new Promise((resolve, reject) => {
        Services.getWeekBettingInfo().then(res => {
          this.showWeekBetting = _get(res, 'data.data.show', false)
          this._getDayTask()
        }).finally(() => {
          resolve()
        })
      })

    },
    _getWelfareTaskList () {
      return new Promise((resolve, reject) => {
        let gameType = this.gameType
        let params = {
          from: 'sdk',
          gameType: gameType
        }
        this.welfareTaskList = []

        Services.platWelfareTask(params).then(res => {
          let { code, data, message } = _get(res, 'data', {})
          if (code === 200 && data.length) {
            this.welfareTaskList = data
          }
        }).finally(() => {
          resolve()
        })
      })
    },
    gotoweekbetting () {
      parent.location.href = '//wap.beeplaying.com/activities/weekbetting.html?vt=' + new Date().getTime()
    },
    taskClick (item, index, taskType) {
      this.selectTaskInfo = { ...item, index, taskType }
      switch (item.taskStatus) {
        case 0:
          if (taskType && this.needReadAds) {

            let lastWatchTime = localStorage['cache_lastWatchAds']

            if (lastWatchTime) {
              //检测看广告时间距离上次是否超过30s
              let range = Date.now() - lastWatchTime
              if (range < 30 * 1000) {
                this.$Toast('广告准备中请' + parseInt(30 - range / 1000) + '秒后再试')
                return false
              }
            }

            if (this.adsError) {
              this.$Toast('广告加载失败，请稍后重试')
              this.adsInit()
              return
            }
            let adsData = {
              sourceType: 4,
              entrance: 'SDK内每日任务',
            }
            localStorage.setItem('adsData', JSON.stringify(adsData))
            try {
              rewardVideo.show()
            } catch (error) {
              if (this.selectTaskInfo.action === 71) {
                this.$Toast('广告加载失败，请稍后重试')
              } else {
                this.taskFinish()
              }
            }
            return
          }
          this.taskFinish()
          break
        case 1:
          this.goFinish()
        default:
          break
      }
    },
    // taskType 0:新手任务 1:每日任务 2:更多每日任务 3:成就任务 4:福利任务 5:奇遇任务 6:h5成长任务
    taskFinish () {
      let { taskId, taskLogId, showAwardsImage, awardsName, flag, index, taskType } = this.selectTaskInfo
      const pointArr = { 0: 'A_H5PT0061000541', 1: 'A_H5PT0061001408', 2: 'A_H5PT0061001408', 3: 'A_H5PT0022002292', 6: 'A_H5PT0121001154' }
      this.$marchSetsPoint(flag && flag == 'ring2' ? 'A_H5PT0061001618' : pointArr[taskType])
      if (!flag || flag != 'ring2') {
        Services.taskFinish({ taskId, taskLogId }).then(res => {
          let { code, message, data } = res.data
          if (code == 200) {
            /** 打开弹出框 **/
            /** 后端不改兼容前端修改兼容性 **/
            let finishImg = _get(data, 'showAwardsImage', '') || showAwardsImage
            let finishName = _get(data, 'awardsName', '') || awardsName
            let finishNum = _get(data, 'awardsNum', '')
            if (finishNum > 1) {
              finishName = finishName + 'x' + finishNum
            }
            this.openAwards(finishImg, finishName, taskType)
            /** 更新头部我的信息 **/
            this.updateUserInfo()
          } else {
            this.$Toast(message)
          }
        })
      } else {
        Services.ring2exchange({ value: taskId }).then(res => {
          let { code, message, data } = res.data
          if (code == 200) {
            /** 打开弹出框 **/
            /** 后端不改兼容前端修改兼容性 **/
            let finishImg = _get(data, 'awardsImg', '') || awardsImage
            let finishName = _get(data, 'awardsName', '') || awardsName
            this.openAwards(finishImg, finishName, taskType)
            /** 更新头部我的信息 **/
            this.updateUserInfo()
          } else {
            this.$Toast(message)
          }
        })
      }
    },
    // taskType 0:新手任务 1:每日任务 2:更多每日任务 3:成就任务 4:渠道任务 5:奇遇任务 6:h5成长任务
    goFinish () {
      let { gameType, url, action, taskId, taskName, flag, index, taskType, finishNum, taskOps } = this.selectTaskInfo
      const pointArr = { 0: 'A_H5PT0061000540', 1: 'A_H5PT0061000542', 2: 'A_H5PT0061000543', 3: 'A_H5PT0022002291', 6: 'A_H5PT0121001153' }
      this.$marchSetsPoint(flag && flag == 'ring2' ? 'A_H5PT0061001617' : pointArr[taskType])
      if ((action === 1 || action === 2) && !url) {
        this.showGame = true
        this.titleText = `${taskName}${taskOps <= 50 ? ` (<span style="color:#F1FF0D">${finishNum}/${taskOps}</span>)` : ''}`
        this.$marchSetsPoint('A_H5PT0061003809', { project_id: this.gameType }) // H5平台-游戏内SDK-任务页-新人任务-体验任意游戏弹窗加载完成
        return
      }
      if (action === 39) {
        this.$refs.weekCard.openPop()
        return
      }
      if (action == 102) {
        this.getphoneBind()
        this.downLoadAddress = url
        return
      }

      if (taskType === 1 || taskType === 2) {
        let actionsArr = [39, 35, 34, 32]

        // 跳转到首页
        if (action == 36 || url == '/plat/') {
          this.$router.push('/')
          return false
        }
        // 跳转商城
        if (actionsArr.includes(action)) {
          jumpUrl({ url: this.shopUrl }, 'SDK')
          return false
        }
        if (url === 'prizesurvey') {
          if (window.linkUrl.getBackUrlFlag(this.curChannel) == 'xmWap') {
            jumpUrl({ url: 'https://wap.beeplaying.com/xmWap#/personalCenter/survey' }, 'SDK')
          } else {
            jumpUrl({ url: 'https://wap.beeplaying.com/publicWap/personalCenter.html#/survey' }, 'SDK')
          }
          return false
        }
      }
      jumpUrl(this.selectTaskInfo, 'SDK')
    },
    async receivePointsAward (item, taskType) {
      let { sort, awardName } = item
      /** 埋点 **/
      this.$marchSetsPoint('A_H5PT0061003206', {
        task_id: sort,
        task_name: awardName
      })
      const res = await Services.receivePointsAward(sort)
      let { code, message, data } = _get(res, 'data', {})
      if (code == 200) {
        /** 打开弹出框 **/
        /** 后端不改兼容前端修改兼容性 **/
        let finishImg = _get(data, 'showAwardsImage', '') || _get(data, 'awardsImage', '')
        let finishName = _get(data, 'awardsName', '')
        this.openAwards(finishImg, finishName, taskType)
        /** 更新头部我的信息 **/
        this.updateUserInfo()
      } else {
        this.$Toast(message)
      }

    },
    // taskType 0:新手任务 1:每日任务 2:更多每日任务 3:成就任务 4:渠道任务 5:奇遇任务 6:h5成长任务
    openAwards (awardsImage, awardsName, taskType) {
      this.showAwards = true
      this.award.awardsImage = awardsImage
      this.award.awardsName = awardsName
      this.award.taskType = taskType
    },
    // taskType 0:新手任务 1:每日任务 2:更多每日任务 3:成就任务 4:渠道任务 5:奇遇任务 6:h5成长任务
    awardsCallback () {
      switch (this.award.taskType) {
        case 0:
          this.specialControl()
          break
        case 3:
          this.$refs.masterTask.confirmAwardDialog()
          break
        case 4:
          this._getWelfareTaskList()
          break
        case 5://奇遇任务
          this.$refs.adventureTask.init()
          break
        case 6:
          this._platTaskByBatch()
        default:
          this._getDayTask()
          break
      }
    },
    showMasterTaskRule (string) {
      this.rule = string
      this.isShowMasterTaskRulePop = true
    },
    showTaskDesc (type, ruleImg) {
      this.ruleImg = ''
      this.popType = type
      switch (type) {
        case 'img':
          this.ruleImg = ruleImg
          break
        case 'rule':
          break
        case 'desc':
          break

        default:
          break
      }
      this.isShowTaskDescPop = true
    },
    closeDayTaskDesc () {
      switch (this.popType) {
        case 'rule':
          this.$marchSetsPoint('A_H5PT0061003208') // H5平台-游戏内SDK-每日任务-积分问号解释弹窗关闭点击
          break
        case 'img':
          this.ruleImg = ''
          this.$marchSetsPoint('A_H5PT0061003209') // H5平台-游戏内SDK-每日任务-任务问号解释弹窗关闭点击
          break
        case 'desc':
          break

        default:
          break
      }
      this.isShowTaskDescPop = false
      this.popType = ''
    },
    checkUse () {
      this.showCheckUse = true
      this.$marchSetsPoint('A_H5PT0061003578', {
        project_id: getUrlParams('gametype')
      })
    },
    hideCheckuse () {
      this.showCheckUse = false
      this.$marchSetsPoint('A_H5PT0061003580', {
        project_id: getUrlParams('gametype')
      })
    },
    closeCheckuse () {
      this.$marchSetsPoint('A_H5PT0061003579', {
        project_id: getUrlParams('gametype')
      })
    },
    confirmCheckuse () {
      this.$marchSetsPoint('A_H5PT0061003581', {
        project_id: getUrlParams('gametype')
      })
      parent.location.href = 'https://wap.beeplaying.com/xmWap/#/mall'
    },
    async getWeekLoopRemark () {
      let endTime = new Date(new Date().toLocaleDateString()).getTime()
      let info = localStorage.getItem('dayTaskDescTextInfo')
      info = JSON.parse(info)
      if (info) {
        if (info && info[endTime]) {
          this.dayTaskDesc = info[endTime]
          return
        }
      }
      const res = await Services.weekLoopRemark()
      this.dayTaskDesc = _get(res, 'data.data', '')
      info = {}
      info[endTime] = this.dayTaskDesc || ''
      localStorage.setItem('dayTaskDescTextInfo', JSON.stringify(info))
    },
    gamePopCallback (type, item) {
      this.showGame = false
      switch (type) {
        case 'game':
          this.$marchSetsPoint('A_H5PT0061003811', { target_project_id: item.id, project_id: this.gameType }) // H5平台-游戏内SDK-任务页-新人任务-体验任意游戏弹窗-选择游戏点击
          jumpUrl(item, 'SDK')
          break
        case 'index':
          this.$marchSetsPoint('A_H5PT0061003812', { project_id: this.gameType }) // H5平台-游戏内SDK-任务页-新人任务-体验任意游戏弹窗-其他游戏点击
          jumpUrl({ url: '/xmWap/#/' }, 'SDK')
          break

        default:
          this.$marchSetsPoint('A_H5PT0061003810', { project_id: this.gameType }) // H5平台-游戏内SDK-任务页-新人任务-体验任意游戏弹窗-关闭点击
          break
      }
    },
    specialControl () {
      if (this.newUserTaskInfo && this.newUserTaskInfo.taskList && this.newUserTaskInfo.taskList.length) {
        let list = this.newUserTaskInfo.taskList.filter(item => item.taskStatus !== 2)
        if (list.length <= 1) {
          this.newUserAllFinish()
          return
        }
      }
      let { gameType, url, action, taskId, taskName } = this.selectTaskInfo
      switch (action) {
        case 39:
          this.specialAward.type = 'weekCard-nextDay'
          this.showSpecialAward = true
          this.$marchSetsPoint('A_H5PT0061003816', { project_id: this.gameType }) // H5平台-游戏内SDK-任务页-新人任务-提醒周卡金叶弹窗加载完成
          break
        case 32:
          this.specialAward.type = 'turnable'
          this.showSpecialAward = true
          this.$marchSetsPoint('A_H5PT0061003813', { project_id: this.gameType }) // H5平台-游戏内SDK-任务页-新人任务-已开启转盘弹窗加载完成
          break

        default:
          break
      }
      this._getNewUserTask()
    },
    async newUserAllFinish () {
      const res = await Services.newUserAllFinish()
      const { code, data } = res.data
      if (code === 200) {
        this.specialAward.type = 'lastTask'
        this.specialAward.awardsName = `<p>额外送您一张<span style="color:#54FFF1">${data.awardsName}</span><br/><span style="color:#54FFF1">${data.awardsDesc}</span>内有效噢</p>`
        this.specialAward.awardsImage = data.awardsImage
        this.showSpecialAward = true
        this.$marchSetsPoint('A_H5PT0061003819', { project_id: this.gameType }) // H5平台-游戏内SDK-任务页-新人任务-赠送充值券弹窗加载完成
      }
    },
    specialCallback (bool) {
      let { action } = this.selectTaskInfo
      if (bool) {
        this._getNewUserTask()
        this.$marchSetsPoint('A_H5PT0061003822', { project_id: this.gameType }) // H5平台-游戏内SDK-任务页-新人任务-赠送充值券弹窗-现在去用户点击
        this.closeTask()
        parent.GameEval && parent.GameEval('openweb', location.origin + '/xmWap/#/gamepayment')
      } else {
        switch (action) {
          case 32:
            this.$marchSetsPoint('A_H5PT0061003815', { project_id: this.gameType }) // H5平台-游戏内SDK-任务页-新人任务-已开启转盘弹窗-知道了点击
            break
          case 39:
            this.$marchSetsPoint('A_H5PT0061003818', { project_id: this.gameType }) // H5平台-游戏内SDK-任务页-新人任务-提醒周卡金叶弹窗-知道了点击
            break
          default:
            this._getNewUserTask()
            this.$marchSetsPoint('A_H5PT0061003821', { project_id: this.gameType }) // H5平台-游戏内SDK-任务页-新人任务-赠送充值券弹窗-知道了点击
            break
        }
      }
    },
    closeSpecialPop () {
      let { action } = this.selectTaskInfo
      switch (action) {
        case 32:
          this.$marchSetsPoint('A_H5PT0061003814', { project_id: this.gameType }) // H5平台-游戏内SDK-任务页-新人任务-已开启转盘弹窗-关闭点击
          break
        case 39:
          this.$marchSetsPoint('A_H5PT0061003817', { project_id: this.gameType }) // H5平台-游戏内SDK-任务页-新人任务-提醒周卡金叶弹窗-关闭点击
          break

        default:
          this._getNewUserTask()
          this.$marchSetsPoint('A_H5PT0061003820', { project_id: this.gameType }) // H5平台-游戏内SDK-任务页-新人任务-赠送充值券弹窗-关闭点击
          break
      }

    },
    closeTask () {
      try {
        switch (this.gameType) {
          case 22:
            if (parent && parent.closeTaksPage) {
              parent.closeTaksPage()
            }
            break
          default:
            if (parent && parent.GameEval) {
              parent.GameEval('closeweb')
              parent.window.bp && parent.bp.event.emit('Event_Close_TaskPage')
              parent.cc.Notification && parent.cc.Notification.emit('Event_Close_TaskPage')
            }
            break
        }
      } catch (e) {
        window.parent.postMessage('closeweb', '*')
      }
    },
    closeAgreementModal (flag) {
      if (flag == 1) {
        this.closeAgreementPop()
        this.showAgreementPop = false
      }
      this.$marchSetsPoint(flag ? 'A_H5PT0331004181' : 'A_H5PT0331004182', {
        source_addres: 'sdk_task'
      })
    },
    goUserAgreement () {
      this.showAgreementPop = false
      parent.location.href = 'https://wap.beeplaying.com/xmWap/#/my/userAgreement'
    },
    openAgreementPop () {
      this.showAgreementPop = true
      this.$marchSetsPoint('P_H5PT0331', {
        source_addres: 'sdk_task'
      })
    },
    async gettjlInfo () {
      let { code, data } = (await Services.gettjlInlet()).data
      if (code == 200) {
        this.isShowtjl = !!data.tjlState
      }
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
.sdk-task-container {
  position: absolute;
  top: 225px;
  bottom: 12px;
  left: 14px;
  right: 15px;
  background: #fff5e7;
  box-shadow: 0px 2px 15px 0px #a15a21;
  border-radius: 30px 30px 30px 60px;
  box-sizing: border-box;
  overflow: hidden;
  .weekbetting {
    width: 100%;
    padding: 12px;
  }
  .nolist {
    margin: 249px auto 0;
    width: 338px;
    height: 226px;
    img {
      vertical-align: top;
      width: 100%;
    }
  }
}
.sdk-task-wrapper {
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
      margin-top: 24px;
    }
  }
  .text {
    p {
      font-size: 24px;
      font-weight: bold;
      color: #fff;
      line-height: 30px;
      text-align: center;
      margin-top: -54px;
      i {
        font-size: 24px;
        color: #ffed5e;
      }
    }
  }
}
.day-task-desc {
  .text {
    margin: 30px 32px 0;
    padding: 0 12px 0 18px;
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    max-height: 264px;
    text-align: left !important;
    font-size: 20px;
    color: #fff;
  }
  .rule-img-wrapper {
    margin: 10px 51px 0 48px;
    max-height: 294px;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    font-size: 0;
    img {
      width: 100%;
    }
  }
}
.pnl_ddwDownload {
  .step {
    margin: 20px 53px;
    width: 389px;
    img {
      width: 389px;
      height: 140px;
    }
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(81, 172, 255, 0.53);
  }

  #txtPhone {
    display: block;
    width: 400px;
    height: 70px;
    background: #0866b3;
    border-radius: 16px;
    margin: 20px auto 15px auto;
    font-size: 20px;
    line-height: 36px;
    padding-left: 22px;
    color: #3d95dc;
  }
  .pnl_code {
    position: relative;
    display: block;
    width: 400px;
    margin: 0 auto;

    #txtCode {
      width: 100%;
      height: 70px;
      background: #0866b3;
      border-radius: 16px;
      font-size: 24px;
      line-height: 36px;
      padding-left: 22px;
      padding-right: 160px;
      color: #3d95dc;
    }
    .sendCode {
      position: absolute;
      top: 17px;
      right: 19px;
      font-size: 24px;
      color: #54fff1;
      border-left: 1px solid #3d85c0;
      padding-left: 14px;
    }
  }
  .tip {
    position: absolute;
    left: 0;
    bottom: 42px;
    width: 100%;
    text-align: center;
    color: #0866b3;
    font-size: 20px;
    font-weight: bold;
  }
  .link_copy {
    color: #f12323;
    font-weight: bold;
    font-size: 20px;
    text-decoration: underline;
    margin: 115px auto 20px auto;
    width: 120px;
    display: block;
  }
  .desc {
    display: block;
    margin: -10px auto 0 auto;
    width: 400px;
    font-size: 20px;
    font-weight: 400;
    line-height: 36px;
    color: #88c0ff;
  }
}
.modal-center {
  margin-top: 60px;
  padding: 0 50px;
  box-sizing: border-box;
  line-height: 40px;
  i {
    color: #ff7800;
    font-weight: bolder;
  }
}
</style>
<style scoped>
.day-task-desc >>> .main-container.type-0 .title {
  margin-top: 60px;
}
.sdk-popup-wrapper .main-container.type-1 .checkuse-title {
  margin: 140px 0 50px;
}
.day-task-desc >>> .main-container.type-0 .text {
  height: 160px;
}
.checkuse-text {
  font-size: 20px;
  color: #fff;
  text-align: center;
}
.checkuse-btns {
  position: absolute;
  width: 100%;
  bottom: 45px;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cancel-btn {
  width: 159px;
  height: 89px;
  background: url(../../img/cancel-btn.png) no-repeat center top;
  background-size: 100% 100%;
  line-height: 84px;
  text-align: center;
  font-size: 24px;
  color: #fff;
}
.confirm-btn {
  width: 239px;
  height: 89px;
  background: url(../../img/confirm-btn.png) no-repeat center top;
  background-size: 100% 100%;
  line-height: 84px;
  text-align: center;
  font-size: 24px;
  color: #fff;
}
</style>

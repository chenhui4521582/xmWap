<template>
  <div class="new-user-task">
    <div class="title">
      <div class="left">
        <i class="line"></i><span>{{task.totalRewards / 10}}元</span><em>新手话费红包</em>
      </div>
      <div class="right">
        <img class="wallet-icon" src="../img/wallet-icon.png" alt="">
        <CountDown :time="task.countDown " />
      </div>
    </div>
    <div class="explain">
      在“领奖”中，话费券可换取话费充值、京东卡、IPhone等实物
    </div>
    <ul class="task-list">
      <li v-for="(item, index) in showTaskList" :key="index" @click="handClick(item, index)">
        <div class="icon">
          <img :src="item.icon | filter" alt="">
        </div>
        <div class="content">
          <div class="name">
            <span v-html="item.taskName"></span>
            <img class="problem-icon" src="../img/grey-problem-icon.png" alt=""
              @click.stop="showPop(item.taskDescImg)" v-if="item.taskDescImg">
          </div>
          <div class="progress">
            <div class="progress-bg">
              <div class="progress-bar"
                :style="{ width: (item.finishNum / item.taskOps) * 100 + '%' }"></div>
              <div class="progress-text">
                {{ item.finishNum | conversion }}/{{ item.taskOps | conversion }}
              </div>
            </div>
            <div class="awards">
              <img :src="item.awardsImage | filter" alt="" />
              <span>{{ item.awardsName }}</span>
            </div>
          </div>
        </div>
        <div class="btn" v-if="item.taskStatus == 0">领取</div>
        <div class="btn play" v-if="item.taskStatus == 1"
          :class="{'task_gray':item.taskName.includes('完成全部任务')}">
          {{ btnText(item.action) }}
        </div>
        <div class="btn play task_gray" v-if="item.taskStatus == 2">
          已领取
        </div>
      </li>
      <template v-if="showHiddenTask">
        <li v-for="(item, index) in hiddenTaskList" :key="index" @click="handClick(item, index)">
          <div class="icon">
            <img :src="item.icon | filter" alt="">
          </div>
          <div class="content">
            <div class="name">
              <span v-html="item.taskName"></span>
              <img class="problem-icon" src="../img/grey-problem-icon.png" alt=""
                @click.stop="showPop(item.taskDescImg)" v-if="item.taskDescImg">
            </div>
            <div class="progress">
              <div class="progress-bg">
                <div class="progress-bar"
                  :style="{ width: (item.finishNum / item.taskOps) * 100 + '%' }"></div>
                <div class="progress-text">
                  {{ item.finishNum | conversion }}/{{ item.taskOps | conversion }}
                </div>
              </div>
              <div class="awards">
                <img :src="item.awardsImage | filter" alt="" />
                <span>{{ item.awardsName }}</span>
              </div>
            </div>
          </div>
          <div class="btn play task_gray">
            已领取
          </div>
        </li>
      </template>
      <li class="arrow" v-if="hiddenTaskList&&hiddenTaskList.length"
        :class="showHiddenTask?'down':'up'" @click="toggleTask()">
        <img src="../img/arrow-icon.png" alt="">
      </li>
    </ul>
    <!-- 领取弹出框 -->
    <awards-dialog v-model="showAwards" :awards="AwardsData.awards"
      :explainText="AwardsData.explainText" @callback="awardsCallback"
      @closedCallback="awardsCallback" />
    <awards-dialog v-model="showSpecialAward" :title-img="titleImg" :tips-txt='specialAward.tipsTxt'
      confirm-btn-text='' :normal-btn-text='normalBtnText' :awards="specialAward.awards"
      :show-recommend="true" :explainText="specialAward.explainText" @callback="specialCallback"
      @closedCallback="specialCallback" />
    <Modal v-model="showModal" :title="titleText" :button-show="false" :type="1"
      @on-close="closedModal">
      <div class="modal-center">
        <ul>
          <li v-for="item in gamelist" :key="item.name" @click="toGame('game',item)">
            <img :src="item.img" alt="">
            <p>{{item.name}}</p>
          </li>
        </ul>
        <p class="other" @click="toGame('index')">
          其他游戏<span class="iconfont icon-next"></span>
        </p>
      </div>
    </Modal>
    <Modal v-model="isShowPop" class="rule-pop" :centerScroll="true" title="说明"
      :closeButtonShow=false :saveText="'知道了'" :type="2" @on-save="closePop()">
      <div class="rule-img-wrapper" @touchmove.stop>
        <img :src="ruleImg | filter" alt="">
      </div>
    </Modal>
    <week-card ref="weekCard" />
  </div>
</template>
<script>
import Services from '@/services/task'
import CountDown from './countDown'
import weekCard from '../../../components/popup/weekCard'
import { jumpUrl } from '@/utils/utils'
import { mapState,mapActions } from 'vuex'
import services from '../../../services/task'
export default {
  props: {
    task: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    showDialog: false,
    awardsImage: '',
    awardsName: '',
    /** 弹出框 **/
    showAwards: false,
    AwardsData: {
      awards: {
        awardsImage: '',
        awardsName: ''
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
    showHiddenTask: false,
    normalBtnText: ['知道了'],
    specialAward: JSON.parse('{"tipsTxt":"","awards":{"awardsImage":"","awardsName":"","nofilter":false,"autoHeight":false},"recommend":{"cdnImage":"","url":""},"explainText":{"text":"","color":"","html":""}}'),
    showSpecialAward: false,
    currentItem: {},
    titleImg: require('../img/yellow-right-title-img.png'),
    showModal: false,
    titleText: '',
    gamelist: [
      {
        img: require('../img/gamelist/billiards.png'),
        url: '/billiards',
        name: '欢乐竞技台球',
        id: 2
      },
      {
        img: require('../img/gamelist/crush.png'),
        url: '/crush',
        name: '糖果萌消消',
        id: 12
      },
      {
        img: require('../img/gamelist/kingdom2.png'),
        url: '/kingdom2',
        name: '三国大作战',
        id: 13
      },
      {
        img: require('../img/gamelist/crush3.png'),
        url: '/crush3',
        name: '破晓方块消消乐',
        id: 27
      },
      {
        img: require('../img/gamelist/square.png'),
        url: '/square',
        name: '众神风云',
        id: 18
      },
      {
        img: require('../img/gamelist/marbles.png'),
        url: '/Marbles',
        name: '王者弹珠',
        id: 21
      }
    ],
    isShowPop: false,
    ruleImg: ''
  }),
  components: {
    CountDown,
    weekCard
  },
  filters: {
    conversion (value) {
      if (value >= 10000) {
        return `${Math.floor(value / 1000) / 10}万`
      } else {
        return value
      }
    },
  },
  methods: {
    ...mapActions({
      updateUserInfo: 'GET_USERINFO'
    }),
    handClick (item, index) {
      if (item.taskStatus == 1) {
        this.goFinish(item, index)
      }
      if (item.taskStatus == 0) {
        if(this.agreementPopType==1){//需要弹窗
          this.$emit('showAgreementPop')
          return
        }
        this._taskFinish(item, index)
      }
    },
    _taskFinish (item, index) {
      this.currentItem = item
      let { taskId, taskLogId, showAwardsImage, awardsName, gameType, taskName } = item
      Services.taskFinish({ taskId, taskLogId }).then(res => {
        let { code, message, data } = res.data
        if (code == 200) {
          // 打开弹出框
          this.openAwards(showAwardsImage, awardsName)
          // 事件ID 事件名称 游戏ID 游戏位置
          this.$marchSetsPoint('A_H5PT0022001403', {
            position_id: index + 1,
            target_project_id: gameType,
            task_id: taskId,
            task_name: taskName
          })
        } else {
          this.$Toast(message)
        }
      })
    },
    openAwards (awardsImage, awardsName) {
      this.showAwards = true
      this.AwardsData.awards.awardsImage = awardsImage
      this.AwardsData.awards.awardsName = awardsName
    },
    goFinish (item, index) {
      let { gameType, url, action, taskId, taskName, finishNum, taskOps } = item
      this.$marchSetsPoint('A_H5PT0022000246', {
        position_id: index + 1,
        target_project_id: gameType,
        task_id: taskId,
        task_name: taskName
      })
      if ((action === 1 || action === 2) && !url) {
        this.showModal = true
        this.titleText = `${taskName}${taskOps <= 50 ? `(<span style="color:#FF4141">${finishNum}/${taskOps}</span>)` : ''}`
        this.$marchSetsPoint('A_H5PT0022003788') // H5平台-任务-新人任务-体验任意游戏弹窗加载完成
        return
      }
      if (action === 39) {
        this.$refs.weekCard.openPop()
        return
      }
      /** 百度底bar 跳转地址转发,统一一版本后删除 **/
      if (this.$moduleConfig.urlReword && this.$moduleConfig.urlReword[url]) {
        window.location.href = this.$moduleConfig.urlReword[url]
        return false
      }
      jumpUrl(item)
    },
    btnText (action) {
      let list = {
        '1': '开始游戏',
        '5': '去抽奖',
        '32': '去抽奖',
        '49': '去套圈',
        '59': '去领养',
        '63': '去兑换',
        '65': '开始游戏',
        '66': '去查看',
        '67': '去查看',
        '73': '去兑换'
      }
      return list[action] || '去完成'
    },
    awardsCallback () {
      this.showAwards = false
      this.specialControl()
    },
    specialControl () {
      if (this.showTaskList.length <= 1) {
        this.newUserAllFinish()
        return
      }
      let { gameType, url, action, taskId, taskName } = this.currentItem
      switch (action) {
        case 32:
          this.specialAward.tipsTxt = '您已开启30天抽奖转盘'
          this.specialAward.explainText.html = '<p class="margin30auto color888">每天可抽一次<br />自付费开始可抽30天</p>'
          this.specialAward.awards.awardsImage = require('../img/find-turnable.png')
          this.specialAward.awards.nofilter = true
          this.specialAward.awards.autoHeight = true
          this.showSpecialAward = true
          this.$marchSetsPoint('A_H5PT0022003792') // H5平台-任务-新人任务-已开启转盘弹窗加载完成
          break
        case 39:
          this.specialAward.explainText.html = '<p class="fs24 margin30auto color888">明天登录可领<span class="red-text">1000金叶</span><br/>连续<span>6天</span></p>'
          this.showSpecialAward = true
          this.$marchSetsPoint('A_H5PT0022003798') // H5平台-任务-新人任务-提醒周卡金叶弹窗加载完成
          break

        default:
          break
      }
      /** 更新头部我的信息 **/
      this.updateUserInfo()
      /** 通知父组件 重新获取数据 **/
      this.$emit('newUserTaskRefresh')
    },
    async newUserAllFinish () {
      const res = await services.newUserAllFinish()
      const { code, data } = res.data
      if (code === 200) {
        this.specialAward.explainText.html = `<p class="fs24 margin30auto color888">额外送您一张<span class="red-text">${data.awardsName}</span><br/><span>${data.awardsDesc}</span>内有效噢</p>`
        this.specialAward.awards.awardsImage = data.awardsImage
        this.normalBtnText = ['知道了', '现在去用']
        this.showSpecialAward = true
        this.$marchSetsPoint('A_H5PT0022003804') // H5平台-任务-新人任务-赠送充值券弹窗加载完成
      }
    },
    toGame (type, item) {
      this.showModal = false
      switch (type) {
        case 'game':
          this.$marchSetsPoint('A_H5PT0022003790', { target_project_id: item.id }) // H5平台-任务-新人任务-体验任意游戏弹窗-选择游戏点击
          jumpUrl(item)
          break
        case 'index':
          this.$marchSetsPoint('A_H5PT0022003791') // H5平台-任务-新人任务-体验任意游戏弹窗-其他游戏点击
          this.$router.push('/')
          break

        default:

          break
      }
    },
    closedModal () {
      this.showModal = false
      this.$marchSetsPoint('A_H5PT0022003789') // H5平台-任务-新人任务-体验任意游戏弹窗-关闭点击
    },
    specialCallback (type) {
      this.showSpecialAward = false
      this.specialAward = JSON.parse('{"tipsTxt":"","awards":{"awardsImage":"","awardsName":"","nofilter":false,"autoHeight":false},"recommend":{"cdnImage":"","url":""},"explainText":{"text":"","color":"","html":""}}')
      this.normalBtnText = ['知道了']
      let { gameType, url, action, taskId, taskName } = this.currentItem
      switch (type) {
        case 'close':
          switch (action) {
            case 32:
              this.$marchSetsPoint('A_H5PT0022003793') // H5平台-任务-新人任务-已开启转盘弹窗-关闭点击
              break
            case 39:
              this.$marchSetsPoint('A_H5PT0022003799') // H5平台-任务-新人任务-提醒周卡金叶弹窗-关闭点击
              break

            default:
              /** 更新头部我的信息 **/
              this.updateUserInfo()
              /** 通知父组件 重新获取数据 **/
              this.$emit('newUserTaskRefresh')
              // 如果后期增加特殊处理得自行增加
              this.$marchSetsPoint('A_H5PT0022003805') // H5平台-任务-新人任务-赠送充值券弹窗-关闭点击
              break
          }
          break
        case 'cancel':
          switch (action) {
            case 32:
              this.$marchSetsPoint('A_H5PT0022003794') // H5平台-任务-新人任务-已开启转盘弹窗-知道了点击
              break
            case 39:
              this.$marchSetsPoint('A_H5PT0022003800') // H5平台-任务-新人任务-提醒周卡金叶弹窗-知道了点击
              break

            default:
              /** 更新头部我的信息 **/
              this.updateUserInfo()
              /** 通知父组件 重新获取数据 **/
              this.$emit('newUserTaskRefresh')
              // 如果后期增加特殊处理得自行增加
              this.$marchSetsPoint('A_H5PT0022003806') // H5平台-任务-新人任务-赠送充值券弹窗-知道了点击
              break
          }

          break
        case 'sure':
          /** 更新头部我的信息 **/
          this.updateUserInfo()
          /** 通知父组件 重新获取数据 **/
          this.$emit('newUserTaskRefresh')
          // 如果后期增加特殊处理得自行增加
          this.$marchSetsPoint('A_H5PT0022003807') // H5平台-任务-新人任务-赠送充值券弹窗-现在去用户点击
          this.$router.push({ name: 'payment' })
          break

        default:
          break
      }
    },
    showPop (taskDescImg) {
      this.ruleImg = taskDescImg
      this.$marchSetsPoint('A_H5PT0022003202')// H5平台-任务-每日任务-任务标题旁问号点击
      this.isShowPop = true
    },
    closePop () {
      this.isShowPop = false
    },
    toggleTask () {
      this.showHiddenTask = !this.showHiddenTask
      this.$marchSetsPoint('A_H5PT0022003787') // H5平台-任务-新人任务-展开或收起点击
    }
  },
  computed: {
    ...mapState(['agreementPopType']),
    taskProgress () {
      if (!this.task && !this.task.taskList.length) return ''
      let number = 0
      this.task.taskList.forEach(item => {
        if (item.taskStatus == 2) {
          number++
        }
      })
      return `${number}/${this.task.taskList.length}`
    },
    showTaskList () {
      return this.task.taskList.filter(item => item.taskStatus !== 2)
    },
    hiddenTaskList () {
      return this.task.taskList.filter(item => item.taskStatus === 2)
    }
  }
}
</script>
<style lang="less" scoped>
.opacitying {
  opacity: 0.5;
}
.new-user-task {
  margin-top: 50px;
  margin-bottom: 50px;
  padding: 0 24px;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .left {
      display: flex;
      justify-content: flex-start;
      align-items: flex-end;
      color: #303133;
      font-size: 32px;
      font-weight: bold;
      line-height: 1.1;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      i {
        margin-right: 10px;
        width: 6px;
        height: 32px;
        border-radius: 3px;
        background: #ff4141;
      }
      span {
        color: #ff4141;
      }
    }
    .right {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .wallet-icon {
        margin-right: 6px;
        display: block;
        width: 33px;
        height: 27px;
        animation: rotate 1s infinite;
      }
      .count-down {
        font-size: 24px;
        color: #ff4141;
      }
    }
  }
  .problem-icon {
    width: 24px;
    height: 24px;
    margin-left: 9px;
  }
  .explain {
    margin: 20px 0 4px;
    padding-left: 16px;
    font-size: 20px;
    font-weight: 500;
    line-height: 40px;
    color: rgba(136, 136, 136, 1);
  }
  .top-line {
    width: 100%;
    height: 50px;
    p {
      float: left;
      margin-right: 20px;
    }
    .process {
      display: inline-block;
      margin-right: 0;
      width: 120px;
      height: 28px;
      line-height: 28px;
      background: #000;
    }
    i {
      color: #ffd338;
    }
    p:last-child {
      float: right;
      i {
        display: inline-block;
        margin-left: 12px;
        width: 19px;
        height: 11px;
        vertical-align: middle;
        background: url('../img/icon_arrow.png') no-repeat;
        background-size: 100% 100%;
        &.rotate {
          transform: rotate(180deg);
        }
      }
    }
  }
  .task-list {
    position: relative;
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      position: relative;
      overflow: hidden;
      border-bottom: 1px solid #e6e6e6;
      .icon {
        overflow: hidden;
        margin-right: 20px;
        width: 72px;
        height: 72px;
        border-radius: 50%;
        img {
          vertical-align: top;
          width: 100%;
          height: 100%;
        }
      }
      .content {
        flex: 1;
        .name {
          margin-bottom: 14px;
          color: #000;
          font-size: 28px;
          font-weight: bold;
          line-height: 1.2;
        }
        .progress {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .progress-bg {
            background: #fff;
            width: 200px;
            position: relative;
            height: 24px;
            border-radius: 8px;
            overflow: hidden;
            margin-right: 20px;
            .progress-bar {
              background-color: #ffbc00;
              position: absolute;
              height: 100%;
              left: 0;
            }
          }
          .progress-text {
            font-size: 20px;
            color: #575757;
            height: 24px;
            line-height: 24px;
            text-align: center;
            position: absolute;
            left: 0;
            right: 0;
            margin: auto;
          }
          .awards {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            background-size: 100% 100%;
            border-radius: 0 20px 20px 0;
            height: 30px;
            img {
              width: 30px;
              height: 30px;
            }
            span {
              display: block;
              padding: 0 5px;
              font-size: 24px;
              height: 30px;
              line-height: 30px;
              color: #ff5e00;
              font-weight: bold;
              text-align: center;
              white-space: nowrap;
            }
          }
        }
        .description {
          font-size: 24px;
          color: #999999;
        }
      }
      .btn {
        color: #ff4141;
        font-size: 24px;
        border-radius: 16px;
        text-align: center;
        box-sizing: border-box;
        width: 150px;
        height: 56px;
        line-height: 56px;
        font-weight: 500;
        white-space: nowrap;
        background-color: #ffffff;
        &.play {
          color: #ff4141;
          background-color: #f0f0f0;
          &.task_gray {
            color: #666;
          }
        }
        &.gray {
          background: #fff;
          color: #ff4141;
        }
        &.received {
          position: relative;
          background: #e0e0e0;
          color: #ff4141;
          opacity: 0.6;
        }
      }
      .in-game {
        position: absolute;
        bottom: -25px;
        left: 20px;
        color: #2f3c49;
        font-size: 18px;
      }
      &:last-child {
        border-bottom: none;
      }
    }
    .arrow {
      position: absolute;
      left: 50%;
      margin-left: -25px;
      bottom: -50px;
      z-index: 3;
      transition: all 0.1s;
      transform: rotateZ(0deg);
      transform-origin: center;
      font-size: 0;
      img {
        width: 50px;
        height: 50px;
      }
      &.down {
        transform: rotateZ(180deg);
        transform-origin: center;
      }
    }
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
      position: fixed;
      width: 90%;
      top: 16%;
      left: 50%;
      margin-left: -45%;
      animation: rotate 2s linear infinite;
      opacity: 0.8;
    }
    .content-box {
      position: fixed;
      width: 60%;
      height: 80%;
      left: 50%;
      margin-left: -30%;
      top: 20%;
      .open-gift {
        position: absolute;
        top: 15%;
        left: 50%;
        margin-left: -140px;
        width: 280px;
      }
      .open-text {
        position: absolute;
        top: 40%;
        left: 50%;
        margin-left: -204px;
        width: 408px;
      }
      .open-btn {
        position: absolute;
        top: 52%;
        left: 50%;
        margin-left: -94px;
        width: 188px;
      }
    }
  }
  .modal-center {
    ul {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-around;
      margin: 5px auto 20px;
      li {
        margin: 15px auto 0;
        flex: 30%;
        text-align: center;
        font-size: 20px;
        color: #888;
        white-space: nowrap;
        img {
          width: 104px;
          height: 104px;
        }
      }
    }
    p.other {
      text-align: center;
      font-size: 24px;
      color: #5186ca;
      .icon-next {
        font-size: 20px;
      }
    }
  }
  .rule-img-wrapper {
    margin: 0 -24px;
    max-height: 600px;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    font-size: 0;
    img {
      width: 100%;
    }
  }
}
@keyframes rotate {
  0% {
  }
  10% {
    transform: rotate(20deg);
  }
  20% {
    transform: rotate(-20deg);
  }
  30% {
    transform: rotate(15deg);
  }
  40% {
    transform: rotate(-15deg);
  }
  50% {
    transform: rotate(10deg);
  }
  60% {
    transform: rotate(-10deg);
  }
  70% {
    transform: rotate(5deg);
  }
  80% {
    transform: rotate(-5deg);
  }
  90% {
    transform: rotate(0);
  }
  100% {
  }
}
</style>

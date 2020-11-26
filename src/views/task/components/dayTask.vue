<template>
  <div class="day-task">
    <div class="title">
      <p>
        <span><i class="line"></i>每日任务</span><span v-if="needReadAds"
          style="color:#888">&nbsp;&nbsp;(领取前需看完视频)</span>
      </p>
      <p @click="showPop('desc')">任务轮替说明</p>
    </div>
    <section class="integral-wrapper" v-if="awardRsps&&awardRsps.length">
      <div class="my-integral">当前积分: <span>{{userPoints}}</span>
        <img class="problem-icon" src="../img/grey-problem-icon.png" alt=""
          @click="showPop('rule')">
      </div>
      <div class="awards-rsps">
        <ul>
          <li v-for="(item,index) in awardRsps" :key="`rsp-${index}`">
            <div class="img">
              <img class="normal" :src="item.awardImage|filter" alt=""
                v-if="index<awardRsps.length-1">
              <img v-else-if="item.awardStatus===2" src="../img/box-opened.png" class="box-opened"
                alt="">
              <img v-else src="../img/box-close.png" class="box-close" alt="">
            </div>
            <div class="name">{{item.awardName}}</div>
            <div class="line"></div>
            <div class="status">
              <img class="opened" src="../img/opened-icon.png" alt="" v-if="item.awardStatus===2">
              <span class="get" v-else-if="item.awardStatus===0"
                @click="_receivePointsAward(item)">领取</span>
              <span class="normal" v-else>{{item.points}}积分</span>
            </div>
          </li>
        </ul>
        <div class="integral-progress-wrapper">
          <div class="integral-progress" :style="{width:integralProgress}"></div>
        </div>
      </div>
    </section>
    <p class="red-title" v-if="redTitle">
      {{redTitle}}
    </p>
    <ul class="task-list">
      <li v-for="(item, index) in task" :key="index" @click="handClick(item, index)">
        <template v-if="item.taskId">
          <div class="icon">
            <img :src="item.icon | filter" alt="">
          </div>
          <div class="content">
            <div class="name">
              <span v-html="item.taskName"></span>
              <img class="problem-icon" src="../img/grey-problem-icon.png" alt=""
                @click.stop="showPop('img',item.taskDescImg)" v-if="item.taskDescImg">
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
          <div class="btn play" v-if="item.taskStatus == 1">去完成</div>
          <div class="btn received" v-if="item.taskStatus == 2">
            已领取
          </div>
        </template>
        <template v-else>
          <guanggao :position="item.position"></guanggao>
        </template>
      </li>
    </ul>
    <!-- 领取弹出框 -->
    <awards-dialog v-model="showAwards" :awards="AwardsData.awards"
      :explainText="AwardsData.explainText" @callback="awardsCallback"
      @closedCallback="awardsCallback" />
    <Modal v-model="isShowPop" class="rule-pop" :centerScroll="true" title="说明"
      :closeButtonShow=false :saveText="'知道了'" :type="2" @on-save="closePop()">
      <template v-if="popType==='img'">
        <div class="rule-img-wrapper" @touchmove.stop>
          <img :src="ruleImg | filter" alt="">
        </div>
      </template>
      <template v-if="popType==='rule'">
        <div class="text">
          1、完成任务可领积分，积分达到一定数值后可领取奖品；<br>
          2、奖品记得当天及时领取，第二天每日任务将重置，无法领取；<br>
          3、当天获得的积分，第二天将重置清零。
        </div>
      </template>
      <template v-if="popType === 'desc'">
        <div class="text" v-html="descText" @touchmove.stop>
        </div>
      </template>
    </Modal>
  </div>
</template>
<script>
import guanggao from '@/components/guanggao'
import Services from '@/services/task'
import { jumpUrl, bdAdsInit } from '@/utils/utils'
import { mapState, mapActions } from 'vuex'
import _get from 'lodash.get'
export default {
  props: {
    taskInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      showDialog: false,
      awardsImage: '',
      awardsName: '',
      /** 弹出框 **/
      showAwards: false,
      AwardsData: {
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
      selectTaskInfo: {},
      isShowPop: false,
      popType: '',
      ruleImg: '',
      descText: ''
    }
  },
  filters: {
    conversion (value) {
      if (value >= 10000) {
        return `${Math.floor(value / 1000) / 10}万`
      } else {
        return value
      }
    }
  },
  components: {
    guanggao
  },
  computed: {
    ...mapState(['shopUrl', 'userInfo','agreementPopType']),
    task () {
      return _get(this.taskInfo, 'tasks', [])
    },
    awardRsps () {
      let arr = _get(this.taskInfo, 'awardRsps', [])
      if (arr) {
        arr.sort((a, b) => a.sort - b.sort)
      }
      return arr
    },
    userPoints () {
      return _get(this.taskInfo, 'userPoints', 0)
    },
    endTime () {
      let time = _get(this.taskInfo, 'endTime', '')
      return time && time.slice(5) || ''
    },
    curChannel () {
      return localStorage.getItem('APP_CHANNEL') ? localStorage.getItem('APP_CHANNEL') : getUrlParams('channel')
    },
    needReadAds () {
      return (this.curChannel.indexOf('100039') > -1 || this.curChannel.indexOf('100042') > -1) && this.userInfo && this.userInfo.userType === 1
    },
    redTitle () {
      if (this.awardRsps && this.awardRsps.length > 0) {
        return '限时升级至' + this.endTime
      }
      return ''
    },
    integralProgress () {
      if (this.awardRsps && this.awardRsps.length) {
        let index = this.awardRsps.findIndex(item => item.awardStatus === 1)
        switch (index) {
          case 0:
            return `${12.5 * this.userPoints / this.awardRsps[0].points}%`
          case 1:
          case 2:
          case 3:
            return `${(25 * index - 12.5) + 25 * (this.userPoints - this.awardRsps[index - 1].points) / (this.awardRsps[index].points - this.awardRsps[index - 1].points)}%`
          default:
            return '100%'
        }
      } else {
        return '0%'
      }
    }
  },

  mounted () {
    if (this.needReadAds) {
      bdAdsInit()
    }
    this.getWeekLoopRemark()
  },
  methods: {
    ...mapActions({
      updateUserInfo: 'GET_USERINFO'
    }),
    async handClick (item, index) {
      if (item.taskId) {
        this.selectTaskInfo = { ...item, index: index }
        if (item.taskStatus == 1 || item.taskStatus == 2) {
          this.goFinish()
        }
        if (item.taskStatus == 0) {
          if(this.agreementPopType==1){//需要弹窗
            this.$emit('showAgreementPop')
            return
          }
          if (this.needReadAds) {

            let lastWatchTime = localStorage['cache_lastWatchAds']

            if (lastWatchTime) {
              //检测看广告时间距离上次是否超过30s
              let range = Date.now() - lastWatchTime
              if (range < 30 * 1000) {
                this.$Toast('广告准备中请' + parseInt(30 - range / 1000) + '秒后再试')
                return false
              }
            }

            window.closeAdver = this._taskFinish
            let adsData = {
              sourceType: 2,
              entrance: '每日任务',
            }
            localStorage.setItem('adsData', JSON.stringify(adsData))
            try {
              rewardVideo.show()
            } catch (error) {
              if (this.selectTaskInfo.action === 71) {
                this.$Toast('广告加载失败，请稍后重试')
              } else {
                this._taskFinish()
              }
            }
            return
          }
          this._taskFinish()
        }
      }
    },
    _receivePointsAward (item) {
      let { sort, awardName } = item
      /** 埋点 **/
      this.$marchSetsPoint('A_H5PT0022003201', {
        task_id: sort,
        task_name: awardName
      })
      this.AwardsData.explainText.text = '可在【每日任务】模块查看'
      Services.receivePointsAward(sort).then(res => {
        let { code, message, data } = res.data
        if (code == 200) {
          /** 打开弹出框 **/
          /** 后端不改兼容前端修改兼容性 **/
          let finishImg = _get(data, 'showAwardsImage', '') || _get(data, 'awardsImage', '')
          let finishName = _get(data, 'awardsName', '')
          this.openAwards(finishImg, finishName)
          /** 更新头部我的信息 **/
          this.updateUserInfo()
        } else {
          this.$Toast(message)
        }
      })
    },
    _taskFinish () {
      let { taskId, taskLogId, showAwardsImage, taskName, awardsName, gameType, index } = this.selectTaskInfo
      this.AwardsData.explainText.text = '可在【我的】页面中查看'
      Services.taskFinish({ taskId, taskLogId }).then(res => {
        let { code, message, data } = res.data
        if (code == 200) {
          /** 打开弹出框 **/
          /** 后端不改兼容前端修改兼容性 **/
          let finishImg = _get(data, 'showAwardsImage', '') || showAwardsImage
          let finishName = _get(data, 'awardsName', '') || awardsName
          let finishNum = _get(data, 'awardsNum', '')
          if (finishNum > 1) {
            finishName = finishName + '*' + finishNum
          }
          this.openAwards(finishImg, finishName)
          /** 埋点 **/
          this.$marchSetsPoint('A_H5PT0022001402', {
            position_id: index + 1,
            target_project_id: gameType,
            task_id: taskId,
            task_name: taskName
          })
          /** 更新头部我的信息 **/
          this.updateUserInfo()
        } else {
          this.$Toast(message)
        }
      })
    },
    goFinish () {
      let { gameType, url, action, taskId, taskName, index } = this.selectTaskInfo
      this.$marchSetsPoint('A_H5PT0022000244', {
        position_id: index + 1,
        target_project_id: gameType,
        task_id: taskId,
        task_name: taskName
      })
      let actionsArr = [39, 35, 34, 32]
      // 跳转到首页
      if (action == 36 || url == '/plat/') {
        this.$router.push('/')
        return false
      }
      // 跳转商城
      if (actionsArr.includes(action)) {
        parent.location.href = this.shopUrl
        return false
      }
      //跳转问卷调查
      if (url == 'prizesurvey') {
        this.$router.push('/personalCenter/survey')
        return false
      }
      /** 百度底bar 跳转地址转发,统一一版本后删除 **/
      if (this.$moduleConfig.urlReword && this.$moduleConfig.urlReword[url]) {
        parent.location.href = this.$moduleConfig.urlReword[url]
        return false
      }
      jumpUrl(this.selectTaskInfo)
    },
    openAwards (awardsImage, awardsName) {
      this.showAwards = true
      this.AwardsData.awards.awardsImage = awardsImage
      this.AwardsData.awards.awardsName = awardsName
    },
    awardsCallback () {
      this.showAwards = false
      /** 通知父组件 重新获取数据 **/
      this.$emit('dayTaskRefresh')
    },
    async getWeekLoopRemark () {
      let endTime = new Date(new Date().toLocaleDateString()).getTime()
      let info = localStorage.getItem('dayTaskDescTextInfo')
      info = JSON.parse(info)
      if (info) {
        if (info && info[endTime]) {
          this.descText = info[endTime]
          return
        }
      }
      const res = await Services.weekLoopRemark()
      this.descText = _get(res, 'data.data', '')
      info = {}
      info[endTime] = this.descText || ''
      localStorage.setItem('dayTaskDescTextInfo', JSON.stringify(info))
    },
    showPop (type, taskDescImg) {
      this.ruleImg = ''
      this.popType = type
      switch (type) {
        case 'img':
          this.ruleImg = taskDescImg
          this.$marchSetsPoint('A_H5PT0022003202')// H5平台-任务-每日任务-任务标题旁问号点击
          break
        case 'rule':
          this.$marchSetsPoint('A_H5PT0022003200')// H5平台-任务-每日任务-积分旁问号点击
          break
        case 'desc':
          break

        default:
          break
      }
      this.isShowPop = true
    },
    closePop () {
      switch (this.popType) {
        case 'rule':
          this.$marchSetsPoint('A_H5PT0022003203')// H5平台-任务-每日任务-积分问号解释弹窗关闭点击
          break
        case 'img':
          this.ruleImg = ''
          this.$marchSetsPoint('A_H5PT0022003204')// H5平台-任务-每日任务-任务问号解释弹窗关闭点击
          break
        case 'desc':
          break

        default:
          break
      }
      this.isShowPop = false
      this.popType = ''
    }
  }
}
</script>
<style lang="less" scoped>
.opacitying {
  opacity: 0.5;
}
.day-task {
  margin-top: 60px;
  padding: 0 24px;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      color: #e8382b;
      font-size: 24px;
      margin-left: 10px;
      line-height: 1;
      &:last-child {
        color: #ff7800;
        line-height: 30px;
        border-bottom: 1px solid #ff7800;
      }
    }
    span {
      &:first-child {
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
      }
    }
  }
  .red-title {
    text-align: center;
    margin: 20px 0 -10px;
    color: #e8382b;
    font-size: 24px;
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
  .problem-icon {
    width: 24px;
    height: 24px;
    margin-left: 9px;
  }
  .integral-wrapper {
    background: #fff7dd;
    border-radius: 16px;
    padding: 6px 20px 24px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.03);
    margin-top: 15px;
    .my-integral {
      color: #888;
      font-size: 20px;
      display: flex;
      align-items: center;
      span {
        font-size: 32px;
        color: #ff7800;
        font-weight: bold;
      }
    }
    .awards-rsps {
      position: relative;
      ul {
        display: flex;
        align-items: center;
        justify-content: space-around;
        li {
          flex: 1;
          div {
            white-space: nowrap;
            font-size: 20px;
            text-align: center;
          }
          .img {
            height: 90px;
            overflow: hidden;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            .normal {
              height: 72px;
            }
            .box-opened {
              height: 90px;
            }
            .box-close {
              height: 76px;
            }
          }
          .line {
            width: 4px;
            height: 30px;
            background: rgba(187, 187, 187, 0.5);
            margin: 9px auto 12px;
            border-radius: 3px;
          }
          .status {
            text-align: center;
            font-size: 0;
            .opened {
              width: 30px;
              height: 30px;
            }
            .get {
              display: inline-block;
              background: #ff4141;
              width: 80px;
              height: 30px;
              color: #fff;
              border-radius: 8px;
              line-height: 30px;
              font-size: 20px;
              text-align: center;
            }
            .normal {
              display: inline-block;
              background: #ffecb1;
              width: 80px;
              height: 30px;
              color: #ff7800;
              border-radius: 8px;
              line-height: 30px;
              font-size: 20px;
              text-align: center;
            }
          }
        }
      }
      .integral-progress-wrapper {
        position: absolute;
        bottom: 49px;
        left: 0;
        width: 100%;
        height: 16px;
        background: #fff;
        border-radius: 8px;
        font-size: 0;
        overflow: hidden;
        .integral-progress {
          height: 100%;
          min-width: 0%;
          background: #ffbc00;
        }
      }
    }
  }
  .task-list {
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
        color: #fff;
        font-size: 24px;
        border-radius: 16px;
        text-align: center;
        box-sizing: border-box;
        width: 150px;
        height: 56px;
        line-height: 56px;
        font-weight: 500;
        white-space: nowrap;
        background: rgba(255, 120, 0, 1);
        &.play {
          background-color: #ff4141;
        }
        &.gray {
          background: #fff;
          color: #ff4141;
        }
        &.received {
          position: relative;
          background: #e0e0e0;
          color: #ff4141;
        }
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
  .rule-pop {
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
    .text {
      color: #888;
      font-size: 24px;
      font-weight: 400;
      max-height: 300px;
      overflow-x: hidden;
      overflow-y: scroll;
    }
  }
}
</style>

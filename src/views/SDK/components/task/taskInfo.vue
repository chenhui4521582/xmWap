<template>
  <article class="sdk-task-info" :class="{'newUser': taskType == 0}">
    <!-- 新手任务头部 -->
    <template v-if="taskType == 0">
      <div class="new-user-title">
        <div class="left">
          <div class="icon">
            <img src="../../img/wallet-icon.png" alt="">
          </div>
          <div class="text">
            <div class="name"><span>{{taskInfo.totalRewards / 10}}元</span>新手话费红包</div>
            <div class="wrap">
              <span>剩余时间</span>
              <count-down :time="redTitle" />
            </div>
          </div>
        </div>
        <div class="right" @click="checkUse">
          话费券怎么用<span class="iconfont icon-next"></span>
        </div>
      </div>
    </template>
    <!-- 其他任务头部 -->
    <template v-else>
      <section class="title" v-if="title">{{title}}</section>
      <section class="sub-title" v-if="subTitle">{{subTitle}}</section>
      <section class="red-title" v-if="redTitle && !subTitle">{{redTitle|formatTime}}</section>
    </template>
    <section class="integral-wrapper" v-if="pointInfo.awardRsps && pointInfo.awardRsps.length>0">
      <div class="my-integral">当前积分: <span>{{pointInfo.userPoints}}</span>
        <img class="problem-icon" src="../../img/grey-problem-icon.png" alt=""
          @click.stop="showPop('rule')">
      </div>
      <div class="awards-rsps">
        <ul>
          <li v-for="(item,index) in pointInfo.awardRsps" :key="`rsp-${index}`">
            <div class="img">
              <img class="normal" :src="item.awardImage|filter" alt=""
                v-if="index<pointInfo.awardRsps.length-1">
              <img v-else-if="item.awardStatus===2" src="../../img/box-opened.png"
                class="box-opened" alt="">
              <img v-else src="../../img/box-close.png" class="box-close" alt="">
            </div>
            <div class="name">{{item.awardName}}</div>
            <div class="line"></div>
            <div class="status">
              <img class="opened" src="../../img/opened-icon.png" alt=""
                v-if="item.awardStatus===2">
              <span class="get" v-else-if="item.awardStatus===0" @click="pointClick(item)">领取</span>
              <span class="normal" v-else>{{item.points}}积分</span>
            </div>
          </li>
        </ul>
        <div class="integral-progress-wrapper">
          <div class="integral-progress" :style="{width:integralProgress}"></div>
        </div>
      </div>
    </section>
    <p class="red-title" style="margin:0.4rem auto -0.4rem"
      v-if="typeof redTitle == 'object' && redTitle.constructor == Array && redTitle.length>1 && !subTitle">
      {{redTitle[1]}}</p>
    <section class="list-wrapper">
      <ul class="list">
        <template v-if="taskType == 0">
          <li class="item" v-for="(item, index) in showTaskList" :key="index">
            <div class="icon">
              <img :src="item.icon | filter" alt="">
            </div>
            <div class="center">
              <div class="name">
                <span v-html="item.taskName"></span>
                <img class="problem-icon" src="../../img/grey-problem-icon.png" alt=""
                  @click.stop="showPop('img',item.taskDescImg)" v-if="item.taskDescImg">
              </div>
              <div class="wrap">
                <div class="progress">
                  <div class="progress-center" :style="{width: countWidth(item)}"></div>
                  <div class="progress-text">
                    {{item.finishNum | conversion}}/{{item.taskOps | conversion}}</div>
                </div>
                <div class="award">
                  <div class="award-img">
                    <img :src="item.awardsImage | filter" alt="" />
                  </div>
                  <div class="award-name">
                    {{ item.awardsName }}
                  </div>
                </div>
              </div>
            </div>
            <div class="btn-wrapper" @click.stop="handleClick(item,index)">
              <div class="btn-finish" v-if="item.taskStatus == 0">领取
              </div>
              <div class="btn-go" v-if="item.taskStatus == 1">去完成
              </div>
            </div>
          </li>
          <template v-if="showHiddenTask">
            <li class="item" v-for="(item, index) in hiddenTaskList" :key="'hidden-'+index">
              <div class="icon">
                <img :src="item.icon | filter" alt="">
              </div>
              <div class="center">
                <div class="name">
                  <span v-html="item.taskName"></span>
                  <img class="problem-icon" src="../../img/grey-problem-icon.png" alt=""
                    @click.stop="showPop('img',item.taskDescImg)" v-if="item.taskDescImg">
                </div>
                <div class="wrap">
                  <div class="progress">
                    <div class="progress-center" :style="{width: countWidth(item)}"></div>
                    <div class="progress-text">
                      {{item.finishNum | conversion}}/{{item.taskOps | conversion}}</div>
                  </div>
                  <div class="award">
                    <div class="award-img">
                      <img :src="item.awardsImage | filter" alt="" />
                    </div>
                    <div class="award-name">
                      {{ item.awardsName }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="btn-wrapper" @click.stop="handleClick(item,index)">
                <div class="btn-finished">已领取</div>
              </div>
            </li>
          </template>
          <li class="arrow" v-if="hiddenTaskList&&hiddenTaskList.length"
            :class="showHiddenTask?'down':'up'" @click="toggleTask()">
            <img src="../../img/arrow-icon.png" alt="">
          </li>
        </template>
        <template v-else>
          <li class="item" v-for="(item, index) in taskList" :key="index">
            <div class="icon">
              <img :src="item.icon | filter" alt="">
            </div>
            <div class="center">
              <div class="name">
                <span v-html="item.taskName"></span>
                <img class="problem-icon" src="../../img/grey-problem-icon.png" alt=""
                  @click.stop="showPop('img',item.taskDescImg)" v-if="item.taskDescImg">
              </div>
              <div class="wrap">
                <div class="progress">
                  <div class="progress-center" :style="{width: countWidth(item)}"></div>
                  <div class="progress-text">
                    {{item.finishNum | conversion}}/{{item.taskOps | conversion}}</div>
                </div>
                <div class="award">
                  <div class="award-img">
                    <img :src="item.awardsImage | filter" alt="" />
                  </div>
                  <div class="award-name">
                    {{ item.awardsName }}
                  </div>
                </div>
              </div>
            </div>
            <div class="btn-wrapper" @click.stop="handleClick(item,index)">
              <div class="btn-finish" v-if="item.taskStatus == 0">领取
              </div>
              <div class="btn-go" v-if="item.taskStatus == 1">去完成
              </div>
              <div class="btn-finished" v-if="item.taskStatus == 2">已领取</div>
            </div>
          </li>

        </template>
      </ul>
    </section>
  </article>
</template>
<script>
import CountDown from '../countDown'
import {mapState} from 'vuex'
export default {
  name: 'sdk-day-task-info',
  components: {
    CountDown
  },
  data () {
    return {
      showHiddenTask: false
    }
  },
  filters: {
    conversion (value) {
      if (value >= 10000) {
        return `${Math.floor(value / 1000) / 10}万`
      } else {
        return value
      }
    },
    formatTime (param) {
      if (typeof param === 'string' && param.constructor == String) {
        return param
      } else if (typeof param == 'object' && param.constructor == Array) {
        return param.length ? param[0] : ''
      } else if (!isNaN(param) && isFinite(param)) {
        let days = param / 1000 / 3600 / 24
        let day = Math.floor(days)
        let hours = Math.ceil((days - day) * 24)
        return `倒计时剩余 ${day}天${hours}小时`
      }
      return ''
    }
  },
  props: {
    taskList: {
      type: Array,
      default: () => ([])
    },
    pointInfo: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    },
    redTitle: {
      type: [Number, String, Array],
      default: 0
    },
    taskType: {
      type: Number,
      default: 0
    },
    taskInfo: {
      typeof: Object,
      default: () => { }
    },
    gameType: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    ...mapState(['agreementPopType']),
    integralProgress () {
      if (this.pointInfo.awardRsps && this.pointInfo.awardRsps.length) {
        let index = this.pointInfo.awardRsps.findIndex(item => item.awardStatus === 1)
        switch (index) {
          case 0:
            return `${12.5 * this.pointInfo.userPoints / this.pointInfo.awardRsps[0].points}%`
          case 1:
          case 2:
          case 3:
            return `${(25 * index - 12.5) + 25 * (this.pointInfo.userPoints - this.pointInfo.awardRsps[index - 1].points) / (this.pointInfo.awardRsps[index].points - this.pointInfo.awardRsps[index - 1].points)}%`
          default:
            return '100%'
        }
      } else {
        return '0%'
      }
    },
    showTaskList () {
      return this.taskList.filter(item => item.taskStatus !== 2)
    },
    hiddenTaskList () {
      return this.taskList.filter(item => item.taskStatus === 2)
    }
  },
  mounted () {

  },
  methods: {
    countWidth (item) {
      if (item.finishNum && item.taskOps) {
        let count = (item.finishNum / item.taskOps) > 1 ? 1 : (item.finishNum / item.taskOps)
        return count * 100 + '%'
      } else {
        return '0%'
      }
    },
    handleClick (item, index) {
      if(this.agreementPopType==1&&item.taskStatus == 0){//需要弹窗
        this.$emit('showAgreementPop')
        return
      }
      this.$emit('on-click', item, index, this.taskType)
    },
    pointClick (item) {
      if(this.agreementPopType==1){//需要弹窗
        this.$emit('showAgreementPop')
        return
      }
      this.$emit('point-click', item, this.taskType)
    },
    showPop (type, taskDescImg) {
      this.$emit('show-desc-pop', type, taskDescImg)
      if (taskDescImg) {
        this.$marchSetsPoint('A_H5PT0061003207') // H5平台-游戏内SDK-每日任务-任务标题旁问号点击
      } else {
        this.$marchSetsPoint('A_H5PT0061003205') // H5平台-游戏内SDK-每日任务-积分旁问号点击
      }
    },
    checkUse () {
      this.$emit('checkUse')
    },
    toggleTask () {
      this.showHiddenTask = !this.showHiddenTask
      this.$marchSetsPoint('A_H5PT0061003808', { project_id: this.gameType }) // H5平台-游戏内SDK-任务页-新人任务-展开或收起点击
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
.sdk-task-info {
  margin: 20px auto 0;
  padding: 20px 12px;
  &.newUser {
    position: relative;
    margin: 0;
    padding: 100px 12px 0;
  }
  .new-user-title {
    position: absolute;
    left: 0;
    top: 0;
    padding: 0 19px 0 13px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100px;
    background: url(../../img/new-user-title.png) no-repeat center top;
    background-size: 100% 100%;
    font-weight: bold;
    .left {
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .icon {
        margin-right: 10px;
        width: 76px;
        height: 64px;
        animation: rotate 1s infinite;
        img {
          vertical-align: top;
          width: 100%;
          height: 100%;
        }
      }
      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        .name {
          margin-bottom: 5px;
          font-size: 22px;
          color: #000000;
          span {
            color: #ff4141;
          }
        }
        .wrap {
          display: flex;
          justify-content: flex-start;
          font-size: 18px;
          span {
            margin-right: 6px;
            color: #454545;
          }
          .count-down {
            color: #dd5236;
          }
        }
      }
    }
    .right {
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      white-space: nowrap;
      font-size: 18px;
      color: #5185c9;
    }
  }
  .title {
    text-align: center;
    font-size: 26px;
    font-weight: bold;
    color: #9f752a;
    display: flex;
    align-items: center;
    justify-content: center;
    &::before,
    &::after {
      content: '';
      display: block;
      width: 32px;
      height: 36px;
    }
    &::before {
      .bg-center('../../img/left-handle.png');
      margin-right: 10px;
    }
    &::after {
      .bg-center('../../img/right-handle.png');
      margin-left: 10px;
    }
  }
  .sub-title {
    text-align: center;
    font-size: 22px;
    font-weight: bold;
    color: #9f752a;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -20px;
    &::before,
    &::after {
      content: '';
      display: block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #9f752a;
      margin: 0 12px;
    }
  }
  .red-title {
    font-size: 20px;
    font-weight: bold;
    color: #ff1200;
    text-align: center;
  }

  .problem-icon {
    width: 21px;
    height: 21px;
    margin-left: 9px;
  }
  .integral-wrapper {
    background: #ffeec4;
    border-radius: 16px;
    padding: 6px 20px 24px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.03);
    margin-top: 15px;
    margin-bottom: 15px;
    .my-integral {
      color: #be9957;
      font-size: 18px;
      display: flex;
      align-items: center;
      span {
        font-size: 26px;
        color: #ff4141;
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
            font-size: 18px;
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
            width: 2px;
            height: 26px;
            background: #d0d0d0;
            margin: 9px auto 12px;
            border-radius: 1px;
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
              background: url('../../img/get-bg.png') no-repeat center center;
              background-size: 100% 100%;
              width: 80px;
              height: 30px;
              color: #fff;
              border-radius: 15px;
              line-height: 30px;
              font-size: 20px;
              text-align: center;
            }
            .normal {
              display: inline-block;
              background: #ffdeaf;
              width: 80px;
              height: 30px;
              color: #be9957;
              border-radius: 15px;
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
        background: #ceb68b;
        border-radius: 8px;
        font-size: 0;
        overflow: hidden;
        .integral-progress {
          height: 100%;
          min-width: 0%;
          background: #fe7506;
        }
      }
    }
  }
  .list {
    position: relative;
    .item {
      position: relative;
      padding: 15px 20px 12px 9px;
      display: flex;
      align-items: center;
      height: 100px;
      border-bottom: 3px dashed #e6ad5d;
      box-sizing: border-box;
      .icon {
        margin-right: 10px;
        overflow: hidden;
        min-width: 72px;
        max-width: 72px;
        height: 72px;
        border-radius: 50%;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .center {
        width: 330px;
        .name {
          font-size: 22px;
          color: #000;
          font-weight: bold;
          width: 330px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          vertical-align: middle;
        }
        .wrap {
          display: flex;
          align-items: center;
          .progress {
            position: relative;
            width: 170px;
            height: 24px;
            background: #ceb68b;
            border-radius: 8px;
            .progress-center {
              position: absolute;
              left: 0;
              top: 0;
              z-index: 1;
              width: 0;
              height: 100%;
              background: #fe7506;
              border-radius: 8px;
            }
            .progress-text {
              position: absolute;
              left: 0;
              top: 0;
              z-index: 1;
              width: 100%;
              height: 24px;
              line-height: 24px;
              font-size: 16px;
              line-height: 24px;
              color: #fff;
              text-align: center;
            }
          }
          .award {
            display: flex;
            justify-content: center;
            align-items: center;
            .award-img {
              margin-left: 20px;
              margin-right: 5px;
              min-width: 30px;
              max-width: 30px;
              height: 30px;
              line-height: 30px;
              img {
                max-width: 100%;
                max-height: 100%;
              }
            }
            .award-name {
              white-space: nowrap;
              color: #dd5237;
              font-size: 20px;
              font-weight: bold;
            }
          }
        }
      }
      .btn-wrapper {
        min-width: 90px;
        max-width: 90px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        font-size: 20px;
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
    .arrow {
      position: absolute;
      left: 50%;
      margin-left: -25px;
      bottom: -24px;
      transition: all 0.1s;
      transform: translate3d(0, 0, 000) rotateZ(0deg);
      transform-origin: center;
      z-index: 3;
      font-size: 0;
      img {
        width: 45px;
        height: 45px;
      }
      &.down {
        transform: translate3d(0, 0, 000) rotateZ(180deg);
        transform-origin: center;
      }
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

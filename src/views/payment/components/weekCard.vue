<template>
  <article class="weeks-card-wrapper" :class="{'newUser':isShowNewUserPop}"
    @click.self="closePop(1)" v-if="cards.length">
    <!--周卡-->
    <section class="weeks-card" :class="{expand:isExpand,bg0:index==0,bg1:index==1}" v-for="(item,index) in cards" :key="index">
      <div class="weeks-content">
        <div class="weeks-content-title">{{titles[index]}}<img src="../img/weekcard/help.png" alt="" v-if="isExpand" @click="openPop(index)"></div>
        <template v-if="isExpand">
          <div class="items">
            <div class="item" v-for="(citem, cindex) in item.content.split(';')" :key="cindex">
              <span class="num" v-html="citem.replace(/((\(|（)概率\d+%(\)|）))/g,'').replace(/((\+)?\d+(元)?)/g,`<i style='color:#D7484C'>$1</i>`)"></span>
            </div>
          </div>
          <div class="btn">
            <template v-if="item.buyFlag">
              <div class="market_price">
                原价 <span class="code">￥</span>{{item.originalPrice}}
              </div>
              <div class="btnClick" @click.stop="toPay(item, index?7:3)"><span class="code">￥</span>{{ item.price || '' }}</div>
            </template>
            <template v-else>
              <div class="btnClick actived"><span class="code">剩余{{(index?30:7)-item.days}}天</span></div>
            </template>
          </div>
        </template>
        <template v-else>
          <div class="weeks-content-surplus">
            剩余<i>{{(index?30:7)-item.days}}天</i>
          </div>
        </template>
      </div>
      <div class="weeks-corner" v-if="isExpand&&item.bonusRatio">赠{{item.bonusRatio}}%</div>
      <img src="../img/weekcard/expand.png" alt="" v-if="!isExpand" class="expand" @click.stop="expand(index)">
    </section>
    <section v-if="isShowNewUserPop" class="newUserPop">
      <div class="hand">
        <img src="../img/hand.png" alt="">
      </div>
    </section>
    <Modal v-model="showWeekTips" title="周卡加赠" saveText="知道了" @on-save="closeTips" @on-close="closeTips">
      <div class="modal_content">
        自购买第二天起，<br>每天登录可领<i>{{cards[0]&&cards[0].content.split(';')[1].split(/['+','*']/)[1]}}</i>,持续<i>6天</i>
      </div>
    </Modal>
    <Modal v-model="showMonthTips" title="月卡加赠" saveText="知道了" @on-save="closeTips" @on-close="closeTips">
      <div class="modal_content">
        <p>1、自购买第二天起，每天登录可领加赠，持续<i>29天</i></p>
        <p>2、加赠为以下奖品中的随机一种：<i>{{cards[1]&&cards[1].content.split(';')[1].split(/['+','*']/)[1]}}</i></p>
      </div>
    </Modal>
  </article>
</template>

<script>
import { getUrlParams } from '@/utils/utils'

export default {
  name: '',
  components: {},
  data () {
    return {
      isShowed: true,
      newVersionTaskOpened: {
        weekcard: Date.now()
      },
      isExpand:true,//是不是展开
      showWeekTips:false,
      showMonthTips:false,
      cards:[],
      titles:['豪华周卡','至尊月卡'],
      //立得 +30000金叶子;加赠 +1000金叶子*6天
      content:'立得 398000金叶子;随机 +800金叶子/1元话费券/1元京东卡*29天'
    }
  },
  props: {
    weeksConent: {
      type: Array,
      default: () => ([])
    },
    weeksCard: {
      type: Object,
      default: () => {
      }
    },
    monthCard: {
      type: Object,
      default: () => {
      }
    }
  },
  computed: {
    isShowNewUserPop () {
      let isOpen = getUrlParams('openPop')
      history.replaceState({}, '', location.href.split(/\?|\&/)[0])
      let info = localStorage.getItem('newVersionTaskOpened') ? JSON.parse(localStorage.getItem('newVersionTaskOpened')) : {}
      if (info.task) {
        if (info.weekcard) {
          return false
        }
        return this.isShowed && isOpen
      }
      return false
    }
  },
  methods: {
    toPay (item, type) {
      if (item.buyFlag&&this.isExpand) {
        if (this.isShowNewUserPop) {
          this.closePop()
        }
        this.$emit('toPay', item, type)
      }
    },
    closePop (type) {
      this.isShowed = false
      if (type) {
        this.$marchSetsPoint('A_H5PT0023002646') // H5平台-任务-新手任务-周卡引导-高亮商城页面-点击高亮外区域
      } else {
        this.$marchSetsPoint('A_H5PT0023002645') // H5平台-任务-新手任务-周卡引导-高亮商城页面-点击高亮周卡礼包
      }
    },
    openPop(type){
      //H5平台-商城-周卡说明点击 A_H5PT0023004140
      //H5平台-商城-月卡说明点击 A_H5PT0023004141
      this.$marchSetsPoint(type?'A_H5PT0023004141':'A_H5PT0023004140')
      if(type){
        this.showMonthTips=true
      }else{
        this.showWeekTips=true
      }
    },
    closeTips(){
      if(this.showMonthTips==true){
        this.showMonthTips=false
      }else{
        this.showWeekTips=false
      }
    },
    expand(type){
      //H5平台-商城-展开周卡点击 A_H5PT0023004143
      //H5平台-商城-展开月卡点击 A_H5PT0023004144
      this.$marchSetsPoint(type?'A_H5PT0023004144':'A_H5PT0023004143')
      this.isExpand=true
    }
  },
  mounted () {
    if (this.isShowNewUserPop) {
      this.$marchSetsPoint('A_H5PT0023002644') // H5平台-任务-新手任务-周卡引导-高亮商城页面展现加载完成
      let info = localStorage.getItem('newVersionTaskOpened') ? JSON.parse(localStorage.getItem('newVersionTaskOpened')) : {}
      localStorage.setItem('newVersionTaskOpened', JSON.stringify({ ...info, ...this.newVersionTaskOpened }))
    }
  },
  watch:{
    weeksCard(val){
      if(val){
        this.cards.push(this.weeksCard)
        this.monthCard&& this.cards.push(this.monthCard)
        this.isExpand=!!this.weeksCard.buyFlag||!!(this.monthCard&&this.monthCard.buyFlag)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.weeks-card-wrapper {
  display: flex;
  justify-content: space-between;
  &.newUser {
    position: fixed;
    z-index: 20;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .weeks-card {
      margin: 20px;
      box-shadow: 0 0 0 10000px rgba(0, 0, 0, 0.6);
    }
  }
  .weeks-card {
    margin-top: 20px;
    padding: 27px 20px 0 11px;
    width: 330px;
    height: 250px;
    border-radius: 16px;
    overflow: hidden;
    background: linear-gradient(133deg, #FFFFFF 0%, #A2BDCD 100%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
    padding: 25px 30px;
    box-sizing: border-box;
    position: relative;
    &.bg1{
      background: linear-gradient(133deg, #FEECC4 0%, #FFC778 100%);
    }
    &:not(.expand){
      height: 130px;
    }
    .weeks-card-icon {
      margin-right: 28px;
      width: 180px;
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f7f7f7;
      border-radius: 10px;
      img {
        width: 160px;
        height: 160px;
      }
      &.actived {
        background: rgba(255, 250, 212, 1);
        border: 1px solid rgba(255, 198, 107, 1);
        opacity: 1;
        border-radius: 10px;
        position: relative;
        &:before {
          content: '';
          width: 180px;
          height: 57px;
          background: url('../img/index/cardlight.png');
          background-size: 100% 100%;
          position: absolute;
          bottom: -57px;
          animation: lightchange 2s infinite ease-in-out;
        }
      }
    }
    .weeks-content {
      flex: 1;
      .weeks-content-title {
        font-size: 32px;
        font-weight: bold;
        color: rgba(0, 0, 0, 1);
        display: flex;
        align-items: center;
        height: 42px;
        img{
          margin-left: 10px;
          width: 24px;
          height: 24px;
        }
      }
      .items {
        height: 118px;
        padding: 3px 0 0;
        display: flex;
        /*justify-content: center;*/
        flex-direction: column;
        .item {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          font-size: 24px;
          font-weight: 400;
          margin-bottom: 5px;
          flex-wrap: wrap;
          .title {
            margin-right: 10px;
            color: rgba(136, 136, 136, 1);
          }
          .num {
            color: rgba(136, 136, 136, 1);
            i{
              color: #ff7800;
            }
          }
        }
      }
      .btn {
        display: flex;
        align-items: center;
        .market_price {
          color: rgba(187, 187, 187, 1);
          font-size: 20px;
          text-decoration: line-through;
          font-weight: 500;
        }
        .price {
          margin-right: 20px;
          font-size: 24px;
          font-weight: 400;
          color: rgba(0, 0, 0, 1);
          .code {
            color: rgba(255, 120, 0, 1);
            margin-top: 3px;
          }
        }
        .btnClick {
          margin-left: 10px;
          width: 110px;
          height: 42px;
          background: rgba(255, 65, 65, 1);
          border-radius: 10px;
          font-size: 24px;
          font-weight: 500;
          text-align: center;
          line-height: 42px;
          color: rgba(255, 255, 255, 1);
          .code {
            font-size: 20px;
            margin-top: 2px;
          }
          &.actived {
            width: 210px;
            background: rgba(251, 175, 175, 1);
            margin: auto;
          }
        }
      }
      .used {
        float: right;
        width: 150px;
        height: 42px;
        text-align: center;
        line-height: 42px;
        background: #ffc655;
        font-size: 20px;
        color: #ba5300;
        border-radius: 28px;
      }
    }
    .weeks-corner{
      position: absolute;
      top:25px;
      right: 0;
      width: 86px;
      height: 30px;
      background: url("../img/weekcard/corner.png");
      background-size: 100% 100%;
      line-height: 30px;
      text-align: center;
      font-size: 20px;
      font-weight: 500;
      color: #FFFFFF;
    }
    .weeks-content-surplus{
      margin-top: 3px;
      font-size: 24px;
      font-weight: 400;
      color: #888888;
      i{
        color: #FF7800;
      }
    }
    .expand{
      position: absolute;
      top:59px;
      right: 54px;
      width: 22px;
      height: 12px;
    }
  }
  .newUserPop {
    .hand {
      position: absolute;
      top: 170px;
      right: 28px;
      width: 75px;
      animation: tranRotateZ 1s linear infinite;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .modal_content{
    font-size: 20px;
    font-weight: 500;
    line-height: 30px;
    color: #888;
    i{
      color: #FF4141;
    }
  }
  @keyframes tranRotateZ {
    0% {
      transform: rotateZ(0deg);
    }
    50% {
      transform: rotateZ(30deg);
    }
    100% {
      transform: rotateZ(0deg);
    }
  }
  @keyframes lightchange {
    0% {
      bottom: -57px;
    }
    100% {
      bottom: 237px;
    }
  }
}
</style>

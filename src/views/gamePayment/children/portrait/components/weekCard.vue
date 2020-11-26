<template>
  <section class="border-bottom" v-if="weeksCard||monthCard">
    <template v-for="(item,index) in cards">
      <div class="weeks-card" :key="index" :class="{expand:isExpand,bg0:index==0,bg1:index==1}">
        <div class="weeks-content">
          <p class="weeks-content-title" :class="{bg0:index==0,bg1:index==1}">{{titles[index]}}<img src="../images/weekcard/help.png" alt="" v-if="isExpand" @click.stop="openPop(index)"></p>
          <template v-if="isExpand">
            <div class="items">
              <div class="item" v-for="(citem, cindex) in item.content.split(';')" :key="cindex">
                <span class="num" :class="{bg0:index==0,bg1:index==1}" v-html="citem.replace(/((\(|（)概率\d+%(\)|）))/g,'').replace(/((\+)?\d+(元)?)/g,`<i style='color:#ff7800'>$1</i>`)"></span>
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
            <div class="weeks-content-surplus" :class="{bg0:index==0,bg1:index==1}">
              剩余<i>{{(index?30:7)-item.days}}天</i>
            </div>
          </template>
        </div>
        <div class="weeks-corner" :class="{bg0:index==0,bg1:index==1}" v-if="isExpand&&item.bonusRatio">赠{{item.bonusRatio}}%</div>
        <img :src="`${require(`../images/weekcard/expand${index}.png`)}`" alt="" v-if="!isExpand" class="expand" @click.stop="expand(index)">
      </div>
    </template>
  </section>
</template>

<script>
  export default {
    name: 'weekCard',
    props:{
      weeksCard:{
        type:Object,
        default:()=>{}
      },
      monthCard:{
        type:Object,
        default:()=>{}
      }
    },
    data(){
      return {
        cards: [],
        isExpand:true,
        titles:['豪华周卡','至尊月卡']
      }
    },
    methods:{
      toPay (item, type) {
        if (item.buyFlag&&this.isExpand) {
          if (this.isShowNewUserPop) {
            this.closePop()
          }
          this.$emit('toPay', item, type)
        }
      },
      openPop(type){
        //游戏内-商城-周卡说明点击 A_H5PT0058004145
        //游戏内-商城-月卡说明点击 A_H5PT0058004146
        this.$marchSetsPoint(type?'A_H5PT0058004146':'A_H5PT0058004145',{edition: 'portrait',project_id: parent.SDK.getGameType()})
        this.$emit('openPop',type)
      },
      expand(type){
        //游戏内-商城-展开周卡点击 A_H5PT0058004148
        //游戏内-商城-展开月卡点击 AA_H5PT0058004149
        this.$marchSetsPoint(type?'A_H5PT0058004149':'A_H5PT0058004148',{edition: 'portrait',project_id: parent.SDK.getGameType()})
        this.isExpand=true
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

<style scoped lang="less">
  .bg-center(@url) {
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url(@url);
  }
  .border-bottom {
    padding: 20px 0;
    border-bottom: 2px dashed #e6ad5d;
    display: flex;
    justify-content: space-between;
  }
  .weeks-card {
    padding: 22px 25px;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    width: 275px;
    height: 231px;
    position: relative;
    &.bg0{
      background: url("../images/weekcard/bg01.png");
      background-size: 100% 100%;
    }
    &.bg1{
      background: url("../images/weekcard/bg11.png");
      background-size: 100% 100%;
    }
    &:not(.expand){
      height: 97px;
      &.bg0{
        background: url("../images/weekcard/bg00.png");
        background-size: 100% 100%;
      }
      &.bg1{
        background: url("../images/weekcard/bg10.png");
        background-size: 100% 100%;
      }
    }
    .weeks-content {
      .weeks-content-title {
        font-size: 26px;
        font-weight: bold;
        color: #565656;
        display: flex;
        align-items: center;
        img{
          margin-left: 10px;
          width: 24px;
          height: 24px;
        }
        &.bg1{
          color: #9F752A;
        }
      }
      .items {
        height: 85px;
        padding: 3px 0 0;
        .item {
          font-size: 18px;
          color: #565656;
        }
        .num {
          color: #565656;
          i{
            color: #D7484C;
          }
          &.bg1{
            color: #9F752A;
          }
        }
      }
    }
    .btn {
      display: flex;
      align-items: center;
      .market_price {
        color: #828282;
        font-size: 18px;
        text-decoration: line-through;
        font-weight: bold;
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
        height: 60px;
        .bg-center('../images/buy-btn.png');
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        line-height: 60px;
        color: rgba(255, 255, 255, 1);
        .code {
          font-size: 20px;
          margin-top: 2px;
        }
        &.actived {
          width: 191px;
          height: 71px;
          line-height: 75px;
          .bg-center('../images/weekcard/btn_gray.png');
          margin: auto;
        }
      }
    }
    .weeks-corner{
      position: absolute;
      top:13px;
      right: 16px;
      width: 80px;
      height: 28px;
      background: url("../images/weekcard/corner0.png");
      background-size: 100% 100%;
      line-height: 28px;
      text-align: center;
      font-size: 18px;
      font-weight: 500;
      color: #FFFFFF;
      padding-left: 8px;
      box-sizing: border-box;
      &.bg1{
        background: url("../images/weekcard/corner1.png");
        background-size: 100% 100%;
      }
    }
    .weeks-content-surplus{
      margin-top: 3px;
      font-size: 18px;
      font-weight: 400;
      color: #565656;
      i{
        color: #D7484C;
      }
      &.bg1{
        color: #9F752A;
      }
    }
    .expand{
      position: absolute;
      top:42px;
      right: 77px;
      width: 26px;
      height: 12px;
    }
  }
</style>

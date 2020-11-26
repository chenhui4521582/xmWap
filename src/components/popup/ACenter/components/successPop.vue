<template>
  <div v-if="show">
    <div class="pop-mask"></div>
    <div class="successPopLight">
      <div class="successPop">
        <div class="pic">
          <img :src="prizeImgUrl|filter" alt="">
        </div>
        <div class="prize_name">{{prizeName}}</div>
        <div class="gain_btn" @click="close">朕收下了</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'successPop',
    props: {
      show:{
        type: Boolean,
        default: false
      },
      prizeImgUrl: {
        type: String,
        default: ''
      },
      prizeName: {
        type: String,
        default: ''
      }
    },
    methods:{
      close(){
        this.$emit('close')
      }
    }
  }
</script>

<style lang="less" scoped>
  .pop-mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .7);
    z-index: 11
  }
  .successPopLight{
    position: fixed;
    top:0;
    bottom: 0;
    margin: auto;
    width: 7.2*100px;
    height: 9.11*100px;
    background: url("../images/type4/success_light.png") no-repeat;
    background-size: 100% 100%;
    z-index: 11;
    .successPop{
      position: absolute;
      left: 0;
      right: 0;
      top:0;
      bottom: 0;
      margin: auto;
      width: 4.8*100px;
      height: 5.3*100px;
      background: url("../images/type4/success_bg.png") no-repeat;
      background-size: 100% 100%;
      .pic{
        position: absolute;
        top:1.48*100px;
        left:1.66*100px;
        width:1.48*100px;
        height:1.48*100px;
        background:rgba(255,214,109,1);
        border:.02rem solid rgba(255,255,255,1);
        border-radius:.12*100px;
        img{
          position: absolute;
          top:0;
          bottom: 0;
          left: 0;
          right: 0;
          margin:auto ;
          width: 1.09*100px;
          height: .84*100px;
        }
      }
      .prize_name{
        position: absolute;
        top:3.08*100px;
        width: 100%;
        text-align: center;
        font-size: .24*100px;
      }
      .gain_btn{
        position: absolute;
        top:4.24*100px;
        left: 0;
        right: 0;
        margin: auto;
        width:2.4*100px;
        height:.62*100px;
        line-height:.62*100px;
        text-align: center;
        background:rgba(255,207,82,1);
        border-radius:.12*100px;
        font-size:.26*100px;
        font-weight:bold;
        color:rgba(163,76,0,1);
      }
      &:before{
        content:'';
        position: absolute;
        top:.29*100px;
        left: .93*100px;
        width: 2.93*100px;
        height: .5*100px;
        background: url("../images/type4/success_title.png") no-repeat;
        background-size: 100% 100%;
      }
      &:after{
        content:'可到我的资产中查看';
        position: absolute;
        top: 3.62*100px;
        width: 100%;
        height: .5*100px;
        font-size:.26*100px;
        text-align: center;
      }
    }
  }
</style>

<template>
  <div class="profitFirstPop" v-if="value">
    <!-- 引导第一步 -->
    <div class="center awards" v-if="step == 0">
      <div class="box">
      </div>
      <div class="desc">
        {{textList[step].desc}}
      </div>
      <div class="arrow">
        <img src="../img/arrow1.png" alt="">
      </div>
      <div class="btn" @click="changeStep()">
        {{textList[step].btn}}
      </div>
    </div>
    <!-- 引导第二步 -->
    <div class="center rule" v-if="step == 1">
      <div class="box">
        <img src="../img/ste2-bg.png" alt="">
      </div>
      <div class="desc">
        {{textList[step].desc}}
      </div>
      <div class="arrow">
        <img src="../img/arrow2.png" alt="">
      </div>
      <div class="btn" @click="changeStep()">
        {{textList[step].btn}}
      </div>
    </div>
  </div>
</template>

<script>
import Services from '@/services/newUserGuide'
import utils from '@/utils/utils';
export default {
  name: 'new-user-task-guide',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    isShow: true,
    step: 0,
    textList: [
      {name:'awards', desc: '盈利排名1000以内奖励京东卡、话费', btn: '下一步' },
      {name:'rule', desc: '每天 13点、21点发榜', btn: '知道了'}
    ],
    newVersionTaskOpened: {
      profit: Date.now()
    }
  }),
  methods: {
    changeStep () {
      this.$marchSetsPoint('A_H5PT0025002648',
        { 'source_address': this.step }
      )
      if (this.step == 1) {
        this.$emit('input', false)
        this.$emit('firstPopHide')
        return 
      }
      this.step++
    }
  },
  mounted () {
    this.$marchSetsPoint('A_H5PT0025002647') 
  }
}
</script>

<style lang="less" scope>
.profitFirstPop {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 11;
  .center {
    position: absolute;
    height: 100%;
    width: 100%;
    .box {
      position: absolute;
      box-shadow: 0 0 0 10000px rgba(0, 0, 0, 0.6);
    }
    .arrow {
      position: absolute;
      height: 80px;
      width: 54px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .desc {
      position: absolute;
      width: 220px;
      font-size: 24px;
      font-weight: 400;
      line-height: 38px;
      color: #fff;
    }
    .btn {
      position: absolute;
      width: 170px;
      height: 56px;
      border: 2px solid #fff;
      border-radius: 16px;
      font-size: 24px;
      font-weight: 500;
      line-height: 50px;
      color: #fff;
      text-align: center;
      box-sizing: border-box;
      p {
        color: #bdbdbd;
      }
    }
    &.awards {
      .box {
        right: 24px;
        top: 460px;
        width: 350px;
        height: 140px;
        border-radius: 5px;
      }
      .arrow {
        width: 82px;
        height: 74px;
        right: 90px;
        top: 610px;
      }
      .desc {
        right: 150px;
        top: 620px;
      }
      .btn {
        right: 120px;
        top: 740px;
      }
    }
    &.rule {
      .box {
        left: 50%;
        top: 280px;
        width: 672px;
        height: 60px;
        transform: translate(-50%, 0);  
        img {
          vertical-align: top;
          width: 100%;
          height: 100%;
        }
      }
      .arrow {
        width: 80px;
        height: 54px;
        left: 434px;
        top: 350px;
      }
      .desc {
        width: 250px;
        left: 200px;
        top: 370px;
      }
      .btn {
        left: 240px;
        top: 470px;
      }
    }
    &.rank {
      .box {
        left: 30px;
        right: 30px;
        top: 500px;
        height: 70px;
      }
      .arrow {
        left: 550px;
        top: 580px;
        transform: rotate(60deg);
      }
      .desc {
        width:440px;
        left: 70px;
        top: 600px;
      }
      .btn {
        left: 270px;
        top: 720px;
      }
    }
  }
}
</style>
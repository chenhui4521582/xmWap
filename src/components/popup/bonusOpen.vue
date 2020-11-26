<template>
  <div class="pop-window" v-if="showActivityPop">
    <div class="pop-mask" @touchmove.prevent></div>
    <div class="bonus-success pop">
      <img :src="img|filter" alt="" @click="gotobonusOpen">
      <div class="close" @click="close(1)">
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import Services from '@/services/activity'
  import { newUtils } from '@/utils/utils'
  export default {
    data() {
      return {
        showActivityPop: false,
        img:''
      }
    },
    methods: {
      close() {
        this.showActivityPop = false
      },
      /** 是否显示入口 **/
      async _getbonusOpenInfo() {
        let res = await Services.getbonusOpenInfo()
        let {code,data} = res.data
        if (code === 200) {
          this.showActivityPop = data.show
          if(this.showActivityPop){
            this.img=data.image
            this.$marchSetsPoint('A_H5PT0074001372')
          }
        }
      },
      gotobonusOpen() {
        this.$marchSetsPoint('A_H5PT0074001373')
        location.href=`//wap.beeplaying.com/activities/bonuspoolact.html?from=strong`
      }
    },
    mounted() {
      this._getbonusOpenInfo()
    },
    watch: {
      showActivityPop(value) {
        if(value) {
          newUtils.ScrollNoMove()
        }else {
          newUtils.ScrollMove()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .pop-window {
    position: relative;
    z-index: 11;
    width: 100%;
    height: 100%;
    min-height: 100%;
    max-height: 100%;
    .pop-close {
      width: 0.68*100px;
      height: 0.68*100px;
      position: absolute;
      right: -0.34*100px;
      top: -0.34*100px;
    }
  }

  .pop-mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .7);
    z-index: 10;
  }

  .bonus-success {
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 11;
    img {
      width: 526px;
      height: 670px;
    }
    .bonus-success-btn {
      width: 241px;
      height: 91px;
      background: url("./img/shuffling_game/btn.png");
      background-size: 100% 100%;
      position: absolute;
      position: absolute;
      bottom: 150px;
      left: 140px;
      animation: btnScale 0.6s infinite linear;
    }
    .close {
      position: absolute;
      left: 50%;
      bottom: -90px;
      z-index: 2;
      display: flex;
      justify-content: center;
      width: 62px;
      height: 62px;
      transform: translate(-50%, 0);
      color: #fff;
      background: url('~@/assets/images/global-close.png') no-repeat center center / 60px 60px;
      background-size: 60px 60px;
    }
  }

  @keyframes btnScale {
    0% {
      transform: scale(1.1);
    }

    50% {
      transform: scale(1.1);
    }

    51% {
      transform: scale(1);
    }

    100% {
      transform: scale(1);
    }
  }
</style>

<template>
  <div class="pop-window" v-if="showActivityPop">
    <div class="pop-mask" @touchmove.prevent></div>
    <div class="bonus-success pop">
      <div class="bonus-success-btn" @click="gotoweekpackage"></div>
      <div class="close" @click="close(1)"></div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import { newUtils } from '@/utils/utils'
  import Services from '@/services/activity'
  export default {
    data() {
      return {
        showActivityPop: false
      }
    },
    methods: {
      close() {
        this.$marchSetsPoint('A_H5PT0019001765')
        this.showActivityPop = false
      },
      /** 是否显示入口 **/
      async _getshufflingGameInfo() {
        let res = await Services.getshufflingGameInfo()
        let {code,data} = res.data
        if (code === 200) {
          this.showActivityPop = data
          if(this.showActivityPop){
            this.$marchSetsPoint('A_H5PT0019001763')
          }
        }
      },
      gotoweekpackage() {
        this.$marchSetsPoint('A_H5PT0019001764')
        location.href='//wap.beeplaying.com/activities/shufflinggame.html?from=index'
      }
    },
    mounted() {
      this._getshufflingGameInfo()
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
    left: 55%;
    transform: translate(-50%, -50%);
    width: 5.77*100px;
    height: 7.11*100px;
    z-index: 11;
    &.pop {
      width: 613px;
      height: 821px;
      background: url("./img/shuffling_game/bg.png");
      background-size: 100% 100%;
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
      transform: translate(-180%, 0);
      color: #fff;
      background: url('~@/assets/images/global-close.png') no-repeat center center;
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

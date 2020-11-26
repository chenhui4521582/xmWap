<template>
  <div class="pop-window" v-if="showActivityPop">
    <div class="pop-mask" @touchmove.prevent></div>
    <div class="bonus-success pop">
      <div class="bonus-success-btn" @click="gotopage"></div>
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
        this.showActivityPop = false
        this.$parent.initDialog()
      },
      /** 是否显示入口 **/
      async _getGameInfo(callback) {
        let res = await Services.getKoiWishInfo()
        let { code, data } = res.data
        if (code === 200) {
          this.showActivityPop = data
          if (this.showActivityPop) {
            this.$marchSetsPoint('A_H5PT0019003725')
          }
        }
        callback({
          name: 'koiWish',
          isShow: this.showActivityPop
        })
      },
      gotopage() {
        this.$marchSetsPoint('A_H5PT0019003726')
        location.href = '//wap.beeplaying.com/activities/koiwish.html?from=index'
      },
      init(callback){
        this._getGameInfo(callback)
      }
    },
    mounted() {

    },
    watch: {
      showActivityPop(value) {
        if (value) {
          newUtils.ScrollNoMove()
        } else {
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
    &.pop {
      width: 610px;
      height: 672px;
      background: url("./img/koiwish/bg.png");
      background-size: 100% 100%;
    }
    .bonus-success-btn {
      width: 278px;
      height: 76px;
      background: url("./img/koiwish/btn.png");
      background-size: 100% 100%;
      position: absolute;
      position: absolute;
      bottom: 175px;
      left: 0;
      right: 0;
      margin: auto;
      animation: btnScale 0.6s infinite linear;
    }
    .close {
      position: absolute;
      bottom: -60px;
      left: 0;
      right: 0;
      margin: auto;
      z-index: 2;
      display: flex;
      justify-content: center;
      width: 48px;
      height: 88px;
      background: url('./img/koiwish/close.png') no-repeat center center;
      background-size: 100% 100%;
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

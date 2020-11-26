<template>
  <div class="pop-window" v-if="showActivityPop">
    <div class="pop-mask" @touchmove.prevent></div>
    <div class="bonus-success pop">
      <img src="./img/threeHours/bg.png" alt="" @click="gotoact">
      <div class="close" @click="close()">
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import Services from '@/services/activity'
  import { newUtils } from '@/utils/utils'
  import {mapMutations} from 'vuex'
  export default {
    data() {
      return {
        showActivityPop: false,
      }
    },
    methods: {
      ...mapMutations(['SET_THREEHOURS_ENTRANCE']),
      close() {
        this.showActivityPop = false
        this.$parent.initDialog()
      },
      /** 是否显示入口 **/
      async _getThreeHoursInfo(callback) {
        let res = await Services.getThreeHoursInfo()
        let { code, data } = res.data
        if (code === 200) {
          this.SET_THREEHOURS_ENTRANCE(data)
          this.showActivityPop = data.popup
          if (this.showActivityPop) {
            this.$marchSetsPoint('A_H5PT0019003918')
          }
          callback({
            name: 'threeHours',
            isShow: this.showActivityPop
          })
        }
      },
      gotoact() {
        this.$marchSetsPoint('A_H5PT0019003919')
        location.href = `//wap.beeplaying.com/activities/fighthours.html?from=strong`
      },
      init(callback) {
        this._getThreeHoursInfo(callback)
      }
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
      width: 574px;
      height: 512px;
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
      bottom: -50px;
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

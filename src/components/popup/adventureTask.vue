<template>
  <div class="pop-window" v-if="showActivityPop">
    <div class="pop-mask" @touchmove.prevent></div>
    <div class="adventureTask-bonusSuccess">
      <div class="title">{{adventureTask.awardsName}}<br>已发送到您的账号</div>
      <div class="info">前往任务中心查看开启其他任务</div>
      <div class="adventureTask-bonusSuccess-btn" @click="gotoAdventureTask"></div>
      <div class="close" @click="close"></div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import { newUtils } from '@/utils/utils'
  import Services from '@/services/activity'
  import {mapActions} from 'vuex'
  export default {
    data() {
      return {
        adventureTask: {},
        showActivityPop: false
      }
    },
    methods: {
      ...mapActions({
        _getUserInfo: 'GET_USERINFO', // 获取用户信息
      }),
      transUint(awards) {
        let finish = awards > 10000 ? parseFloat((awards / 10000).toFixed(1)) + '万' : awards
        return finish
      },
      close() {
        this.showActivityPop = false
        this.$parent.initDialog()
      },
      /** 是否显示入口 **/
      async _getAdventureTaskInfo(callback) {
        let res = await Services.loseWarningPopUp()
        let { code, data } = res.data
        if (code === 200 && data.popup) {
          let resReceive = await Services.loseWarningReceive()
          let resReceiveData = resReceive.data
          this.adventureTask = data
          this.showActivityPop = resReceiveData.code == 200 && resReceiveData.data
          if (this.showActivityPop) {
            this._getUserInfo()
            this.$marchSetsPoint('A_H5PT0019003190')
          }
        }
        callback({
          name: 'adventureTask',
          isShow: this.showActivityPop
        })
      },
      gotoAdventureTask() {
        this.$marchSetsPoint('A_H5PT0019003191')
        this.$router.push('/task')
      },
      init(callback) {
        this._getAdventureTaskInfo(callback)
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
      width: 0.68 * 100px;
      height: 0.68 * 100px;
      position: absolute;
      right: -0.34 * 100px;
      top: -0.34 * 100px;
    }
  }

  .pop-mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 10;
  }

  .adventureTask-bonusSuccess {
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 502px;
    height: 843px;
    background: url('./img/adventure_task/bg.png');
    background-size: 100% 100%;
    z-index: 11;
    &:before {
      content: '';
      position: absolute;
      top: 39px;
      left: 72px;
      right: 90px;
      width: 340px;
      height: 74px;
      background: url('./img/adventure_task/case.png');
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .title {
      position: absolute;
      top: 150px;
      left: 0;
      right: 0;
      margin: auto;
      font-size: 48px;
      font-weight: bold;
      color: #FFF5D9;
      text-align: center;
    }
    .info {
      width: 100%;
      position: absolute;
      top: 308px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      font-size: 24px;
      font-weight: 400;
      color: rgba(163, 1, 39, 1);
    }
    .adventureTask-bonusSuccess-btn {
      width: 301px;
      height: 111px;
      background: url('./img/adventure_task/btn.png');
      background-size: 100% 100%;
      position: absolute;
      position: absolute;
      top: 363px;
      left: 97px;
      /*animation: btnScale 0.6s infinite linear;*/
    }
    .close {
      position: absolute;
      left: 50%;
      bottom: -40px;
      z-index: 2;
      display: flex;
      justify-content: center;
      width: 60px;
      height: 60px;
      transform: translate(-50%, 0);
      color: #fff;
      background: url('./img/adventure_task/pop_close.png') no-repeat center center;
      background-size: 60px 60px;
      &.type1 {
        left: 50%;
      }
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


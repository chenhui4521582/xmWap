<template>
  <section class="item-wrapper">
    <div class="top">
      <div class="icon">
        <img :src="info.icon|filter" alt="">
      </div>
      <div class="info">
        <div class="info-top">
          <p>{{info.name}}</p>
          <div class="like" @click="subscribeOrUnsubscribe">
            <img v-if="info.subscribeStatus" src="../img/liked.png" alt="">
            <img v-else src="../img/unlike.png" alt="">
          </div>
        </div>
        <div class="tips" :class="info.awardPoolStatus?'opened':'unopened'">
          {{info.awardPoolStatus?'开启中':'即将开启'}}</div>
      </div>
    </div>
    <div class="middle" @click="toGame(info,0)">
      <number-change :number="info.awardPoolNum" />
    </div>
    <p class="bottom" @click="toGame(info,1)">
      打奖池 >
    </p>
  </section>
</template>

<script>
import Service from '@/services/index'
import numberChange from './numberChange'
import _get from 'lodash.get'
import { jumpUrl } from '@/utils/utils'
export default {
  name: 'PJItem',
  components: {
    numberChange
  },
  props: {
    info: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
  },
  mounted () {

  },
  methods: {
    async subscribeOrUnsubscribe () {
      this.$marchSetsPoint('A_H5PT0324004021', {
        is_follow: !!this.info.subscribeStatus,
        is_jackpot: !!this.info.awardPoolStatus,
        jackpot_game: this.info.name
      }) // H5平台-奖池汇总-关注或取消关注点击
      const res = await Service.subscribeOrUnsubscribe({ gameType: this.info.gameType })
      const code = _get(res, 'data.code', 0)
      if (code === 200) {
        this.$emit('refresh')
      }
    },
    toGame (info, type) {
      if (type) {
        this.$marchSetsPoint('A_H5PT0324004022', {
          is_follow: !!this.info.subscribeStatus,
          is_jackpot: !!this.info.awardPoolStatus,
          jackpot_game: this.info.name
        }) // H5平台-奖池汇总-打奖池点击
      } else {
        this.$marchSetsPoint('A_H5PT0324004020', {
          is_follow: !!this.info.subscribeStatus,
          is_jackpot: !!this.info.awardPoolStatus,
          jackpot_game: this.info.name
        }) // H5平台-奖池汇总-奖池数字点击
      }
      jumpUrl(info)
    }
  }
}
</script>

<style lang="less" scoped>
.item-wrapper {
  margin: 20px 0;
  width: 326px;
  height: 300px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
  opacity: 1;
  border-radius: 16px;
  box-sizing: border-box;
  padding: 24px;
  color: #000;
  font-weight: 500;
  font-size: 24px;
  .top {
    display: flex;
    .info {
      flex: 1;
      margin-left: 15px;
      display: flex;
      align-content: space-between;
      flex-wrap: wrap;
    }
    .info-top {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .like {
      width: 26px;
      height: 22px;
      display: flex;
      align-items: center;
      img {
        width: 26px;
        height: 22px;
      }
    }
    .tips {
      color: #fff;
      font-size: 20px;
      height: 30px;
      line-height: 30px;
      border-radius: 6px;
      padding: 0 10px;
      &.opened {
        background: #ff9d46;
      }
      &.unopened {
        background: #ffd04e;
      }
    }
  }
  .middle {
    width: 300px;
    height: 107px;
    background: url('../img/item-bg.png') no-repeat center center;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding-top: 30px;
    position: relative;
    padding-right: 30px;
  }
  .bottom {
    color: #ff4141;
    text-align: center;
    height: 90px;
    line-height: 90px;
  }
  .icon {
    width: 80px;
    height: 80px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
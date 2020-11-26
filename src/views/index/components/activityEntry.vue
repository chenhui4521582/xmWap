<template>
  <div class="activity-entry" id="activity-entry" :class="[icoshow==true?'down-activity-entry':'']"
    @click="headerClick" v-if="userType">
    <img src="../img/turntable-icon.png" alt="" v-if="userType===1">
    <template v-else>
      <img src="../img/activity-entry-icon.png" alt v-if="!acenterIconData" />
      <img :src="acenterIconData" alt v-else />
      <div class="red-dot" v-if="redDot.activity !=0 "></div>
    </template>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { jumpUrl } from '@/utils/utils'
import indexServices from '@/services/index'
import _get from 'lodash.get'
export default {
  name: 'activityEntry',
  props: {
    userType: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      acenterIconData: '',
      // 显示返利卡时
      icoshow: false
    }
  },
  computed: {
    ...mapState(['redDot'])
  },
  methods: {
    ...mapActions({
      _getActivitiesReddot: 'GET_ACTIVITIES_REDDOT'
    }),
    /** 图标点击 **/
    headerClick () {
      this.$marchSetsPoint('A_H5PT0019000714')
      if (this.userType === 1) {
        jumpUrl({ url: '/activities/newUserTurntable.html#/?from=activityEntry' })
      } else {
        this.$emit('callback', 'popup_acenter')
      }
    },
    /** 图标动画 **/
    iconAnimation () {
      window.addEventListener('touchstart', event => {
        let touch = event.touches[0]
        this.startY = touch.pageY
      })
      window.addEventListener('touchend', event => {
        let element = document.getElementById('activity-entry')
        let touch = event.changedTouches[0]
        let endY = this.startY - touch.pageY
        // 上滑
        if (endY > 5) {
          element && element.classList.add('hide')
          element && element.classList.remove('show')
        } else {
          element && element.classList.add('show')
          element && element.classList.remove('hide')
        }
      })
    },
    async getAcenterIocnData () {
      let res = await indexServices.getAcenterIconData()
      let { data } = res
      if (data.code == 200) {
        this.acenterIconData = _get(res, 'data.data[0].cdnImage', '')
      }
    },
    /** 首页探宝活动入口icon是否展示 **/
    enterTreasureHunt () {
      indexServices.getState(1).then(res => {
        let { data } = res.data
        this.show = _get(data, 'rebateCountdown', '')
        if (this.show > 0) {
          this.icoshow = true
        }
      })
    }
  },
  //
  mounted () {
    /**初始化获取红点状态*/
    this.getAcenterIocnData()
    this.iconAnimation()
    // 如果有福利卡,活动中心向下移
    this.enterTreasureHunt()
    this._getActivitiesReddot()
  }
}
</script>
<style lang="less" scoped>
.activity-entry {
  position: fixed;
  z-index: 9;
  right: -20px;
  bottom: 350px;
  width: 153px;
  &.down-activity-entry {
    position: fixed;
    z-index: 9;
    right: -20px;
    bottom: 250px;
    width: 153px;
  }
  img {
    vertical-align: top;
    width: 100%;
    height: 100%;
  }
  .red-dot {
    position: absolute;
    right: 30px;
    top: -5px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ff0000;
  }
  &.show {
    transition: all 0.2s;
    transform: translate(0, 0);
    opacity: 1;
  }
  &.hide {
    transition: all 0.2s;
    transform: translate(100%, 0);
    opacity: 0;
  }
}
</style>

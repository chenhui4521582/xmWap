<template>
  <aside id="pool-jackpot-icon" class="pool-jackpot-icon">
    <img class="tips" v-if="showTips" src="./img/tips.png" alt="">
    <img class="icon" src="./img/pool-jackpot-icon.png" alt="" @click="toPoolJackpot">
  </aside>
</template>

<script>
export default {
  name: 'poolJackpotIcon',
  components: {

  },
  data () {
    return {
      startY: 0
    }
  },
  computed: {
    showTips () {
      let poolJackpotOpened = localStorage.getItem('poolJackpotOpened')
      let show = poolJackpotOpened ? false : true
      return show
    }
  },
  mounted () {
    this.iconAnimation()
  },
  methods: {
    /** 图标动画 **/
    iconAnimation () {
      window.addEventListener('touchstart', event => {
        let touch = event.touches[0]
        this.startY = touch.pageY
      })
      window.addEventListener('touchend', event => {
        let element = document.getElementById('pool-jackpot-icon')
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
    toPoolJackpot () {
      let endTime = new Date(new Date().toLocaleDateString()).getTime().toString()
      localStorage.setItem('poolJackpotOpened', endTime)
      this.$marchSetsPoint('A_H5PT0019004023') // H5平台-首页-奖池汇总按钮点击
      this.$router.push({ name: 'poolJackpot' })
    }
  }
}
</script>

<style lang="less" scoped>
#pool-jackpot-icon {
  position: fixed;
  z-index: 9;
  left: 0;
  bottom: 360px;
  width: 153px;
  img {
    transform: translate3d(0, 0, 0);
  }
  .tips {
    margin-left: 10px;
    margin-bottom: -10px;
    width: 194px;
  }
  .icon {
    width: 125px;
  }
  &.show {
    transition: all 0.2s;
    transform: translate(0, 0);
    opacity: 1;
  }
  &.hide {
    transition: all 0.2s;
    transform: translate(-100%, 0);
    opacity: 0;
  }
}
</style>

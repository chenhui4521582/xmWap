<template>
  <div class="achievement-entry" id="achievement-entry" @click="goTaskHome">
    <img :src="$moduleConfig.achievement.icon" alt="">
    <div class="red-dot" v-if="showRedDot"></div>
  </div>
</template>
<script>
  import Services from '../../../services/task'

  export default {
    props: {},
    data() {
      return {
        showIcon: true,
        showRedDot: false
      }
    },
    computed: {},
    components: {},
    methods: {
      /** 图标动画 **/
      iconAnimation() {
        let element = document.getElementById('achievement-entry')
        window.addEventListener('touchstart', event => {
          let touch = event.touches[0]
          this.startY = touch.pageY
        })
        window.addEventListener('touchend', event => {

          let touch = event.changedTouches[0]
          let endY = this.startY - touch.pageY
          // 上滑
          if (endY > 5) {
            element.classList.add('hide')
            element.classList.remove('show')
          } else {
            element.classList.add('show')
            element.classList.remove('hide')
          }
        })
      },
      async showRedDotFn() {
        let { data } = await Services.getAchievementRedDot()
        this.showRedDot = data.data.showRedDot
      },
      goTaskHome() {
        this.$emit('goTaskHome')
      }
    },
    watch: {},
    created() {
    },
    mounted() {
      this.showRedDotFn()
      this.iconAnimation()
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .achievement-entry {
    position: fixed;
    z-index: 9;
    right: 0px;
    top: 270px;
    width: 110px;
    height: 95px;
    img {
      vertical-align: top;
      width: 100%;
    }
    .red-dot {
      position: absolute;
      right: 10px;
      top: -5px;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background: #FF0000;
    }
    &.show {
      transition: all .2s;
      transform: translate(0, 0);
      opacity: 1;
    }
    &.hide {
      transition: all .2s;
      transform: translate(100%, 0);
      opacity: 0;
    }
  }
</style>

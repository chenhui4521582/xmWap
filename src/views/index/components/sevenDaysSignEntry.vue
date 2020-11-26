<template>
  <div class="sevendays-entry" id="sevendays-entry"
       @click="headerClick" v-if="showEntry">
    <img src="../img/sevendaysign-entry-icon.png"/>
    <div class="red-dot" v-if="showRedot"></div>
  </div>
</template>
<script>
  import indexServices from '@/services/index'

  export default {
    name: 'sevenDaysSignEntry',
    data() {
      return {
        showEntry: false,
        showRedot: false
      }
    },
    methods: {
      /** 图标点击 **/
      headerClick() {
        this.$marchSetsPoint('A_H5PT0019004483')//H5平台-多多玩APP连续打卡活动-首页icon点击
        let resetTime = new Date(new Date().toLocaleDateString()).getTime()
        localStorage.setItem('SevenDaysSign_REDOT', JSON.stringify({ resetTime, show: true }))
        location.href = 'https://wap.beeplaying.com/activities/sevenDaysSign.html?vt=' + new Date().getTime()
      },
      /** 图标动画 **/
      iconAnimation() {
        window.addEventListener('touchstart', event => {
          let touch = event.touches[0]
          this.startY = touch.pageY
        })
        window.addEventListener('touchend', event => {
          let element = document.getElementById('sevendays-entry')
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
      async getSevenDaysSignEntry() {
        let { code, data } = (await indexServices.getSevenDaysSignEntry()).data
        this.showEntry = code == 200 && data
      },
      _getActivitiesReddot() {
        /** 今天12点时间搓 **/
        let resetTime = new Date(new Date().toLocaleDateString()).getTime()
        /** 查看储存状态 **/
        let tipsData = JSON.parse(localStorage.getItem('SevenDaysSign_REDOT'))
        /** 本地没有缓存或者本地缓存时间搓不对，重新记录数据 **/
        if (!tipsData || tipsData.resetTime !== resetTime) {
          localStorage.setItem('SevenDaysSign_REDOT', JSON.stringify({ resetTime, show: false }))
          this.showRedot = true
        }else{
          this.showRedot =tipsData && tipsData.show === false
        }
      }
    },
    mounted() {
      this._getActivitiesReddot()
      this.getSevenDaysSignEntry()
      this.iconAnimation()
    }
  }
</script>
<style lang="less" scoped>
  .sevendays-entry {
    position: fixed;
    z-index: 9;
    left: 0;
    bottom: 185px;
    width: 125px;
    img {
      vertical-align: top;
      width: 100%;
      height: 100%;
    }
    .red-dot {
      position: absolute;
      right: 8px;
      top: -8px;
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
      transform: translate(-100%, 0);
      opacity: 0;
    }
  }
</style>

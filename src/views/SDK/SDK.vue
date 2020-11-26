<template>
  <div class="close-task" @click="closeTask()">
    <!-- 大神攻略 -->
    <div class="master-strategy" v-if="landscape == 'false'" @click.stop="goStrategy"></div>
    <!-- 空方法不可删阻塞外层closeTask -->
    <main class="sdk-wrapper" @click.stop="">
      <article class="sdk">
        <section class="header" />
        <section class="footer" />
        <section class="main">
          <div class="sdk-icon" @click.stop="closeTask()"></div>
          <sdk-title />
          <sdk-nav :wf-cur-link="wfCurLink" />
          <div class="main-wrapper">
            <router-view></router-view>
          </div>
        </section>
      </article>
    </main>
  </div>
</template>
<script>
import SdkTitle from './components/sdkTitle'
import SdkNav from './components/sdkNav'
import { getUrlParams } from '@/utils/utils'
export default {
  name: 'SDK',
  data: () => ({
    landscape: 'true'
  }),
  components: {
    /** 头部组件 **/
    SdkTitle,
    /** 导航组件 **/
    SdkNav
  },
  beforeRouteEnter (to, from, next) {
    /** 页面页面宽度1280px **/
    let baseWidth = 720
    const baseSize = 30
    if (to.query.isLandscape === 'true') {
      baseWidth = 1280
    }
    const scale = document.documentElement.clientWidth / baseWidth > 1 ? 1 : document.documentElement.clientWidth / baseWidth
    document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
    next()
  },
  beforeRouteLeave (to, from, next) {
    // 恢复 720px 基准
    let baseWidth = 720
    const baseSize = 30
    const scale = document.documentElement.clientWidth / baseWidth > 1 ? 1 : document.documentElement.clientWidth / baseWidth
    document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
    next()
  },
  computed: {
    gameType () {
      return getUrlParams('gametype') && parseInt(getUrlParams('gametype'))
    },
    wfCurLink () {
      return getUrlParams('wf_cur_link') || ''
    }
  },
  methods: {
    closeTask () {
      try {
        switch (this.gameType) {
          case 22:
            if (parent && parent.closeTaksPage) {
              parent.closeTaksPage()
            }
            break
          default:
            if (parent && parent.GameEval) {
              parent.GameEval('closeweb')
              parent.window.bp && parent.bp.event.emit('Event_Close_TaskPage')
              parent.cc.Notification && parent.cc.Notification.emit('Event_Close_TaskPage')
            }
            break
        }
      } catch (e) {
        window.parent.postMessage('closeweb', '*')
      }
    },
    /** 跳转大神攻略 **/
    goStrategy () {
      parent.location.href = `${process.env['VUE_APP_HOST_PLATFORM']}/activities/masterstrategy.html?from=sdk`
      this.$marchSetsPoint('A_H5PT0061003396')
    }
  },
  mounted () {
    this.landscape = getUrlParams('isLandscape') || 'true'
    console.log(this.landscape)
  }
}
</script>
<style lang="less" scoped>
.bg-center(@url) {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url(@url);
}
.close-task {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  background: rgba(0, 0, 0, 0);
}
.master-strategy {
  position: absolute;
  top: 80px;
  left: -24px;
  width: 100px;
  height: 70px;
  background-image: url('./img/strategy-icon.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: 100% auto;
}
.sdk-wrapper {
  .sdk {
    width: 627px;
    height: 100vh;
    background-position: center top;
    background-repeat: repeat-y;
    background-size: 100% auto;
    background-image: url('./img/bg-middle.png');
    border-radius: 78px 0 0 78px;
    position: relative;
    box-sizing: border-box;
    padding: 15px 15px 15px 23px;
    .header {
      width: 100%;
      height: 150px;
      position: absolute;
      top: 0;
      right: 0;
      background-repeat: no-repeat;
      background-image: url('./img/bg-top.png');
      background-position: center bottom;
      background-size: 100% auto;
    }
    .footer {
      width: 100%;
      height: 97px;
      position: absolute;
      bottom: 0;
      right: 0;
      .bg-center('./img/bg-bottom.png');
    }
    .main {
      position: relative;
      z-index: 1;
      border-radius: 70px 0px 0px 70px;
      border: 3px #17558c dashed;
      width: 100%;
      height: 100%;
      .sdk-icon {
        width: 81px;
        height: 120px;
        position: fixed;
        top: 540px;
        right: 594px;
        z-index: 2;
        .bg-center('./img/bg-icon.png');
      }
    }
  }
  &::after {
    content: '';
    clear: both;
  }
}

/* 横屏模式 */
@media screen and (orientation: landscape) {
  .sdk-wrapper {
    .sdk {
      .main {
        .sdk-icon {
          top: 300px;
        }
      }
    }
  }
}
</style>
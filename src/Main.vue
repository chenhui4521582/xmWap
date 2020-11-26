<template>
  <div id="app" :class="{'okoooAndroid': isOkoooAndroid}">
    <transition :name="transitionName">
      <!-- 缓存页面 -->
      <template v-if="keepAlive">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </template>
      <template v-else>
        <router-view />
      </template>
      <!-- 页面不缓存 -->
    </transition>
    <Modal v-model="showCloseTip" :type="2" :title="'温馨提示'" :closeText="'退出'" :saveText="'继续玩'"
      @on-close="closePage" @on-save="goOnPlay">
      <div class="close_content">
        <img src="@/assets/images/short.png" alt="">
        <div class="content-text">这就要走了吗？<br />明天再来，可以签到领福利。</div>
      </div>
    </Modal>
    <!-- 开发环境全局登录按钮 -->
    <login />
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import Login from '@/components/login/login'
import { newUtils } from '@/utils/utils'
export default {
  name: 'APP',
  data () {
    return {
      showCloseTip: false,
      transitionName: ''
    }
  },
  components: {
    Login
  },
  computed: {
    ...mapState(['redDot']),
    keepAlive () {
      return !!(this.$route.meta && this.$route.meta.keepAlive)
    },
    isOkoooAndroid () {
      let u = navigator.userAgent
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 //android终端
      return localStorage['APP_CHANNEL'] == '100006' && isAndroid
    }
  },
  methods: {
    ...mapActions({
      _getUserInfo: 'GET_USERINFO', // 获取用户信息
      _getUserSign: 'GET_USER_SIGN', // 获取用户是否签到
      _getMyprizeRedDot: 'GET_MYPRIZE_REDDOT',
      _getTurntableRedDot: 'GET_TURNTABLE_REDDOT',
      _getTaskRedDot: 'GET_TASK_REDDOT'
    }),
    goOnPlay () {
      this.showCloseTip = false
      this.$marchSetsPoint('A_H5PT0019001621')
    },
    closeTipCallback () {
      this.$marchSetsPoint('A_H5PT0019001623')
    },
    androidBack () {
      var self = this
      if (window.android && window.android.finish) {
        if (history && history.pushState) {
          history.pushState({}, '')
          window.onpopstate = function (event) {
            //这里可以监听到浏览器的返回事件，并做你想做的事情，
            if (self.$route.name == 'index') {
              self.showCloseTip = true
              history.pushState({}, '')
            }
          }
        }
      }
    },
    async closePage () {
      await this.$marchSetsPoint('A_H5PT0019001622')
      window.android.finish()
    },
    /** 获取红点 **/
    getRedDot () {
      this._getMyprizeRedDot()
      this._getTurntableRedDot()
      this._getTaskRedDot()
    }
  },
  mounted () {
    this._getUserInfo()
    this.getRedDot()
    this.androidBack()
    /** 解决键盘唤起不能点击按钮 **/
    newUtils.clearInput()
  },
  watch: {
    $route (to, from) {
      if (!from.name || !['index', 'mall', 'my', 'task'].includes(from.name)) {
        //猫会员日入口
        sessionStorage.removeItem('cache_getCatVipEntranceState')
      }
      const { name, title, } = to
      if (name === 'task' || name === 'index' || name === 'mall' || name === 'my') {
        this._getUserInfo()
      }
      /**
       * 添加缓存处理
       * 如果to的索引值为1，不添加任何动画；如果to索引大于from索引,判断为前进状态,反之则为后退状态
       **/
      if (to.meta.index > 1) {
        if (to.meta.index < from.meta.index) {
          this.transitionName = 'slide-right'
        } else if (to.meta.index > from.meta.index) {
          this.transitionName = 'slide-left'
        }
      } else if (to.meta.index == 1 && from.meta.index > 1) {
        this.transitionName = 'slide-right'
      } else {
        this.transitionName = ''
      }
      /* 路由发生变化修改页面title */
      if (to.meta.title) {
        if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) && localStorage['APP_CHANNEL'] === '100090') {
          document.title = '多多玩'
        } else {
          document.title = to.meta.title
        }
      }
      window.scroll(0, 0) //解决safrai下滑动后，页面切换白屏的问题
      /** 切换路由的时候解除页面锁定 **/
      newUtils.ScrollMove()
    }
  }
}
</script>

<style lang="less">
@import url('./assets/less/base.less');
@import url('./assets/iconfont/iconfont.css');
.okoooAndroid {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
}
.close_content {
  padding: 30px 0;
  width: 100%;
  text-align: center;
  img {
    width: 300px;
  }
  .content-text {
    color: #888;
    font-size: 24px;
    margin-top: 30px;
    line-height: 36px;
  }
  .img-size {
    width: 167px;
    height: 172px;
  }
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 0.2s;
  position: fixed;
  width: 100%;
  height: 100vh;
  left: 0;
}
.slide-right-enter {
  transform: translateX(-100%);
}
.slide-right-leave-active {
  transform: translateX(100%);
}
.slide-left-enter {
  transform: translateX(100%);
}
.slide-left-leave-active {
  transform: translateX(-100%);
}
</style>

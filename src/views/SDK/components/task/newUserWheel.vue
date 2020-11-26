<template>
  <section class="new-user-wheel" v-if="info&&info.openFlag" id="moveDiv" @mousedown="down"
    @touchstart="down" @mousemove="move" @touchmove="move" @mouseup="end" @touchend="end">
    <div class="icon" @click.stop="goWheel()">
      <img :src="imgUrl" alt="">
      <div class="red-dot" v-if="info.wheelTimes">{{info.wheelTimes}}</div>
    </div>
  </section>
</template>

<script>
import { jumpUrl, getUrlParams } from '@/utils/utils'
import Services from '@/services/index'
import _get from 'lodash.get'
import API from '@/services/API/API'
import imgUrl from '../../img/wheel-icon.gif'
export default {
  name: 'newUserWheel',
  components: {

  },
  data () {
    return {
      info: {},
      flags: false,
      position: { x: 0, y: 0 },
      nx: '', ny: '', dx: '', dy: '', xPum: '', yPum: '',
    }
  },
  mounted () {
    this._getNewUserWheel()
  },
  computed: {
    gameType () {
      return getUrlParams('gametype') && parseInt(getUrlParams('gametype'))
    },
    imgUrl () {
      return imgUrl + '?' + Date.now()
    }
  },
  methods: {
    async _getNewUserWheel () {
      const res = await Services.getNewUserWheelInfo()
      this.info = _get(res, 'data.data', {})
    },
    async goWheel () {
      let _this = this
      this.$marchSetsPoint('A_H5PT0061002052', { from_project_id: this.gameType }) // H5平台-游戏内SDK-转盘icon点击(跳转到新手转盘活动页)
      let xhr = new XMLHttpRequest()
      xhr.open('get', API.getNewUserActivity)
      xhr.setRequestHeader('Authorization', localStorage.getItem('ACCESS_TOKEN'))
      xhr.send()
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          jumpUrl({ url: xhr.getResponseHeader('uri') + `?from=${_this.gameType}` }, 'SDK')
        }
      }
    },
    // 实现移动端拖拽
    down () {
      this.flags = true
      var touch
      if (event.touches) {
        touch = event.touches[0]
      } else {
        touch = event
      }
      this.position.x = touch.clientX
      this.position.y = touch.clientY
      this.dx = moveDiv.offsetLeft
      this.dy = moveDiv.offsetTop
    },
    move () {
      if (this.flags) {
        var touch
        if (event.touches) {
          touch = event.touches[0]
        } else {
          touch = event
        }
        this.nx = touch.clientX - this.position.x
        this.ny = touch.clientY - this.position.y
        this.xPum = this.dx + this.nx
        this.yPum = this.dy + this.ny
        moveDiv.style.left = this.xPum < 0 ? 0 : this.xPum > 200 ? 200 : this.xPum + 'px'
        moveDiv.style.top = this.yPum + 'px'
        //阻止页面的滑动默认事件
        document.addEventListener('touchmove', function () { // 1.2 如果碰到滑动问题，请注意是否获取到 touchmove
          event.stopPropagation() // 如果没有引入jq 就用 stopPropagation()
        }, false)
      }
    },
    //鼠标释放时候的函数
    end () {
      this.flags = false
    }
  }
}
</script>

<style lang="less" scoped>
.new-user-wheel {
  position: absolute;
  top: 555px;
  left: 24px;
  z-index: 1;
  .icon {
    position: relative;
    width: 108px;
    height: 108px;
    img {
      width: 100%;
      height: 100%;
    }
    .red-dot {
      position: absolute;
      width: 32px;
      height: 32px;
      line-height: 30px;
      color: #fff;
      font-weight: 500;
      top: 6px;
      right: 6px;
      background: #ff0000;
      font-size: 20px;
      text-align: center;
      border-radius: 16px;
    }
  }
}
</style>

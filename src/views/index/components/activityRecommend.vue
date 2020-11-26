<template>
  <transition name="hide">
    <div class="activity-recommend" v-if="showPop">
      <div class="mask"></div>
        <div class="content" @click.stop="handleClick" >
          <div class="bg">
            <img :src="recommendDate.image | filter" alt />
          </div>
          <div class="closed" @click.stop="hidePop"></div>
        </div>
    </div>
  </transition>
</template>
<script>
import Services from '@/services/index'
import newUtils,{ jumpUrl } from '@/utils/utils'
import _get from 'lodash.get'
export default {
  name: 'activityRecommend',
  data: () => ({
    showPop: false,
    recommendDate: {}
  }),
  methods: {
    openPop() {
      if(!newUtils.isEmptyObject(this.recommendDate)){
        this.showPop = true
        this.$marchSetsPoint('A_H5PT0019001556', {
          task_name: this.recommendDate.url
        })
      }
    },
    hidePop() {
      this.$parent.initDialog();
      this.showPop = false
    },
    _getActivityRecommend() {
      Services.getActivityRecommend().then(res => {
        let {code, data} = _get(res, 'data', {})
        if(code === 200 && data[0]) {
          this.recommendDate = data[0]
        }
        this.initCache()
      })
    },
    handleClick() {
      let url = this.recommendDate.url
      this.$marchSetsPoint('A_H5PT0019001557', {
        task_name: url
      })
      this.hidePop()
      if (url && url.indexOf('popup') != -1) {
        this.$emit('callback', url)
      } else {
        jumpUrl({ url })
      }
    },
    endTime() {
      let date = new Date()
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      let d = date.getDate()
      return new Date(`${y}/${m}/${d}`).getTime()
    },
    initCache() {
      this.openPop()
      localStorage.setItem('ActivityRecommend', `${this.endTime()}`)
    },
    init(callback) {
      let endTime = this.endTime()
      let cacheTime = localStorage.getItem('ActivityRecommend')
      let isShowDialog = false;
      /** 假如缓存时间小于当前时间, 打开弹框更新缓存**/
      if (cacheTime) {
        if(endTime != cacheTime){
          this._getActivityRecommend()
          isShowDialog = true;
        }
      } else {
        this._getActivityRecommend()
        isShowDialog = true;
      }

      if(callback){
        callback({
          name: 'activityRecommend',
          isShow: isShowDialog
        })
      }
    }
  },
  mounted() {
    // this.timer = setTimeout(()=> {
    //   this.init()
    // },1000)
  },
  beforeDestory() {
    clearTimeout(this.timer)
  },
  watch: {
    showPop(value) {
      if(value) {
        newUtils.ScrollNoMove()
      }else {
        newUtils.ScrollMove()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.activity-recommend{
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 12;
  .mask {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    background: rgba(0,0,0,.7)
  }
  .content{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    &.show {
      animation: fadeIn .5s ease-in-out;
    }
    &.hide {
      animation: fadeOut .5s ease-in-out;
    }
    .bg {
      width: 550px;
      min-height: 600px;
      img {
        vertical-align: top;
        width: 100%;
      }
    }
    .closed {
      position: absolute;
      left: 50%;
      bottom: -90px;
      z-index: 2;
      display: flex;
      justify-content: center;
      width: 62px;
      height: 62px;
      transform: translate(-50%, 0);
      color: #fff;
      background: url('~@/assets/images/global-close.png') no-repeat center center;
      background-size: 60px 60px;
    }
  }
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.hide-leave-active {
  animation: hideAnimation 1s ease-in-out;
}
@keyframes hideAnimation {
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(.1);
  }
  100% {
    transform-origin: 675px 685px;
    transform: scale(0)
  }
}
</style>




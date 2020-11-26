<template>
  <article class="newUserTaskPop" v-if="show" @touchmove.prevent>
    <section class="mask">
    </section>
    <section class="content">
      <img class="pop-bg" :src="imgUrl|filter" alt="">
      <div class="close-wrapper">
        <div class="iconfont icon-closed" @click="onClose"></div>
      </div>
      <img class="btn" src="../img/receive-btn.png" alt="" @click="goTask">
    </section>
  </article>
</template>

<script>
import { mapState } from 'vuex'
import { bottomBarJump } from '@/utils/utils'
import Services from '@/services/index'
import _get from 'lodash.get'
export default {
  name: 'newUserTaskPop',
  computed: {
    ...mapState(['userInfo']),
    havePopUp () {
      let TIMES_7_DAY = 604800000
      let isNew = Date.now() - this.userInfo.createTime < TIMES_7_DAY
      if (isNew) {
        let endTime = new Date(new Date().toLocaleDateString()).getTime().toString()
        let info = localStorage.getItem('newUserTaskPopInfo')
        if (info === endTime) {
          return false
        }
        return true
      }
      return false
    }
  },
  data () {
    return {
      show: false,
      imgUrl: ''
    }
  },
  methods: {
    goTask () {
      this.$marchSetsPoint('A_H5PT0019003825') // H5平台-首页-新人红包弹窗-立即领取点击
      localStorage.setItem('newUserTaskPopInfo', new Date(new Date().toLocaleDateString()).getTime())
      bottomBarJump('#/task', 'task', this.$router)
    },
    async newUserPopup () {
      const res = await Services.newUserPopup()
      const data = _get(res, 'data.data', {})
      this.show = data.show
      this.imgUrl = data.imgUrl
      this.$marchSetsPoint('A_H5PT0019003823') // H5平台-首页-新人红包弹窗加载完成
    },
    onClose () {
      localStorage.setItem('newUserTaskPopInfo', new Date(new Date().toLocaleDateString()).getTime())
      this.show = false
      this.$marchSetsPoint('A_H5PT0019003824') // H5平台-首页-新人红包弹窗-关闭点击
      this.$parent.initDialog()
    },
    init (callback) {
      if (this.havePopUp) {
        this.newUserPopup()
      }
      else {
        callback({
          name: 'newUserTaskPop',
          isShow: false
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/less" lang="less" scoped>
.newUserTaskPop {
  .mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 99;
  }
  .content {
    width: 470px;
    height: 490px;
    position: absolute;
    top: 270px;
    left: 50%;
    margin-left: -235px;
    z-index: 99;
    .pop-bg {
      width: 100%;
    }
    .close-wrapper {
      position: absolute;
      right: 0;
      top: 0;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-closed {
      color: #fff;
      font-size: 18px;
    }
    .btn {
      width: 330px;
      height: 86px;
      position: absolute;
      bottom: 30px;
      left: 50%;
      margin-left: -165px;
    }
  }
}
</style>

<template>
  <div class="newUserPage1" v-if="isShow">
    <div class="center" @click="handleClick">
      <div class="box">
        <img src="./images/page1_mask.png" alt="">
      </div>
      <div class="bg">
        <img src="./images/page1_tips.png" alt="">
      </div>
      <div class="btn">
        <img src="./images/btn.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import Services from '@/services/newUserGuide'
import utils from '@/utils/utils'
export default {
  name: 'user-guide-page1',
  data: () => ({
    isAnimation: false,
    isShow: false
  }),
  methods: {
    handleClick () {
      this.$marchSetsPoint('A_H5PT0020001303')
      // 允许浏览器滚动
      utils.ScrollMove()
      this.isShow = false
    },
    _saveNewUserGuide () {
      Services.saveNewUserGuide({ version: 1, position: 1001 })
    },
    _getNewUserGuide () {
      Services.getNewUserGuide({ version: 1 }).then(res => {
        let { data } = res.data
        if (data == '1001') {
          // 阻止浏览器滚动
          utils.ScrollToTop()
          utils.ScrollNoMove()
          this.isShow = true
          this._saveNewUserGuide()
          this.$marchSetsPoint('A_H5PT0020001302')
        }
      })
    },
    init () {
      this._getNewUserGuide()
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="less" scope>
.newUserPage1 {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 11;
  .center {
    position: absolute;
    height: 100%;
    width: 100%;
    .box {
      position: absolute;
      top: 310px;
      left: 20px;
      width: 340px;
      height: 420px;
      box-shadow: 0 0 0 1000px rgba(22, 22, 22, 0.7);
      border-radius: 15px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .bg {
      position: absolute;
      left: 20px;
      top: 640px;
      width: 640px;
      height: 380px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .btn {
      position: absolute;
      left: 20px;
      top: 950px;
      width: 170px;
      height: 60px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
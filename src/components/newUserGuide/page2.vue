<template>
  <div class="newUserPage2" v-if="isShow">
    <div class="center" @click.stop="handleClick">
      <div v-if="step===1" class="step1" :class="{'active' : closeRules}">
        <div class="box">
          <img src="./images/page2_mask.png" alt="">
        </div>
        <div class="bg">
          <img src="./images/page2_tips.png" alt="">
        </div>
        <div class="btn">
          <img src="./images/btn.png" alt="">
        </div>
      </div>
      <div v-if="step===2" class="step2" :class="{'active' : closeRules}">
        <div class="box">
          <img src="./images/page3_mask.png" alt="">
        </div>
        <div class="bg">
          <img src="./images/page3_tips.png" alt="">
        </div>
        <div class="btn">
          <img src="./images/btn.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Services from '@/services/newUserGuide'
import utils from '@/utils/utils'
export default {
  name: 'user-guide-page2',
  data: () => ({
    isAnimation: false,
    isShow: false,
    step: 1,
    closeRules: window.localStorage.getItem('closeRules') ? true : false
  }),
  methods: {
    handleClick () {
      if (this.step == 1) {
        this.step = 2
        this.$marchSetsPoint('A_H5PT0021001311')
        this.$marchSetsPoint('A_H5PT0021001310')
      }
      else if (this.step == 2) {
        // 允许浏览器滚动
        utils.ScrollMove()
        this.isShow = false
        this.$marchSetsPoint('A_H5PT0021001312')
      }
    },
    _saveNewUserGuide () {
      Services.saveNewUserGuide({ version: 2, position: 1001 })
    },
    _getNewUserGuide () {
      Services.getNewUserGuide({ version: 2 }).then(res => {
        let { data } = res.data
        if (data == '1001') {
          // 阻止浏览器滚动
          setTimeout(() => {
            this._saveNewUserGuide()
            utils.ScrollToTop()
            utils.ScrollNoMove()
            this.isShow = true
            this.$marchSetsPoint('A_H5PT0021001309')
          }, 20)
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
.newUserPage2 {
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
    .step1 {
      .box {
        position: absolute;
        top: 140px;
        left: 15px;
        width: 464px;
        height: 180px;
        box-shadow: 0 0 0 1000px rgba(22, 22, 22, 0.7);
        border-radius: 28px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .bg {
        position: absolute;
        left: 15px;
        top: 300px;
        width: 660px;
        height: 400px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .btn {
        position: absolute;
        left: 15px;
        top: 620px;
        width: 170px;
        height: 60px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      &.active {
        .box {
          top: 158px;
        }
        .bg {
          top: 278px;
        }
        .btn {
          top: 598px;
        }
      }
    }
    .step2 {
      .box {
        position: absolute;
        top: 320px;
        left: 20px;
        width: 350px;
        height: 200px;
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
        top: 440px;
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
        top: 760px;
        width: 170px;
        height: 60px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      &.active {
        .box {
          top: 348px;
        }
        .bg {
          top: 468px;
        }
        .btn {
          top: 788px;
        }
      }
    }
  }
}
</style>
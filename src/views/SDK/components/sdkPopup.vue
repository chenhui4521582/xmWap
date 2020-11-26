<template>
  <article class="sdk-popup-wrapper" v-show="show" @touchmove.self.prevent>
    <transition name="mask">
      <div class="popup-mask" @click.stop="" v-show="show"></div>
    </transition>
    <section class="main-container" :class="[`type-${type}`,{'is-sdk':isSDK}]">
      <div class="position-relative" @touchmove.stop>
        <div v-if="showClose" class="close-btn" @click.stop="close()"></div>
        <p class="title" v-if="title" v-html="title"></p>
        <slot>
          <div class="text" style="margin-top: 1.7rem;">
            <p>即将离开当前游戏</p>
            <p>您是否确定前往{{toText}}？</p>
          </div>
        </slot>
        <slot name="btns"></slot>
        <div class="btn-wrapper"
          :class="{'long-wrapper':btnNumber===1,fontMore:cancelText.length>5||confirmText.length>5}"
          v-if="btnNumber">
          <div class="cancel-btn" v-if="showCancel" @click.stop="cancel()">{{cancelText}}</div>
          <div class="confirm-btn" :class="{'inactivated':inactivated}" v-if="showConfirm"
            @click.stop="confirm()">{{confirmText}}</div>
        </div>
      </div>
    </section>
  </article>
</template>

<script>
import utils from '@/utils/utils'
export default {
  name: 'sdkPopup',
  props: {
    value: {
      type: [Boolean, Number],
      default: false
    },
    type: {
      type: [Number, String],
      default: 0
    },
    title: {
      type: String,
      default: ''
    },
    toText: {
      type: String,
      default: '参与活动'
    },
    showClose: {
      type: Boolean,
      default: true
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    showConfirm: {
      type: Boolean,
      default: true
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    inactivated: {
      type: Boolean,
      default: false
    },
    closeFlag: {
      type: Boolean,
      default: true
    },
    isSDK: {
      type: Boolean,
      default: true
    },
    centerScroll: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      show: this.value
    }
  },
  mounted () {
  },
  computed: {
    btnNumber () {
      if (this.showCancel && this.showConfirm) {
        return 2
      } else if (this.showCancel || this.showConfirm) {
        return 1
      } else {
        return 0
      }
    }
  },
  methods: {
    close () {
      this.$emit('input', false)
      this.$emit('on-close')
    },
    cancel () {
      if (this.closeFlag) {
        this.$emit('input', false)
      }
      this.$emit('on-cancel')
    },
    confirm () {
      if (this.closeFlag) {
        this.$emit('input', false)
      }
      this.$emit('on-confirm')
    }

  },
  watch: {
    value (val) {
      this.show = val
    },
    show (val) {
      this.$emit('input', val)
      if (val && !this.centerScroll) {
        utils.ScrollNoMove()
      }
      else {
        utils.ScrollMove()
      }
    }
  },
}
</script>

<style lang="less" scoped>
.bg-center(@url) {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url(@url);
}
.sdk-popup-wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
  overflow: hidden;
  .popup-mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 99;
    overflow: hidden;
  }
  .main-container {
    position: absolute;
    z-index: 100;
    left: 50%;
    margin-left: -266px;
    top: 270px;
    width: 532px;
    height: 460px;
    .bg-center('../img/popup-bg.png');
    &.is-sdk {
      left: initial;
      margin-left: initial;
      right: 42px;
    }
    .position-relative {
      position: relative;
      width: 100%;
      height: 100%;
      padding: 1px;
    }
    .close-btn {
      position: absolute;
      right: -8px;
      top: -16px;
      width: 70px;
      height: 70px;
      .bg-center('../img/close-icon.png');
    }
    .title {
      font-size: 32px;
      font-weight: bold;
      color: #fff;
      line-height: 36px;
      text-shadow: 0px 3px 3px rgba(21, 90, 147, 0.86);
      text-align: center;
    }
    .btn-wrapper {
      position: absolute;
      width: 100%;
      bottom: 45px;
      font-size: 24px;
      font-weight: bold;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      div {
        width: 188px;
        height: 88px;
        margin: 0 6px;
        padding: 11px 0 15px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .cancel-btn {
        .bg-center('../img/blue-normal-btn-bg.png');
      }
      .confirm-btn {
        .bg-center('../img/orange-normal-btn-bg.png');
      }
      &.long-wrapper {
        div {
          width: 278px;
        }
        .cancel-btn {
          .bg-center('../img/blue-long-btn-bg.png');
        }
        .confirm-btn {
          .bg-center('../img/orange-long-btn-bg.png');
          &.inactivated {
            .bg-center('../img/grey-long-btn-bg.png');
          }
        }
      }
      &.fontMore {
        font-size: 22px;
      }
    }
    &.type-downloadDDW {
      .title {
        margin-top: 60px;
      }
      height: 652px;
      .bg-center('../img/popup_ddwDownload.png');
      .btn-wrapper {
        bottom: 66px;
      }
    }
    &.type-downloadDDWStep2 {
      .title {
        margin-top: 60px;
      }
      width: 518px;
      height: 631px;
      .bg-center('../img/popup_ddwDownloadStep2.png');
      .btn-wrapper {
        bottom: 160px;
      }
    }
    &.type-weekCard {
      width: 535px;
      height: 585px;
      .bg-center('../img/popup-585-bg.png');
    }
    &.type-weekCard-nextDay {
      width: 534px;
      height: 462px;
      text-align: center;
      font-size: 20px;
      color: #fff;
      .bg-center('../img/popup-462-bg.png');
      .icon-img {
        width: 233px;
        height: 155px;
        margin: 50px auto 27px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    &.type-turnable {
      width: 534px;
      height: 672px;
      text-align: center;
      font-size: 20px;
      color: #fff;
      .bg-center('../img/popup-672-bg.png');
      .icon-img {
        width: 233px;
        height: 155px;
        margin: 50px auto 27px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .title {
        font-size: 32px;
        text-shadow: 0px 3px 3px rgba(21, 90, 147, 0.86);
      }
      .img {
        width: 433px;
        margin: 20px auto 32px;
        img {
          width: 100%;
        }
      }
    }
    &.type-lastTask {
      width: 534px;
      height: 672px;
      text-align: center;
      font-size: 20px;
      color: #fff;
      .bg-center('../img/popup-672-bg.png');
      .icon-img {
        width: 233px;
        height: 155px;
        margin: 50px auto 27px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .award-bg {
        margin-top: -72px;
        img {
          width: 256px;
          height: 148px;
        }
      }
    }
    &.type-gamelist {
      width: 534px;
      height: 672px;
      .bg-center('../img/popup-672-bg.png');
      .title {
        margin-top: 88px;
      }
      .gamelist {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-around;
        margin: 40px;
        li {
          margin: 15px auto 0;
          flex: 30%;
          text-align: center;
          font-size: 24px;
          color: #fff;
          white-space: nowrap;
          img {
            width: 104px;
            height: 104px;
          }
        }
      }
    }
    &.type-0 {
      .title {
        margin-top: 84px;
      }
      .text {
        font-size: 20px;
        font-weight: bold;
        color: #fff;
        line-height: 30px;
        text-align: center;
      }
    }
    &.type-1 {
      width: 534px;
      height: 562px;
      .bg-center('../img/popup-562-bg.png');
      .title {
        margin-top: 60px;
      }
    }
    &.type-2 {
      .title {
        position: absolute;
        width: 270px;
        height: 110px;
        .bg-center('../img/awards-top.png');
        left: 122px;
        top: -100px;
        box-sizing: border-box;
        padding-top: 60px;
      }
    }
  }
}
// 动画
.mask-enter {
  opacity: 0;
}
.mask-enter-active {
  transition: opacity 0.3s;
}
.mask-leave-to {
  opacity: 0;
}
.mask-leave-active {
  transition: opacity 0.3s;
}
/* 横屏模式 */
@media screen and (orientation: landscape) {
  .sdk-popup-wrapper {
    .main-container {
      top: 90px;
    }
  }
}
</style>

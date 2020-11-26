<template>
  <div class="comPop-wrap" v-show="show">
    <transition name="mask">
      <div class="comPop-mask" v-show="show"></div>
    </transition>
    <div class="comPop-content" :class="Object.assign({'showWidth':isWidth},classObj)">
      <div class="header" :class="{notitile:!title}">
        <span>{{title}}</span>
      </div>
      <div class="content" :class="{'line': type==2}">
        <slot></slot>
      </div>
      <div class="footer-wrap" v-if="type == 1 && buttonShow">
        <slot name="footer">
          <wf-button v-if="saveButtonShow" :long=true @click="save">{{saveText}}</wf-button>
        </slot>
      </div>
      <div class="btns" v-if="type == 2 && buttonShow">
        <slot name="footer">
          <div class="btn cancel" v-if="closeButtonShow" @click="close">{{closeText}}</div>
          <div class="btn confirm" v-if="saveButtonShow" @click="save">{{saveText}}</div>
        </slot>
      </div>
      <slot name="other"></slot>
      <div class="close-icon" :class="classObj" v-if="(type == 1 && closeIconShow)||(type == 2 && closeIcon2Show)"
        @click="closeModal"></div>
    </div>
  </div>
</template>
<script>
import utils from '@/utils/utils'
export default {
  name: 'Modal',
  data () {
    return {
      show: this.value
    }
  },
  props: {
    isWidth: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: false
    },
    type: {
      default: 1
    },
    title: {
      type: String,
      default: '我是标题'
    },
    closeText: {
      type: String,
      default: '取消'
    },
    closeIconShow: {
      type: Boolean,
      default: true
    },
    closeButtonShow: {
      type: Boolean,
      default: true
    },
    saveText: {
      type: String,
      default: '确认'
    },
    saveButtonShow: {
      type: Boolean,
      default: true
    },
    buttonShow: {
      type: Boolean,
      default: true
    },
    buttonOptions: {
      type: Object,
      default: () => ({})
    },
    centerScroll: {
      type: Boolean,
      default: false
    },
    closeIcon2Show: {//type2 加关闭按钮
      type: Boolean,
      default: false
    },
    classObj:{
      type: Object,
      default: () => ({})
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
  methods: {
    closeModal () {
      this.show = false
      this.$emit('on-close')
    },
    // 关闭弹框
    close () {
      this.show = false
      this.$emit('on-close')
    },
    // 确认按钮
    save () {
      this.$emit('on-save')
    }
  }
}
</script>
<style lang="less" scoped>
* {
  box-sizing: border-box;
}
.comPop-wrap {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 99;
  .comPop-mask {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 1;
    overflow: hidden;
    pointer-events: none;
  }
  .comPop-content {
    position: absolute;
    width: 470px;
    min-height: 200px;
    z-index: 2;
    background:linear-gradient(-51deg,rgba(251,136,101,0.98),rgba(239,36,83,0.98));
    border-radius: 32px;
    top: 42%;
    left: 50%;
    transform: translate(-50%, -50%);

    &.showWidth {
      width: 600px;
    }
    &.sharesuccess{
      height: 606px;
      background: url("./assets/popsuccess.png");
      background-size: 100% 100%;
      padding-top: 300px;
      box-sizing: border-box;
    }
    .header {
      margin-top: 30px;
      width: 100%;
      position: relative;
      font-size: 42px;
      font-weight: bold;
      color:rgba(255,243,212,1);
      line-height: 40px;
      text-align: center;
      &:not(.notitile){
        height: 40px;
        margin-top: 36px;
      }
    }
    .content {
      padding: 8px 30px 23px;
      &.line {
        border-bottom: 2px solid #e6e6e6;
      }
    }
    .footer-wrap {
      margin-bottom: 30px;
      height: 70px;
      width: 100%;
      text-align: center;
      box-sizing: border-box;
      padding: 0 30px;
    }
    .btns {
      height: 90px;
      width: 100%;
      text-align: center;
      box-sizing: border-box;
      overflow: hidden;
      display: flex;
      justify-content: center;
      .btn {
        margin: 0 10px;
        width: 100%;
        height: 90px;
        line-height: 90px;
        font-size: 24px;
      }
      .cannel {
        color: #000000;
      }
      .confirm {
        color: #ff4141;
      }
    }
    .close-icon {
      position: absolute;
      height: 18px;
      width: 18px;
      top: 20px;
      right: 20px;
      text-align: center;
      line-height: 40px;
      background: url('./assets/close.png') no-repeat;
      background-size: 100% 100%;
      i {
        font-size: 18px;
        color: #888888;
      }
      &.sharesuccess{
        top: 190px;
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
</style>



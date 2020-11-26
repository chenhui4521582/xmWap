<template>
  <section class="g-p-header">
    <section class="image-wrapper">
      <img class="back" src="../images/back-icon.png" alt="" @click="handleClick('back')">
      <span class="title">{{title}}</span>
      <img class="close" src="../images/close-icon.png" alt="" @click="handleClick('close')">
    </section>
  </section>
</template>

<script>
export default {
  name: 'GPHeader',
  components: {

  },
  props: {
    title: {
      type: String,
      default: '支付'
    },
    isSetBack: {
      type: Boolean,
      default: false
    },
    isNormalTitle: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
  },
  methods: {
    back () {
      if (this.isSetBack) {
        this.$emit('back')
      } else {
        localStorage.removeItem('originDeffer')
        let src = parent.document.querySelector('iframe') && parent.document.querySelector('iframe').src
        if (src && (src.includes('gameMall') || src.includes('gamepayment'))) {
          history.go(-1)
        } else if (parent && parent.GameEval) {
          parent.GameEval('closeweb')
        } else {
          history.go(-1)
        }
      }
    },
    close () {
      if (this.isSetBack) {
        this.$emit('close')
      } else {
        localStorage.removeItem('originDeffer')
        parent && parent.GameEval && parent.GameEval('closeweb')
      }
    },
    handleClick (type) {
      if (this.isNormalTitle) {
        this[type]()
      } else {
        this.$emit('handleClick', type)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.g-p-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  z-index: 1;
  .image-wrapper {
    position: relative;
    display: flex;
    height: inherit;
    justify-content: space-between;
    align-items: center;
    &::after {
      transform: scaleX(-1);
    }
    .back {
      height: 60px;
      width: 60px;
      top: 0;
    }
    .title {
      font-size: 30px;
      font-family: PingFangSC-Regular, sans-serif;
      font-weight: bolder;
      color: #fff;
      line-height: 72px;
    }
    .close {
      width: 70px;
      height: 70px;
      margin-top: -12px;
      margin-right: -6px;
    }
  }
}
</style>

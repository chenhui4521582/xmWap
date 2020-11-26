<template>
  <div class="header-wap" v-if="$moduleConfig.isShowHeader||needShow"
    :style="{backgroundColor: bgColor}">
    <div class="return-img" @click="returnPage">
      <i class="iconfont icon-return"></i>
    </div>
    <slot>
      <div class="title">{{title}}</div>
    </slot>
  </div>
</template>
<script>
export default {
  name: 'wfHeader',
  props: {
    title: {
      type: String,
      default: ''
    },
    customize: {
      type: Boolean,
      default: false
    },
    bgColor: {
      type: String,
      default: '#f7f7f7'
    },
    needShow: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({

  }),
  methods: {
    returnPage () {
      if (this.customize) {
        this.$emit('on-click')
      } else {
        this.$router.go(-1)
        this.$emit('on-back')
      }
    }
  },
  mounted () {
  }
}
</script>
<style lang="less" scoped>
.header-wap {
  height: 100px;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 10;
  box-sizing: border-box;
  padding: 0 30px;
  color: #000;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  .return-img {
    position: absolute;
    top: 0;
    left: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100px;
    height: 94px;
    box-sizing: border-box;
    z-index: 10;
    .iconfont {
      font-size: 30px;
    }
  }
  .title {
    text-align: center;
    font-size: 32px;
    font-weight: bold;
  }
}
</style>


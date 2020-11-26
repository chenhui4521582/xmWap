<template>
  <div class="sf_comment"
    :class="[$moduleConfig.isShowHeader&&'show-header',isSystemQueryUser&&'show-auto-icon']">
    <div class="sf_comment_container" @click="goToBillComment">
      晒单功能上线啦，快来<i>抢先体验<i class="iconfont icon-next"></i> </i>
    </div>
    <div class="line"></div>
  </div>
</template>

<script>
export default {
  name: 'sfComment',
  props: {
    isSystemQueryUser: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  methods: {
    goToBillComment () {
      this.$router.push('/billcomment')
    }
  }
}
</script>

<style scoped lang="less">
.sf_comment {
  position: fixed;
  top: 85px;
  left: 24px;
  right: 24px;
  z-index: 10;
  background: #f7f7f7;
  &.show-header {
    top: 100px;
  }
  &.show-auto-icon&.show-header {
    top: 158px;
  }
  .sf_comment_container {
    font-size: 24px;
    font-weight: 400;
    text-align: center;
    line-height: 70px;
    width: 672px;
    height: 70px;
    background: url('../../img/comment_title.png');
    background-size: 100% 100%;
    i {
      color: #ff4141;
    }
  }
  .line {
    height: 20px;
    background: #f7f7f7;
  }
}
</style>

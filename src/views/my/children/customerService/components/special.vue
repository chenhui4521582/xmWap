<template>
  <section class="special">
    <h2 class="title">客服公众号</h2>
    <p class="time">微信搜索并关注“<span v-clipboard:copy="copyText" v-clipboard:success="onCopy"
        v-clipboard:error="onError">{{copyText}}</span>”公众号，在线客服将第一时间回复</p>
    <p class="directions">提示：点击复制公众号名称，在微信中搜索即可关注。 </p>
  </section>
</template>

<script>
export default {
  name: '',
  components: {

  },
  data () {
    return {
      copyText: '多多玩vip'
    }
  },
  mounted () {

  },
  methods: {

    onCopy () {
      this.$Toast('复制成功')
    },
    onError () {
      this.$Toast('复制失败')
    },
  }
}
</script>

<style lang="less" scoped>
.special {
  color: #333;
  padding: 0 24px;
  margin-bottom: 38px;
  .title {
    font-weight: bold;
    font-size: 28px;
  }
  .time {
    font-size: 24px;
    span {
      color: #ff9200;
    }
  }
  .directions {
    font-size: 24px;
    color: #888;
    line-height: 36px;
  }
}
</style>

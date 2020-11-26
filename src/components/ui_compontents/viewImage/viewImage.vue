<template>
  <div class="pnl_view" v-if="src">
      <img :src="src" />
      <i class="iconfont icon-close" @click="close"></i>
  </div>
</template>
<script>
export default {
  name: 'ViewImage',
  data() {
    return {
      
    }
  },
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  methods: {
    close(){
        this.$emit('on-close');
    }
  }
}
</script>
<style lang="less" scoped>
    .pnl_view
    {
        position: fixed;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        z-index: 99;
        background-color: rgba(0, 0, 0, 0.7);

        img{
            display: block;
            margin:30% auto 10% auto;
        }

        .icon-close
        {
            display: block;
            margin:0 auto;
            color:#fff;
            font-size:1.5rem;
            text-align: center;
        }
    }
</style>



<template>
  <div>
    <div class="singlepage-bg" style="position: relative;">
      <img src="./images/back.png" alt="" class="back" @click="back">
      <template v-for="item in 9">
        <img :src="`${require(`./images/layer${item}.png`)}`" alt=""
             :class="className(item)" class="image">
      </template>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
      };
    },
    computed: {},
    methods: {
      className(index) {
        return 'image' + index
      },
      back(){
        this.$marchSetsPoint('A_H5PT0191001878')
        this.$router.go(-1)
      }
    },
    mounted(){
      this.$marchSetsPoint('P_H5PT0191')
    }
  };
</script>
<style lang="less" scoped>
  .back {
    position: absolute;
    top: 19px;
    left: 30px;
    width: 80px;
    height: 40px;
  }

  .image {
    display: block;
    &.image1 {
      height: 368px;
    }
    &.image2 {
      height: 890px;
    }
    &.image3 {
      height: 800px;
    }
    &.image4 {
      height: 601px;
    }
    &.image5 {
      height: 630px;
    }
    &.image6 {
      height: 870px;
    }
    &.image7 {
      height: 860px;
    }
    &.image8 {
      height: 710px;
    }
    &.image9 {
      height: 840px;
    }

  }
</style>

<template>
  <div class="mall-banner" v-if="sliderLength">
    <div class="wrapper" v-if="sliderLength > 1">
      <swiper :options="options">
        <swiper-slide class="swiper-slide" v-for="(item, index) in list" :key="index"
          @click.native="slideClick(item, index)">
          <img class="swiper-img" :src="item.image | filter" alt="" />
        </swiper-slide>
      </swiper>
    </div>
    <div class="wrapper" v-if="sliderLength == 1">
      <div class="swiper-slide" v-for="(item, index) in list" :key="index"
        @click="slideClick(item, index)">
        <img class="swiper-img" :src="item.image | filter" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { gameActivityJump } from '@/utils/utils'
import 'swiper/dist/css/swiper.css'
export default {
  name: 'banner',
  props: {
    list: {
      type: Array,
      default: () => ([])
    }
  },
  data: () => ({
    defaultOptions: {
      autoplay: true,
      loop: true,
      observer: true,
      observeParents: true
    }
  }),
  components: {
    swiper,
    swiperSlide
  },
  computed: {
    options () {
      return Object.assign({}, this.defaultOptions, this.propsOptions)
    },
    sliderLength () {
      return this.list.length
    }
  },
  methods: {
    slideClick (item, index) {
      gameActivityJump(item.url)
    }
  }
}
</script>

<style scoped lang="less">
.mall-banner {
  margin: auto;
  position: relative;
  overflow: hidden;
  width: 100%;
  max-height: 170px;
  border-radius: 28px;
  margin: 0 auto 20px;
}
</style>
<style lang="less">
.swiper-img {
  vertical-align: top;
  width: 100%;
  height: 163px;
  border-radius: 28px;
  overflow: hidden;
}
.swiper-pagination {
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
}
</style>

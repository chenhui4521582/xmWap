<template>
  <div class="payment-banner">
    <div class="wrapper">
      <template v-if="list.length>1">
        <swiper :options="options">
          <swiper-slide class="swiper-slide" v-for="(item, index) in list" :key="index"
            @click.native="slideClick(item, index)">
            <img class="swiper-img" :src="item.image | filter" alt="" />
          </swiper-slide>
        </swiper>
        <div class="swiper-pagination"></div>
      </template>
      <img class="swiper-img" :src="list[0].image | filter" alt="" v-else
        @click="slideClick(list[0], 0)" />
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import { jumpUrl } from '@/utils/utils'
export default {
  name: 'banner',
  props: {
    list: {
      type: Array,
      default: () => ([])
    },
    propsOptions: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    defaultOptions: {
      autoplay: true,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
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
    }
  },
  methods: {
    async slideClick (item, index) {
      await this.$marchSetsPoint('A_H5PT0021001689', {
        position_id: index,
        task_id: item.id,
        task_name: item.name,
        target_project_id: item.gameType
      })
      jumpUrl(item)
    }
  }
}
</script>

<style lang="less">
.payment-banner {
  margin-top: 20px;
  overflow: hidden;
  position: relative;
  .swiper-container {
    border-radius: 16px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
  }
  .swiper-img {
    vertical-align: top;
    width: 100%;
    /*height: 220px;*/
    border-radius: 16px;
    overflow: hidden;
  }
  .swiper-pagination {
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
  }
  .swiper-pagination-bullet {
    margin: 0 4px;
    width: 10px;
    height: 10px;
    background: hsla(0, 0%, 100%, 1);
  }
  .swiper-pagination-bullet-active {
    background: hsla(0, 0%, 100%, 0.8);
    width: 20px;
    border-radius: 30px;
  }
}
</style>

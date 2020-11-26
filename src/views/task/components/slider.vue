<template>
  <div class="task-banner">
    <div class="wrapper">
      <swiper :options="options">
        <swiper-slide class="swiper-slide" v-for="(item, index) in list" :key="index"
          @click.native="slideClick(item, index)">
          <img class="swiper-img" :src="item.image | filter" alt="" />
        </swiper-slide>
      </swiper>
      <div class="swiper-pagination"></div>
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
      await this.$marchSetsPoint('A_H5PT0022001294', {
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

<style scoped lang="less">
.task-banner {
  position: relative;
  padding: 20px 24px 0;
  height: 239px;
  .wrapper {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
}
</style>
<style lang="less">
.swiper-container {
  border-radius: 16px;
}
.swiper-img {
  vertical-align: top;
  width: 100%;
  height: 220px;
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
</style>

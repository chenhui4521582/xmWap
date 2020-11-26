<template>
  <div class="horn">
    <swiper v-if="isShow" :options="defaultOptions" >
      <swiper-slide class="swiper-slide">
        <div class="rule">
          榜单每天<span>13点</span>、<span>21</span>点更新
        </div>
      </swiper-slide>
      <swiper-slide class="swiper-slide">
        <div class="text" v-if="hornMessage.index">
          <template v-if="hornMessage.index <= 20" >
            <i v-if="hornMessage.index == 1">大神请收下我的膝盖吧</i>
            <i v-else>下级奖励为 <span>{{hornMessage.nextAwardsName}}</span></i>
          </template>
          <template v-else>
            下级奖励为 <i>{{hornMessage.nextAwardsName}}</i>
          </template>
        </div>
        <div v-else class="text">
          进入 <i>{{hornMessage.capacity}}名</i> 最低可得 <i>{{hornMessage.nextAwardsName}}</i>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import { jumpUrl } from '@/utils/utils'
export default {
  name: 'horn',
  props: {
    hornMessage: {
      type: Object,
    }
  },
  data: () => ({
    defaultOptions: {
      loop: true,
      autoplay: true,
      direction: 'vertical',
      height: 70
    },
    isShow: false
  }),
  components: {
    swiper,
    swiperSlide
  },
  methods: {
    async slideClick(item, index) {
      await this.$marchSetsPoint('A_H5PT0022001294', {
        position_id: index,
        task_id: item.id,
        task_name: item.name,
        target_project_id: item.gameType
      })
      jumpUrl(item)
    }
  },
  watch: {
    hornMessage(newValue) {
      this.isShow = true
    }
  }
}
</script>

<style scoped lang="less">
.horn {
  position: relative;
  margin-top: 20px;
  overflow: hidden;
  height: 70px;
  background: url('../img/tip.png') no-repeat center top ;
  background-size: 100% 100%;
  border-radius: 16px;
  box-shadow:0px 3px 6px rgba(0,0,0,0.08);
}
</style>
<style lang="less">
.swiper-slide {

  .text {
    height: 70px;
    line-height: 70px;
    text-align: center;
    font-size: 24px;
    color: #000000;
    i {
      color: #FF4141;
    }
  }
  .rule {
    height: 70px;
    line-height: 70px;
    text-align: center;
    font-size: 24px;
    color: #000000;
    span {
      color: #FF4141;
    }
  }
}
</style>

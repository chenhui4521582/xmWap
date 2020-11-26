<template>
  <!-- 推广位 -->
  <div class="find-recommend">
    <ul>
      <li v-for="(item,index) in recommendList" :key="index" @click="jump(item,index)">
        <img :src="item.image|filter" alt="">
      </li>
    </ul>
  </div>
</template>
<script>
import { getRingServerStatus, getSeckillStatus } from '@/services/shop'
import { jumpUrl } from '@/utils/utils'

export default {
  name: 'recommend',
  props: {
    recommendList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    jump (item, index) {
      this.$marchSetsPoint('A_H5PT0272003213', {
        position_id: index,
        awards_id: item.id,
        awards_name: item.name
      })
      jumpUrl({ url: item.url })
    }
  }
}
</script>
<style lang="less" scoped>
.find-recommend {
  padding: 70px 24px 50px;
  ul {
    display: flex;
    justify-content: space-between;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    &.active li {
      width: 216px;
    }
    &.seckill li {
      width: 216px;
      margin-right: 12px;
      &:last-child {
        margin-right: 0;
      }
    }
    li {
      flex-shrink: 0;
      width: 330px;
      height: 120px;
      img {
        vertical-align: top;
        width: 100%;
        height: 100%;
        border-radius: 16px;
      }
    }
  }
}
</style>

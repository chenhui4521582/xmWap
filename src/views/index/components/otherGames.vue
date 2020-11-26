<template>
  <section class="other_games">
    <!-- 推荐位游戏列表 -->
    <game-list-info :list="recommendList" />
    <!-- 游戏位列表 -->
    <game-list-info 
      v-for="(item, index) in list"
      :list="item.gameRspList" 
      :showName="item.showName" 
      :key="index"
    />
  </section>
</template>
<script type="text/ecmascript-6">
import GameListInfo from './gameListInfo'
export default {
  props: {
    list: {
      type: Array,
      default: () => ([])
    },
    recommendList: {
      type: Array,
      default: () => ([])
    }
  },
  components: {
    GameListInfo
  },
  methods: {
    async goGame (item, index, flag, itemlist) {
      //flag 0 推荐位 1 竖排 2 横版
      let self = this
      if (item && item.url) {
        this.$marchSetsPoint(flag ? 'A_H5PT0019000675' : 'A_H5PT0019000674', {
          position_id: flag ? index + 1 : index,
          target_project_id: item.type,
          task_id: itemlist.categoryId,
          task_name: itemlist.showName
        })
        self.$emit('goGame', item)
      }
    },
    getArr (arr) {
      return arr[0].innerSort ? arr : arr.slice(1)
    },
    geturl (url) {
      if (url && !url.includes('http')) {
        return url.startsWith('/') ? ('//file.beeplaying.com' + url) : ''
      } else {
        return url
      }
    }
  }
}
</script>

<style scoped lang="less" rel="stylesheet/less">
.other_games {
  padding: 0 12px 20px 24px;
}
</style>

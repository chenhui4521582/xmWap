<template>
  <div class="recent-play">
    <slot></slot>
    <div class="wrap" v-if="showRecent">
      <div class="icon">
        <img src="../img/recent_playiconB.png" alt="">
      </div>
      <ul>
        <li v-for="(item, index) in recentList" :key="index" @click="goGame(item, index)">
          <div class="game-icon">
            <img :src="item.icon | filter" alt="">
            <img v-if="item.jackpotStatus == 1" src="../img/jackpotStatus.gif" alt=""
              class="corner">
          </div>
          <p class="game-name" :class="{'disable': !item.name}">
            {{item.name}}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { jumpUrl } from '@/utils/utils'
export default {
  name: 'recentPlay',
  props: {
    list: {
      type: Array,
      default: () => ([])
    }
  },
  computed: {
    showRecent () {
      return this.list.length
    },
    recentList () {
      let arr = []
      for (let i = 0; i < 4; i++) {
        if (this.list[i]) {
          arr.push(this.list[i])
        } else {
          arr.push({ icon: require('../img/nogame-icon.png') })
        }
      }
      return arr
    }
  },
  methods: {
    goGame (item, index) {
      if (item && item.url) {
        this.$marchSetsPoint('A_H5PT0019000671', {
          position_id: index + 1,
          target_project_id: item.type
        })
        this.$emit('goGame', item)
      }
    }
  }
}
</script> 
<style lang="less" scoped>
.recent-play {
  margin: 0 24px;
  width: 672px;
  background: #fff;
  border-radius: 16px;
  .wrap {
    margin: 0 20px 0;
    height: 139px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-top: 1px solid rgba(238, 238, 238, 1);
    .icon {
      margin-right: 12px;
      width: 96px;
      height: 90px;
      img {
        vertical-align: top;
        width: 100%;
        height: 100%;
      }
    }
    ul {
      padding-left: 35px;
      min-width: 5px;
      display: flex;
      flex: 1;
      height: 113px;
      border-left: 1px solid #eeeeee;
      justify-content: space-between;
      li {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .game-icon {
          position: relative;
          width: 80px;
          height: 80px;
          img {
            vertical-align: top;
            width: 80px;
            height: 80px;
          }
          .corner {
            position: absolute;
            right: 0;
            top: 50px;
            width: 92px;
            height: 32px;
          }
        }

        .game-name {
          height: 25px;
          line-height: 25px;
          text-align: center;
          color: #000;
          font-size: 20px;
          white-space: nowrap;
          text-align: center;
          &.disable {
            background: #f7f7f7;
            width: 90px;
          }
        }
      }
    }
  }
}
</style>
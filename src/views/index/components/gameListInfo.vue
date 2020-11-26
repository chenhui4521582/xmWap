<template>
  <div class="game_item">
    <div class="title" v-if="showName">{{showName}}</div>
    <ul>
      <li 
        v-for="(item, index) in list" 
        :class="{ column: item.showType == 2, recommend: (item.showType == 2 && item.recommendImg) }" 
        :key="index"  
        @click="goJumpOutsideGame(item, index)"
      >
        <!-- 推广位大图 -->
        <div class="recommend-img" v-if="(item.showType == 2 && item.recommendImg)">
          <img :src="item.recommendImg | filter" alt="" />
        </div>
        <!-- 推广位大图遮罩 -->
        <div class="recommend-cover" v-if="(item.showType == 2 && item.recommendImg)"></div>
        <div class="icon">
          <img :src="item.icon | filter" alt="">
        </div>
        <div class="corner" v-if="item.corner">
          <img :src="item.corner | filter" alt="" class="corner" >
        </div>
        <div class="jackpotStatus" v-if="item.jackpotStatus == 1">
          <img src="../img/jackpotStatus.gif" alt="" class="corner" >
        </div>
        <div class="text">
          <div class="game-name">{{ item.name }}</div>
          <div class="game-remark">{{ item.remark }}</div>
        </div>
        <div class="start-btn" v-if="item.showType == 2">开始</div>
      </li>
    </ul>
  </div>
</template>
<script>
import { jumpUrl } from '@/utils/utils'
export default {
  name: 'gameListInfo',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    showName: {
      type: String,
      default: ''
    }
  },
  methods: {
    goJumpOutsideGame (item, index) {
      this.$marchSetsPoint('A_H5PT0019000672', {
        position_id: index,
        target_project_id: item.type,
        task_id: item.id,
        task_name: item.name
      })
      jumpUrl(item)
    }
  }
}
</script>
<style lang="less" scoped>
.game_item {
  padding-bottom: 35px;
  .title {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #000;
  }
  ul {
    display: flex;
    justify-content: flex-start;
    flex-flow: wrap;
    li {
      position: relative;
      padding-bottom: 27px; 
      margin: 0 12px 12px 0;
      width: 216px;
      text-align: center;
      background:#fff;
      border-radius:16px;
      &.last {
        margin-right: 0;
      }
      .icon {
        margin: 30px auto 8px;
        width: 104px;
        height: 104px;
        img {
          vertical-align: top;
          width: 100%;
          height: 100%;
        }
      }
      .corner {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 2;
        width: 50px;
        height: 30px;
        img {
          vertical-align: top;
          width: 100%;
          height: 100%;
        }
      }
      .jackpotStatus {
        position: absolute;
        top: 100px;
        left: 50px;
        width: 112px;
        height: 37px;
        img {
          vertical-align: top;
          width: 100%;
          height: 100%;
        }
      }
      .game-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 4px;
        color: #000000;
        font-size: 24px;
      }
      .game-remark {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #888888;
        font-size: 20px;
      }
      // 竖版样式
      &.column {
        position: relative;
        padding-bottom: 0;
        margin: 0 0 12px 0;
        width: 672px;
        height: 144px;
        background:#fff;
        border-radius:16px;
        display: flex;
        justify-content: flex-start;
        align-content: center;
        .icon {
          margin: 20px 12px 20px 20px;
        }
        .jackpotStatus {
          position: absolute;
          top: 90px;
          left: 10px;
        }
        .text {
          margin: 20px 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .game-name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-bottom: 4px;
            color: #000000;
            font-size: 24px;
            text-align: left;
          }
          .game-remark {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #888888;
            font-size: 20px;
            text-align: left;
          }
        }
        .start-btn {
          position: absolute;
          right: 20px;
          top: 49px;
          width: 110px;
          height: 42px;
          background:rgba(255,65,65,1);
          opacity: 1;
          border-radius: 10px;
          font-size: 24px;
          font-weight: 500;
          line-height: 42px;
          color: #fff;
        }
      }
      // 推广位样式
      &.recommend {
        overflow: hidden;
        height: 270px;
        .recommend-img {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          img {
            vertical-align: top;
            width: 100%;
            height: 100%;
          }
        }
        .recommend-cover {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 2;
          height: 120px;
          background: linear-gradient(180deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.56) 15%,rgba(255,255,255,.99) 40%,rgba(255,255,255,1) 100%);
        }
        .icon {
          position: relative;
          z-index: 3;
          margin: 148px 14px 20px 20px;
        }
        .jackpotStatus {
          position: absolute;
          top: 220px;
          left: 10px;
          z-index: 4;
        }
        .text {
          position: relative;
          z-index: 3;
          margin: 148px 0 20px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .start-btn {
          position: absolute;
          right: 20px;
          top: 196px;
          z-index: 3;
        }
      }
    }
  }
}
</style>
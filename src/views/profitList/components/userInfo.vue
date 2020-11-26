<template>
  <div class="wrapper" v-if="show">
    <loading v-if="isLoading" />
    <div v-else class="pnl_userInfo">
      <i class="iconfont icon-close" @click="close"></i>
      <div class="pnl_baseInfo" :class="{'no-head-frame':!userInfo.headFrame}">
        <img :src="(userInfo&&userInfo.headImg||avatar)|filter" />
        <div v-if="userInfo.headFrame" class="head-frame">
          <img :src="userInfo.headFrame|filter" alt="">
        </div>
        <ul>
          <li>昵称: {{userInfo.nickName}}</li>
          <li>玩龄: {{userInfo.playTime}}</li>
          <li>招财猫等级: {{userInfo.catLevel}}</li>
        </ul>
      </div>
      <div class="pnl_infoDetail">
        <ul>
          <li>
            盈利榜<br />
            最高排名<br />
            <span class="count">{{userInfo.profitMaxRanking}}</span>
          </li>
          <li>
            盈利榜<br />
            夺冠次数<br />
            <span class="count">{{userInfo.profitTopOneTimes}}</span>
          </li>
          <li>
            盈利榜<br />
            前三次数<br />
            <span class="count">{{userInfo.profitTopThreeTimes}}</span>
          </li>
          <li>
            金叶<br />
            财富<br />
            <span
              class="count">{{userInfo.leafs > 10000 ? (userInfo.leafs/10000).toFixed(2)+'万' : userInfo.leafs}}</span>
          </li>
          <li>
            累计<br />
            京东卡<br />
            <span
              class="count">{{userInfo.totalJdk > 10000 ? (userInfo.totalJdk/10000).toFixed(2)+'万' : userInfo.totalJdk}}</span>
          </li>
          <li>
            累计<br />
            话费<br />
            <span
              class="count">{{userInfo.totalHf > 10000 ? (userInfo.totalHf/10000).toFixed(2)+'万' : userInfo.totalHf}}</span>
          </li>
        </ul>
      </div>
      <div class="pnl_infoExternal" v-if="userInfo.gameRsps.length>0">
        <div class="pnl_recentPlay">
          <div class='title'>最近爱玩</div>
          <ul>
            <li v-for="game in userInfo.gameRsps">
              <img @click="openGame(game)" :src="game.icon | filter" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import profit from '@/services/profit'
import _get from 'lodash.get'
import { jumpUrl } from '@/utils/utils'

export default {
  name: 'userInfo',
  components: {

  },
  props: {
    fromPage: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      userInfo: {},
      isLoading: true,
      show: false,
      avatar: '/cdn/common/images/common/img_photo.png'
    }
  },
  mounted () {

  },
  methods: {
    openGame (game) {
      if (game.url) {
        if (this.fromPage == 'find') {
          this.$marchSetsPoint('A_H5PT0272003222', {
            target_project_name: game.name || ''
          })
        }
        jumpUrl({ url: game.url })
      }
    },
    init (userId) {
      this.$marchSetsPoint('A_H5PT0025002680')
      if (userId) {
        this.show = true
        this.isLoading = true
        profit.getUserProfitInfo({
          userId
        }).then(res => {
          this.isLoading = false
          this.userInfo = _get(res, 'data.data', {})
        }).catch(() => {
          this.isLoading = false
        })
      }
    },
    close () {
      this.show = false
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10;

  .pnl_userInfo {
    padding: 50px 36px 42px 36px;
    position: absolute;
    border-radius: 32px;
    top: 250px;
    left: calc((100% - 510px) / 2);
    width: 510px;
    min-height: 540px;
    background: #fff;

    .icon-close {
      position: absolute;
      right: 25px;
      top: 25px;
      color: #888;
    }

    .pnl_baseInfo {
      padding-bottom: 27px;
      border-bottom: 1px #ccc solid;
      position: relative;
      img {
        float: left;
        width: 100px;
        height: 100px;
      }
      &.no-head-frame {
        img {
          width: 100px;
          height: 100px;
        }
      }
      .head-frame {
        position: absolute;
        width: 120px;
        height: 120px;
        top: -10px;
        left: -10px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      ul {
        float: left;
        margin-left: 30px;
        li {
          width: 280px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 24px;
          color: #000;
        }
      }
      &:after {
        content: '';
        display: block;
        clear: both;
      }
    }
  }

  .pnl_infoDetail {
    padding: 27px 0 7px 0;

    ul {
      margin-left: -10px;
      li {
        float: left;
        margin-left: 12px;
        min-width: 100px;
        margin-bottom: 20px;
        font-size: 18px;
        color: #888;
        .count {
          font-size: 24px;
          color: #000;
        }
      }
      &:after {
        content: '';
        display: block;
        clear: both;
      }
    }
  }

  .pnl_infoExternal {
    padding-top: 20px;
    font-size: 20px;
    border-top: 1px solid #ccc;
    .title {
      color: #888;
    }
    .pnl_recentPlay {
      ul {
        margin-top: 6px;
        display: flex;
        li {
          margin-right: 30px;
          img {
            width: 80px;
          }
        }
      }
    }
  }
}
</style>

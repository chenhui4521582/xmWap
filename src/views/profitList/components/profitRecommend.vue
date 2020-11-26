<template>
  <div class="profit-recommend">
    <div class="ls-video" @click="gotoLsVideo">
      查看大神高光时刻
    </div>
    <div class="recommend-icon" @click="show">
      我要冲榜拿大奖
    </div>
    <div class="mask" v-show="showRecommend"></div>
    <transition name="slide1">
      <div class="recommend-box" v-show="showRecommend">
        <div class="recommend-center">
          <div class="title">
            <img src="../img/recommend-title.png" alt="" />
          </div>
          <div class="recommend-list">
            <better-scroll>
              <ul>
                <li @click="goGame(item)" v-for="(item, index) in games" :key="index" class="games">
                  <img :src="item.img" alt="" />
                  <div class="text">
                    <div class="name">
                      {{ item.name }}
                    </div>
                  </div>
                </li>
              </ul>
            </better-scroll>
          </div>
          <div class="recommend-closed" @click="hide">
            关闭
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import BetterScroll from '@/components/betterScroll/betterScroll'
import { localStorage, getUrlParams } from '@/utils/utils'
import { jumpUrl } from '@/utils/utils'
export default {
  name: 'profitRecommend',
  data: () => ({
    showRecommend: false,
    games: [
      {
        name: '糖果萌消消',
        img: require('../img/tg-icon.png'),
        url: 'crush',
        people: '44570人在玩'
      },
      {
        name: '王者弹珠',
        img: require('../img/dz-icon.png'),
        url: 'Marbles',
        people: '39874人在玩'
      },
      {
        name: '众神风云',
        img: require('../img/sj-icon.png'),
        url: 'square',
        people: '21657人在玩'
      },
      {
        name: '去玩斗地主',
        img: require('../img/ddz-icon.png'),
        url: 'landlord',
        people: '23564人在玩'
      },
      {
        name: '欢乐竞技台球',
        img: require('../img/zq-icon.png'),
        url: 'billiards',
        people: '21598人在玩'
      },
      {
        name: '街机欢乐捕鱼',
        img: require('../img/by-icon.png'),
        url: 'fish',
        people: '23895人在玩'
      },
      {
        name: '三国大作战',
        img: require('../img/sg-icon.png'),
        url: 'kingdom2',
        people: '28946人在玩'
      }
    ]
  }),
  components: {
    BetterScroll
  },
  methods: {
    async goGame (item) {
      this.$marchSetsPoint('A_H5PT0025001140')
      if (item.url) {
        jumpUrl(item)
      }
    },
    hide (btn) {
      this.showRecommend = false
      this.$marchSetsPoint('A_H5PT0025001139')
    },
    show () {
      this.showRecommend = true
      this.$marchSetsPoint('A_H5PT0025001138')
    },
    gotoLsVideo () {
      window.location.href = '//wap.beeplaying.com/activities/lsVideo.html?from=platFrom'
    }
  }
}
</script>

<style scoped lang="less">
* {
  box-sizing: border-box;
}
.profit-recommend {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  text-align: center;
  color: #fff;
  font-size: 28px;
  display: flex;
  justify-content: center;
  .recommend-icon {
    width: 50%;
    line-height: 90px;
    background-color: #ff4141;
  }
  .ls-video {
    width: 50%;
    line-height: 90px;
    background-color: #ff7800;
  }
  .mask {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 14;
  }
  .recommend-box {
    position: fixed;
    width: 100%;
    right: 0;
    left: 0;
    bottom: 0;
    background: #fff;
    z-index: 15;
    border-radius: 28px 28px 0 0;
    .recommend-center {
      .title {
        margin-top: 30px;
        padding: 0 24px 94px;
        height: 0;
        overflow: hidden;
        z-index: 11;
        img {
          vertical-align: top;
          width: 100%;
        }
      }
      .games {
        img {
          width: 100px;
          height: 100px;
        }
      }
      .recommend-list {
        position: relative;
        // height: 700px;
        margin: 24px 22px 0;
        ul {
          display: flex;
          // justify-content: space-between;
          flex-wrap: wrap;
          li {
            position: relative;
            width: 25%;
            height: 100px;
            overflow: hidden;
            padding-bottom: 200px;
            display: flex;
            justify-content: center;
            // margin-bottom: 29px;
            .text {
              position: absolute;
              bottom: 1.5rem;
              left: 0;
              box-sizing: border-box;
              width: 100%;
              .name {
                width: 100%;
                text-align: center;
                font-size: 24px;
                color: #888888;
                white-space: nowrap;
              }
            }
          }
        }
        .recommend-explain {
          width: 100%;
          text-align: center;
          margin-top: 6px;
          color: #45536c;
          font-size: 20px;
        }
      }
      .recommend-closed {
        margin-top: 30px;
        overflow: hidden;
        width: 100%;
        height: 90px;
        line-height: 90px;
        font-size: 24px;
        color: #ff4141;
        text-align: center;
        background: #f0f0f0;
      }
      .recommend-footer {
        position: absolute;
        left: 20px;
        bottom: 0.4rem;
        padding-bottom: 201px;
        overflow: hidden;
        width: 580px;
        height: 0;
        z-index: 11;
        img {
          vertical-align: top;
          width: 100%;
        }
      }
    }

    &.slide1-enter,
    .slide1-leave {
      bottom: -100%;
    }
    &.slide1-enter-active,
    .slide1-leave-active {
      transition: all 0.5s ease-in-out;
    }
  }
}
</style>

<template>
  <div class="newUser" v-show="showNewUser">
    <div class="mask"></div>
    <transition name="fade">
      <div class="content" v-show="showNewUser">
        <div class="wrapper">
          <div class="title">
            <img src="../img/title.png" alt="" />
          </div>
          <div class="tips">恭喜你获得新手大礼包</div>
          <!-- 奖品 -->
          <div class="awards">
            <ul>
              <li v-for="(item, index) in newUserAwards" :key="index">
                <div class="img">
                  <img :src="item.awardImage | filter" alt="" />
                </div>
                <div class="name">
                  {{ item.awardName }}
                </div>
              </li>
            </ul>
          </div>
          <!-- 说明 -->
          <div class="explain">金叶子玩游戏即得话费券，话费券可领取</div>
          <!-- 游戏列表 -->
          <div class="games">
            <h5>选取一个游戏，开始你的赚话费之旅吧！</h5>
            <ul v-if="showGames">
              <template v-for="(item, index) in games">
                <li v-if="index < 3" :key="index" :class="{ active: index === 1 }" @click.stop="playGame(item, index)">
                  <div v-if="index === 1" class="count-down">
                    {{ countDown }}S
                  </div>
                  <div class="game-img" :class="{ active: index === 1 }">
                    <div class="wrap" v-if="index === 1"></div>
                    <img :src="item.image | filter" alt="" />
                  </div>
                  <div class="game-name">
                    {{ item.name }}
                  </div>
                </li>
              </template>
            </ul>
          </div>
          <!-- 按钮 -->
          <div class="btn">
            <div class="game-btn" @click="playGame(0)">玩游戏赚话费</div>
            <div class="sign-btn" @click="goSign">
              做任务赚话费
              <span class="iconfont icon-next"></span>
            </div>
          </div>
          <!-- 关闭按钮 -->
          <div class="closed iconfont icon-close" @click="closedNewUserCard"></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Services from '@/services/index'
import API from '@/services/API/API'
import _get from 'lodash.get'
import { newUtils, jumpUrl, getUrlParams } from '@/utils/utils'
export default {
  name: 'newUserCard',
  data: () => ({
    /** 打开弹窗 **/
    showNewUser: false,
    /** 新手礼包**/
    newUserAwards: [],
    /** 游戏列表 **/
    games: [],
    countDown: 5,
    url: ''
  }),
  computed: {
    showGames () {
      return this.games && this.games.length
    }
  },
  methods: {
    ...mapActions({
      _getUserInfo: 'GET_USERINFO'
    }),
    /** 是否显示新手框领取框 **/
    _getNewUserCard (callback) {
      Services.getNewUserCard({ custom: 'label' }).then(res => {
        this.showNewUser = _get(res, 'data.data.show', false)
        if (this.showNewUser) {
          if(callback){
            callback({
              name:'newUserCard',
              isShow:true
            })
          }
          this.newUserAwards = _get(res, 'data.data.awardList', [])
          this.games = _get(res, 'data.data.games', [])
          this.url = _get(res, 'data.data.url', '')
          this.$marchSetsPoint('A_H5PT0019001419')
          this.countTime()
          this._getUserInfo()
        }
        else
        {
          if(callback){
            callback({
              name:'newUserCard',
              isShow:false
            })
          }
        }
      })
    },
    playGame (item, index) {
      if (item === 0) {
        this.$marchSetsPoint('A_H5PT0019001503', {
          position_id: 1,
          target_project_id: this.games[1].type
        })
        this.showNewUser = false;
      } else {
        this.$marchSetsPoint('A_H5PT0019001505', {
          position_id: index + 1,
          target_project_id: item.type
        })
        this.showNewUser = false;
        clearInterval(this.timer)
        jumpUrl(item)
      }
    },
    countTime () {
      this.timer = setInterval(() => {
        this.countDown--
        if (this.countDown === 0) {
          clearInterval(this.timer)
          this.playGame(this.games[1], 0)
          return false
        }
      }, 1000)
    },
    goSign () {
      this.$marchSetsPoint('A_H5PT0019001504')
      if (this.url) {
        jumpUrl({ url: this.url })
      } else {
        this.showNewUser = false
      }
    },
    closedNewUserCard () {
      clearInterval(this.timer)
      this.showNewUser = false
      this.$marchSetsPoint('A_H5PT0019001548')
      this.$parent.initDialog();
    },
    async init(callback) {
      const isShowCard = await this._getNewUserWheel()
      if (isShowCard) {
        let _token = localStorage.getItem('ACCESS_TOKEN') || getUrlParams('token') || ''
        let xhr = new XMLHttpRequest()
        xhr.open('get', API.getNewUserActivity)
        xhr.setRequestHeader('Authorization', _token)
        xhr.send()
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4 && xhr.status == 200) {
            if(callback){
              callback({
                name:'newUserCard',
                isShow:true
              })
            }
            jumpUrl({ url: xhr.getResponseHeader('uri') + '?from=newuser' });
          }
          else
          {
            if(callback){
              callback({
                name:'newUserCard',
                isShow:false
              })
            }
          }
        }
      } else {
        this._getNewUserCard(callback)
      }
    },
    async _getNewUserWheel () {
      let actChannels = ['100070', '100073']
      let _channel = localStorage.getItem('APP_CHANNEL') || getUrlParams('channel') || 0
      if (actChannels.includes(_channel)) {
        const res = await Services.getNewUserWheelInfo()
        const isShow = _get(res, 'data.data.firstFlag', false)
        return isShow
      }
      return false
    },
  },
  mounted () {
    //this.init();
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  watch: {
    showNewUser (value) {
      if (value) {
        newUtils.ScrollNoMove()
      } else {
        newUtils.ScrollMove()
      }
    }
  }
}
</script>

<style scoped lang="less">
.newUser {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 12;
  .mask {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 13;
    background: rgba(0, 0, 0, 0.7);
  }
  .content {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 470px;
    z-index: 14;
    transform: translate(-50%, -50%);
    .wrapper {
      position: relative;
      padding-top: 78px;
      width: 100%;
      background: #fff;
      overflow: visible;
      border-radius: 32px;
      .title {
        position: absolute;
        left: 50%;
        top: -78px;
        transform: translate(-50%, 0);
        width: 275px;
        height: 155px;
        img {
          vertical-align: top;
          width: 100%;
        }
      }
      .closed {
        position: absolute;
        right: 20px;
        top: 20px;
        color: #acacac;
        font-size: 26px;
      }
      .tips {
        margin-top: 15px;
        font-size: 28px;
        font-weight: bold;
        color: #000;
        text-align: center;
      }
      .awards {
        margin-top: 10px;
        ul {
          display: flex;
          justify-content: center;
          align-items: center;
          li {
            padding: 0 17px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .img {
              margin-right: 10px;
              width: 30px;
              height: 30px;
              img {
                vertical-align: top;
                width: 100%;
                height: 100%;
              }
            }
            .name {
              font-size: 24px;
              color: #ff4141;
            }
          }
        }
      }
      .explain {
        margin: 16px auto 0;
        padding-bottom: 16px;
        width: 410px;
        white-space: nowrap;
        font-size: 20px;
        text-align: center;
        color: #bbbbbb;
        border-bottom: 1px solid #e6e6e6;
      }
      .games {
        margin: 16px auto 0;
        padding-bottom: 16px;
        width: 410px;
        border-bottom: 1px solid #e6e6e6;
        h5 {
          margin-bottom: 15px;
          white-space: nowrap;
          font-size: 20px;
          color: #000000;
          text-align: center;
        }
        ul {
          display: flex;
          justify-content: center;
        }
        li {
          position: relative;
          margin-right: 23px;
          &.active {
            .game-img {
              img {
                animation: huxi 3s infinite ease-in-out;
              }
            }
          }
          .game-img {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto;
            width: 110px;
            height: 110px;
            img {
              vertical-align: top;
              width: 96px;
              height: 96px;
              border-radius: 50%;
              overflow: hidden;
            }
            .wrap {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
              border: 2px solid #ff9200;
            }
          }
          .game-name {
            white-space: nowrap;
            font-size: 20px;
            color: #888888;
            text-align: center;
          }
          .count-down {
            position: absolute;
            right: 0;
            top: 0;
            z-index: 2;
            padding: 0 6px;
            background: #e23c30;
            border-radius: 16px;
            font-size: 20px;
            color: #ffffff;
          }
        }
      }
      .btn {
        width: 100%;
        padding: 29px 0;
        .game-btn {
          margin: 0 auto 15px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 250px;
          height: 70px;
          font-size: 24px;
          border-radius: 16px;
          background: #ff4141;
          color: #fff;
        }
        .sign-btn {
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 250px;
          font-size: 24px;
          color: #5186ca;
        }
      }
    }
  }
}
@keyframes rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes huxi {
  0% {
    transform: scale(0.9);
  }
  10% {
    transform: scale(1);
  }
  20% {
    transform: scale(0.9);
  }
  30% {
    transform: scale(1);
  }
  40% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1);
  }
  60% {
    transform: scale(0.9);
  }
  70% {
    transform: scale(1);
  }
  80% {
    transform: scale(0.9);
  }
  90% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.9);
  }
}
@keyframes fadeAnimation {
  0% {
    transform: translate(-50%, -50%) scale(0);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}
.fade-enter-active {
  animation: fadeAnimation 0.3s ease-in-out;
}
</style>

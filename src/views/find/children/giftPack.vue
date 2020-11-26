<template>
  <main class="gift-pack">
    <section class="tips">温馨提示：礼包会不定期更新，每个礼包限领1次。</section>
    <ul class="game-list">
      <li class="game-list-item" v-for="(items,index) in packList" :key="`game-${index}`">
        <section class="game-info">
          <div class="icon" @click="goGame(items)">
            <img :src="items.icon|filter" alt="">
          </div>
          <div>
            <h4>{{items.name}}</h4>
            <p>{{items.remark}}</p>
          </div>
        </section>
        <ul class="pack-list">
          <li class="pack-list-item" v-for="(item,key) in items.list" :key="`pack-${key}`">
            <div>
              <h5>{{item.name}}</h5>
              <p>{{item.description}}</p>
            </div>
            <div class="btn" :class="`status-${item.status}`" @click="handleClick(item,items)">
              <template v-if="item.status === 0">领取</template>
              <template v-else-if="item.status === 1">已领取</template>
              <template v-else>已领完</template>
            </div>
          </li>
        </ul>
      </li>
    </ul>
    <Modal v-model="successModal" :type="2" :close-button-show="false" title="领取成功"
      @on-save="successModal=false">
      <div class="success-modal">
        <p>礼包兑换码：<span>{{cdkey}}</span>已复制</p>
        <p>可在游戏内输入兑换码领取</p>
      </div>
      <div slot="footer" class="btn copy confirm" v-clipboard:copy="cdkey"
        v-clipboard:success="copyCode" v-clipboard:error="onError">
        去玩游戏
      </div>
    </Modal>
  </main>
</template>

<script>
import findServices from '@/services/find.js'
import { getAwardsCDKey } from '@/services/global.js'
import _get from 'lodash.get'
import { jumpUrl, localStorage } from '@/utils/utils'
export default {
  name: 'giftPack',
  components: {

  },
  data () {
    return {
      packList: [],
      successModal: false,
      cdkey: '',
      selectGame: {}
    }
  },
  mounted () {
    this._channelGamePack()
  },
  methods: {
    async _channelGamePack () {
      const res = await findServices.channelGamePack()
      const { code, data, message } = _get(res, 'data', {})
      if (code === 200) {
        this.packList = data
      }
    },
    handleClick (gift, game) {
      switch (gift.status) {
        case 0:
          this.selectGame = game
          this._getAwardsCDKey(gift.batchId)
          break
        case 1:
          this.goGame(game)
          break

        default:
          break
      }
    },
    async _getAwardsCDKey (value) {
      const res = await getAwardsCDKey({ value: value })
      const { code, data, message } = _get(res, 'data', {})
      if (code === 200) {
        this.cdkey = data
        this.successModal = true
      } else {
        this.cdkey = message
        this.successModal = true
      }
    },
    goGame (game) {
      jumpUrl({ url: game.gameUrl })
    },
    // 复制卡密
    copyCode () {
      this.goGame(this.selectGame)
    },
    onError () {
      this.$Toast('当前浏览器不支持此功能，请手动复制。')
      this.goGame(this.selectGame)
    }
  }
}
</script>

<style lang="less" scoped>
.gift-pack {
  padding: 20px 24px;
  height: 100vh;
  background: #f7f7f7;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  .tips {
    background: #ffecec;
    border-radius: 16px;
    height: 60px;
    line-height: 60px;
    font-size: 24px;
    color: #ff4141;
    padding: 0 20px;
  }
  .game-list {
    .game-list-item {
      background: #fff;
      border-radius: 16px;
      padding: 20px;
      margin-top: 20px;
      .game-info {
        display: flex;
        align-items: center;
        .icon {
          width: 80px;
          height: 80px;
          margin-right: 12px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        h4 {
          color: #000;
          font-size: 28px;
          font-weight: bold;
          line-height: 42px;
          margin-bottom: 6px;
        }
        p {
          color: #888;
          font-size: 20px;
          font-weight: 500;
          line-height: 30px;
        }
      }
    }
    .pack-list {
      margin-top: 30px;
      .pack-list-item {
        border-top: 1px solid #eee;
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        h5 {
          font-size: 24px;
          font-weight: 400;
          line-height: 36px;
        }
        p {
          color: #888;
          font-size: 20px;
          font-weight: 500;
          line-height: 30px;
        }
        &:last-child {
          margin-bottom: -20px;
        }
        .btn {
          min-width: 110px;
          max-width: 110px;
          font-size: 24px;
          font-weight: 500;
          height: 42px;
          line-height: 42px;
          box-sizing: border-box;
          border-radius: 10px;
          text-align: center;
          &.status-0 {
            background: #ff7800;
            color: #fff;
          }
          &.status-1 {
            background: #f0f0f0;
            color: #ff7800;
          }
          &.status-2 {
            background: #f0f0f0;
            color: #bbb;
          }
        }
      }
    }
  }
  .success-modal {
    font-size: 24px;
    color: #888;
    line-height: 36px;
    text-align: center;
    span {
      color: #ff7800;
    }
  }
}
</style>

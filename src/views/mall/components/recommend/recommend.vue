<template>
  <!-- 推广位 -->
  <div class="recommend" v-if="ringData">
    <ul :class="{'active' : blindBox, seckill: showSeckill && !blindBox}">
      <template v-if="showSeckill && !blindBox">
        <li @click="goSeckill">
          <img src="./img/seckill-icon.png" alt="">
        </li>
        <li @click="jump('/petcat/')">
          <img src="./img/recommend1-active.png" alt="">
        </li>
        <li @click="jump(ringData.type==2?'/ring2/':'/ring/')">
          <img src="./img/recommend2-active.png" alt="">
        </li>
      </template>
      <template v-else>
        <li @click="jump('/petcat/')">
          <img v-if="!blindBox" src="./img/recommend1.png" alt="">
          <img v-else src="./img/recommend1-active.png" alt="">
        </li>
        <li @click="jump(ringData.type==2?'/ring2/':'/ring/')">
          <img v-if="!blindBox" src="./img/recommend2.png" alt="">
          <img v-else src="./img/recommend2-active.png" alt="">
        </li>
        <li v-if="blindBox" @click="toBlindBox">
          <img :src="blindBox.image | filter" alt="">
        </li>
      </template>
    </ul>
  </div>
</template>
<script>
// import { getRingServerStatus,getSeckillStatus,getBlindBoxRecommend } from '@/services/shop'
import { getRingServerStatus, getSeckillStatus } from '@/services/shop'
import { jumpUrl } from '@/utils/utils'
import _get from 'lodash.get'
export default {
  name: 'recommend',
  data: () => ({
    showSeckill: false,
    ringData: null,
    blindBox: null
  }),
  computed: {
    curChannel () {
      return localStorage.getItem('APP_CHANNEL') ? localStorage.getItem('APP_CHANNEL') : this.getUrlParam('channel')
    }
  },
  methods: {
    _getSeckillStatus () {
      getSeckillStatus().then(res => {
        this.showSeckill = _get(res, 'data', false)
      })
    },
    _getRingServerStatus () {
      getRingServerStatus().then(res => {
        let { data, code } = res.data
        if (code === 200) {
          if (data.type === '1' || (data.distanceStop < 0 && data.distanceStart >= 0)) {
            this.ringData = data
          }
        }
      })
    },
    toBlindBox () {
      location.href = this.blindBox.url
    },
    jump (url) {
      if (url === '/petcat/') {
        this.$marchSetsPoint('A_H5PT0020000213')
      }
      //100039001和100075跳新版的
      else if ((this.curChannel == '100039001' || this.curChannel == '100075') && url == '/ring/') {
        url = '/ring2/'
      }
      else if (url === 'blindBox') {
        this.$marchSetsPoint('A_H5PT0020002750')
        url = 'https://wap.beeplaying.com/activities/blindBox.html#/'
      }
      else {
        this.$marchSetsPoint('A_H5PT0020000211')
      }
      jumpUrl({ url })
    },
    goSeckill () {
      window.location.href = 'https://wap.beeplaying.com/activities/seckill.html#/'
      this.$marchSetsPoint('A_H5PT0020002751')
    }
  },
  async created () {
    this._getRingServerStatus()
    this._getSeckillStatus()
    // const { data } = await getBlindBoxRecommend()
    // if (data.data.length > 0) this.blindBox = data.data[0]
  }
}
</script>
<style lang="less" scoped>
.recommend {
  padding: 70px 24px 300px;
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
      }
    }
  }
}
</style>

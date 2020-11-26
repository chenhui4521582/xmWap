<template>
  <ul class="nav-wrapper">
    <template v-for="(item,key) in navList">
      <li v-if="showNavItem(item)" :key="key" :class="{activated:item.value===current}"
        @click.stop="handleClick(item.url)">
        <div class="icon" :class="item.url"></div>
        <p class="name">
          {{item.name}}
        </p>
        <p class="redTag" :class="item.url==='gift'&&'gift-text'" v-if="item.redTag">{{item.redTag}}
        </p>
      </li>
    </template>
  </ul>
</template>

<script>
import { getUrlParams } from '@/utils/utils'
import Services from '@/services/SDK'
import _get from 'lodash.get'
export default {
  name: 'sdkNav',
  props: {
    wfCurLink: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      current: '',
      navList: [{
        value: 'sdkTask',
        url: 'task',
        name: '任务',
        redTag: 0
      }, {
        value: 'sdkGift',
        url: 'gift',
        name: '礼包',
        redTag: 0
      }, {
        value: 'sdkPrivilege',
        url: 'privilege',
        name: '特权',
        redTag: 0
      }, {
        value: 'sdkActivity',
        url: 'activity',
        name: '活动',
        redTag: 0
      }]
    }
  },
  computed: {
    gameType () {
      return getUrlParams('gametype') && parseInt(getUrlParams('gametype')) || getUrlParams('gameType') && parseInt(getUrlParams('gameType'))
    }
  },
  methods: {
    handleClick (url) {
      switch (url) {
        case 'privilege':
          this.$marchSetsPoint('A_H5PT0061002864', { from_project_id: this.gameType }) // H5平台-游戏内SDK-特权页TAB切换点击
          break
        case 'gift':
          this.$marchSetsPoint('A_H5PT0121001157', { from_project_id: this.gameType }) // H5平台-游戏内SDK-特权页TAB切换点击
          break

        default:
          break
      }
      this.$router.push({ path: `/sdk/${url}`, query: { ...getUrlParams() } })
    },
    /** 获取活动列表 **/
    _getActivityList () {
      Services.getActivityList().then(res => {
        this.navList[3].redTag = _get(res, 'data.data.unreadQuantity', 0)
      })
    },
    async getCdkeyStatus () {
      const res = await Services.cdkeyStatus({
        value: this.wfCurLink
      })
      const { data, code, message } = res.data
      if (code === 200) {
        if (data && data.length) {
          for (let index = 0; index < data.length; index++) {
            const element = data[index]
            if (!element.IF_GET && element.gameCdkeyRsp.remainNum * 100 > 0) {
              this.navList[1].redTag = '福利'
              return
            }
          }
        }
      }
    },
    showNavItem (item) {
      if (this.wfCurLink) {
        if (item.url === 'activity') {
          return false
        }
        return true
      } else {
        if (item.url === 'gift') {
          return false
        }
        return true
      }
    }
  },
  mounted () {
    this.current = this.$route.name
    if (this.wfCurLink) {
      this.getCdkeyStatus()
    } else {
      this._getActivityList()
    }
  },
  watch: {
    '$route' (newValue) {
      this.current = newValue.name
    }
  }
}
</script>

<style lang="less" scoped>
.bg-center(@url) {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url(@url);
}
.nav-wrapper {
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: #be9957;
  margin-top: 10px;
  li {
    width: 180px;
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .bg-center('../img/tag-normal-bg.png');
    .icon {
      width: 32px;
      height: 32px;
      margin-top: 12px;
    }
    .task {
      .bg-center('../img/task-icon.png');
    }
    .privilege {
      .bg-center('../img/privilege-icon.png');
    }
    .activity {
      .bg-center('../img/activity-icon.png');
    }
    .gift {
      .bg-center('../img/activity-icon.png');
    }
    .name {
      margin-left: 3px;
      margin-top: 12px;
    }
    .redTag {
      position: absolute;
      top: 42px;
      right: 20px;
      min-width: 28px;
      text-align: center;
      font-size: 18px;
      color: #fff;
      background-color: #ff4141;
      padding: 0 3px;
      border-radius: 10px 10px 10px 2px;
      &.gift-text {
        right: 9px;
        top: 30px;
      }
    }
  }
  .activated {
    font-size: 28px;
    color: #fff;
    width: 216px;
    height: 120px;
    .bg-center('../img/tag-activated-bg.png');
    .icon {
      width: 60px;
      height: 60px;
      margin-left: -15px;
    }
    .task {
      .bg-center('../img/task-activated-icon.png');
    }
    .privilege {
      .bg-center('../img/privilege-activated-icon.png');
    }
    .activity {
      .bg-center('../img/activity-activated-icon.png');
    }
    .gift {
      .bg-center('../img/activity-activated-icon.png');
    }
    .name {
      margin-left: -9px;
    }
    .redTag {
      right: 30px;
      &.gift-text {
        right: 21px;
      }
    }
  }
}
</style>

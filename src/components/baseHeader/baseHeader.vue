<template>
  <section class="base-header">
    <!-- 百度底bar首页头部 -->
    <div class="redTitle-index" v-if="showRedTitle" @click="goMyPage">
      游戏
      <div class="index-icon"></div>
    </div>
    <!-- 黄色版本头部 -->
    <div class="content">
      <div class="base-info">
        <div class="item" @click="openPayment">
          <img src="./image/gold_leaf.png" alt="">
          <span class="item-text">{{userInfo.amount | amountComputen}}<span
              class="unit">{{userInfo.amount>10000 ? "万" : ""}}</span></span>
          <slot name="getIcon">
            <span class="add"></span>
          </slot>
        </div>
        <div class="item" @click="prize">
          <img class="item-img-big" src="./image/call_sharge.png" alt="">
          <span class="item-text"> {{hfSum | amountComputen }}{{hfSum > 10000 ? "万" : ""}}<span
              class="unit">元</span></span>
          <div class="lingjiang" v-if="routerName!=='mall'">去使用</div>
        </div>
      </div>
      <div class="base-button" :class="routerName" @click="goPage">
        <slot>
          <template v-if="showSelect">
            <img src="./image/select-icon.png" alt="" class="select-icon" @click.stop="goSelect">
          </template>
          <template v-if="routerName==='mall'">
            <span>查看我的奖品</span>
            <span class="iconfont icon-next"></span>
            <div class="red-icon" v-if="redDot.myPrize"></div>
          </template>
          <template v-if="routerName==='index' || routerName==='task' || routerName==='find'">
            <img src="./image/message_icon.png" alt="" class="message-icon">
            <div class="red-icon" v-if="isMessageUnread"></div>
          </template>
        </slot>
      </div>
    </div>
  </section>
</template>
<script>
import { mapState } from 'vuex'
import { getBaseInfo, getMessageUnread, mseaageList } from '../../services/user'
import { bottomBarJump } from '@/utils/utils'
export default {
  name: 'baseHeader',
  data () {
    return {
      messageUnread: 0, // 判断是否有未读消息
      messageList: [],
      isMessageUnread: false
    }
  },
  computed: {
    ...mapState(['userInfo', 'userSign', 'FILE_HOST', 'redDot']),
    routerName () {
      return this.$route.name
    },
    hfSum () {
      return this.userInfo.hfSum ? (this.userInfo.hfSum / 10).toFixed(1) : 0
    },
    /** 是否红色版头部名称 **/
    showRedTitle () {
      return this.$moduleConfig.baseHeader[this.routerName]
    },
    /** 显示搜索icon **/
    showSelect () {
      return this.routerName == 'index'
    }
  },
  filters: {
    amountComputen (val) {
      if (!val) { return 0 }
      return val > 10000 ? (val / 10000).toFixed(2) : val
    }
  },
  methods: {
    goSelect () {
      this.$marchSetsPoint('A_H5PT0019002872')
      this.$router.push({ name: 'select' })
    },
    // 跳转页面
    async goPage () {
      const { name } = this.$route
      if (name === 'mall') {
        this.$marchSetsPoint('A_H5PT0020001299')
        bottomBarJump('#/my/prize', 'myPrize', this.$router)
      } else if (name === 'task') {
        this.$marchSetsPoint('A_H5PT0022002674')
        this.$router.push({ name: 'message' })
      } else if (name === 'index') {
        this.$marchSetsPoint('A_H5PT0019000191')
        this.$router.push({ name: 'message' })
      } else if (name === 'find') {
        this.$marchSetsPoint('A_H5PT0019000191')
        this.$router.push({ name: 'message' })
      }
    },
    // 跳转个人中心
    goMyPage () {
      bottomBarJump('#/my', 'my', this.$router)
    },
    // 点击金叶子
    async openPayment () {
      let name = this.$route.name
      switch (name) {
        case 'task':
          this.$marchSetsPoint('A_H5PT0022001297') // H5平台-我的-金叶子-去充值
          break
        case 'index':
          this.$marchSetsPoint('A_H5PT0019001684')
          break
        case 'mall':
          this.$marchSetsPoint('A_H5PT0020001688')
          break
        default:
          break
      }
      bottomBarJump('#/payment', 'payment', this.$router)
    },
    // 打开商城页面
    async openShop () {
      this.$router.push({ name: 'shop' })
    },
    // 打开领奖页面 点击花费卷
    async openPage () {
      switch (this.routerName) {
        case 'task':
          this.$marchSetsPoint('A_H5PT0022001298')
          break
        case 'index':
          this.$marchSetsPoint('A_H5PT0019000189', {
            residual_jingdong: this.hfSum,
            residual_phone: this.jdSum
          })
          break
        case 'mall':
          this.$marchSetsPoint('A_H5PT0020001301')
          break
        default:
          break
      }
      bottomBarJump('#/payment', 'payment', this.$router)
    },
    // 领奖按钮
    async prize () {
      switch (this.routerName) {
        case 'index':
          this.$marchSetsPoint('A_H5PT0019000189')
          break
        case 'task':
          this.$marchSetsPoint('A_H5PT0022001298')
          break
        default:
          break
      }
      bottomBarJump('#/mall', 'mall', this.$router)
    },
    // 返回
    back () {
      this.$router.back(-1)
    },
    // 页面初始化
    async pageInit () {
      const { code, data } = await mseaageList()
      if (code === 200) {
        this.messageList = data
      }
      // 消息提示
      const messageData = await getMessageUnread()
      if (messageData.code === 200) {
        this.messageUnread = messageData.data.quantity
      }
      let obj = {}
      let extraUnreadCountData = localStorage.getItem('extraUnreadCountData') ? JSON.parse(localStorage.getItem('extraUnreadCountData')) : {}
      this.messageList.filter(item => !!extraUnreadCountData[item.senderType]).map(item => {
        obj[item.senderType] = extraUnreadCountData[item.senderType]
      })
      if (Object.keys(obj).length) {
        localStorage.setItem('extraUnreadCountData', JSON.stringify(obj))
      } else {
        localStorage.removeItem('extraUnreadCountData')
      }
      let extraUnreadCount = Object.values(obj).length ? Object.values(obj).reduce((a, b) => a + b) : 0
      this.isMessageUnread = this.messageUnread && (this.messageUnread - extraUnreadCount < 0 ? 0 : (this.messageUnread - extraUnreadCount)) || 0
    }
  },
  mounted () {
    if (this.routerName !== 'mall') {
      this.pageInit()
    }
  }
}
</script>
<style lang="less" scoped>
* {
  box-sizing: border-box;
}
/** 限时金叶 不需的时候删除 **/
.getIcon {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  height: 32px;
  border-radius: 16px;
  background: #fb4a0c;
  font-size: 20px;
  color: #fff;
}
/** 限时金叶 不需的时候删除 **/
.base-header {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 10;
  background: #f7f7f7;
}
.redTitle-index {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  padding: 0 24px;
  font-size: 34px;
  font-weight: bold;
  .index-icon {
    position: absolute;
    right: 24px;
    top: 48%;
    transform: translate(0, -50%);
    width: 40px;
    height: 40px;
    background: url(./image/my-icon.png) no-repeat center center;
    background-size: 100% 100%;
  }
}
.redTitle {
  position: relative;
  height: 70px;
  padding: 25px 24px 0;
  font-size: 32px;
  text-align: center;
  line-height: 1.2;
  font-weight: bold;
  .iconfont {
    position: absolute;
    left: 24px;
    top: 28px;
    font-size: 30px;
  }
}
.content {
  height: 70px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.base-info {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 42px;
  .item {
    margin-right: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
    img {
      width: 30px;
      height: 30px;
    }
    .item-text {
      margin: 0 10px;
      font-size: 28px;
      color: #888888;
      font-weight: bold;
      .unit {
        font-size: 20px;
        color: #888888;
      }
    }
    .add {
      width: 28px;
      height: 28px;
      font-size: 20px;
      background: url(./image/add.png) no-repeat center center;
      background-size: 28px 28px;
    }
    .lingjiang {
      width: 70px;
      height: 28px;
      font-size: 20px;
      font-weight: 500;
      line-height: 29px;
      color: rgba(255, 255, 255, 1);
      text-align: center;
      opacity: 1;
      background: rgba(255, 65, 65, 1);
      border-radius: 8px;
      white-space: nowrap;
    }
  }
}
.base-button {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 42px;
  border-radius: 10px;
  font-size: 24px;
  &.mall {
    font-size: 24px;
    color: #000000;
    .iconfont {
      line-height: 1;
      margin-left: 6px;
    }
  }
  .select-icon {
    margin-right: 20px;
    width: 36px;
    height: 36px;
  }
  .red-icon {
    position: absolute;
    right: -2px;
    top: 2px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #e8382b;
  }
  .icon {
    margin-right: 10px;
    width: 34px;
    height: 34px;
  }
  .message-icon {
    width: 40px;
    height: 36px;
  }
}
</style>



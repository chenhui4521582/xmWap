<template>
  <div class="message-warp" :class="{'showHeader': $moduleConfig.isShowHeader}">
    <wf-header title="消息中心" />
    <template v-if="messageList.length">
      <ul class="message-content">
        <li class="message-item" v-for="(item,index) in messageList" :key="index"
          @click="openDetails(item)">
          <div class="img-warp">
            <img class="img" :src="item.senderImg | filter" alt="小图">
          </div>
          <div class="item-content">
            <h4 class="title">{{item.senderName}}</h4>
            <p v-html="item.content"></p>
          </div>
          <div class="item-right">
            <p>{{item.timeInterval}}</p>
            <span v-if="getUnreadCount(item)>0" class="message-pit">{{getUnreadCount(item)}}</span>
          </div>
        </li>
      </ul>
    </template>
    <template v-else>
      <no-list message="暂时没有消息" />
    </template>

  </div>
</template>
<script>
import { mseaageList } from "@/services/user"
export default {
  name: "message",
  data () {
    return {
      messageList: [],
      allExtraUnreadCountData: {}
    }
  },
  computed: {

  },
  mounted () {
    this.pageInit()
  },
  methods: {
    // 页面初始化
    async pageInit () {
      // 获取不能处理消息前端存储数据
      this.allExtraUnreadCountData = localStorage.getItem('extraUnreadCountData') ? JSON.parse(localStorage.getItem('extraUnreadCountData')) : {}
      // 埋点
      this.$marchSetsPoint('P_H5PT0024')
      const { code, data } = await mseaageList()
      if (code === 200) {
        this.messageList = data
      }
    },

    // 打开消息详情
    openDetails (item) {
      const { senderType, senderName } = item
      this.$marchSetsPoint('A_H5PT0024000645', {
        task_id: senderType,
        task_name: senderName
      })
      this.setExtraUnreadCountData(item)
      this.$router.push({
        name: "messageDetails",
        query: { senderType, senderName }
      })
    },
    // 设置后端处理不了的已读的消息
    setExtraUnreadCountData (item) {
      if (item.extraUnreadCount && this.getUnreadCount(item) > 0) {
        let obj = {}
        obj[item.senderType] = item.extraUnreadCount
        obj = Object.assign(this.allExtraUnreadCountData, obj)
        this.allExtraUnreadCountData = obj
        localStorage.setItem('extraUnreadCountData', JSON.stringify(obj))
      }
    },
    // 判断当前消息是否已读
    getUnreadCount (item) {
      if (Object.keys(this.allExtraUnreadCountData).includes(item.senderType + '')) {
        let unreadCount = item.unreadCount - this.allExtraUnreadCountData[item.senderType] < 0 ? 0 : item.unreadCount - this.allExtraUnreadCountData[item.senderType]
        return unreadCount > 99 ? '99+' : unreadCount
      } else {
        return item.unreadCount > 99 ? '99+' : item.unreadCount
      }
    }
  }
}
</script>
<style lang="less" scoped>
.message-warp {
  min-height: 100vh;
  background: #f7f7f7;
  padding-top: 10px;
  &.showHeader {
    padding-top: 100px;
  }
  .message-content {
    margin-top: 20px;
    padding: 0 24px;
    background-color: #fff;
  }
  .message-item {
    height: 120px;
    width: 100%;
    box-sizing: border-box;
    border-bottom: 1px solid #e5e5e5;
    padding: 26px 0 23px;
    display: flex;
    align-items: center;
    &:last-child {
      border-bottom: none;
    }
    .img-warp {
      width: 72px;
      height: 72px;
      flex: 0 72px;
      overflow: hidden;
      border-radius: 12px;
      margin-right: 11px;
      img {
        width: 72px;
      }
    }
    .item-right {
      width: 100px;
      flex: 0 100px;
      text-align: right;
      p {
        font-size: 20px;
        color: #acacac;
        margin-top: 10px;
      }
      .message-pit {
        display: inline-block;
        height: 24px;
        line-height: 26px;
        font-size: 20px;
        padding: 0 13px;
        border-radius: 6px;
        background-color: #e8382b;
        color: #fff;
      }
    }
    .item-content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-wrap: wrap;
      align-content: space-between;
      min-height: 78px;
      .title {
        font-size: 28px;
        color: #000;
        font-weight: bold;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 24px;
        color: #888888;
      }
    }
  }
}
</style>


